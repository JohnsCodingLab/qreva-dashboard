import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/tables/DataTable';
import ApprovalTabs from '@/components/account-approvals/ApprovalTabs';
import ApprovalModals from '@/components/account-approvals/ApprovalModals';
import { useApprovalModals } from '@/hooks/useApprovalModals';
import { approvalTabs, approvalColumns, createApprovalActions } from './constants';
import { useAccountApprovals, useApproveAccount, useDeclineAccount } from '@/store/features/approvals/useAccountApprovals';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const AccountApprovals = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pending');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const { data: approvalsResponse, isLoading } = useAccountApprovals({
    status: activeTab.toLowerCase(),
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });
  const approveAccount = useApproveAccount();
  const declineAccount = useDeclineAccount();

  const approvals = approvalsResponse?.data || [];

  const {
    modals,
    setters,
    selectedUser,
    setSelectedUser,
    declineReason,
    setDeclineReason,
    feedbackType,
    setFeedbackType
  } = useApprovalModals();

  const handleAcceptClick = useCallback((user) => {
    setSelectedUser(user);
    setters.setShowAcceptModal(true);
  }, [setSelectedUser, setters]);

  const handleDeclineClick = useCallback((user) => {
    setSelectedUser(user);
    setters.setShowDeclineModal(true);
  }, [setSelectedUser, setters]);

  const handleAcceptApproval = useCallback(() => {
    if (approveAccount.isPending || !selectedUser) return;
    approveAccount.mutate(selectedUser.userId || selectedUser._id, {
      onSuccess: () => {
        setFeedbackType('approved');
        setters.setShowAcceptModal(false);
        setters.setShowSuccessModal(true);
        handleSuccess('Account approved successfully');
      },
      onError: (error) => {
        setters.setShowAcceptModal(false);
        handleError(error);
      },
    });
  }, [selectedUser, approveAccount, setFeedbackType, setters]);

  const handleDeclineApproval = useCallback(() => {
    if (declineAccount.isPending || !selectedUser) return;
    declineAccount.mutate({ userId: selectedUser.userId || selectedUser._id, reason: declineReason }, {
      onSuccess: () => {
        setFeedbackType('declined');
        setters.setShowDeclineModal(false);
        setters.setShowSuccessModal(true);
        handleSuccess('Account declined successfully');
      },
      onError: (error) => {
        setters.setShowDeclineModal(false);
        handleError(error);
      },
    });
  }, [selectedUser, declineReason, declineAccount, setFeedbackType, setters]);

  const tableActions = useMemo(
    () =>
      createApprovalActions(
        navigate,
        activeTab,
        handleAcceptClick,
        handleDeclineClick
      ),
    [navigate, activeTab, handleAcceptClick, handleDeclineClick]
  );

  // Tab counts - use total from response or length of current data
  const tabCounts = {
    Pending: activeTab === 'Pending' ? approvals.length : '-',
    Approved: activeTab === 'Approved' ? approvals.length : '-',
    Declined: activeTab === 'Declined' ? approvals.length : '-',
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Account Approvals"
          subtitle="Here is the full list of KYC approvals on the platform"
          showTimeFilter={false}
        />

        <ApprovalTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={approvalTabs}
          tabCounts={tabCounts}
        />

        <DataTable
          data={approvals}
          title={`${activeTab} KYC`}
          columns={approvalColumns}
          actions={tableActions}
          loading={isLoading}
          paginationMode="server"
          rowCount={approvalsResponse?.pagination?.total || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      <ApprovalModals
        modals={modals}
        setters={setters}
        selectedUser={selectedUser}
        declineReason={declineReason}
        setDeclineReason={setDeclineReason}
        onAccept={handleAcceptApproval}
        onDecline={handleDeclineApproval}
        feedbackType={feedbackType}
        isLoading={approveAccount.isPending || declineAccount.isPending}
      />
    </div>
  );
};

export default AccountApprovals;

