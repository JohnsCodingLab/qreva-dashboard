import CustomEye from '@/components/icons/CustomEye';
import CustomUser from '@/components/icons/CustomUser';
import CustomHistory from '@/components/icons/CustomHistory';


export const aggregatorColumns = [
  {
    field: 'firstName',
    headerName: 'Aggregator Name',
    width: 250,
    flex: 1,
    renderCell: (params) => (
      <div className="flex flex-col justify-center h-full">
        <div className="text-sm font-general font-medium">
          {params.row.firstName} {params.row.lastName}
        </div>
        <div className="text-xs text-qreva-navy">{params.row.emailAddress}</div>
      </div>
    )
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone Number',
    width: 160,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {params.value}
      </span>
    )
  },
  {
    field: 'type',
    headerName: 'Account Type',
    width: 130,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {params.value}
      </span>
    )
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    flex: 1,
    renderCell: (params) => {
      const statusColors = {
        Active: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#1B7D3C]',
        Inactive: 'border border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280]',
        Suspended: 'border border-[#F87171] bg-[#FEE2E2] text-[#B91C1C]',
        Pending: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]',
      };
      return (
        <span className={`px-2 py-1.5 text-center ${statusColors[params.value] || statusColors.Inactive} font-general font-medium text-xs rounded-md flex items-center justify-center h-full`}>
          {params.value || '-'}
        </span>
      );
    }
  },
  {
    field: 'clientId',
    headerName: 'Client ID',
    width: 180,
    flex: 1,
    // Not a field the server will order by, and an unsortable header is
    // better than one that silently reorders by date instead.
    sortable: false,
    renderCell: (params) => (
      <span className="text-sm font-general text-qreva-navy flex items-center h-full">{params.value}</span>
    )
  },
  {
    field: 'personnelId',
    headerName: 'Personnel ID',
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">{params.value || '-'}</span>
    )
  }
];

export const createAggregatorActions = (navigate, onSuspend, onManageAgents) => [
  ...(onManageAgents ? [{
    label: 'Manage Agents',
    icon: CustomUser,
    onClick: (row) => onManageAgents(row),
  }] : []),
  {
    label: 'View Profile Details',
    icon: CustomEye,
    onClick: (row) => navigate(`/aggregators/${row._id}`)
  },
  {
    label: 'View Transaction History',
    icon: CustomHistory,
    onClick: (row) => navigate(`/aggregators/${row._id}?tab=transactions`)
  },
  ...(onSuspend ? [{
    label: 'Suspend Aggregator',
    icon: CustomUser,
    onClick: (row) => onSuspend(row)
  }] : []),
];


export const aggregatorProfileTabs = [
  { key: 'profile', label: 'Profile Details' },
  { key: 'transactions', label: 'Transaction History' },
  { key: 'agents', label: 'Agents' }
];

export const agentColumns = [
  {
    field: 'firstName',
    headerName: 'Agent Name',
    width: 250,
    renderCell: (params) => (
      <div>
        <div className="text-sm font-medium">{params.row.firstName} {params.row.lastName}</div>
        <div className="text-xs text-qreva-navy">{params.row.emailAddress}</div>
      </div>
    )
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone Number',
    width: 160,
  },
  {
    field: 'type',
    headerName: 'Account Type',
    width: 130,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => {
      const statusColors = {
        Active: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#1B7D3C]',
        Inactive: 'border border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280]',
        Suspended: 'border border-[#F87171] bg-[#FEE2E2] text-[#B91C1C]',
      };
      return (
        <span className={`px-2 py-1.5 text-center ${statusColors[params.value] || ''} font-general font-medium text-xs rounded-md`}>
          {params.value || '-'}
        </span>
      );
    }
  },
  { field: 'clientId', headerName: 'Client ID', width: 180 }
];

export const createChartSeries = (chartData) => [
  { data: chartData?.map(d => d.cardPayments) || [], color: '#06b6d4', label: 'Card Payments' },
  { data: chartData?.map(d => d.qrPayments) || [], color: '#FF5B04', label: 'QR Payments' }
];

