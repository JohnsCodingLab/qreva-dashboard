import React, { useEffect, useState } from 'react';
import BaseModal from './BaseModal';
import { Button } from '@/components/ui/button';

const formatNaira = (value) => `₦${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const MIN_REASON = 10;

/**
 * Takes money out of a customer's account, by hand.
 *
 * Written to be slightly awkward on purpose. The amount and the reason are both
 * required, the reason has to be long enough to be an explanation, and the
 * account being debited is restated with its balance right above the button -
 * because the thing this must never do is debit the wrong one of a customer's
 * two accounts.
 */
const DebitAccountModal = ({ isOpen, onClose, account, onSubmit, isSubmitting, error }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');

  // Cleared whenever a different account is picked, so an amount typed for one
  // account can never be submitted against another.
  useEffect(() => {
    setAmount('');
    setReason('');
    setReference('');
  }, [account?.accountNumber, isOpen]);

  if (!account) return null;

  const parsedAmount = Number(amount);
  const amountIsValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const exceedsBalance = amountIsValid && parsedAmount > Number(account.availableBalance || 0);
  const ready = amountIsValid && !exceedsBalance && reason.trim().length >= MIN_REASON;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Debit account" maxWidth="max-w-md">
      <div className="mt-2">
        <div className="mb-4 rounded-lg border border-[#E4E7EC] bg-[#F7FAFA] p-3 text-sm">
          <p className="font-medium text-[#1E1E1E]">
            {account.entityType === 'Corporate' ? 'Corporate account' : 'Individual account'}
          </p>
          <p className="mt-0.5 text-[#2C3134]">
            {account.accountNumber} · {account.bankName}
          </p>
          <p className="mt-1 text-[#808C91]">
            Available balance {formatNaira(account.availableBalance)}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-[#FDA29B] bg-[#FEF3F2] px-3 py-2 text-sm text-[#B42318]">
            {error}
          </div>
        )}

        <label className="mb-1.5 block text-sm font-medium text-[#2C3134]">Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="mb-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
        {/* Said before the request rather than after it comes back rejected.
            The server refuses to overdraw either way. */}
        {exceedsBalance && (
          <p className="mb-3 text-xs text-[#B42318]">
            More than the {formatNaira(account.availableBalance)} available in this account.
          </p>
        )}

        <label className="mb-1.5 mt-3 block text-sm font-medium text-[#2C3134]">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Reversing a duplicate settlement credited on 3 Sept, ref XYZ."
          className="min-h-[90px] w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
        <p className="mt-1 text-xs text-[#808C91]">
          Shown on the customer's statement and kept in the audit log against your name.
          {reason.trim().length > 0 && reason.trim().length < MIN_REASON
            ? ` ${MIN_REASON - reason.trim().length} more characters needed.`
            : ''}
        </p>

        <label className="mb-1.5 mt-3 block text-sm font-medium text-[#2C3134]">
          Your reference <span className="font-normal text-[#808C91]">(optional)</span>
        </label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Reconciliation reference"
          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
        />

        <p className="mt-4 text-xs text-[#B54708]">
          The customer is alerted immediately. This cannot be undone from here.
        </p>

        <Button
          className="mt-3 h-12 w-full rounded-lg bg-[#B42318] font-medium text-white hover:bg-[#912018]"
          onClick={() =>
            onSubmit({
              accountNumber: account.accountNumber,
              amount: parsedAmount,
              reason: reason.trim(),
              reference: reference.trim() || undefined,
            })
          }
          disabled={!ready || isSubmitting}
        >
          {isSubmitting
            ? 'Debiting…'
            : amountIsValid
              ? `Debit ${formatNaira(parsedAmount)}`
              : 'Debit account'}
        </Button>
      </div>
    </BaseModal>
  );
};

export default DebitAccountModal;
