import { useParams } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import LoadingState from '@/components/common/LoadingState';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { createCustomerStats, createCustomerTransactionActions } from '@/pages/airtimePurchase/constants';

const TransactionDetailsView = () => {
  const { id } = useParams();

  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: txData, isLoading } = useTransactions({
    typeCategory: 'Airtime',
    page: 1,
    limit: 50,
  });

  const transactions = txData?.data || [];
  const transaction = transactions.find(tx => tx._id === id || tx.id === id);

  const customerTransactions = transactions.filter(
    tx => (tx.senderName && tx.senderName === transaction?.senderName)
      || (tx.phoneNumber && tx.phoneNumber === transaction?.phoneNumber)
      || (tx.accountNumber && tx.accountNumber === transaction?.accountNumber)
      || (tx.title && tx.title === transaction?.title)
  );

  const stats = transaction ? createCustomerStats(transaction) : [];

  const actions = createCustomerTransactionActions(
    (tx) => {
      setSelectedTransaction(tx);
      setShowDetailsModal(true);
    },
    (tx) => {
      setSelectedTransaction(tx);
      setShowShareModal(true);
    }
  );

  if (isLoading) return <LoadingState />;
  if (!transaction) return <LoadingState message="Transaction not found" />;

  return (
    <>
      <PageHeader
        title="Transaction History"
        subtitle="Here is the full airtime transaction history for this user"
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      <DashboardStats stats={stats} />

      <TransactionHistoryTable
        data={customerTransactions}
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

export default TransactionDetailsView;
