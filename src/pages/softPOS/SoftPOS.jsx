import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanToPayMetrics } from '@/store/features/dashboard/useDashboard';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { formatDashboardStats } from '@/utils/formatDashboardStats';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import TopCustomersCard from '@/components/cards/TopCustomersCard';
import PaymentComparisonPie from '@/components/charts/PaymentComparisonPie';
import MultiLineChart from '@/components/charts/MultiLineChart';
import RegionsTable from '@/components/tables/RegionsTable';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import { multiLineData, chartSeries, createTransactionActions, createRegioncolumns, softposTransactionColumns } from './constants';

const SoftPOS = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { data, isLoading, isError, refetch } = useScanToPayMetrics({
    range: timeFilter,
  });

  // Fetch transactions using the new API
  const { 
    data: transactionData, 
    isLoading: isTransactionsLoading 
  } = useTransactions({
    typeCategory: 'SoftPOS',
    page,
    limit,
    search,
    ...filters
  });

  const metrics = useMemo(() => {
    if (!data?.data) return null;
    return {
      summary: data.data.summary || {},
      changePercentages: data.data.changePercentages || {},
      topCustomers: data.data.topCustomers || [],
      topRegions: data.data.topRegions || [],
      paymentBreakdown: (data.data.softPosPaymentBreakdown || []).map(item => ({
        id: item.method,
        value: item.percentage,
        label: `${item.method} Payments`,
        color: item.method === 'Card' ? '#E85304' : '#26C8B9'
      })),
      dailyTransactionVolume: (data.data.dailyTransactionVolume || []).map(d => ({
        label: d.label,
        value: d.amount
      })),
    };
  }, [data]);

  const transactions = useMemo(() => transactionData?.data || [], [transactionData]);
  const pagination = useMemo(() => transactionData?.pagination || {}, [transactionData]);

  const formattedStats = useMemo(() => {
    if (!metrics?.summary) return null;
    return formatDashboardStats(metrics.summary, metrics.changePercentages, timeFilter);
  }, [metrics, timeFilter]);

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleViewRegionDetails = (regionId) => {
    navigate(`/softpos/details/region/${regionId}`);
  };

  const regionColumns = createRegioncolumns(handleViewRegionDetails);

  const transactionActions = createTransactionActions({
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
            <p className="text-qreva-navy">Loading Soft POS metrics...</p>
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
            <p className="text-qreva-orange mb-4">Failed to load Soft POS metrics</p>
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
          title="Soft POS"
          subtitle="Here is how this has been performing so far"
          timeFilter={timeFilter}
          onTimeFilterChange={handleTimeFilterChange}
        />

        <DashboardStats stats={formattedStats} route="softpos" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5 mb-6">
          <div className='col-span-2'>
            <PaymentComparisonPie
              data={metrics.paymentBreakdown}
              title="Card Payments vs QR Payments %"
            />
          </div>
          <div className='col-span-3'>
            <TopCustomersCard
              data={metrics.topCustomers}
              title="Top Performing Agents"
              showAgentToggle={false}
            />
          </div>
        </div>

        <MultiLineChart
          data={metrics.dailyTransactionVolume}
          series={[{ data: (metrics?.dailyTransactionVolume || []).map(d => d.value), color: '#E85304', label: 'Value' }]}
          timeFilter={timeFilter}
        />

        <RegionsTable 
          data={metrics.topRegions}
          columns={regionColumns}
        />

        <TransactionHistoryTable
          data={transactions}
          title="Transaction History"
          columns={softposTransactionColumns}
          actions={transactionActions}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
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

export default SoftPOS;
