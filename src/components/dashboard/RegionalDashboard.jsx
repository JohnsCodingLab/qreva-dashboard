import React, { useMemo } from 'react';
import KpiGrid from '../regional/kpi/KpiGrid';
import TransactionTrendChart from '../regional/charts/TransactionTrendChart';
import NetworkGrowthChart from '../regional/charts/NetworkGrowthChart';
import ServiceDonutChart from '../regional/charts/ServiceDonutChart';
import TransactionStatusDonut from '../regional/charts/TransactionStatusDonut';
import LeaderboardCard from '../regional/leaderboards/LeaderboardCard';
import TransactionHistoryTable from '../tables/TransactionHistoryTable';
import { TRANSACTION_TYPE_FILTER_GROUP } from '@/constants/transactionFilters';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';

const STATUS_FILTER_GROUP = {
  key: 'status',
  label: 'Status',
  options: ['Completed', 'Pending', 'Failed'].map((status) => ({ label: status, value: status })),
};

const RegionalDashboard = ({
  formattedStats,
  metrics,
  userMetrics,
  transactions,
  pagination,
  timeFilter,
  transactionActions,
  transactionColumns,
  handlePageChange,
  handleSearch,
  handleFilter,
  showDetailsModal,
  setShowDetailsModal,
  showShareModal,
  setShowShareModal,
  selectedTransaction,
  isTransactionsLoading
}) => {
  // Map metrics to KpiGrid format
  // formattedStats is an array of objects: { label, value, change, subtext }
  const totalPosDistributed = (metrics?.posDistribution || []).reduce((acc, row) => acc + (row.posDistributed || 0), 0);
  const totalPosTarget = (metrics?.posDistribution || []).reduce((acc, row) => acc + (row.target || 0), 0);
  const posTargetAchievement = totalPosTarget > 0 ? Math.round((totalPosDistributed / totalPosTarget) * 100) : 0;

  const totalMerchantRevenue = (metrics?.merchantRevenuePerformance || []).reduce((acc, row) => acc + (row.revenueGenerated || 0), 0);

  const rawTransactionValue = Number(metrics?.summary?.totalTransactionVolume ?? metrics?.summary?.totalTransactionValue ?? 0);
  const rawCommission = Number(metrics?.summary?.totalCommission ?? metrics?.summary?.totalEarnings ?? 0);
  const rawSuccessRate = Number(
    metrics?.summary?.successRate ??
    (metrics?.summary?.successfulTransactions
      ? Math.round((metrics.summary.successfulTransactions / (metrics.summary.totalTransactions || 1)) * 100)
      : 0)
  );
  const rawDeductions = Number(metrics?.summary?.totalDeductions ?? metrics?.summary?.totalRevenue ?? 0);

  const kpis = {
    totalAgents: { value: userMetrics?.agents || metrics?.summary?.activeUsers || 0, growth: parseFloat(userMetrics?.agentsChange) || 0 },
    totalMerchants: { value: userMetrics?.merchants || metrics?.summary?.activeUsers || 0, growth: parseFloat(userMetrics?.merchantsChange) || 0 },
    aggregatorManagers: { value: userMetrics?.aggregatorManagers || 0, growth: parseFloat(userMetrics?.aggregatorManagersChange) || 0 },
    aggregators: { value: userMetrics?.aggregators || 0, growth: parseFloat(userMetrics?.aggregatorsChange) || 0 },
    totalTransactions: { value: metrics?.summary?.totalTransactions || 0, growth: 0 },
    transactionValue: { formatted: '₦' + rawTransactionValue.toLocaleString(), growth: 0 },
    totalCommission: { formatted: '₦' + rawCommission.toLocaleString(), growth: 0 },
    successRate: { value: rawSuccessRate, growth: 0 },
    totalDeductions: { formatted: '₦' + rawDeductions.toLocaleString(), growth: 0 },
    posDistributed: { value: totalPosDistributed, growth: 0 },
    posTargetAchievement: { value: posTargetAchievement, growth: 0 },
    merchantRevenue: { formatted: '₦' + totalMerchantRevenue.toLocaleString(), growth: 0 },
    statesManaged: { value: metrics?.topRegions?.length || userMetrics?.statesManaged || 0, growth: 0 },
    stateManagers: { value: userMetrics?.stateManagers || 0, growth: parseFloat(userMetrics?.stateManagersChange) || 0 },
    newAgents: { value: userMetrics?.newAgents || 0, growth: parseFloat(userMetrics?.newAgentsChange) || 0 },
    newMerchants: { value: userMetrics?.newMerchants || 0, growth: parseFloat(userMetrics?.newMerchantsChange) || 0 },
  };

  // Map metrics.dailyTransactionVolume and metrics.dailyTransactionCounts to trends format
  const trends = React.useMemo(() => {
    const volumes = metrics?.dailyTransactionVolume || [];
    const counts = metrics?.dailyTransactionCounts || [];
    const countMap = new Map(counts.map(c => [c.label, c.value]));
    const volumeMap = new Map(volumes.map(v => [v.label, v.value]));

    const allDates = Array.from(new Set([
      ...volumes.map(v => v.label || v.date || v.name),
      ...counts.map(c => c.label || c.date || c.name),
    ])).filter(Boolean);

    if (allDates.length === 0 && volumes.length > 0) {
      return volumes.map((d, idx) => ({
        date: d.label || d.date || d.name || `Day ${idx + 1}`,
        transactions: 0,
        valueMillions: Number((Number(d.value || d.amount || 0) / 1000000).toFixed(3)),
      }));
    }

    return allDates.map(date => {
      const txCount = countMap.get(date) || 0;
      const amount = Number(volumeMap.get(date) || 0);
      return {
        date,
        transactions: txCount,
        valueMillions: Number((amount / 1000000).toFixed(3)),
      };
    });
  }, [metrics?.dailyTransactionVolume, metrics?.dailyTransactionCounts]);

  const posDistMap = (metrics?.posDistribution || []).reduce((acc, row) => { acc[row.state] = row; return acc; }, {});
  const stateLeaderboard = (metrics?.topStates || metrics?.topRegions || []).map(region => ({
    state: region.location,
    agents: Math.floor((region.totalTransactions || 0) / 100), // mock
    transactions: region.totalTransactions,
    commission: '₦' + (region.totalRevenue || 0).toLocaleString(),
    posDistributed: posDistMap[region.location]?.posDistributed || 0,
    posTargetAchievement: posDistMap[region.location]?.achievement || 0,
  }));

  // Map metrics.topPurchasePercentages to service donut chart format
  const serviceDistribution = (metrics?.topPurchasePercentages || []).map(p => ({
    name: p.provider || p.type || 'Unknown',
    value: p.percentage,
    displayValue: p.amount ? '₦' + p.amount.toLocaleString() : undefined,
    count: p.count,
    percentage: p.percentage
  }));

  // Status donut chart
  const statusDistribution = useMemo(() => {
    if (metrics?.transferStatusBreakdown && metrics.transferStatusBreakdown.length > 0) {
      return metrics.transferStatusBreakdown.map(item => ({
        name: item.label || item.name || item.id,
        count: item.count !== undefined ? item.count : (item.value || 0),
        value: item.count !== undefined ? item.count : (item.value || 0),
        percentage: item.percentage,
        color: item.color || (item.name === 'Completed' ? '#26C8B9' : item.name === 'Pending' ? '#F59E0B' : '#EF4444'),
      }));
    }
    return [
      { name: 'Completed', value: metrics?.summary?.totalTransactions || metrics?.summary?.successfulTransactions || 0, count: metrics?.summary?.totalTransactions || metrics?.summary?.successfulTransactions || 0, color: '#26C8B9' },
      { name: 'Pending', value: metrics?.summary?.pendingTransactions || 0, count: metrics?.summary?.pendingTransactions || 0, color: '#F59E0B' },
      { name: 'Failed', value: metrics?.summary?.failedTransactions || 0, count: metrics?.summary?.failedTransactions || 0, color: '#EF4444' },
    ];
  }, [metrics?.transferStatusBreakdown, metrics?.summary]);

  return (
    <div id="regional-dashboard-container" className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* KPI Grid */}
      <KpiGrid kpis={kpis} loading={!metrics} />

      {/* Charts Row 1: Trend & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionTrendChart
            data={trends}
            timeFilter={timeFilter}
            loading={!metrics}
          />
        </div>
        <div className="lg:col-span-1">
          <NetworkGrowthChart
            data={metrics?.dailyNetworkGrowth}
            loading={!metrics}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-3">
          <LeaderboardCard
            title="Top Performing States"
            items={stateLeaderboard}
            columns={[
              { header: 'Rank' },
              { header: 'State' },
              { header: 'Agents' },
              { header: 'Transactions' },
              { header: 'Commission' },
              { header: 'POS Distributed' },
              { header: 'POS Target %', align: 'right' }
            ]}
            loading={!metrics}
            type="state"
          />
        </div>
      </div>

      {/* Charts Row 2: Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServiceDonutChart
          data={serviceDistribution}
          totalFormatted={serviceDistribution.length > 0 ? kpis.transactionValue?.formatted : undefined}
          loading={!metrics}
        />
        <TransactionStatusDonut
          data={statusDistribution}
          loading={!metrics}
        />
      </div>

      {/* Row 3: New Performance Breakdowns from Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <LeaderboardCard
          title="State POS Distribution Performance"
          subtitle="Targets vs Actuals"
          items={metrics?.posDistribution || []}
          columns={[
            { header: 'State' },
            { header: 'POS Distributed' },
            { header: 'Target' },
            { header: 'Achievement' },
            { header: 'POS Value', align: 'right' }
          ]}
          loading={!metrics}
          type="posDistribution"
        />

        <LeaderboardCard
          title="Merchant Revenue Performance"
          subtitle="Top Merchants & POS Target Status"
          items={metrics?.merchantRevenuePerformance || []}
          columns={[
            { header: 'Merchant' },
            { header: 'State' },
            { header: 'Aggregator' },
            { header: 'Txn Value' },
            { header: 'POS Value' },
            { header: 'Revenue' },
            { header: 'Target Status', align: 'right' }
          ]}
          loading={!metrics}
          type="merchant"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LeaderboardCard
          title="State Manager Performance"
          items={metrics?.stateManagerPerformance || []}
          columns={[
            { header: 'Rank' },
            { header: 'Manager' },
            { header: 'State' },
            { header: 'Transactions' },
            { header: 'Growth' },
            { header: 'Commission' },
            { header: 'POS Target', align: 'right' }
          ]}
          loading={!metrics}
          type="stateManager"
        />

        <LeaderboardCard
          title="Top Performing Aggregator Managers"
          items={metrics?.aggregatorManagerPerformance || []}
          columns={[
            { header: 'Rank' },
            { header: 'Manager' },
            { header: 'State' },
            { header: 'Aggregators Managed' },
            { header: 'Transactions' },
            { header: 'Commission' },
            { header: 'POS Target', align: 'right' }
          ]}
          loading={!metrics}
          type="aggregatorManager"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LeaderboardCard
          title="POS Performance"
          items={metrics?.posPerformance || []}
          columns={[
            { header: 'POS ID' },
            { header: 'Merchant' },
            { header: 'State' },
            { header: 'Agg. Manager' },
            { header: 'Aggregator' },
            { header: 'POS Value' },
            { header: 'Target Status' },
            { header: 'Last Activity', align: 'right' }
          ]}
          type="posPerformance"
        />

        <LeaderboardCard
          title="Recent Onboardings"
          items={metrics?.recentOnboardings || []}
          columns={[
            { header: 'Name' },
            { header: 'Type' },
            { header: 'State' },
            { header: 'Assigned To' },
            { header: 'Date Onboarded' },
            { header: 'Status', align: 'right' }
          ]}
          type="recentOnboardings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LeaderboardCard
          title="Lowest Performing States"
          items={metrics?.lowestStates || []}
          columns={[
            { header: 'Rank' },
            { header: 'State' },
            { header: 'Issue' },
            { header: 'Txns' },
            { header: 'Onboarding' },
            { header: 'POS Target' },
            { header: 'Failure Rate' },
            { header: 'Follow-up', align: 'right' }
          ]}
          type="lowestStates"
        />

        <LeaderboardCard
          title="State Performance Summary"
          items={metrics?.stateSummary || []}
          columns={[
            { header: 'State' },
            { header: 'Agents' },
            { header: 'Merchants' },
            { header: 'Aggs' },
            { header: 'AMs' },
            { header: 'Txns' },
            { header: 'Value' },
            { header: 'Commission' },
            { header: 'POS Dist' },
            { header: 'Target %' },
            { header: 'Success %', align: 'right' }
          ]}
          type="stateSummary"
        />
      </div>

      {/* Transactions Table - Using existing TransactionHistoryTable to preserve actions and modal connections */}
      <div className="mt-8">
        <TransactionHistoryTable
          data={transactions}
          actions={transactionActions}
          columns={transactionColumns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          filterGroups={[STATUS_FILTER_GROUP, TRANSACTION_TYPE_FILTER_GROUP]}
          isLoading={isTransactionsLoading}
        />
      </div>

      <TransactionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        transaction={selectedTransaction}
      />

      <ShareReceiptModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default RegionalDashboard;
