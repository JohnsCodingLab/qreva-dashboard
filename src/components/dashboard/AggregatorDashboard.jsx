import { useMemo } from 'react';
import TopTransactionValueCard from '@/components/cards/TopTransactionValueCard';
import TopCustomersCard from '@/components/cards/TopCustomersCard';
import TransactionVolumeChart from '@/components/charts/TransactionVolumeChart';
import TransactionPercentagePie from '@/components/charts/TransactionPercentagePie';
import PaymentComparisonPie from '@/components/charts/PaymentComparisonPie';
import RegionsTable from '@/components/tables/RegionsTable';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import {
  TRANSACTION_STATUS_FILTER_GROUP,
  DATE_RANGE_FILTER_GROUP,
} from '@/constants/transactionFilters';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import DashboardStats from '@/components/base/DashboardStats';
import { useAggregatorReferralLink } from '@/store/features/users/useUsers';

const EXCLUDED_CATEGORIES = ['airtime', 'data', 'bills', 'bill', 'bill payment', 'data purchase', 'airtime purchase'];

const FILTER_GROUPS = [TRANSACTION_STATUS_FILTER_GROUP, DATE_RANGE_FILTER_GROUP];

const AggregatorDashboard = ({
  formattedStats,
  metrics,
  transactions,
  pagination,
  timeFilter,
  transactionActions,
  handlePageChange,
  handleSearch,
  handleFilter,
  sortModel,
  handleSortChange,
  showDetailsModal,
  setShowDetailsModal,
  showShareModal,
  setShowShareModal,
  selectedTransaction,
  isTransactionsLoading,
  userRole,
}) => {
  const shouldLoadReferral = userRole === 'aggregator' || userRole === 'aggregator_manager';
  const { data: referralResponse } = useAggregatorReferralLink({
    enabled: shouldLoadReferral,
  });
  const referral = referralResponse?.data;

  // Filter out airtime, data, bills from pie chart data (Observation #09)
  const filteredPurchasePercentages = useMemo(() => {
    return (metrics.topPurchasePercentages || []).filter(
      item => !EXCLUDED_CATEGORIES.includes((item.label || item.provider || '').toLowerCase())
    );
  }, [metrics.topPurchasePercentages]);

  return (
    <>
      {shouldLoadReferral && (referral?.referralCode || referral?.referralLink) && (
        <div className="bg-white border border-[#E8EBED] rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-[#1E1E1E] mb-2">Referral Details</h3>
          <p className="text-xs text-[#808C91] mb-1">
            Referral Code: <span className="text-[#1E1E1E] font-medium">{referral?.referralCode || '-'}</span>
          </p>
          <p className="text-xs text-[#808C91] break-all">
            Referral Link: <span className="text-[#1E1E1E] font-medium">{referral?.referralLink || '-'}</span>
          </p>
        </div>
      )}

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

      {/* Top Customers + Card vs QR Payments - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TopCustomersCard
          data={metrics.topAgents}
          title="Top Performing Agents"
          showAgentToggle={false}
        />
        <PaymentComparisonPie
          data={metrics.softPosPaymentBreakdown}
          title="Card Payments vs QR Payments %"
          showPercentage={true}
        />
      </div>

      {/* Top Performing Regions (Observation #06) */}
      <RegionsTable data={metrics.topRegions} title="Top Performing Regions" />

      {/* Transaction History */}
      <TransactionHistoryTable
        data={transactions}
        actions={transactionActions}
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
    </>
  );
};

export default AggregatorDashboard;
