export const ACTIVITY_LOGS_DATA = [
  {
    id: 1,
    user: "Rejoice Regina Rose",
    email: "emailaddress@g...om",
    role: "Internal Staff",
    action: "Updated Permissions for Agents",
    date: "10:00 AM | 25th March, 2025",
  },
  {
    id: 2,
    user: "Rejoice Regina Rose",
    email: "emailaddress@g...om",
    role: "Internal Staff",
    action: "Promoted Peculiar Rose to Agg. Manager",
    date: "10:00 AM | 25th March, 2025",
  },
  {
    id: 3,
    user: "Rejoice Regina Rose",
    email: "emailaddress@g...om",
    role: "Internal Staff",
    action: "Suspended Peculiar Rose",
    date: "10:00 AM | 25th March, 2025",
  },
  {
    id: 4,
    user: "Rejoice Regina Rose",
    email: "emailaddress@g...om",
    role: "Internal Staff",
    action: "Updated Tier 2 Settings",
    date: "10:00 AM | 25th March, 2025",
  },
  {
    id: 5,
    user: "Rejoice Regina Rose",
    email: "emailaddress@g...om",
    role: "Internal Staff",
    action: "Deleted the Bronze Agent Category",
    date: "10:00 AM | 25th March, 2025",
  },
  {
    id: 6,
    user: "Rejoice Regina Rose",
    email: "emailaddress@g...om",
    role: "Internal Staff",
    action: "Created the Bronze Agent Category",
    date: "10:00 AM | 25th March, 2025",
  },
  {
    id: 7,
    user: "Rejoice Regina Rose",
    email: "emailaddress@g...om",
    role: "Internal Staff",
    action: "Approved Peculiar Rose Tier 3 KYC",
    date: "10:00 AM | 25th March, 2025",
  },
];

const splitCamelCase = (str) =>
  str
    ? String(str)
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .trim()
    : '-';

const formatDate = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return {
    date: d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
};

export const ACTIVITY_LOGS_COLUMNS = [
  {
    field: "actorAdminId",
    headerName: "Actor",
    width: 260,
    minWidth: 240,
    flex: 1.4,
    renderCell: (params) => {
      const name = params.row.actorName || params.row.user || null;
      const email = params.row.actorEmail || params.row.email || null;
      const id = params.row.actorAdminId || '-';
      return (
        <div className="flex flex-col justify-center h-full min-w-0 py-3">
          <div className="text-sm font-medium text-[#1E1E1E] truncate">{name || id}</div>
          {email && <div className="text-xs text-[#808C91] truncate">{email}</div>}
          {name && <div className="text-xs text-[#808C91] truncate">{id}</div>}
        </div>
      );
    },
  },
  {
    field: "role",
    headerName: "Role",
    width: 150,
    minWidth: 140,
    flex: 0.8,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full whitespace-normal leading-snug">
        {params.row.actorRole || params.row.role || '-'}
      </span>
    ),
  },
  {
    field: "resource",
    headerName: "Resource",
    width: 160,
    minWidth: 150,
    flex: 0.9,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {splitCamelCase(params.row.resource)}
      </span>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    width: 190,
    minWidth: 180,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {splitCamelCase(params.row.action)}
      </span>
    ),
  },
  {
    field: "description",
    headerName: "Description",
    width: 360,
    minWidth: 320,
    flex: 1.8,
    renderCell: (params) => {
      const description = params.row.description || params.row.details || null;
      const action = splitCamelCase(params.row.action);
      const resource = splitCamelCase(params.row.resource);
      const updatedFields = params.row.metadata?.updatedFields;
      const generated = updatedFields?.length
        ? `${action} on ${resource} — Fields: ${updatedFields.map(splitCamelCase).join(', ')}`
        : `${action} on ${resource}`;
      const displayDescription = description ? splitCamelCase(description) : generated;
      return (
        <span className="text-sm text-[#505C61] flex items-center h-full whitespace-normal leading-snug py-3">
          {displayDescription}
        </span>
      );
    },
  },
  {
    field: "network",
    headerName: "Network",
    width: 220,
    minWidth: 200,
    flex: 1.1,
    renderCell: (params) => (
      <div className="flex flex-col justify-center h-full min-w-0 py-3">
        <span className="text-sm text-[#505C61] truncate">{params.row.ipAddress || '-'}</span>
        <span className="text-xs text-[#808C91] truncate">{params.row.location || params.row.city || '-'}</span>
      </div>
    ),
  },
  {
    field: "device",
    headerName: "Device / Agent",
    width: 310,
    minWidth: 290,
    flex: 1.5,
    renderCell: (params) => {
      return (
        <div className="flex flex-col justify-center h-full min-w-0 py-3">
          <span className="text-sm text-[#505C61] truncate">
            {params.row.deviceType || '-'} | {params.row.os || '-'} | {params.row.browser || '-'}
          </span>
          <span className="text-xs text-[#808C91] truncate">{params.row.userAgent || '-'}</span>
        </div>
      );
    },
  },
  {
    field: "requestPath",
    headerName: "Request",
    width: 260,
    minWidth: 240,
    flex: 1.2,
    renderCell: (params) => (
      <div className="flex flex-col justify-center h-full min-w-0 py-3">
        <span className="text-sm text-[#505C61] truncate">{params.row.requestMethod || '-'}</span>
        <span className="text-xs text-[#808C91] truncate">{params.row.requestPath || '-'}</span>
      </div>
    ),
  },
  {
    field: "createdAt",
    headerName: "Timestamp",
    width: 180,
    minWidth: 160,
    flex: 0.9,
    renderCell: (params) => {
      const f = formatDate(params.row.timestamp || params.row.createdAt);
      if (!f) return <span className="text-sm text-[#808C91] flex items-center h-full">-</span>;
      return (
        <div className="flex flex-col justify-center h-full py-3">
          <span className="text-sm text-[#505C61]">{f.date}</span>
          <span className="text-xs text-[#808C91]">{f.time}</span>
        </div>
      );
    },
  },
];

