import CustomEye from '@/components/icons/CustomEye';
import CustomUser from '@/components/icons/CustomUser';
import CustomHistory from '@/components/icons/CustomHistory';

export const aggregatorManagerStats = [
  { label: 'Total Aggregators Manager', value: '8,000', change: '10%', subtext: '2X in last 24 hours' },
  { label: 'Total Agg. Manager Transactions', value: '50,823', change: '10%', subtext: '5,000 in last 24 hours' },
  { label: 'Total Agg. Manager Trans. Volume', value: '₦450,823', change: '10%', subtext: '₦600 in last 24 hours' },
  { label: 'Total Agg. Manager Commission', value: '₦115,823', change: '10%', subtext: '₦6,000 in last 24 hours' }
];

const formatNaira = (val) => `₦${Number(val || 0).toLocaleString()}`;
const formatCount = (val) => Number(val || 0).toLocaleString();

const formatLocation = (row) => {
  const personal = row.personalDetails || {};
  const address = row.address || {};
  const state = personal.state || address.state || '';
  const lga = personal.lga || address.lga || address.city || '';
  if (state && lga) return `${lga}, ${state}`;
  return state || lga || address.country || row.location || '-';
};

const formatJoinedDate = (val) => {
  if (!val) return '-';
  const d = new Date(val);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const aggregatorManagerColumns = [
  {
    field: 'firstName',
    headerName: 'Aggregator Managers Name',
    width: 240,
    flex: 1.2,
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
    field: 'totalTransactionCount',
    headerName: 'Total Transaction Counts',
    width: 180,
    flex: 1,
    // These three totals aren't stored on the manager's user document - they
    // are resolved per page from their downline's transactions, so the server
    // cannot order the collection by them. Left unsortable rather than
    // offering a header that would quietly sort by date instead.
    sortable: false,
    renderCell: (params) => {
      const value = params.row.totalTransactionCount
        ?? params.row.stats?.totalTransactions
        ?? params.row.transactionCount
        ?? 0;
      return (
        <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
          {formatCount(value)}
        </span>
      );
    }
  },
  {
    field: 'totalTransactionValue',
    headerName: 'Total Transaction Values',
    width: 180,
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      const value = params.row.totalTransactionValue
        ?? params.row.stats?.totalVolume
        ?? params.row.transactionVolume
        ?? 0;
      return (
        <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
          {formatNaira(value)}
        </span>
      );
    }
  },
  {
    field: 'totalCommissions',
    headerName: 'Total Commissions',
    width: 160,
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      const value = params.row.totalCommissions
        ?? params.row.stats?.totalCommissions
        ?? params.row.commissions
        ?? 0;
      return (
        <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
          {formatNaira(value)}
        </span>
      );
    }
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
    field: 'createdAt',
    headerName: 'Date Joined',
    width: 140,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {formatJoinedDate(params.row.createdAt || params.row.dateJoined)}
      </span>
    )
  },
  {
    field: 'clientId',
    headerName: 'Client ID',
    width: 160,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <span className="text-sm font-general text-qreva-navy flex items-center h-full">{params.value || '-'}</span>
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
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 180,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
        {formatLocation(params.row)}
      </span>
    )
  },
];

export const createAggregatorManagerActions = (navigate, onSuspend, onManageAggregators) => [
  ...(onManageAggregators ? [{
    label: 'Manage Aggregators',
    icon: CustomUser,
    onClick: (row) => onManageAggregators(row),
  }] : []),
  {
    label: 'View Profile Details',
    icon: CustomEye,
    onClick: (row) => navigate(`/aggregator-managers/${row._id}`)
  },
  {
    label: 'View Transaction History',
    icon: CustomHistory,
    onClick: (row) => navigate(`/aggregator-managers/${row._id}?tab=transactions`)
  },
  ...(onSuspend ? [{
    label: 'Suspend Aggregator Manager',
    icon: CustomUser,
    onClick: (row) => onSuspend(row)
  }] : []),
];

