const ACTION_STYLES = {
  allow: 'bg-[#E8F8EE] text-[#1BA860]',
  monitor: 'bg-[#EAF3FF] text-[#2F6FE0]',
  verify: 'bg-[#FFF6E5] text-[#B8860B]',
  review: 'bg-[#FFF1E5] text-[#FF5B04]',
  block: 'bg-[#FDEAEA] text-[#D92D20]',
};

export const SCORE_BAND_COLUMNS = [
  {
    field: 'range',
    headerName: 'Score Range',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">
        {params.row.min_score} – {params.row.max_score}
      </span>
    ),
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 1,
    renderCell: (params) => (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center h-fit my-auto ${
          ACTION_STYLES[params.row.action] || 'bg-[#F2F3F4] text-[#808C91]'
        }`}
      >
        {params.row.action}
      </span>
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
