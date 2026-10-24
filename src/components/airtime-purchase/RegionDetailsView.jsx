import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import LoadingState from '@/components/common/LoadingState';
import { useAirtimePurchaseMetrics } from '@/store/features/dashboard/useDashboard';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { getRegionStats, createTransactionActions } from '@/pages/airtimePurchase/constants';

const RegionDetailsView = () => {
  const { id } = useParams();

  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: metricsData, isLoading: isMetricsLoading } = useAirtimePurchaseMetrics({
    range: timeFilter.toLowerCase(),
  });

  const regions = metricsData?.data?.topRegions || [];
  const region = regions.find(r => r._id === id || r.id === id || r.location === decodeURIComponent(id));

  const { data: txData, isLoading: isTxLoading } = useTransactions({
    typeCategory: 'Airtime',
    location: region?.location,
    page: 1,
    limit: 50,
  });

  const transactions = txData?.data || [];

  const actions = createTransactionActions(
    (tx) => {
      setSelectedTransaction(tx);
      setShowDetailsModal(true);
    },
    (tx) => {
      setSelectedTransaction(tx);
      setShowShareModal(true);
    }
  );

  if (isMetricsLoading || isTxLoading) return <LoadingState />;
  if (!region) return <LoadingState message="Region not found" />;

  return (
    <>
      <PageHeader
        title={region.location}
        subtitle="Here is how this location has been performing so far"
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      <DashboardStats stats={getRegionStats(region)} />

      <TransactionHistoryTable
        data={transactions}
        title="Transactions"
        actions={actions}
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

export default RegionDetailsView;
