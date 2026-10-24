const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '—';
  }
};

const userLabel = (user) => {
  if (!user || typeof user !== 'object') return '—';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return name || user.emailAddress || '—';
};

export const INVESTIGATION_COLUMNS = [
  {
    field: 'user',
    headerName: 'User',
    flex: 1.3,
    renderCell: (params) => (
      <div className="flex flex-col justify-center h-full">
        <span className="text-sm font-medium text-[#1E1E1E]">{userLabel(params.row.userId)}</span>
        <span className="text-xs text-[#808C91]">
          {params.row.userId?.emailAddress || params.row.userId?.phoneNumber || '—'}
        </span>
      </div>
    ),
  },
  {
    field: 'reason',
    headerName: 'Reason',
    flex: 1.4,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{params.row.reason || '—'}</span>
    ),
  },
  {
    field: 'addedBy',
    headerName: 'Added By',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{userLabel(params.row.addedBy)}</span>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Date Added',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{formatDate(params.row.createdAt)}</span>
    ),
  },
  {
    field: 'active',
    headerName: 'Status',
    flex: 0.7,
    renderCell: (params) => (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center h-fit my-auto ${
          params.row.active ? 'bg-[#FFF4E5] text-[#B25E00]' : 'bg-[#F2F3F4] text-[#808C91]'
        }`}
      >
        {params.row.active ? 'Under Investigation' : 'Closed'}
      </span>
    ),
  },
];

export const INVESTIGATION_ACTIONS = [
  { label: 'View Login Sessions' },
  { label: 'View Verification Captures' },
  { label: 'Remove From List' },
];
