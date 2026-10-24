import { MoreVertical } from "lucide-react";
import { format } from "date-fns";

export const regionalManagerColumns = [
  {
    field: "sn",
    headerName: "S/N",
    width: 60,
    renderCell: (params) => {
      // DataGrid row index is 0-based.
      const index = params.api.getRowIndexRelativeToVisibleRows(params.row._id || params.row.id);
      return index !== undefined ? index + 1 : "-";
    },
  },
  {
    field: "_id",
    headerName: "ID",
    flex: 1,
    renderCell: (params) => {
      const id = params.row._id || params.row.id || "";
      return id.substring(0, 8); // Displaying a shortened ID for better UI
    },
  },
  {
    field: "fullName",
    headerName: "Full Name",
    flex: 1.5,
    renderCell: (params) => {
      const fullName = params.row.fullName || `${params.row.firstName || ''} ${params.row.lastName || ''}`.trim();
      const initial = fullName ? fullName.charAt(0).toUpperCase() : '?';
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-qreva-blue text-white flex items-center justify-center font-medium">
            {initial}
          </div>
          <span className="font-medium text-[#1E1E1E]">{fullName}</span>
        </div>
      );
    },
  },
  {
    field: "emailAddress",
    headerName: "Email Address",
    flex: 1.5,
    renderCell: (params) => params.row.emailAddress || params.row.email,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    flex: 1,
    renderCell: (params) => params.row.phoneNumber || params.row.phone || "-",
  },
  {
    field: "assignedRegion",
    headerName: "Assigned Region",
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "Date Added",
    flex: 1,
    renderCell: (params) => (
      <span>{params.value ? format(new Date(params.value), "dd MMM yyyy") : "-"}</span>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      const isActive = params.value === "Active" || params.value === "active";
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive
              ? "bg-[#E6F9E6] text-qreva-blue"
              : "bg-[#FBE9E9] text-qreva-orange"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];

export const createManagerActions = (handleViewProfile, handleSuspendClick, handleResendInvite) => {
  return [
    {
      label: "View Profile",
      onClick: handleViewProfile,
      disabled: !handleViewProfile,
    },
    {
      label: (row) => ((row.status === "Active" || row.status === "active") ? "Suspend Manager" : "Activate Manager"),
      onClick: handleSuspendClick,
      disabled: !handleSuspendClick,
      className: (row) => ((row.status === "Active" || row.status === "active") ? "text-qreva-orange" : "text-qreva-blue"),
    },
    {
      label: "Resend Invite",
      onClick: handleResendInvite,
      disabled: !handleResendInvite,
      isVisible: (row) => (row.status === "Pending" || row.status === "pending"),
    },
  ];
};

