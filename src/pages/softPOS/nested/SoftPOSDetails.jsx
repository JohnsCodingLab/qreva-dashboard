import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import TransactionPercentagePie from '@/components/charts/TransactionPercentagePie';
import MultiLineChart from '@/components/charts/MultiLineChart';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import TopCustomersCard from '@/components/cards/TopCustomersCard';
import DashboardStats from '@/components/base/DashboardStats';
import { useCategoryDetailMetrics, useSoftposBreakdown } from '@/store/features/category/useCategory';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { createRegionTransactionActions, createAgentTransactionActions } from '../constants';

const SoftPOSDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const regionParam = type === 'region' ? id : undefined;
  const { data: metricsResponse } = useCategoryDetailMetrics('softpos', { region: regionParam });
  const { data: breakdownResponse } = useSoftposBreakdown({ region: regionParam });
  const { data: txResponse } = useTransactions({ category: 'softpos', region: regionParam });

  const metrics = metricsResponse?.data || {};
  const breakdown = breakdownResponse?.data || {};
  const transactions = txResponse?.data || [];

  const stats = useMemo(() => [
    { label: 'Total Transaction Volume', value: (metrics.totalTransactions || 0).toLocaleString(), change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Total Transaction Value', value: `₦${(metrics.totalVolume || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Success Rate', value: `${metrics.successRate || 0}%`, change: '+0%', subtext: 'in last 24 hours' },
    { label: 'Average Value', value: `₦${(metrics.averageValue || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours' },
  ], [metrics]);

  const topCustomers = (metrics.topCustomers || []).map(c => ({
    name: `${c.firstName} ${c.lastName}`,
    amount: c.totalVolume,
    transactions: c.totalTransactions,
  }));

  const cardVsQrData = [
    { id: 0, value: breakdown.cardPayments?.count || 0, label: 'Card Payments', color: '#FF5B04' },
    { id: 1, value: breakdown.qrPayments?.count || 0, label: 'QR Payments', color: '#06b6d4' },
  ];

  const dailyBreakdown = breakdown.dailyBreakdown || [];
  const chartData = dailyBreakdown.map(d => ({ date: d.date, card: d.card, qr: d.qr }));
  const chartSeries = [
    { dataKey: 'card', label: 'Card', color: '#FF5B04' },
    { dataKey: 'qr', label: 'QR', color: '#06b6d4' },
  ];

  const regionTransactionActions = createRegionTransactionActions({
    setSelectedTransaction, setShowDetailsModal, setShowShareModal, navigate
  });
  const agentTransactionActions = createAgentTransactionActions({
    setSelectedTransaction, setShowDetailsModal, setShowShareModal, navigate
  });

  if (type === 'region') {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader title={id} subtitle="Here is how this location has been performing so far" timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />
          <DashboardStats stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TransactionPercentagePie data={cardVsQrData} title="Card Payments vs QR Payments %" wrapped={true} />
            <TopCustomersCard data={topCustomers} title="Top Customers" />
          </div>
          <MultiLineChart data={chartData} series={chartSeries} title="Daily Transaction Value" />
          <TransactionHistoryTable data={transactions} title="Transactions" actions={regionTransactionActions} />
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
          <PageHeader title="Transaction History" subtitle="Here is the full SoftPOS transaction history for this agent" timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />
          {transaction && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-qreva-indigo">
                    {(transaction.customerName || transaction.agentName || '')?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'TX'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">{transaction.customerName || transaction.agentName}</h3>
                  <p className="text-qreva-navy">{transaction.customerPhone || transaction.phoneNumber}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-qreva-ash text-qreva-navy rounded-full text-sm">{transaction.status}</span>
                </div>
              </div>
            </div>
          )}
          <DashboardStats stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TransactionPercentagePie data={cardVsQrData} title="Payment Distribution" wrapped={true} />
            <TopCustomersCard data={topCustomers} title="Related Agents" />
          </div>
          <MultiLineChart data={chartData} series={chartSeries} title="Daily Transaction Value" />
          <TransactionHistoryTable data={transactions} title="Transactions" actions={agentTransactionActions} />
        </div>
        <TransactionDetailsModal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} transaction={selectedTransaction} />
        <ShareReceiptModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} transaction={selectedTransaction} />
      </div>
    );
  }

  return <div>Invalid view type</div>;
};

export default SoftPOSDetails;

