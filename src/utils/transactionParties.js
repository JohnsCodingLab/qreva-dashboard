// Resolving "who sent this" differs by direction, and getting it wrong is not
// visually obvious - it silently shows a real (but wrong) person's name.
//
// The catch: Transaction.senderName is NOT the sender on Inward transfers. A
// backend pre-save hook stamps the account holder's own name into that field
// whenever it isn't already set, and the inward webhook never sets it - so on
// Inward it holds the RECIPIENT's name. Only metadata.debitAccountName (which
// SafeHaven populates on the inward webhook) is the true external sender.
//
// On Outward the account holder genuinely is the sender, so senderName is
// correct there, and it's the only field that carries it.
//
// Keep this in one place: this exact chain is needed by the transfers table,
// the details modal, and the receipt, and having three copies is what let them
// drift out of sync in the first place.

export const resolveSenderName = (row) => {
  if (!row) return "-";

  if (row.type === "Inward") {
    return (
      row.metadata?.debitAccountName ||
      row.transferId?.debitAccountName ||
      "-"
    );
  }

  return (
    row.senderName ||
    row.metadata?.debitAccountName ||
    row.transferId?.accountName ||
    "-"
  );
};

export const resolveRecipientName = (row) => {
  if (!row) return "-";

  return (
    row.recipientName ||
    row.transferId?.nameEnquiryId?.accountName ||
    row.metadata?.creditAccountName ||
    "-"
  );
};
