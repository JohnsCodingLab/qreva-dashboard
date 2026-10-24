export const RULE_COLUMNS = [
  {
    field: 'name',
    headerName: 'Rule Name',
    flex: 1.4,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">{params.row.name}</span>
    ),
  },
  {
    field: 'applies_to_event_types',
    headerName: 'Applies To',
    flex: 1.3,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {(params.row.applies_to_event_types || []).join(', ')}
      </span>
    ),
  },
  {
    field: 'weight',
    headerName: 'Weight',
    flex: 0.6,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{params.row.weight}</span>
    ),
  },
  {
    field: 'is_hard_override',
    headerName: 'Hard Override',
    flex: 0.9,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.is_hard_override ? `Yes (${params.row.override_action || '—'})` : 'No'}
      </span>
    ),
  },
  {
    field: 'version',
    headerName: 'Version',
    flex: 0.5,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">v{params.row.version}</span>
    ),
  },
  {
    field: 'active',
    headerName: 'Status',
    flex: 0.7,
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

export const RULE_ACTIONS = [
  { label: 'Edit Rule' },
  { label: 'Deactivate Rule' },
];

export const EVENT_TYPE_OPTIONS = ['transfer', 'onboarding', 'login', 'withdrawal', 'bill_payment'];
