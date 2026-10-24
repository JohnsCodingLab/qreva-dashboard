import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTransferMetrics } from '@/store/features/dashboard/useDashboard';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { formatDashboardStats } from '@/utils/formatDashboardStats';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import TopCustomersCard from '@/components/cards/TopCustomersCard';
import PaymentComparisonPie from '@/components/charts/PaymentComparisonPie';
import MultiLineChart from '@/components/charts/MultiLineChart';
import BarChartComponent from '@/components/charts/BarChartComponent';
import RegionsTable from '@/components/tables/RegionsTable';
import DataTable from '@/components/tables/DataTable';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import { createTransactionColumns, createTransactionActions } from './constants';
import { useBanks } from '@/store/features/earnings/useEarnings';

const TRANSFER_FILTER_GROUPS = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Successful', value: 'Successful' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Failed', value: 'Failed' },
    ],
  },
];

const Transfers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { data: banksResponse } = useBanks();
  const banksMap = useMemo(() => {
    const banks = banksResponse?.data || [];
    return banks.reduce((acc, bank) => {
      const code = bank.code || bank.bankCode;
      if (code) acc[code] = bank.name;
      return acc;
    }, {});
  }, [banksResponse]);

  const transferDirection = useMemo(() => {
    if (location.pathname.startsWith('/transfers/inward')) return 'inward';
    if (location.pathname.startsWith('/transfers/outward')) return 'outward';
    return 'all';
  }, [location.pathname]);

  const pageTitle = transferDirection === 'inward' ? 'Inward Transfers' : transferDirection === 'outward' ? 'Outward Transfers' : 'Transfers';

  const { data, isLoading, isError, refetch } = useTransferMetrics({
    range: timeFilter,
    direction: transferDirection === 'all' ? undefined : transferDirection,
  });

  // Fetch transactions using the new API
  const { 
    data: transactionData, 
    isLoading: isTransactionsLoading 
  } = useTransactions({
    typeCategory: 'Transfer',
    direction: transferDirection === 'all' ? undefined : transferDirection,
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
      statusData: (data.data.transferStatusBreakdown || []).map(item => ({
        id: item.status,
        value: item.percentage,
        label: item.status,
        color: item.status === 'Completed' ? '#26C8B9' : item.status === 'Pending' ? '#FFA500' : '#E85304'
      })),
      dailyTransactionCounts: (data.data.dailyTransactionCounts || []).map(d => ({
        label: d.label,
        value: d.count
      })),
      dailyTransactionVolume: (data.data.dailyTransactionVolume || []).map(d => ({
        label: d.label,
        value: d.amount
      })),
    };
  }, [data]);

  const transactions = useMemo(() => transactionData?.data || [], [transactionData]);
  const pagination = useMemo(() => transactionData?.pagination || {}, [transactionData]);

  // Client-side fallback filtering so search/filter narrow what's already
  // loaded even if the backend ignores the params.
  const visibleTransactions = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    const statusFilter = filters.status?.toLowerCase();
    const directionFilter = transferDirection;

    return transactions.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter) {
        return false;
      }
      if (directionFilter !== 'all') {
        const txType = String(row.type || '').toLowerCase();
        const isInward = txType.includes('inward');
        if (directionFilter === 'inward' && !isInward) return false;
        if (directionFilter === 'outward' && isInward) return false;
      }
      if (!q) return true;
      const senderName =
        row.senderName ||
        row.metadata?.debitAccountName ||
        row.transferId?.accountName ||
        '';
      const recipientName =
        row.recipientName ||
        row.transferId?.nameEnquiryId?.accountName ||
        row.metadata?.creditAccountName ||
        '';
      const haystack = [
        senderName,
        recipientName,
        row.status,
        row.reference,
        row.transactionRef,
        row._id,
        row.amount != null ? String(row.amount) : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [transactions, search, filters, transferDirection]);

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

  const handleFilter = (selectedFilters) => {
    setFilters(selectedFilters || {});
    setPage(1);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleViewRegionDetails = (regionId) => {
    const basePath =
      transferDirection === 'inward'
        ? '/transfers/inward/details'
        : transferDirection === 'outward'
          ? '/transfers/outward/details'
          : '/transfers/details';
    navigate(`${basePath}/region/${regionId}`);
  };

  const transactionActions = createTransactionActions({
    setSelectedTransaction,
    setShowDetailsModal,
    setShowShareModal,
    navigate
  });

  const transactionColumns = useMemo(
    () => createTransactionColumns(banksMap),
    [banksMap],
  );

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qreva-orange mx-auto mb-4"></div>
            <p className="text-qreva-navy">Loading transfer metrics...</p>
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
            <p className="text-qreva-orange mb-4">Failed to load transfer metrics</p>
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
          title={pageTitle}
          subtitle="Here is how this has been performing so far"
          timeFilter={timeFilter}
          onTimeFilterChange={handleTimeFilterChange}
        />

        <DashboardStats stats={formattedStats} route="transfers" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5 mb-6">
          <div className='col-span-2'>
            <PaymentComparisonPie data={metrics.statusData} />
          </div>
          <div className='col-span-3'>
            <TopCustomersCard
              data={metrics.topCustomers}
              title="Top Performing Customers"
              showAgentToggle={false}
            />
          </div>
        </div>

        <MultiLineChart
          data={metrics.dailyTransactionVolume}
          series={[{ data: (metrics.dailyTransactionVolume || []).map(d => d.value), color: '#B54103', label: 'Value' }]}
          timeFilter={timeFilter}
        />

        {/* Use actual dailyTransactionCounts from API */}
        <BarChartComponent
          data={metrics.dailyTransactionCounts}
          series={[{ data: (metrics?.dailyTransactionCounts || []).map(d => d.value), color: '#FF5B04' }]}
          timeFilter={timeFilter}
        />

        <RegionsTable
          data={metrics.topRegions}
          onViewDetails={handleViewRegionDetails}
        />

        <DataTable
          data={visibleTransactions}
          title="Transaction History"
          actions={transactionActions}
          columns={transactionColumns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          showFilter={true}
          filterGroups={TRANSFER_FILTER_GROUPS}
          isLoading={isTransactionsLoading}
          showExport={true}
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

export default Transfers;
