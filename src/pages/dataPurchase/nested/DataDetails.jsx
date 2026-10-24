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
import { createRegionTransactionActions, createCustomerTransactionActions } from '../constants';

const DataDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const regionParam = type === 'region' ? id : undefined;
  const { data: metricsResponse } = useCategoryDetailMetrics('data', { region: regionParam });
  const { data: txResponse } = useTransactions({ category: 'data', region: regionParam });

  const metrics = metricsResponse?.data || {};
  const transactions = txResponse?.data || [];

  const stats = useMemo(() => [
    { label: 'Total Transaction Volume', value: (metrics.totalTransactions || 0).toLocaleString(), change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Total Transaction Value', value: `₦${(metrics.totalVolume || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Success Rate', value: `${metrics.successRate || 0}%`, change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Average Value', value: `₦${(metrics.averageValue || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours' },
  ], [metrics]);

  const topProviders = metrics.topProviders || [];
  const topCustomers = metrics.topCustomers || [];
  const dailyBreakdown = metrics.dailyBreakdown || [];

  const regionTransactionActions = createRegionTransactionActions({
    setSelectedTransaction, setShowDetailsModal, setShowShareModal, navigate
  });
  const customerTransactionActions = createCustomerTransactionActions({
    setSelectedTransaction, setShowDetailsModal, setShowShareModal
  });

  if (type === 'region') {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader title={id} subtitle="Here is how this location has been performing so far" timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />
          <DashboardStats stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TopTransactionValueCard data={topProviders.map(p => ({ name: p.name, value: p.volume }))} title="Top Transaction Value" />
            </div>
            <div className="lg:col-span-3">
              <TopCustomersCard data={topCustomers.map(c => ({ name: `${c.firstName} ${c.lastName}`, amount: c.totalVolume, transactions: c.totalTransactions }))} title="Top Customers" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TransactionVolumeChart data={dailyBreakdown.map(d => ({ label: d.date, value: d.volume }))} timeFilter={typeof timeFilter === 'string' ? timeFilter.toLowerCase() : timeFilter} />
            </div>
            <div className="lg:col-span-1">
              <TransactionPercentagePie data={topProviders.map(p => ({ name: p.name, value: p.percentage }))} title="Top % Purchase from Customers" wrapped={true} />
            </div>
          </div>
          <TransactionHistoryTable data={transactions} title="Transaction History" variant="region" actions={regionTransactionActions} />
        </div>
        <TransactionDetailsModal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} transaction={selectedTransaction} />
        <ShareReceiptModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} transaction={selectedTransaction} />
      </div>
    );
  }

  if (type === 'transaction') {
    const transaction = transactions.find(tx => String(tx.id || tx._id) === String(id));
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader title="Transaction History" subtitle="Here is the full data transaction history for this user" timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />
          {transaction && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">
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
          <DashboardStats stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TopTransactionValueCard data={topProviders.map(p => ({ name: p.name, value: p.volume }))} title="Top Transaction Value" />
            </div>
            <div className="lg:col-span-3">
              <TransactionPercentagePie data={topProviders.map(p => ({ name: p.name, value: p.percentage }))} title="Top % Purchase" wrapped={true} />
            </div>
          </div>
          <TransactionHistoryTable data={transactions} title="Transaction History" variant="region" actions={customerTransactionActions} />
        </div>
        <TransactionDetailsModal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} transaction={selectedTransaction} />
        <ShareReceiptModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} transaction={selectedTransaction} />
      </div>
    );
  }

  return <div>Invalid view type</div>;
};

export default DataDetails;

