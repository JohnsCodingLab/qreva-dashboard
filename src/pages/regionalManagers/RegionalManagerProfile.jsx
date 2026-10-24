import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format } from "date-fns";
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { useDashboardMetrics } from '@/store/features/dashboard/useDashboard';
import DateRangePicker from '@/components/common/DateRangePicker';
import ExportReportDropdown from '@/components/common/ExportReportDropdown';
import { regionColumns } from '@/components/tables/TransactionHistoryTable';
import RegionalDashboard from '@/components/dashboard/RegionalDashboard';
import CustomEye from '@/components/icons/CustomEye';
import CustomShare from '@/components/icons/CustomShare';
import { formatDashboardStats } from '@/utils/formatDashboardStats';

const RegionalManagerProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get manager from router state
  const manager = location.state?.manager;

  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [transactionType, setTransactionType] = useState('');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = ({ status, transactionType } = {}) => {
    setStatus(status || '');
    setTransactionType(transactionType || '');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardMetrics({
    category: 'all',
    range: timeFilter.range,
    from: timeFilter.from,
    to: timeFilter.to,
    ownerUserId: manager?._id,
    ownerScope: 'regionalManager'
  });
  const performanceData = dashboardData?.data?.regionalManagerPerformance?.find(
    (p) => p.region === manager?.assignedRegion
  );

  const metrics = useMemo(() => {
    const data = dashboardData?.data;
    if (!data) return null;
    return {
      summary: data.summary || {},
      changePercentages: data.changePercentages || {},
      topTransactionValues: data.topTransactionValues || [],
      topCustomers: data.topCustomers || [],
      topAgents: data.topAgents || [],
      dailyTransactionVolume: (data.dailyTransactionVolume || []).map(d => ({
        label: d.label,
        value: d.amount
      })),
      dailyTransactionCounts: (data.dailyTransactionCounts || []).map(d => ({
        label: d.label,
        value: d.count
      })),
      topPurchasePercentages: data.topPurchasePercentages || [],
      topRegions: data.topRegions || [],
      transferStatusBreakdown: (data.transferStatusBreakdown || []).map(item => ({
        id: item.status,
        value: item.percentage,
        label: item.status,
        color: item.status === 'Completed' ? '#26C8B9' : item.status === 'Pending' ? '#FFA500' : '#E85304'
      })),
      softPosPaymentBreakdown: (data.softPosPaymentBreakdown || []).map(item => ({
        id: item.method,
        value: item.percentage,
        label: `${item.method} Payments`,
        color: item.method === 'Card' ? '#E85304' : '#26C8B9'
      })),
      hourlyBreakdown: data.hourlyBreakdown || [],
      paymentRequestVolume: data.paymentRequestVolume || 0,
      paymentRequestDailyVolume: data.paymentRequestDailyVolume || [],
      paymentRequests: data.paymentRequests || [],
      posDistribution: data.posDistribution || [],
      stateManagerPerformance: data.stateManagerPerformance || [],
      merchantRevenuePerformance: data.merchantRevenuePerformance || [],
      aggregatorManagerPerformance: data.aggregatorManagerPerformance || [],
      posPerformance: data.posPerformance || [],
      recentOnboardings: data.recentOnboardings || [],
      lowestStates: data.lowestStates || [],
      stateSummary: data.stateSummary || [],
    };
  }, [dashboardData]);

  const baseFormattedStats = useMemo(() => {
    if (!metrics?.summary) return null;
    return formatDashboardStats(metrics.summary, metrics.changePercentages, timeFilter);
  }, [metrics, timeFilter]);

  const formattedStats = useMemo(() => {
    if (!baseFormattedStats) return null;
    return baseFormattedStats;
  }, [baseFormattedStats]);

  const { data: txResponse, isLoading: txLoading } = useTransactions({
    region: manager?.assignedRegion || undefined,
    page,
    limit,
    search,
    status,
    typeCategory: transactionType || undefined,
    from: timeFilter.from,
    to: timeFilter.to,
    ownerUserId: manager?._id,
    ownerScope: 'regionalManager'
  });

  const transactions = txResponse?.data || [];
  const pagination = txResponse?.pagination || {};

  const isSuperAdmin = localStorage.getItem("userRole") === "SuperAdmin";

  const transactionColumns = useMemo(() => {
    let cols = [...regionColumns];
    if (isSuperAdmin) {
      const revenueCol = {
        field: "fee",
        headerName: "Revenue (₦)",
        width: 150,
        flex: 1,
        renderCell: (params) => (
          <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
            {params.value?.toLocaleString() || params.row.revenue?.toLocaleString() || "0"}
          </span>
        ),
      };
      cols.splice(cols.length - 1, 0, revenueCol);
    }
    return cols;
  }, [isSuperAdmin]);

  const transactionActions = [
    {
      label: 'View Transaction Details',
      type: 'view',
      icon: CustomEye,
      onClick: (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
      },
    },
    {
      label: 'Download Receipt',
      type: 'share',
      icon: CustomShare,
      onClick: (transaction) => {
        setSelectedTransaction(transaction);
        setShowShareModal(true);
      },
    },
  ];

  if (!manager) {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA] p-6 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Regional manager details not found. Please navigate from the Regional managers list.</p>
        <button
          onClick={() => navigate('/regional-managers')}
          className="px-4 py-2 bg-qreva-orange text-white rounded-lg"
        >
          Go Back to List
        </button>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex flex-wrap items-center gap-4">
            <DateRangePicker value={timeFilter} onChange={handleTimeFilterChange} />
            <ExportReportDropdown timeFilter={timeFilter} region={manager.assignedRegion} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-qreva-blue text-white flex items-center justify-center text-3xl font-bold shadow-sm">
              {(manager.fullName || manager.firstName || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1E1E1E]">{manager.fullName || `${manager.firstName || ''} ${manager.lastName || ''}`}</h2>
              <p className="text-gray-500 text-sm mt-1">{manager.emailAddress || manager.email}</p>
              <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-semibold ${manager.status === 'Active' || manager.status === 'active' ? 'bg-[#E6F9E6] text-qreva-blue' : 'bg-[#FBE9E9] text-qreva-orange'}`}>
                {manager.status === 'Active' || manager.status === 'active' ? 'Active Account' : 'Inactive Account'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Assigned Region</p>
              <p className="font-semibold text-[#1E1E1E] mt-1 text-lg">{manager.assignedRegion || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Role</p>
              <p className="font-semibold text-[#1E1E1E] mt-1 text-lg">Regional manager</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date Added</p>
              <p className="font-semibold text-[#1E1E1E] mt-1 text-lg">{manager.createdAt ? format(new Date(manager.createdAt), 'dd MMM yyyy') : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Success Rate</p>
              <p className="font-semibold text-[#1E1E1E] mt-1 text-lg">
                {performanceData ? `${performanceData.successRate}%` : 'N/A'}
              </p>
            </div>
          </div>

        </div>

        <div className="mt-8">
          <RegionalDashboard
            formattedStats={formattedStats}
            metrics={metrics}
            transactions={transactions}
            pagination={pagination}
            timeFilter={timeFilter}
            handlePageChange={handlePageChange}
            handleSearch={handleSearch}
            handleFilter={handleFilter}
            isTransactionsLoading={txLoading}
            showDetailsModal={showDetailsModal}
            setShowDetailsModal={setShowDetailsModal}
            showShareModal={showShareModal}
            setShowShareModal={setShowShareModal}
            selectedTransaction={selectedTransaction}
            transactionActions={transactionActions}
            transactionColumns={transactionColumns}
          />
        </div>
      </div>
    </div>
  );
};

export default RegionalManagerProfile;

