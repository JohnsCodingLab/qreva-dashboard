import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardStats from '@/components/base/DashboardStats';
import WithdrawModal from '@/components/modals/WithdrawalModal';
import ProcessingModal from '@/components/modals/ProccessingModal';
import TransferSuccessModal from '@/components/modals/TransferSuccessModal';
import SaveBeneficiaryModal from '@/components/modals/SaveBeneficiaryModal';
import SuccessModal from '@/components/modals/SuccessModal';
import DataTable from '@/components/tables/DataTable';
import CustomEye from '@/components/icons/CustomEye';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import {
  useEarnings,
  useWithdrawals,
  useCreateWithdrawal,
  useBeneficiaries,
  useCreateBeneficiary,
} from '@/store/features/earnings/useEarnings';

const WITHDRAW_ROLES = ['agent', 'aggregator', 'aggregator_manager'];

const MyEarnings = () => {
  const { user } = useAuth();
  const canWithdraw = WITHDRAW_ROLES.includes(user?.role);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSaveBeneficiaryModal, setShowSaveBeneficiaryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTransferSuccessModal, setShowTransferSuccessModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // API hooks
  const { data: earningsResponse } = useEarnings();
  const { data: withdrawalsResponse, isLoading: isLoadingWithdrawals } = useWithdrawals({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });
  const { data: beneficiariesResponse } = useBeneficiaries();
  const createWithdrawalMutation = useCreateWithdrawal();
  const createBeneficiaryMutation = useCreateBeneficiary();

  const earningsStats = useMemo(() => {
    const e = earningsResponse?.data || {};
    return [
      { label: 'Your Earnings', value: `₦${(e.totalEarnings || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours', showEye: true },
      { label: 'Available Balance', value: `₦${(e.availableBalance || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours' },
      { label: 'Total Withdrawn', value: `₦${(e.totalWithdrawn || 0).toLocaleString()}`, change: '+0%', subtext: 'in last 24 hours' },
    ];
  }, [earningsResponse]);

  const frequentBeneficiaries = useMemo(() => {
    const list = beneficiariesResponse?.data || [];
    return list.map(b => ({
      ...b,
      initial: b.accountName?.split(' ').map(w => w[0]).join('').slice(0, 2) || '?',
      name: b.accountName || 'Unknown',
      color: '#FF5B04',
    }));
  }, [beneficiariesResponse]);

  const withdrawals = useMemo(() => {
    const list = withdrawalsResponse?.data || [];
    return list.map(w => {
      const dateObj = w.createdAt ? new Date(w.createdAt) : null;
      const formattedDate = dateObj
        ? dateObj.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
          + ' | ' + dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'N/A';
      return {
        ...w,
        id: w._id || w.id,
        name: w.accountName,
        bank: `${w.bankName} | ${w.accountNumber}`,
        transactionId: w.reference,
        date: formattedDate,
      };
    });
  }, [withdrawalsResponse]);

  const columns = [
    {
      field: 'name',
      headerName: 'Agent Name',
      width: 250,
      flex: 1,
      renderCell: (params) => (
        <div>
          <div className="text-sm font-general text-[#1E1E1E] font-medium">{params.row.name}</div>
          <div className="text-sm font-general text-[#475367]">{params.row.bank}</div>
        </div>
      )
    },
    {
      field: 'bank',
      headerName: 'Bank',
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
          {params.value}
        </span>
      )
    },
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
          {params.value}
        </span>
      )
    },
    {
      field: 'amount',
      headerName: 'Amount (₦)',
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
          {params.value?.toLocaleString()}
        </span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      flex: 1,
      renderCell: (params) => {
        const statusColors = {
          Pending: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]',
          Successful: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]',
          Failed: 'border border-[#FF4D4D] bg-[#FFF0F0] text-[#FF4D4D]',
        };
        return (
          <span className={`px-2 py-1.5 text-center ${statusColors[params.value] || ''} font-general font-medium text-xs rounded-md flex items-center justify-center h-full`}>
            {params.value}
          </span>
        );
      }
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 180,
      flex: 1,
      renderCell: (params) => (
        <span className="text-sm text-[#1E1E1E] font-general flex flex-wrap items-center h-full">{params.value}</span>
      )
    },
  ];

  const handleWithdraw = () => {
    setShowWithdrawModal(false);
    setShowProcessingModal(true);

    createWithdrawalMutation.mutate(
      {
        amount: Number(amount),
        bankCode: bankName,
        accountNumber,
        accountName,
        saveBeneficiary: false,
        pin: '',
      },
      {
        onSuccess: () => {
          setShowProcessingModal(false);
          setShowTransferSuccessModal(true);
        },
        onError: () => {
          setShowProcessingModal(false);
        },
      }
    );
  };

  const handleSaveBeneficiary = () => {
    setShowTransferSuccessModal(false);
    setBeneficiaryName(accountName);
    setShowSaveBeneficiaryModal(true);
  };

  const confirmSaveBeneficiary = () => {
    createBeneficiaryMutation.mutate(
      {
        accountName,
        accountNumber,
        bankName,
        bankCode: bankName,
      },
      {
        onSuccess: () => {
          setShowSaveBeneficiaryModal(false);
          setShowSuccessModal(true);
        },
      }
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const formatAmount = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const tableActions = [
    {
      label: 'View Details',
      icon: CustomEye,
      onClick: (row) => {
        setSelectedTransaction(row);
        setShowDetailsModal(true);
      }
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFA]">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-1">My Earnings</h1>
            <p className="text-sm text-[#808C91]">View all your earnings and withdraw earnings here</p>
          </div>
          {canWithdraw && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-6 py-2.5 bg-[#FF5B04] text-white rounded-lg text-sm font-medium hover:bg-[#E54F03] transition-colors"
            >
              Withdraw Now
            </button>
          )}
        </div>

        {/* Earnings Stats */}
        <DashboardStats stats={earningsStats} route="my-earnings" />

        {/* Withdrawals Table */}
        <DataTable
          className="font-general"
          data={withdrawals}
          columns={columns}
          title="Transaction History"
          actions={tableActions}
          loading={isLoadingWithdrawals}
          paginationMode="server"
          rowCount={withdrawalsResponse?.pagination?.total || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onSearch={setSearchQuery}
          onFilter={() => {}}
        />
      </div>

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        frequentBeneficiaries={frequentBeneficiaries}
        setBankName={setBankName}
        setAccountNumber={setAccountNumber}
        setAccountName={setAccountName}
        bankName={bankName}
        accountNumber={accountNumber}
        accountName={accountName}
        amount={amount}
        formatAmount={formatAmount}
        handleAmountChange={handleAmountChange}
        handleWithdraw={handleWithdraw}
      />

      <ProcessingModal
        isOpen={showProcessingModal}
        onClose={() => setShowProcessingModal(false)}
      />

      <TransferSuccessModal
        isOpen={showTransferSuccessModal}
        onClose={() => setShowTransferSuccessModal(false)}
        handleSaveBeneficiary={handleSaveBeneficiary}
      />

      <SaveBeneficiaryModal
        isOpen={showSaveBeneficiaryModal}
        onClose={() => setShowSaveBeneficiaryModal(false)}
        accountName={accountName}
        accountNumber={accountNumber}
        bankName={bankName}
        beneficiaryName={beneficiaryName}
        setBeneficiaryName={setBeneficiaryName}
        confirmSaveBeneficiary={confirmSaveBeneficiary}
      />

      <TransactionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        transaction={selectedTransaction}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        beneficiaryName={beneficiaryName}
      />
    </div>
  );
};

export default MyEarnings;

