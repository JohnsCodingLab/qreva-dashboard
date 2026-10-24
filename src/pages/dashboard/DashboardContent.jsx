import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardMetrics } from '@/store/features/dashboard/useDashboard';
import { useEarnings } from '@/store/features/earnings/useEarnings';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { useUserMetrics } from '@/store/features/users/useUsers';
import { formatDashboardStats } from '@/utils/formatDashboardStats';
import PageHeader from '@/components/common/PageHeader';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import AggregatorDashboard from '@/components/dashboard/AggregatorDashboard';
import RegionalDashboard from '@/components/dashboard/RegionalDashboard';
import StateDashboard from '@/components/dashboard/StateDashboard';
import CustomEye from '@/components/icons/CustomEye';
import CustomShare from '@/components/icons/CustomShare';
import ExportReportDropdown from '@/components/common/ExportReportDropdown';
import { getDefaultDateRange } from '@/components/common/DateRangePicker';

const DashboardContent = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState(() => getDefaultDateRange('today'));
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [transactionType, setTransactionType] = useState('');

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch dashboard metrics
  const { data, isLoading, isError, refetch } = useDashboardMetrics({
    category: 'all',
    range: timeFilter.range,
    from: timeFilter.from,
    to: timeFilter.to,
  });

  // Role checks
  const isAdmin = ['SuperAdmin', 'Operation', 'Support'].includes(user?.role || '');
  const isAgent = user?.role === 'agent';
  const isAggregator = user?.role === 'aggregator';
  const isAggregatorManager = user?.role === 'aggregator_manager';
  const isRegionalManager = user?.role === 'RegionalManager';
  const isStateManager = user?.role === 'StateManager';
  const isPortalUpline = isAggregator || isAggregatorManager || isRegionalManager || isStateManager;

  const { data: earningsResponse } = useEarnings({
    enabled: isPortalUpline,
  });
  const { data: userMetricsResponse } = useUserMetrics(
    isPortalUpline ? { range: timeFilter.range, from: timeFilter.from, to: timeFilter.to } : {},
  );

  // Fetch transactions using the new API
  const {
    data: transactionData,
    isLoading: isTransactionsLoading
  } = useTransactions({
    page,
    limit,
    search,
    status,
    typeCategory: transactionType || undefined,
    from: timeFilter.from,
    to: timeFilter.to,
  });

  // Extract data from API response
  const metrics = useMemo(() => {
    if (!data?.data) return null;

    return {
      summary: data.data.summary || {},
      changePercentages: data.data.changePercentages || {},
      topTransactionValues: data.data.topTransactionValues || [],
      topCustomers: data.data.topCustomers || [],
      topAgents: data.data.topAgents || [],
      dailyTransactionVolume: (data.data.dailyTransactionVolume || []).map(d => ({
        label: d.label,
        value: d.amount
      })),
      dailyOnboardings: (data.data.dailyOnboardings || []).map(d => ({
        label: d.label,
        amount: d.amount
      })),
      dailyNetworkGrowth: data.data.dailyNetworkGrowth || [],
      dailyTransactionCounts: (data.data.dailyTransactionCounts || []).map(d => ({
        label: d.label,
        value: d.count
      })),
      topPurchasePercentages: data.data.topPurchasePercentages || [],
      topRegions: data.data.topRegions || [],
      transferStatusBreakdown: (data.data.transferStatusBreakdown || []).map(item => ({
        id: item.status,
        name: item.status,
        label: item.status,
        value: item.count !== undefined ? item.count : item.percentage,
        count: item.count !== undefined ? item.count : 0,
        percentage: item.percentage,
        color: item.status === 'Completed' ? '#26C8B9' : item.status === 'Pending' ? '#F59E0B' : '#EF4444'
      })),
      softPosPaymentBreakdown: (data.data.softPosPaymentBreakdown || []).map(item => ({
        id: item.method,
        value: item.percentage,
        label: `${item.method} Payments`,
        color: item.method === 'Card' ? '#E85304' : '#26C8B9'
      })),
      hourlyBreakdown: data.data.hourlyBreakdown || [],
      paymentRequestVolume: data.data.paymentRequestVolume || 0,
      paymentRequestDailyVolume: data.data.paymentRequestDailyVolume || [],
      paymentRequests: data.data.paymentRequests || [],
      posDistribution: data.data.posDistribution || [],
      stateManagerPerformance: data.data.stateManagerPerformance || [],
      merchantRevenuePerformance: data.data.merchantRevenuePerformance || [],
      aggregatorManagerPerformance: data.data.aggregatorManagerPerformance || [],
      superAdminKpis: data.data.superAdminKpis || null,
      superAdminCharts: data.data.superAdminCharts || null,

      // Flatten superAdminCharts for AdminDashboard consumption
      trendData: data.data.superAdminCharts?.trendData || [],
      serviceBreakdown: data.data.superAdminCharts?.serviceBreakdown || [],
      statusBreakdown: data.data.superAdminCharts?.statusBreakdown || [],
      userTypeBreakdown: data.data.superAdminCharts?.userTypeBreakdown || [],
      topMerchantsRevenue: data.data.superAdminCharts?.topMerchantsRevenue || [],

      // Performance tables with field name mapping
      regionalManagers: (data.data.regionalManagerPerformance || []).map(rm => ({
        _id: rm._id || rm.name,
        name: rm.name,
        region: rm.region,
        statesManaged: rm.statesManaged || 0,
        transactions: rm.totalTransactions || 0,
        value: rm.totalTransactionValue || 0,
        revenue: rm.revenueGenerated || 0,
        onboarding: rm.onboarding || 0,
        hardwarePos: rm.hardwarePos || 0,
        successRate: rm.successRate || 0,
        targetAchievement: rm.targetAchievement || 0,
      })),
      stateManagers: (data.data.stateManagerPerformance || []).map(sm => ({
        _id: sm._id || sm.name,
        name: sm.name,
        state: sm.state,
        networkSize: (sm.totalAgents || 0) + (sm.totalMerchants || 0),
        transactions: sm.totalTransactions || 0,
        value: sm.totalTransactionValue || 0,
        revenue: sm.revenueGenerated || 0,
        onboarding: sm.onboarding || 0,
        hardwarePos: sm.posDistributed || 0,
        targetAchievement: sm.posTargetAchievement || 0,
      })),
      aggregatorManagers: (data.data.aggregatorManagerPerformance || []).map(am => ({
        _id: am._id || am.name,
        name: am.name,
        state: am.state,
        aggregatorsManaged: am.aggregators || 0,
        agents: am.agents || 0,
        merchants: am.merchants || 0,
        transactions: am.transactions || 0,
        value: am.totalCommission || 0,
        revenue: am.totalCommission || 0,
        targets: am.targets || 0,
      })),
      aggregators: (data.data.aggregatorPerformance || []).map(agg => ({
        _id: agg._id || agg.name,
        name: agg.name,
        manager: agg.manager || 'N/A',
        agents: agg.agents || 0,
        merchants: agg.merchants || 0,
        transactions: agg.transactions || 0,
        value: agg.commission || 0,
        revenue: agg.commission || 0,
        onboarding: agg.networkSize || 0,
        activity: agg.activity || 0,
      })),
      merchantRevenues: (data.data.merchantRevenuePerformance || []).map(m => ({
        _id: m._id || m.merchantName,
        name: m.merchantName,
        location: m.state,
        aggregator: m.aggregatorName || 'N/A',
        transactionValue: m.totalTransactionValue || 0,
        hardwarePosValue: m.posValue || 0,
        qrevaRevenue: m.revenueGenerated || 0,
        lastActivity: m.lastActivity || 'N/A',
      })),
      agentRevenues: (data.data.agentRevenuePerformance || []).map(a => ({
        _id: a._id || a.agentName,
        name: a.agentName,
        location: a.state,
        aggregator: a.aggregatorName || 'N/A',
        transactionValue: a.totalTransactionValue || 0,
        hardwarePosValue: a.posValue || 0,
        qrevaRevenue: a.revenueGenerated || 0,
        lastActivity: a.lastActivity || 'N/A',
      })),
      personalRevenues: (data.data.personalRevenuePerformance || []).map(p => ({
        _id: p._id || p.personalName,
        name: p.personalName,
        location: p.state,
        transactionValue: p.totalTransactionValue || 0,
        qrevaRevenue: p.revenueGenerated || 0,
        lastActivity: p.lastActivity || 'N/A',
      })),
      inactiveMembers: data.data.inactiveMembers || [],
      recentOnboardings: (data.data.recentOnboardings || []).map(u => ({
        _id: u._id || u.name,
        name: u.name,
        accountType: u.type,
        location: u.lga || 'N/A',
        dateJoined: u.date,
        status: u.status || 'Active',
      })),
    };
  }, [data]);

  const transactions = useMemo(() => transactionData?.data || [], [transactionData]);
  const pagination = useMemo(() => transactionData?.pagination || {}, [transactionData]);

  // Format stats for DashboardStats component
  const baseFormattedStats = useMemo(() => {
    if (!metrics?.summary) return null;
    return formatDashboardStats(metrics.summary, metrics.changePercentages, timeFilter);
  }, [metrics, timeFilter]);

  const formattedStats = useMemo(() => {
    if (!baseFormattedStats) return null;
    if (!isPortalUpline) return baseFormattedStats;

    const totalEarnings = Number(earningsResponse?.data?.totalEarnings || 0);
    const totalAgents = Number(userMetricsResponse?.data?.agents || 0);
    const totalAgentsChange = String(userMetricsResponse?.data?.agentsChange || '0%');
    const formatCurrency = (amount) =>
      new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
      }).format(amount);
    const formatNumber = (count) =>
      new Intl.NumberFormat('en-US').format(count);

    const earningsCard = {
      label: 'Your Earnings',
      value: formatCurrency(totalEarnings),
      change: '',
      subtext: 'All-time earned on the system',
    };
    const totalAgentsCard = {
      label: 'Total Agents',
      value: formatNumber(totalAgents),
      change: totalAgentsChange,
      subtext: 'Total downline agents',
    };

    return [
      earningsCard,
      baseFormattedStats[0], // Total Transaction Volume (downline only)
      baseFormattedStats[1], // Total Transaction Value (downline only)
      totalAgentsCard,
    ].filter(Boolean);
  }, [baseFormattedStats, earningsResponse, isPortalUpline, userMetricsResponse]);

  // Transaction actions
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

  // Handle time filter change
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

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-qreva-ash">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qreva-orange mx-auto mb-4"></div>
            <p className="text-qreva-navy font-bold font-urbanist">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !metrics) {
    return (
      <div className="flex-1 overflow-auto bg-qreva-ash">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-qreva-orange mb-4">Failed to load dashboard data</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-qreva-orange text-white rounded hover:bg-qreva-orange"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Common props for all dashboards
  const dashboardProps = {
    formattedStats,
    metrics,
    userMetrics: userMetricsResponse?.data,
    transactions,
    pagination,
    timeFilter,
    handlePageChange,
    handleSearch,
    handleFilter,
    isTransactionsLoading,
  };

  const modalProps = {
    showDetailsModal,
    setShowDetailsModal,
    showShareModal,
    setShowShareModal,
    selectedTransaction,
  };

  const getDashboardTitle = () => {
    if (isRegionalManager) return 'Regional Manager Dashboard';
    if (isStateManager) return 'State Manager Dashboard';
    if (isAdmin) return 'Admin Dashboard';
    if (isAggregatorManager) return 'Aggregator Manager Dashboard';
    if (isAggregator) return 'Aggregator Dashboard';
    if (isAgent) return 'Agent Dashboard';
    return 'Dashboard';
  };

  return (
    <div className="flex-1 overflow-auto bg-qreva-ash">
      <div className="p-4 sm:p-6">
        <PageHeader
          title={getDashboardTitle()}
          subtitle="Here is how this has been performing so far"
          breadcrumb="Dashboard"
          timeFilter={timeFilter}
          onTimeFilterChange={handleTimeFilterChange}
          enableDateRange={true}
          actionButton={
            (isRegionalManager || isStateManager) ? (
              <ExportReportDropdown timeFilter={timeFilter} />
            ) : null
          }
        />

        {/* Render appropriate dashboard based on role */}
        {isAdmin && (
          <AdminDashboard 
            {...dashboardProps}
            transactionActions={transactionActions}
            {...modalProps}
          />
        )}

        {isRegionalManager && (
          <RegionalDashboard 
            {...dashboardProps}
            transactionActions={transactionActions}
            {...modalProps}
          />
        )}

        {isStateManager && (
          <StateDashboard 
            {...dashboardProps}
            transactionActions={transactionActions}
            {...modalProps}
          />
        )}

        {isAgent && (
          <AgentDashboard
            {...dashboardProps}
          />
        )}

        {(isAggregator || isAggregatorManager) && (
          <AggregatorDashboard
            {...dashboardProps}
            userRole={user?.role}
            transactionActions={transactionActions}
            {...modalProps}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
