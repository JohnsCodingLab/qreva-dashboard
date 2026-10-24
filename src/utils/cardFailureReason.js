// ISO 8583 field 39 response codes - where the card network states why a
// payment was declined. SafeHaven returns this on every POS transaction but
// leaves `description` null, so without translating it admins only ever saw
// "Failed" with no explanation, on a failure rate that is currently very high.
//
// Mirrors the mapping used in the mobile app so agents and admins are given
// the same wording for the same decline.
const FIELD_39_REASONS = {
  '00': 'Approved',
  '01': 'Declined by the card issuer. The customer should contact their bank.',
  '03': 'Terminal is not set up to accept this card.',
  '04': 'Card retained by issuer.',
  '05': 'Declined by the card issuer.',
  '06': 'The card issuer reported an error.',
  '12': 'Invalid transaction for this card.',
  '13': 'Invalid amount.',
  '14': 'Invalid card number.',
  '19': 'The bank asked for the transaction to be retried.',
  '25': 'The issuer has no record of this card.',
  '30': 'The payment message was malformed.',
  '41': 'Card reported lost.',
  '43': 'Card reported stolen.',
  '51': 'Insufficient funds on the card.',
  '54': 'The card has expired.',
  '55': 'Incorrect PIN entered.',
  '57': 'This card is not permitted to make this type of payment.',
  '58': 'Terminal is not permitted to process this card.',
  '61': "Amount exceeds the card's transaction limit.",
  '62': 'Restricted card.',
  '65': "Exceeds the card's daily transaction count.",
  '75': 'PIN tried too many times; the card is now blocked.',
  '76': 'Unable to route the payment to the card issuer.',
  '78': 'The card is not activated.',
  '82': 'Card security check failed.',
  '91': 'The card issuer was temporarily unavailable.',
  '92': 'Unable to reach the card issuer.',
  '94': 'Duplicate transaction detected.',
  '96': 'The payment network had a problem.',
};

export const reasonForField39 = (code) => {
  const normalized = String(code ?? '').trim();
  if (!normalized) return null;
  return FIELD_39_REASONS[normalized.padStart(2, '0')] || null;
};

// Our own reconciliation messages are accurate but read as internal jargon.
// Translate the ones admins actually see into something that explains what
// happened without needing to know how reconciliation works.
const INTERNAL_REASON_HINTS = [
  {
    match: /timed out waiting for a card/i,
    text: 'No card was presented before the transaction expired, so it was never charged.',
  },
  {
    match: /amount mismatch/i,
    text: "The card was charged but the amount didn't match what was expected, so the merchant was not credited automatically. Needs manual review.",
  },
  {
    match: /status UNKNOWN/i,
    text: 'The card network never confirmed this transaction either way.',
  },
  {
    match: /status PENDING/i,
    text: 'The card network still had this transaction in flight and it never settled.',
  },
];

/**
 * Best available explanation for why a card transaction failed, preferring the
 * most specific: the provider's own description, then the card network's
 * response code, then a translation of our internal reconciliation message,
 * then the raw message itself so nothing is ever swallowed.
 */
export const resolveFailureReason = (transaction) => {
  if (!transaction) return null;
  const meta = transaction.metadata || {};

  const description = meta.providerResponse?.description || meta.description;
  if (description) return String(description);

  const field39Reason = reasonForField39(
    meta.providerResponse?.field39 ?? meta.field39,
  );
  if (field39Reason) return field39Reason;

  const raw = meta.failureReason ? String(meta.failureReason) : null;
  if (raw) {
    const hint = INTERNAL_REASON_HINTS.find((entry) => entry.match.test(raw));
    return hint ? `${hint.text} (${raw})` : raw;
  }

  return null;
};

/**
 * A SoftPOS record is created the moment a merchant keys in an amount, so one
 * that expires with no card ever presented is an abandoned checkout, not a
 * payment that failed. Reporting these as failures badly distorts the numbers:
 * measured over 7 days of production data they were 214 of 270 "failures".
 */
export const isAbandonedCheckout = (transaction) => {
  if (!transaction || transaction.status !== 'Failed') return false;
  const reason = transaction.metadata?.failureReason || transaction.narration;
  return (
    Boolean(reason) &&
    (/timed out waiting for a card/i.test(String(reason)) ||
      /no card was tapped/i.test(String(reason)) ||
      /abandoned before card tap/i.test(String(reason)))
  );
};
