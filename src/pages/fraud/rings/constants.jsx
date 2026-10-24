export const RING_COLUMNS = [
  {
    field: 'root_id',
    headerName: 'Root ID',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">{params.row.root_id}</span>
    ),
  },
  {
    field: 'cluster_type',
    headerName: 'Cluster Type',
    flex: 0.9,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{params.row.cluster_type}</span>
    ),
  },
  {
    field: 'size',
    headerName: 'Size',
    flex: 0.5,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">{params.row.size}</span>
    ),
  },
  {
    field: 'last_updated_at',
    headerName: 'Last Updated',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.last_updated_at ? new Date(params.row.last_updated_at).toLocaleString() : '—'}
      </span>
    ),
  },
  {
    field: 'reviewed',
    headerName: 'Status',
    flex: 0.7,
    renderCell: (params) => (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center h-fit my-auto ${
          params.row.reviewed ? 'bg-[#E8F8EE] text-[#1BA860]' : 'bg-[#FFF1E5] text-[#FF5B04]'
        }`}
      >
        {params.row.reviewed ? 'Reviewed' : 'Unreviewed'}
      </span>
    ),
  },
];

export const RING_ACTIONS = [{ label: 'Review Cluster' }];
