import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryMetrics } from '@/store/features/dashboard/useDashboard';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { formatDashboardStats } from '@/utils/formatDashboardStats';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import TopTransactionValueCard from '@/components/cards/TopTransactionValueCard';
import TopCustomersCard from '@/components/cards/TopCustomersCard';
import TransactionVolumeChart from '@/components/charts/TransactionVolumeChart';
import TransactionPercentagePie from '@/components/charts/TransactionPercentagePie';
import RegionsTable from '@/components/tables/RegionsTable';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import { vasTransactionColumns } from '@/components/tables/vasTransactionColumns';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import { createRegionTransactionActions } from './constants';

// TODO: Add 'bills' category to API or use combined categories
// Currently using 'all' category - needs backend support for bills-specific category

const BillsPayment = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // TODO: API needs 'bills' category or combined electricity+cabletv
  const { data, isLoading, isError, refetch } = useCategoryMetrics('bills', {
    range: timeFilter,
  });

  // Fetch transactions using the new API
  const { 
    data: transactionData, 
    isLoading: isTransactionsLoading 
  } = useTransactions({
    category: 'bills',
    page,
    limit,
  });

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
      topPurchasePercentages: data.data.topPurchasePercentages || [],
      topRegions: data.data.topRegions || [],
    };
  }, [data]);

  const transactions = useMemo(() => {
    return (transactionData?.data || []).filter(tx => 
      tx.typeCategory !== 'Airtime' && 
      tx.typeCategory !== 'Data' &&
      tx.category !== 'airtime' &&
      tx.category !== 'data'
    );
  }, [transactionData]);
  const pagination = useMemo(() => transactionData?.pagination || {}, [transactionData]);

  const formattedStats = useMemo(() => {
    if (!metrics?.summary) return null;
    return formatDashboardStats(metrics.summary, metrics.changePercentages, timeFilter);
  }, [metrics, timeFilter]);

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleViewRegionDetails = (regionId) => {
    navigate(`/bills/details/region/${regionId}`);
  };

  const transactionActions = createRegionTransactionActions({
    setSelectedTransaction,
    setShowDetailsModal,
    setShowShareModal,
    navigate
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qreva-orange mx-auto mb-4"></div>
            <p className="text-qreva-navy">Loading bills payment metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-qreva-orange mb-4">Failed to load bills payment metrics</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-qreva-orange text-white rounded hover:bg-qreva-orange">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Bills Payment"
          subtitle="Here is how this has been performing so far"
          timeFilter={timeFilter}
          onTimeFilterChange={handleTimeFilterChange}
        />

        <DashboardStats stats={formattedStats} route="bills-payment" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-2">
            <TopTransactionValueCard 
              data={metrics.topTransactionValues}
              title="Top Transaction Value"
            />
          </div>
          <div className="lg:col-span-3">
            <TopCustomersCard 
              data={metrics.topCustomers}
              agentsData={metrics.topAgents}
              title="Top Customers"
              showAgentToggle={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <TransactionVolumeChart
              data={metrics.dailyTransactionVolume}
              timeFilter={timeFilter}
            />
          </div>
          <div className="lg:col-span-1">
            <TransactionPercentagePie 
              data={metrics.topPurchasePercentages}
              title="Top % Purchase from Customers"
              wrapped={true}
            />
          </div>
        </div>

        <RegionsTable
          data={metrics.topRegions}
          title="Top Regions"
          onViewDetails={handleViewRegionDetails}
        />

        <TransactionHistoryTable
          data={transactions}
          title="Transaction History"
          columns={vasTransactionColumns}
          actions={transactionActions}
          pagination={pagination}
          onPageChange={handlePageChange}
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

export default BillsPayment;