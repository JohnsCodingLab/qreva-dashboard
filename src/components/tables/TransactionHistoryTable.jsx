import CustomEye from "../icons/CustomEye";
import CustomHistory from "../icons/CustomHistory";
import CustomShare from "../icons/CustomShare";
import DataTable from "./DataTable";

const customerNameColumn = {
  field: "customerName",
  // Assembled from several fallbacks rather than read from one stored field,
  // so the server has nothing to order the full set by. These tables are
  // server-paginated, so offering the sort would only reorder the page.
  sortable: false,
  headerName: "Customer Name",
  width: 180,
  flex: 1,
  renderCell: (params) => {
    const name =
      params.row.senderName ||
      params.row.customerName ||
      params.row.clientName ||
      params.row.transferId?.nameEnquiryId?.accountName ||
      params.row.utilityId?.vasVerificationId?.name ||
      params.row.title ||
      "-";
    const acc =
      params.row.senderPhone ||
      params.row.phoneNumber ||
      params.row.utilityId?.phoneNumber ||
      params.row.meterNumber ||
      params.row.utilityId?.meterNumber ||
      params.row.creditAccountNumber ||
      params.row.accountNumber ||
      params.row.utilityId?.accountNumber ||
      params.row.acc ||
      "";
    return (
      <div className="flex flex-col justify-center h-full">
        <div className="text-sm font-general font-medium flex items-center h-full">
          {name}
        </div>
        {acc && (
          <div className="text-xs text-qreva-navy flex items-center h-full">
            {acc}
          </div>
        )}
      </div>
    );
  },
};

const billerColumn = {
  field: "biller",
  // Assembled from several fallbacks rather than read from one stored field,
  // so the server has nothing to order the full set by. These tables are
  // server-paginated, so offering the sort would only reorder the page.
  sortable: false,
  headerName: "Biller",
  width: 150,
  flex: 0.9,
  renderCell: (params) => {
    const biller =
      params.row.biller ||
      params.row.utilityId?.provider ||
      params.row.provider ||
      params.row.networkProvider ||
      params.row.utilityId?.serviceName ||
      params.row.utilityId?.billerName ||
      params.row.serviceName ||
      params.row.typeCategory ||
      params.row.category ||
      "-";
    return (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {biller}
      </span>
    );
  },
};

const locationColumn = {
  field: "location",
  headerName: "Location",
  width: 140,
  flex: 0.8,
  renderCell: (params) => (
    <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
      {params.value || params.row.state || params.row.region || "-"}
    </span>
  ),
};

const categoryColumn = {
  field: "typeCategory",
  headerName: "Category",
  width: 130,
  flex: 0.8,
  renderCell: (params) => (
    <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
      {params.value || params.row.category || "-"}
    </span>
  ),
};

const detailsColumn = {
  field: "title",
  // Assembled from several fallbacks rather than read from one stored field,
  // so the server has nothing to order the full set by. These tables are
  // server-paginated, so offering the sort would only reorder the page.
  sortable: false,
  headerName: "Customer Details",
  width: 200,
  flex: 1,
  renderCell: (params) => {
    const name =
      params.row.customerName ||
      params.row.senderName ||
      params.row.transferId?.nameEnquiryId?.accountName ||
      params.row.utilityId?.vasVerificationId?.name ||
      "Unknown Name";
    const personId =
      params.row.clientId ||
      params.row.userId ||
      params.row.acc ||
      "";
    return (
      <div className="flex flex-col justify-center h-full">
        <div className="text-sm font-general font-medium flex items-center h-full">
          {name}
        </div>
        {personId && (
          <div className="text-xs text-qreva-navy flex items-center h-full">
            {personId}
          </div>
        )}
      </div>
    );
  },
};

const statusColumn = {
  field: "status",
  headerName: "Status",
  width: 130,
  flex: 0.8,
  renderCell: (params) => {
    const statusColors = {
      Pending: "border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]",
      Successful: "border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]",
      Completed: "border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]",
      Failed: "border border-[#E85304] bg-[#FCECE8] text-[#E85304]",
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
};

const typeColumn = {
  field: "type",
  headerName: "Transaction Type",
  width: 140,
  flex: 0.7,
  renderCell: (params) => (
    <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
      {params.value}
    </span>
  ),
};

const amountColumn = {
  field: "amount",
  headerName: "Amount (₦)",
  width: 150,
  flex: 1,
  renderCell: (params) => (
    <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
      {params.value?.toLocaleString()}
    </span>
  ),
};


const qrevaRevenueColumn = {
  field: "qreva_fee",
  headerName: "Qreva Revenue (\u20A6)",
  width: 120,
  flex: 0.8,
  renderCell: (params) => (
    <span className="text-sm font-general text-green-600 flex items-center font-bold h-full">
      {params.value != null ? params.value.toLocaleString() : "-"}
    </span>
  ),
};


const referenceColumn = {
  field: "reference",
  headerName: "Transaction Ref",
  width: 150,
  flex: 1,
  renderCell: (params) => (
    <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
      {params.row.sessionId || params.row.reference || params.row.transactionId || "-"}
    </span>
  ),
};

const accountTypeColumn = {
  field: "accountType",
  headerName: "Account Type",
  width: 130,
  flex: 0.8,
  renderCell: (params) => (
    <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
      {params.value || params.row.userType || params.row.customerType || "-"}
    </span>
  ),
};


const transactionDateColumn = {
  field: "createdAt",
  headerName: "Transaction Date",
  width: 180,
  flex: 1,
  renderCell: (params) => {
    const val = params.value || params.row.date;
    if (!val)
      return (
        <span className="text-sm text-qreva-navy flex items-center h-full">
          -
        </span>
      );
    const d = new Date(val);
    if (isNaN(d))
      return (
        <span className="text-sm text-qreva-navy flex items-center h-full">
          {val}
        </span>
      );
    return (
      <span className="text-sm text-qreva-navy flex items-center h-full">
        {d.toLocaleDateString("en-NG", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    );
  },
};

export const defaultColumns = [
  transactionDateColumn,
  referenceColumn,
  detailsColumn,
  accountTypeColumn,
  typeColumn,
  amountColumn,
  qrevaRevenueColumn,
  statusColumn,
  locationColumn,
];

export const regionColumns = [
  customerNameColumn,
  billerColumn,
  locationColumn,
  statusColumn,
  typeColumn,
  amountColumn,
  qrevaRevenueColumn,
  transactionDateColumn,
];

const TransactionHistoryTable = ({
  data,
  title = "Transaction History",
  actions = [],
  columns: columnsOverride,
  variant,
  ...rest
}) => {
  let columns = defaultColumns;
  if (columnsOverride && columnsOverride.length > 0) {
    columns = columnsOverride;
  } else if (variant === "region") {
    columns = regionColumns;
  }

  const defaultActions = [
    {
      label: "View Details",
      icon: CustomEye,
      onClick: (row) => console.log("View:", row),
    },
    {
      label: "Download Receipt",
      icon: CustomShare,
      onClick: (row) => console.log("Share:", row),
    },
    {
      label: "View History",
      icon: CustomHistory,
      onClick: (row) => console.log("History:", row),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      title={title}
      actions={actions.length > 0 ? actions : defaultActions}
      showExport={true}
      exportText="Export Transactions CSV"
      {...rest}
    />
  );
};

export default TransactionHistoryTable;
