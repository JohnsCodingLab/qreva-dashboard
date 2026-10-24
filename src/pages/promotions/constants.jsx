import CustomEye from '@/components/icons/CustomEye';
import CustomDecline from '@/components/icons/CustomDecline';

export const promotionColumns = [
  {
    field: 'imageUrl',
    headerName: 'Banner',
    width: 170,
    sortable: false,
    renderCell: (params) => (
      <div className="flex h-full items-center">
        <img
          src={params.value}
          alt={params.row.altText || 'Banner'}
          className="h-10 w-32 rounded object-cover"
        />
      </div>
    ),
  },
  {
    field: 'name',
    headerName: 'Campaign',
    width: 220,
    flex: 1,
    renderCell: (params) => (
      <div className="flex h-full flex-col justify-center">
        <div className="text-sm font-general font-medium">{params.value}</div>
        <div className="max-w-[240px] truncate text-xs text-qreva-navy">
          {params.row.targetUrl}
        </div>
      </div>
    ),
  },
  {
    field: 'impressions',
    headerName: 'Seen',
    width: 100,
    renderCell: (params) => (
      <span className="flex h-full items-center text-sm font-general tabular-nums text-[#1E1E1E]">
        {(params.value ?? 0).toLocaleString('en-US')}
      </span>
    ),
  },
  {
    field: 'clicks',
    headerName: 'Tapped',
    width: 110,
    renderCell: (params) => {
      const seen = params.row.impressions ?? 0;
      const clicks = params.value ?? 0;
      // The rate is the number anyone actually asks for, and it is cheap to
      // show next to the count rather than making someone work it out.
      const rate = seen > 0 ? Math.round((clicks / seen) * 100) : null;
      return (
        <div className="flex h-full flex-col justify-center">
          <span className="text-sm font-general tabular-nums text-[#1E1E1E]">
            {clicks.toLocaleString('en-US')}
          </span>
          {rate !== null && (
            <span className="text-xs text-[#808C91]">{rate}%</span>
          )}
        </div>
      );
    },
  },
  {
    field: 'active',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => (
      <div className="flex h-full items-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-general font-medium ${
            params.value
              ? 'border border-[#4ED17E] bg-[#E9F9EF] text-[#1B7D3C]'
              : 'border border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280]'
          }`}
        >
          {params.value ? 'Live' : 'Paused'}
        </span>
      </div>
    ),
  },
];

export const createPromotionActions = (onToggle, onDelete) => [
  {
    label: 'Pause / make live',
    icon: CustomEye,
    onClick: (row) => onToggle(row),
  },
  {
    label: 'Delete campaign',
    icon: CustomDecline,
    onClick: (row) => onDelete(row),
  },
];
