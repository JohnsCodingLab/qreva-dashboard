// Shared transaction-history column definitions for VAS-style dashboards
// (Airtime, Data, Bills). Used by passing as the `columns` prop on
// TransactionHistoryTable.

const NETWORK_PATTERNS = [
  { match: /\bmtn\b/i, label: 'MTN' },
  { match: /\bairtel\b/i, label: 'Airtel' },
  { match: /\bglo\b/i, label: 'Glo' },
  { match: /\b(9mobile|etisalat|9-?mobile)\b/i, label: '9mobile' },
];

const normalizeNetwork = (raw) => {
  if (!raw) return null;
  const match = NETWORK_PATTERNS.find((n) => n.match.test(String(raw)));
  return match ? match.label : raw;
};

const resolveCustomerName = (row) =>
  row.customerName ||
  row.senderName ||
  row.clientName ||
  row.utilityId?.vasVerificationId?.name ||
  row.transferId?.nameEnquiryId?.accountName ||
  row.title ||
  '-';

const resolvePhoneNumber = (row) =>
  row.phoneNumber ||
  row.utilityId?.phoneNumber ||
  row.metadata?.phoneNumber ||
  row.senderPhone ||
  row.meterNumber ||
  row.utilityId?.meterNumber ||
  row.metadata?.meterNumber ||
  row.utilityId?.accountNumber ||
  row.accountNumber ||
  row.acc ||
  '';

const resolveBiller = (row) => {
  const candidates = [
    row.networkProvider,
    row.network,
    row.metadata?.network,
    row.metadata?.networkProvider,
    row.utilityId?.provider,
    row.metadata?.provider,
    row.provider,
    row.metadata?.billerName,
    row.utilityId?.billerName,
    row.utilityId?.serviceName,
    row.serviceName,
    row.biller,
    row.utilityId?.utilityType,
  ];
  for (const c of candidates) {
    if (!c) continue;
    return normalizeNetwork(c) || c;
  }
  return '-';
};

const resolveLocation = (row) => {
  const meta = row.metadata || {};
  const sender = row.senderId || row.userId || {};
  const senderPersonal = sender.personalDetails || {};
  const senderAddress = sender.address || {};
  const state =
    row.location?.state ||
    meta.state ||
    meta.location?.state ||
    senderPersonal.state ||
    senderAddress.state ||
    '';
  const lga =
    row.location?.lga ||
    meta.lga ||
    meta.location?.lga ||
    senderPersonal.lga ||
    senderAddress.lga ||
    senderAddress.city ||
    '';
  if (state && lga) return `${lga}, ${state}`;
  return state || lga || row.state || row.region || row.location || '-';
};

const resolveBuyerType = (row) => {
  // Prefer explicit fields if present.
  const explicit =
    row.buyerType ||
    row.customerType ||
    row.userType ||
    row.metadata?.buyerType ||
    row.metadata?.customerType;
  if (explicit) return explicit;

  // Boolean signals.
  if (row.isFirstTimer === true || row.isFirstPurchase === true) return 'First-timer';
  if (row.isRepeatBuyer === true || row.isReturningCustomer === true) return 'Repeat-Buyer';

  // Numeric signal — count of prior transactions for this customer.
  const count =
    row.userTransactionCount ??
    row.customerTransactionCount ??
    row.metadata?.userTransactionCount;
  if (typeof count === 'number') {
    return count > 1 ? 'Repeat-Buyer' : 'First-timer';
  }

  return '-';
};

export const vasTransactionColumns = [
  {
    field: 'customerName',
    headerName: 'Customer Name',
    width: 220,
    flex: 1.2,
    valueGetter: (value, row) => resolveCustomerName(row),
    renderCell: (params) => {
      const name = resolveCustomerName(params.row);
      const phone = resolvePhoneNumber(params.row);
      return (
        <div className="flex flex-col justify-center h-full">
          <div className="text-sm font-general font-medium text-[#1E1E1E]">{name}</div>
          {phone && <div className="text-xs text-qreva-navy">{phone}</div>}
        </div>
      );
    },
  },
  {
    field: 'biller',
    headerName: 'Biller',
    width: 130,
    flex: 0.8,
    // Read off the populated utility record, not stored on the transaction, so
    // the server can't order the full set by it. These tables are server
    // paginated, so an offered sort would only reorder the current page.
    sortable: false,
    valueGetter: (value, row) => resolveBiller(row),
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {params.value || '-'}
      </span>
    ),
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 160,
    flex: 0.9,
    valueGetter: (value, row) => resolveLocation(row),
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {params.value || '-'}
      </span>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    flex: 0.8,
    renderCell: (params) => {
      const statusColors = {
        Pending: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]',
        Successful: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]',
        Completed: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]',
        Failed: 'border border-[#E85304] bg-[#FCECE8] text-[#E85304]',
      };
      const statusClass =
        statusColors[params.value] || 'border border-gray-300 bg-qreva-ash text-qreva-navy';
      return (
        <span
          className={`px-2 py-1.5 text-center ${statusClass} font-general font-medium text-xs rounded-md flex items-center justify-center h-full`}
        >
          {params.value || '-'}
        </span>
      );
    },
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 130,
    flex: 0.8,
    // First-timer vs Repeat-Buyer, inferred per row - it is not the stored
    // transaction type despite the field name, so sorting on it server-side
    // would order by something else entirely.
    sortable: false,
    valueGetter: (value, row) => resolveBuyerType(row),
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {params.value || '-'}
      </span>
    ),
  },
  {
    field: 'amount',
    headerName: 'Amount (₦)',
    width: 140,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
        {Number(params.value || 0).toLocaleString()}
      </span>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Transaction Date',
    width: 180,
    flex: 1,
    renderCell: (params) => {
      const val = params.value || params.row.date;
      if (!val)
        return (
          <span className="text-sm text-qreva-navy flex items-center h-full">-</span>
        );
      const d = new Date(val);
      if (isNaN(d))
        return (
          <span className="text-sm text-qreva-navy flex items-center h-full">{val}</span>
        );
      return (
        <span className="text-sm text-qreva-navy flex items-center h-full">
          {d.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      );
    },
  },
];

export default vasTransactionColumns;
