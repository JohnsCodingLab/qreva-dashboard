import { useMemo } from 'react';
import TopTransactionValueCard from '@/components/cards/TopTransactionValueCard';
import TransactionVolumeChart from '@/components/charts/TransactionVolumeChart';
import TransactionPercentagePie from '@/components/charts/TransactionPercentagePie';
import PaymentComparisonPie from '@/components/charts/PaymentComparisonPie';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import {
  TRANSACTION_STATUS_FILTER_GROUP,
  DATE_RANGE_FILTER_GROUP,
} from '@/constants/transactionFilters';
import DashboardStats from '@/components/base/DashboardStats';

const EXCLUDED_CATEGORIES = ['airtime', 'data', 'bills', 'bill', 'bill payment', 'data purchase', 'airtime purchase'];

const FILTER_GROUPS = [TRANSACTION_STATUS_FILTER_GROUP, DATE_RANGE_FILTER_GROUP];

const AgentDashboard = ({
  formattedStats,
  metrics,
  transactions,
  pagination,
  timeFilter,
  handlePageChange,
  handleSearch,
  handleFilter,
  sortModel,
  handleSortChange,
  isTransactionsLoading
}) => {
  // Filter out airtime, data, bills from pie chart data (Observation #09)
  const filteredPurchasePercentages = useMemo(() => {
    return (metrics.topPurchasePercentages || []).filter(
      item => !EXCLUDED_CATEGORIES.includes((item.label || item.provider || '').toLowerCase())
    );
  }, [metrics.topPurchasePercentages]);

  return (
    <>
      <DashboardStats stats={formattedStats} route="dashboard" />

      {/* Top Transaction Value + Top % Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TopTransactionValueCard data={metrics.topTransactionValues} />
        </div>
        <div className="lg:col-span-3">
          <TransactionPercentagePie data={filteredPurchasePercentages} title="Top % Purchase from Customers" />
        </div>
      </div>

      {/* Daily Transaction Value */}
      <TransactionVolumeChart data={metrics.dailyTransactionVolume} timeFilter={timeFilter} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PaymentComparisonPie
          data={metrics.softPosPaymentBreakdown}
          title="Card Payments vs QR Payments %"
          showPercentage={true}
        />
        <PaymentComparisonPie
          data={metrics.transferStatusBreakdown}
          title="Transfer Status %"
          showPercentage={true}
        />
      </div>

      {/* Transaction History */}
      <TransactionHistoryTable
        data={transactions}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        sortModel={sortModel}
        onSortChange={handleSortChange}
        showFilter={true}
        filterGroups={FILTER_GROUPS}
        isLoading={isTransactionsLoading}
      />
    </>
  );
};

export default AgentDashboard;