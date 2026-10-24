export const LIST_TYPE_OPTIONS = ['accounts', 'devices', 'ips', 'phone_numbers', 'bvn', 'nin', 'emails'];

export const BLACKLIST_COLUMNS = [
  {
    field: 'value',
    headerName: 'Value',
    flex: 1.2,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">{params.row.value}</span>
    ),
  },
  {
    field: 'list_type',
    headerName: 'Type',
    flex: 0.8,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{params.row.list_type}</span>
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
    field: 'added_by',
    headerName: 'Added By',
    flex: 0.9,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{params.row.added_by || '—'}</span>
    ),
  },
  {
    field: 'active',
    headerName: 'Status',
    flex: 0.6,
    renderCell: (params) => (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center h-fit my-auto ${
          params.row.active ? 'bg-[#E8F8EE] text-[#1BA860]' : 'bg-[#F2F3F4] text-[#808C91]'
        }`}
      >
        {params.row.active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

export const BLACKLIST_ACTIONS = [{ label: 'Edit Entry' }, { label: 'Remove Entry' }];
