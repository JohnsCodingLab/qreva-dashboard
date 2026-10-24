import { AlertTriangle } from 'lucide-react';
import BaseModal from '@/components/modals/BaseModal';
import { formatNaira, formatDateTime } from '@/pages/posRequests/constants';

const Spinner = ({ label }) => (
  <>
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    <span>{label}</span>
  </>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#E8EBED] last:border-0">
    <span className="text-xs font-medium text-[#808C91] font-general shrink-0">
      {label}
    </span>
    <span className="text-sm text-[#1E1E1E] font-general text-right break-words">
      {value || 'N/A'}
    </span>
  </div>
);

const PosRequestModals = ({
  modals,
  setters,
  selected,
  declineReason,
  setDeclineReason,
  refundReason,
  setRefundReason,
  onApprove,
  onDecline,
  onRefund,
  isApproving = false,
  isDeclining = false,
  isRefunding = false,
}) => {
  const name = selected?.businessName || 'this merchant';
  const quantity = selected?.quantity ?? 0;
  const terminalWord = `${quantity} terminal${quantity === 1 ? '' : 's'}`;

  return (
    <>
      {/* ── Details ───────────────────────────────────────────────────── */}
      <BaseModal
        isOpen={modals.showDetailsModal}
        onClose={() => setters.setShowDetailsModal(false)}
        title="POS Request Details"
        maxWidth="max-w-xl"
      >
        <div className="mb-2">
          <DetailRow label="Business" value={selected?.businessName} />
          <DetailRow label="Business type" value={selected?.businessType} />
          <DetailRow label="Merchant" value={selected?.merchantName} />
          <DetailRow
            label="Email"
            value={selected?.userId?.emailAddress || selected?.merchantEmail}
          />
          <DetailRow label="Phone" value={selected?.phoneNumber} />
          <DetailRow label="Quantity" value={terminalWord} />
          <DetailRow label="Amount paid" value={formatNaira(selected?.amount)} />
          <DetailRow label="Delivery address" value={selected?.deliveryAddress} />
          <DetailRow label="Status" value={selected?.status} />
          <DetailRow
            label="Terminals assigned"
            value={`${selected?.terminals?.length || 0} / ${quantity}`}
          />
          <DetailRow label="Reference" value={selected?.transactionReference} />
          <DetailRow label="Requested" value={formatDateTime(selected?.createdAt)} />
          {selected?.notes ? (
            <DetailRow label="Notes" value={selected.notes} />
          ) : null}
        </div>
        <button
          onClick={() => setters.setShowDetailsModal(false)}
          className="w-full py-3 mt-4 text-sm font-general font-medium text-[#1E1E1E] bg-white border border-[#E8EBED] rounded-lg hover:bg-[#F7FAFA] transition-colors"
        >
          Close
        </button>
      </BaseModal>

      {/* ── Approve ───────────────────────────────────────────────────── */}
      <BaseModal
        isOpen={modals.showApproveModal}
        onClose={() => {
          if (!isApproving) setters.setShowApproveModal(false);
        }}
        title="Approve POS Request"
      >
        <p className="text-sm text-[#808C91] font-general mb-4">
          This assigns {terminalWord} from the pool to{' '}
          <span className="font-semibold text-[#1E1E1E]">{name}</span> and
          marks the request approved. The merchant is emailed.
        </p>
        <p className="text-xs text-[#808C91] font-general mb-6">
          If the pool is short, nothing is assigned and you can approve again
          once terminals arrive.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setters.setShowApproveModal(false)}
            disabled={isApproving}
            className="flex-1 py-3 text-sm font-general font-medium text-[#1E1E1E] bg-white border border-[#E8EBED] rounded-lg hover:bg-[#F7FAFA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onApprove}
            disabled={isApproving}
            className="flex-1 py-3 text-sm font-general font-medium text-white bg-[#4ED17E] rounded-lg hover:bg-[#3DB86A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isApproving ? <Spinner label="Approving..." /> : 'Approve & Assign'}
          </button>
        </div>
      </BaseModal>

      {/* ── Decline ───────────────────────────────────────────────────── */}
      <BaseModal
        isOpen={modals.showDeclineModal}
        onClose={() => {
          if (!isDeclining) setters.setShowDeclineModal(false);
        }}
        title="Decline POS Request"
      >
        {/* Said plainly and up front. Declining leaves the merchant charged,
            and an admin who reads "declined" as "finished" is how somebody
            ends up paying for a terminal they were refused. */}
        <div className="flex gap-3 p-3 mb-4 rounded-lg bg-[#FFF8E6] border border-[#FFC535]">
          <AlertTriangle className="w-4 h-4 text-[#B58202] shrink-0 mt-0.5" />
          <p className="text-xs text-[#B58202] font-general">
            Declining does <span className="font-semibold">not</span> return the{' '}
            {formatNaira(selected?.amount)} already taken. Refund it separately
            from the Declined tab.
          </p>
        </div>
        <p className="text-sm text-[#808C91] font-general mb-4">
          Why is this request being declined? The merchant is told this reason.
        </p>
        <textarea
          disabled={isDeclining}
          className="w-full p-3 border border-[#E8EBED] rounded-lg text-sm font-general focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 mb-6 h-28 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Reason for declining..."
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
        />
        <button
          onClick={onDecline}
          disabled={!declineReason?.trim() || isDeclining}
          className="w-full py-3 bg-[#E56566] text-white rounded-lg font-general font-medium hover:bg-[#D14546] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isDeclining ? <Spinner label="Declining..." /> : 'Decline Request'}
        </button>
      </BaseModal>

      {/* ── Refund ────────────────────────────────────────────────────── */}
      <BaseModal
        isOpen={modals.showRefundModal}
        onClose={() => {
          if (!isRefunding) setters.setShowRefundModal(false);
        }}
        title="Refund POS Request"
      >
        <p className="text-sm text-[#808C91] font-general mb-4">
          This returns{' '}
          <span className="font-semibold text-[#1E1E1E]">
            {formatNaira(selected?.amount)}
          </span>{' '}
          to <span className="font-semibold text-[#1E1E1E]">{name}</span> and
          reverses the commission legs. It cannot be undone.
        </p>
        <textarea
          disabled={isRefunding}
          className="w-full p-3 border border-[#E8EBED] rounded-lg text-sm font-general focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 mb-6 h-28 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Reason for refunding..."
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            onClick={() => setters.setShowRefundModal(false)}
            disabled={isRefunding}
            className="flex-1 py-3 text-sm font-general font-medium text-[#1E1E1E] bg-white border border-[#E8EBED] rounded-lg hover:bg-[#F7FAFA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onRefund}
            disabled={!refundReason?.trim() || isRefunding}
            className="flex-1 py-3 text-sm font-general font-medium text-white bg-[#FF5B04] rounded-lg hover:bg-[#E54F03] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRefunding ? <Spinner label="Refunding..." /> : 'Refund'}
          </button>
        </div>
      </BaseModal>
    </>
  );
};

export default PosRequestModals;
