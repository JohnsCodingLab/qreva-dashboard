import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import TopTransactionValueCard from '@/components/cards/TopTransactionValueCard';
import TopCustomersCard from '@/components/cards/TopCustomersCard';
import TransactionVolumeChart from '@/components/charts/TransactionVolumeChart';
import TransactionPercentagePie from '@/components/charts/TransactionPercentagePie';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import LoadingState from '@/components/common/LoadingState';
import { useCategoryDetailMetrics } from '@/store/features/category/useCategory';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { createTransactionActions } from '../constants';

const AirtimeDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [page, setPage] = useState(1);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const regionParam = type === 'region' ? id : undefined;
  const { data: metricsResponse, isLoading: isMetricsLoading } = useCategoryDetailMetrics('airtime', {
    region: regionParam,
    range: timeFilter.toLowerCase(),
  });

  const { data: txResponse, isLoading: isTxLoading } = useTransactions({
    typeCategory: 'Airtime',
    location: regionParam,
    page,
    limit: 10,
  });

  const metrics = metricsResponse?.data || {};
  const transactions = txResponse?.data || [];
  const pagination = txResponse?.pagination || {};

  const stats = useMemo(() => [
    { label: 'Total Transaction Volume', value: (metrics.totalTransactions || 0).toLocaleString(), change: metrics.changePercentages?.totalTransactions || '+0%', subtext: 'in last 24 hours' },
    { label: 'Total Transaction Value', value: `₦${(metrics.totalVolume || 0).toLocaleString()}`, change: metrics.changePercentages?.totalVolume || '+0%', subtext: 'in last 24 hours' },
    { label: 'Total Revenue', value: `₦${(metrics.totalRevenue || 0).toLocaleString()}`, change: metrics.changePercentages?.totalRevenue || '+0%', subtext: 'in last 24 hours' },
    { label: 'Success Rate', value: `${metrics.successRate || 0}%`, change: metrics.changePercentages?.successRate || '+0%', subtext: 'in last 24 hours' },
  ], [metrics]);

  const topProviders = (metrics.topTransactionValues || metrics.topProviders || []);
  const topCustomers = (metrics.topCustomers || []);
  const dailyVolume = (metrics.dailyTransactionVolume || metrics.dailyBreakdown || []).map(d => ({
    label: d.label || d.date,
    value: d.amount || d.volume || 0,
  }));
  const purchasePercentages = metrics.topPurchasePercentages || [];

  const transactionActions = createTransactionActions(
    (tx) => {
      setSelectedTransaction(tx);
      setShowDetailsModal(true);
    },
    (tx) => {
      setSelectedTransaction(tx);
      setShowShareModal(true);
    }
  );

  const handleTimeFilterChange = (newFilter) => {
    const filterMap = {
      'Today': 'today',
      'Hourly': 'hourly',
      'Weekly': 'weekly',
      'Monthly': 'monthly',
      'Yearly': 'yearly',
    };
    setTimeFilter(filterMap[newFilter] || newFilter);
    setPage(1);
  };

  if (isMetricsLoading) return <LoadingState />;

  // REGION DETAILS VIEW
  if (type === 'region') {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader
            title={decodeURIComponent(id)}
            subtitle="Here is how this location has been performing so far"
            timeFilter={timeFilter}
            onTimeFilterChange={handleTimeFilterChange}
          />

          <DashboardStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TopTransactionValueCard
                data={topProviders}
                title="Top Transaction Value"
              />
            </div>
            <div className="lg:col-span-3">
              <TopCustomersCard
                data={topCustomers}
                title="Top Customers"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TransactionVolumeChart
                data={dailyVolume}
                timeFilter={typeof timeFilter === 'string' ? timeFilter.toLowerCase() : timeFilter}
              />
            </div>
            <div className="lg:col-span-1">
              <TransactionPercentagePie
                data={purchasePercentages}
                title="Top % Purchase from Customers"
                wrapped={true}
              />
            </div>
          </div>

          <TransactionHistoryTable
            data={transactions}
            title="Transaction History"
            variant="region"
            actions={transactionActions}
            pagination={pagination}
            onPageChange={setPage}
            isLoading={isTxLoading}
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
  }

  // TRANSACTION DETAILS VIEW
  if (type === 'transaction') {
    const transaction = transactions.find(tx => String(tx._id || tx.id) === String(id));

    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader
            title="Transaction History"
            subtitle="Here is the full airtime transaction history for this user"
            timeFilter={timeFilter}
            onTimeFilterChange={handleTimeFilterChange}
          />

          {transaction && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-qreva-orange">
                    {(transaction.senderName || transaction.narration || transaction.typeCategory || transaction.title || '')?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'TX'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">{transaction.senderName || transaction.narration || transaction.typeCategory || transaction.title}</h3>
                  <p className="text-qreva-navy">{transaction.senderPhone || transaction.phoneNumber || transaction.creditAccountNumber || transaction.accountNumber || transaction.acc}</p>
                </div>
              </div>
            </div>
          )}

          <DashboardStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TopTransactionValueCard
                data={topProviders}
                title="Top Transaction Value"
              />
            </div>
            <div className="lg:col-span-3">
              <TransactionPercentagePie
                data={purchasePercentages}
                title="Top % Purchase"
                wrapped={true}
              />
            </div>
          </div>

          <TransactionHistoryTable
            data={transactions}
            title="Transaction History"
            variant="region"
            actions={transactionActions}
            pagination={pagination}
            onPageChange={setPage}
            isLoading={isTxLoading}
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
  }

  return <div>Invalid view type</div>;
};

export default AirtimeDetails;

