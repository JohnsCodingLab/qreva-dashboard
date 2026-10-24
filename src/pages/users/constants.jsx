import CustomEye from "@/components/icons/CustomEye";
import CustomUser from "@/components/icons/CustomUser";
import CustomHistory from "@/components/icons/CustomHistory";

export const userStats = [
  {
    label: "Total Users",
    value: "0",
    change: "+0%",
    subtext: "in last 24 hours",
  },
  {
    label: "Total Accounts",
    value: "0",
    change: "+0%",
    subtext: "in last 24 hours",
  },
  {
    label: "Total Agents",
    value: "0",
    change: "+0%",
    subtext: "in last 24 hours",
  },
  {
    label: "Total Aggregators",
    value: "0",
    change: "+0%",
    subtext: "in last 24 hours",
  },
  {
    label: "Total Aggregator Managers",
    value: "0",
    change: "+0%",
    subtext: "in last 24 hours",
  },
];

export const userColumns = [
  {
    field: "firstName",
    headerName: "User Name",
    width: 200,
    flex: 1,
    renderCell: (params) => (
      <div>
        <div className="text-sm font-general text-[#1E1E1E] font-medium">
          {params.row.firstName} {params.row.lastName}
        </div>
        <div className="text-sm font-general text-[#475367]">
          {params.row.emailAddress}
        </div>
      </div>
    ),
  },
  {
    field: "type",
    headerName: "Account Type",
    width: 180,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general font-light tracking-wider text-[#1E1E1E] flex items-center h-full">
        {params.value}
      </span>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    flex: 1,
    renderCell: (params) => {
      const statusColors = {
        Active: "bg-[#E9F9EF] border border-[#4ED17E] text-[#188C43]",
        Suspended: "bg-[#FFF8E6] border border-[#FFC535] text-[#B58202]",
        Deactivated: "bg-[#FCECEC] border border-[#E56566] text-[#9E2D2D]",
        Inactive: "bg-[#F3F4F6] border border-[#D1D5DB] text-[#6B7280]",
        Pending: "bg-[#FFF8E6] border border-[#FFC535] text-[#B58202]",
      };
      return (
        <span
          className={`px-3 py-1.5 ${statusColors[params.value] || ""} text-xs rounded-md font-general tracking-wider font-semibold leading-[145%]`}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    width: 160,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
        {params.value}
      </span>
    ),
  },
  {
    field: "clientId",
    headerName: "Client ID",
    width: 180,
    flex: 1,
    // Not one of the fields the server will order by, and an unsortable
    // header is better than one that silently reorders by date instead.
    sortable: false,
    renderCell: (params) => (
      <span className="text-sm text-[#1E1E1E] font-general flex flex-wrap items-center h-full">
        {params.value}
      </span>
    ),
  },
  {
    field: "personnelId",
    headerName: "Personnel ID",
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#1E1E1E] font-general flex items-center h-full">
        {params.value || "-"}
      </span>
    ),
  },
];

export const createUserActions = (navigate, onSuspend) => [
  {
    label: "View Profile Details",
    icon: CustomEye,
    onClick: (row) => navigate(`/users/${row._id}`),
  },
  {
    label: "View Transaction History",
    icon: CustomHistory,
    onClick: (row) => navigate(`/users/${row._id}?tab=transactions`),
  },
  {
    label: "Suspend User",
    icon: CustomUser,
    onClick: (row) => onSuspend(row),
  },
];

export const userTransactionColumns = [
  {
    field: "title",
    headerName: "Title",
    width: 200,
    flex: 1,
    renderCell: (params) => {
      const name =
        params.row.senderName ||
        params.row.transferId?.nameEnquiryId?.accountName ||
        params.row.utilityId?.vasVerificationId?.name ||
        params.row.narration ||
        params.row.typeCategory ||
        params.row.desc ||
        params.row.title ||
        "-";
      const acc =
        params.row.phoneNumber ||
        params.row.meterNumber ||
        params.row.creditAccountNumber ||
        params.row.accountNumber ||
        "";
      return (
        <div className="flex flex-col justify-center h-full">
          <div className="text-sm font-general text-[#1E1E1E] font-medium">
            {name}
          </div>
          {acc && <div className="text-xs text-qreva-navy">{acc}</div>}
        </div>
      );
    },
  },
  {
    field: "typeCategory",
    headerName: "Category",
    width: 180,
    flex: 1,
    renderCell: (params) => {
      const cat = params.value || params.row.category || "-";
      const terminalId = params.row.metadata?.terminalId;
      const displayCat = cat === 'PhysicalPOS' ? 'Physical POS' : cat === 'SoftPOS' ? 'SoftPOS' : cat;
      return (
        <div className="flex flex-col justify-center h-full">
          <span className="text-sm font-general font-medium text-[#1E1E1E]">
            {displayCat}
          </span>
          {terminalId && (
            <span className="text-xs text-slate-500">
              Terminal: {terminalId}
            </span>
          )}
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    flex: 1,
    renderCell: (params) => {
      const statusColors = {
        Successful: "bg-[#E9F9EF] border border-[#4ED17E] text-[#188C43]",
        Completed: "bg-[#E9F9EF] border border-[#4ED17E] text-[#188C43]",
        Pending: "bg-[#FFF8E6] border border-[#FFC535] text-[#B58202]",
        Failed: "bg-[#FCECEC] border border-[#E56566] text-[#9E2D2D]",
      };
      const statusClass =
        statusColors[params.value] ||
        "bg-qreva-ash border border-gray-300 text-qreva-navy";
      return (
        <span
          className={`px-3 py-1.5 ${statusClass} text-xs rounded-md font-general tracking-wider font-semibold leading-[145%]`}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "type",
    headerName: "Type",
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
        {params.value}
      </span>
    ),
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
          <span className="text-sm text-[#1E1E1E] font-general flex items-center h-full">
            {val}
          </span>
        );
      return (
        <span className="text-sm text-[#1E1E1E] font-general flex items-center h-full">
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
  },
];

