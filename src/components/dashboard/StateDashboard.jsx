import React, { useMemo } from 'react';
import KpiGrid from '../regional/kpi/KpiGrid';
import TransactionTrendChart from '../regional/charts/TransactionTrendChart';
import NetworkGrowthChart from '../regional/charts/NetworkGrowthChart';
import TargetActualChart from '../regional/charts/TargetActualChart';
import ServiceDonutChart from '../regional/charts/ServiceDonutChart';
import TransactionStatusDonut from '../regional/charts/TransactionStatusDonut';
import LeaderboardCard from '../regional/leaderboards/LeaderboardCard';
import TransactionHistoryTable from '../tables/TransactionHistoryTable';
import StatePerformanceTables from './tables/StatePerformanceTables';
import { TRANSACTION_TYPE_FILTER_GROUP } from '@/constants/transactionFilters';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';

const STATUS_FILTER_GROUP = {
  key: 'status',
  label: 'Status',
  options: ['Completed', 'Pending', 'Failed'].map((status) => ({ label: status, value: status })),
};

const StateDashboard = ({
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
  // We can convert this or just use metrics.summary directly
  
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
    merchantRevenue: { formatted: '₦0', growth: 0 },
    posDistributed: { value: 0, growth: 0 },
    statePosTarget: { value: 100, growth: 0 },
    posTargetAchievement: { value: 0, growth: 0 },
    newAggregators: { value: userMetrics?.newAggregators || 0, growth: parseFloat(userMetrics?.newAggregatorsChange) || 0 },
    newAgents: { value: userMetrics?.newAgents || 0, growth: parseFloat(userMetrics?.newAgentsChange) || 0 },
    newMerchants: { value: userMetrics?.newMerchants || 0, growth: parseFloat(userMetrics?.newMerchantsChange) || 0 },
    activeUsers: { value: metrics?.summary?.activeUsers || 0, growth: 0 },
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

  // Map metrics.topStates or metrics.topRegions to leaderboard format
  const agentLeaderboard = (metrics?.topAgents || []).map(region => ({
    name: region.location,
    agents: region.totalTransactions, // Fallback
    txns: region.totalTransactions,
    commission: '₦' + (region.totalRevenue || 0).toLocaleString(),
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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* KPI Grid */}
      <KpiGrid kpis={kpis} loading={!metrics} />

      {/* Charts Row 1: Trend & Network Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <TransactionTrendChart 
            data={trends} 
            timeFilter={timeFilter}
            loading={!metrics}
          />
        </div>
        <div className="h-[400px]">
          <NetworkGrowthChart
            data={metrics?.dailyNetworkGrowth}
            loading={!metrics}
          />
        </div>
      </div>

      {/* Charts Row 2: Breakdowns & Targets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-[350px]">
          <ServiceDonutChart 
            data={serviceDistribution}
            totalFormatted={serviceDistribution.length > 0 ? kpis.transactionValue?.formatted : undefined}
            loading={!metrics}
          />
        </div>
        <div className="h-[350px]">
          <TransactionStatusDonut 
            data={statusDistribution}
            loading={!metrics}
          />
        </div>
        <div className="h-[350px]">
          <TargetActualChart />
        </div>
      </div>

      {/* Charts Row 3: Leaderboards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="h-[350px]">
            <LeaderboardCard
              title="Aggregator Manager Comparison"
              subtitle="Comparing top aggregator managers in the state"
              type="aggregatorManager"
              columns={[
                { label: 'Rank' },
                { label: 'Name' },
                { label: 'Aggregators' },
                { label: 'Agents' },
                { label: 'Merchants' },
                { label: 'Transactions' },
                { label: 'Commission' },
              ]}
              items={metrics?.aggregatorManagerPerformance || []}
            />
        </div>
        <div className="h-[350px]">
            <LeaderboardCard
              title="Aggregator Comparison"
              subtitle="Performance of aggregators in the state"
              type="aggregator"
              columns={[
                { label: 'Rank' },
                { label: 'Name' },
                { label: 'Network Size' },
                { label: 'Transactions' },
                { label: 'Commission' },
                { label: 'Growth', align: 'right' },
              ]}
              items={metrics?.aggregatorPerformance || []}
            />
        </div>
      </div>

      {/* State Performance Tables (Tabs) */}
      <StatePerformanceTables metrics={metrics} />

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

export default StateDashboard;
