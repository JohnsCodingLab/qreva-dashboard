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
import { useCategoryDetailMetrics } from '@/store/features/category/useCategory';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import {
  createCustomerTransactionActions,
  createRegionTransactionActions
} from '../constants';

const BillsDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch category metrics for bills, optionally filtered by region
  const regionParam = type === 'region' ? id : undefined;
  const { data: metricsResponse } = useCategoryDetailMetrics('bills', {
    region: regionParam,
  });

  // Fetch transactions filtered for bills + region
  const { data: txResponse } = useTransactions({
    category: 'bills',
    region: regionParam,
  });

  const metrics = metricsResponse?.data || {};
  const transactions = useMemo(() => {
    return (txResponse?.data || []).filter(tx =>
      tx.typeCategory !== 'Airtime' &&
      tx.typeCategory !== 'Data' &&
      tx.category !== 'airtime' &&
      tx.category !== 'data'
    );
  }, [txResponse]);

  const regionStats = useMemo(() => [
    { label: 'Total Transaction Volume', value: (metrics.totalTransactions || 0).toLocaleString(), change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Total Transaction Value', value: `₦${(metrics.totalVolume || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Success Rate', value: `${metrics.successRate || 0}%`, change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Average Value', value: `₦${(metrics.averageValue || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours' },
  ], [metrics]);

  const topProviders = metrics.topProviders || [];
  const topCustomers = metrics.topCustomers || [];
  const dailyBreakdown = metrics.dailyBreakdown || [];

  const regionTransactionActions = createRegionTransactionActions({
    setSelectedTransaction,
    setShowDetailsModal,
    setShowShareModal,
    navigate
  });

  const customerTransactionActions = createCustomerTransactionActions({
    setSelectedTransaction,
    setShowDetailsModal,
    setShowShareModal,
  });

  // REGION DETAILS VIEW
  if (type === 'region') {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader
            title={id}
            subtitle="Here is how this location has been performing so far"
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />

          <DashboardStats stats={regionStats} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TopTransactionValueCard
                data={topProviders.map(p => ({ name: p.name, value: p.volume }))}
                title="Top Transaction Value"
              />
            </div>
            <div className="lg:col-span-3">
              <TopCustomersCard
                data={topCustomers.map(c => ({
                  name: `${c.firstName} ${c.lastName}`,
                  amount: c.totalVolume,
                  transactions: c.totalTransactions,
                }))}
                title="Top Customers"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TransactionVolumeChart
                data={dailyBreakdown.map(d => ({ label: d.date, value: d.volume }))}
                timeFilter={typeof timeFilter === 'string' ? timeFilter.toLowerCase() : timeFilter}
              />
            </div>
            <div className="lg:col-span-1">
              <TransactionPercentagePie
                data={topProviders.map(p => ({ name: p.name, value: p.percentage }))}
                title="Top % Purchase from Customers"
                wrapped={true}
              />
            </div>
          </div>

          <TransactionHistoryTable
            data={transactions}
            title="Transaction History"
            variant="region"
            actions={regionTransactionActions}
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
    const transaction = transactions.find(tx => String(tx.id || tx._id) === String(id));

    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader
            title="Transaction History"
            subtitle="Here is the full bills payment transaction history for this user"
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />

          {transaction && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-qreva-orange">
                    {(transaction.customerName || transaction.title || '')?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'TX'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">{transaction.customerName || transaction.title}</h3>
                  <p className="text-qreva-navy">{transaction.customerPhone || transaction.acc}</p>
                </div>
              </div>
            </div>
          )}

          <DashboardStats stats={regionStats} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TopTransactionValueCard
                data={topProviders.map(p => ({ name: p.name, value: p.volume }))}
                title="Top Transaction Value"
              />
            </div>
            <div className="lg:col-span-3">
              <TransactionPercentagePie
                data={topProviders.map(p => ({ name: p.name, value: p.percentage }))}
                title="Top % Purchase"
                wrapped={true}
              />
            </div>
          </div>

          <TransactionHistoryTable
            data={transactions}
            title="Transaction History"
            variant="region"
            actions={customerTransactionActions}
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

export default BillsDetails;
