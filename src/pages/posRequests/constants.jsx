import CustomEye from '@/components/icons/CustomEye';
import CustomApprove from '@/components/icons/CustomApprove';
import CustomDecline from '@/components/icons/CustomDecline';

// Backend statuses: Pending, Paid, AwaitingApproval, Processing, Delivered,
// Cancelled, Failed.
//
// Paid is grouped with AwaitingApproval rather than given its own tab. Both
// mean "money taken, hardware not yet assigned", and requests made before the
// approval step existed sit at Paid — leaving them off this tab would hide
// the ones most likely to be waiting.
export const AWAITING_STATUSES = ['AwaitingApproval', 'Paid'];

export const posRequestTabs = [
  { key: 'AwaitingApproval', label: 'Awaiting Approval' },
  { key: 'Processing', label: 'Approved' },
  { key: 'Delivered', label: 'Delivered' },
  { key: 'Cancelled', label: 'Declined' },
  { key: 'all', label: 'All' },
];

export const isAwaitingApproval = (row) =>
  AWAITING_STATUSES.includes(String(row?.status || ''));

/// Declining does not return the money, so a declined request is unfinished
/// until it has been refunded too. Anything already paid for and now
/// cancelled or failed is a candidate.
export const isRefundable = (row) =>
  Boolean(row?.transactionReference) &&
  ['Cancelled', 'Failed'].includes(String(row?.status || ''));

const statusStyles = {
  AwaitingApproval: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]',
  Paid: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]',
  Processing: 'border border-[#6BA6FF] bg-[#EAF2FF] text-[#1D4ED8]',
  Delivered: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#188C43]',
  Cancelled: 'border border-[#E56566] bg-[#FCECEC] text-[#9E2D2D]',
  Failed: 'border border-[#E56566] bg-[#FCECEC] text-[#9E2D2D]',
  Pending: 'border border-gray-300 bg-gray-50 text-gray-600',
};

const statusLabels = {
  AwaitingApproval: 'Awaiting Approval',
  Paid: 'Awaiting Approval',
  Processing: 'Approved',
  Cancelled: 'Declined',
};

export const formatNaira = (value) =>
  `₦${Number(value || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return (
    date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) +
    ' | ' +
    date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  );
};

export const posRequestColumns = [
  {
    field: 'businessName',
    headerName: 'Merchant',
    width: 240,
    flex: 1,
    // leading-5/leading-4 and the gap are explicit so the two lines keep
    // their spacing regardless of the row height around them.
    renderCell: (params) => (
      <div className="flex flex-col gap-1 py-1">
        <span className="text-sm font-medium leading-5 text-[#1E1E1E]">
          {params.row.businessName || 'N/A'}
        </span>
        <span className="text-xs leading-4 text-qreva-navy">
          {params.row.merchantName || params.row.userId?.emailAddress || ''}
        </span>
      </div>
    ),
  },
  {
    field: 'quantity',
    headerName: 'Qty',
    width: 80,
    renderCell: (params) => (
      <span className="text-sm text-[#1E1E1E]">{params.value ?? 0}</span>
    ),
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 140,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#1E1E1E]">{formatNaira(params.value)}</span>
    ),
  },
  {
    field: 'terminals',
    headerName: 'Assigned',
    width: 110,
    renderCell: (params) => {
      const count = params.value?.length || 0;
      // Nothing is assigned until approval, so this reads 0 for everything on
      // the Awaiting tab. It is here to make the opposite obvious: an
      // approved row with 0 assigned is a problem worth seeing.
      return (
        <span className="text-sm text-[#1E1E1E]">
          {count} / {params.row.quantity ?? 0}
        </span>
      );
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 170,
    flex: 1,
    renderCell: (params) => {
      const raw = String(params.value || '');
      return (
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            statusStyles[raw] || statusStyles.Pending
          }`}
        >
          {statusLabels[raw] || raw || 'Unknown'}
        </span>
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Requested',
    width: 220,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#1E1E1E]">
        {formatDateTime(params.value)}
      </span>
    ),
  },
];

export const createPosRequestActions = (onView, onApprove, onDecline, onRefund) => [
  {
    label: 'View Details',
    icon: CustomEye,
    onClick: (row) => onView(row),
  },
  {
    label: 'Approve & Assign',
    icon: CustomApprove,
    isVisible: isAwaitingApproval,
    onClick: (row) => onApprove(row),
  },
  {
    label: 'Decline',
    icon: CustomDecline,
    isVisible: isAwaitingApproval,
    onClick: (row) => onDecline(row),
  },
  {
    label: 'Refund',
    icon: CustomDecline,
    isVisible: isRefundable,
    onClick: (row) => onRefund(row),
  },
];
