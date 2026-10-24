import CustomEye from "@/components/icons/CustomEye";
import CustomShare from "@/components/icons/CustomShare";
import CustomHistory from "@/components/icons/CustomHistory";
import { AccountTypeBadge, DirectionBadge } from "@/components/tables/TransactionBadges";
import { abbreviateBankName } from "@/utils/bankName";
import { resolveSenderName, resolveRecipientName } from "@/utils/transactionParties";

const createRegioncolumns = (handleViewRegionDetails) => [
  {
    field: "location",
    headerName: "Location",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <span className="font-general text-sm flex items-center gap-3">
        <p className="bg-[#F7FAFA] rounded-full w-6 h-6 flex items-center justify-center text-[#808C91] text-center border-2 border-[#E9F1F3]">
          {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
        </p>{" "}
        <p className="font-medium leading-[148%] text-[#1E1E1E]">
          {params.row.location || params.row.name}
        </p>
      </span>
    ),
  },
  {
    field: "totalTransfers",
    headerName: "Total KYC Verifications",
    flex: 1,
    minWidth: 180,
    renderCell: (params) => (
      <span className="font-general text-sm text-[#1E1E1E] flex items-center leading-[156%]">
        {params.value?.toLocaleString()}
      </span>
    ),
  },
  {
    field: "volume",
    headerName: "Total KYC Verifications Sum(N)",
    flex: 1,
    minWidth: 180,
    renderCell: (params) => (
      <span className="font-general text-sm text-[#1E1E1E] flex items-center font-medium">
        {params.value?.toLocaleString()}
      </span>
    ),
  },
  {
    field: "revenue",
    headerName: "Total Revenue (N)",
    flex: 1,
    minWidth: 220,
    renderCell: (params) => (
      <span className="font-general text-sm text-[#1E1E1E] flex items-center font-medium">
        {params.value?.toLocaleString()}
      </span>
    ),
  },
  {
    field: "successRate",
    headerName: "Success Rate (%)",
    flex: 0.8,
    minWidth: 150,
    renderCell: (params) => (
      <span className="font-general text-sm text-[#1E1E1E] flex items-center">
        {params.value}%
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "",
    width: 130,
    sortable: false,
    renderCell: (params) => (
      <button
        onClick={() =>
          handleViewRegionDetails(
            params.row._id || params.row.id || params.row.location,
          )
        }
        className="font-general flex items-center text-sm text-[#26C8B9] underline underline-offset-2 cursor-pointer font-semibold"
      >
        View Details
      </button>
    ),
  },
];

// banksMap: { [bankCode]: bankName }, from the dashboard's cached
// useBanks() hook - only outward transfers carry a beneficiaryBankCode
// (SafeHaven's inward webhook has no sender-bank data at all).
const createTransactionColumns = (banksMap = {}) => [
  {
    field: "senderName",
    headerName: "Senders Name",
    width: 200,
    flex: 1,
    renderCell: (params) => {
      const isOutward = params.row.type === "Outward";
      const senderName = resolveSenderName(params.row);
      return (
        <div
          className="flex items-center h-full w-full min-w-0 text-sm font-general font-medium"
          title={senderName}
        >
          <span className="truncate min-w-0">{senderName}</span>
          {isOutward && <AccountTypeBadge code={params.row.accountTypeBadge} />}
        </div>
      );
    },
  },
  {
    field: "recipientName",
    headerName: "Recipient Name",
    width: 200,
    flex: 1,
    // Resolved from the populated transfer record rather than stored on the
    // transaction, so the server has no field to order the full set by - and
    // this table is server-paginated. Better to not offer the sort than to
    // reorder the ten rows on screen and call it sorted.
    sortable: false,
    valueGetter: (value, row) => resolveRecipientName(row),
    renderCell: (params) => {
      const isOutward = params.row.type === "Outward";
      const fullBankName = isOutward
        ? banksMap[params.row.beneficiaryBankCode] || null
        : null;
      // Abbreviated so the bank doesn't crowd out the recipient's own name;
      // the tooltip below still carries the full value.
      const bankName = fullBankName ? abbreviateBankName(fullBankName) : null;
      const recipientName = params.value && params.value !== "-" ? params.value : null;
      // Mirrors Inward's "QREVA / Name" look (that's SafeHaven's own account
      // name for a Qreva wallet, not composed here) - Outward's equivalent
      // is "Bank / Name", built client-side since bank and recipient name
      // come from two different fields.
      const displayLine = isOutward
        ? [bankName, recipientName].filter(Boolean).join(" / ") || "-"
        : params.value;
      const tooltip = isOutward
        ? [fullBankName, recipientName].filter(Boolean).join(" / ") || "-"
        : displayLine;
      // Everything stays on ONE line. Stacking the direction badge under the
      // name overflowed the DataGrid's fixed row height, which clipped the
      // name text into an unreadable sliver bleeding into the row above.
      return (
        <div
          className="flex items-center h-full w-full min-w-0 text-sm font-general text-[#1E1E1E]"
          title={tooltip}
        >
          <span className="truncate min-w-0">{displayLine}</span>
          {!isOutward && <AccountTypeBadge code={params.row.accountTypeBadge} />}
          {isOutward && <DirectionBadge direction={params.row.transferDirection} />}
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    flex: 0.8,
    renderCell: (params) => {
      const statusColors = {
        Pending: "border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]",
        Successful: "border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]",
        Completed: "border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]",
        Failed: "border border-[#E56566] bg-[#FCECEC] text-[#9E2D2D]",
      };
      const statusClass =
        statusColors[params.value] ||
        "border border-gray-300 bg-qreva-ash text-qreva-navy";
      return (
        <span
          className={`px-2 py-1.5 text-center ${statusClass} font-general font-medium text-xs rounded-md flex items-center justify-center h-full`}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount (₦)",
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
        {params.value?.toLocaleString()}
      </span>
    ),
  },
  {
    field: "fees",
    headerName: "Fees (₦)",
    width: 100,
    flex: 0.7,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {params.value?.toLocaleString()}
      </span>
    ),
  },
  {
    field: "createdAt",
    headerName: "Transaction Date",
    width: 180,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-qreva-navy flex items-center h-full">
        {params.value
          ? new Date(params.value).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </span>
    ),
  },
  {
    field: "location",
    headerName: "Location",
    width: 160,
    flex: 1,
    valueGetter: (value, row) => {
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
        "";
      const lga =
        row.location?.lga ||
        meta.lga ||
        meta.location?.lga ||
        senderPersonal.lga ||
        senderAddress.lga ||
        senderAddress.city ||
        "";
      if (state && lga) return `${lga}, ${state}`;
      return state || lga || row.location || meta.location || senderAddress.country || "-";
    },
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {params.value || "-"}
      </span>
    ),
  },
];

const createTransactionActions = ({
  setSelectedTransaction,
  setShowDetailsModal,
  setShowShareModal,
  navigate,
}) => [
  {
    label: "View Transaction Details",
    type: "view",
    icon: CustomEye,
    onClick: (transaction) => {
      setSelectedTransaction(transaction);
      setShowDetailsModal(true);
    },
  },
  {
    label: "Download Receipt",
    type: "share",
    icon: CustomShare,
    onClick: (transaction) => {
      setSelectedTransaction(transaction);
      setShowShareModal(true);
    },
  },
  {
    label: "View Transaction History",
    type: "history",
    icon: CustomHistory,
    onClick: (transaction) => {
      navigate(
        `/transfers/details/transaction/${transaction._id || transaction.id}`,
      );
    },
  },
];

const createRegionTransactionActions = ({
  setSelectedTransaction,
  setShowDetailsModal,
  setShowShareModal,
  navigate,
}) => [
  {
    label: "View Transaction Details",
    type: "view",
    onClick: (transaction) => {
      setSelectedTransaction(transaction);
      setShowDetailsModal(true);
    },
  },
  {
    label: "Download Receipt",
    type: "share",
    onClick: (transaction) => {
      setSelectedTransaction(transaction);
      setShowShareModal(true);
    },
  },
  {
    label: "View Transaction History",
    type: "history",
    onClick: (transaction) => {
      navigate(
        `/transfers/details/transaction/${transaction._id || transaction.id}`,
      );
    },
  },
];

const createCustomerTransactionActions = ({
  setSelectedTransaction,
  setShowDetailsModal,
  setShowShareModal,
}) => [
  {
    label: "View Transaction Details",
    type: "view",
    icon: CustomEye,
    onClick: (tx) => {
      setSelectedTransaction(tx);
      setShowDetailsModal(true);
    },
  },
  {
    label: "Download Receipt",
    type: "share",
    icon: CustomShare,
    onClick: (tx) => {
      setSelectedTransaction(tx);
      setShowShareModal(true);
    },
  },
];

export {
  createRegioncolumns,
  createTransactionColumns,
  createTransactionActions,
  createRegionTransactionActions,
  createCustomerTransactionActions,
};

