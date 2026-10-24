import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/tables/DataTable';
import ApprovalTabs from '@/components/account-approvals/ApprovalTabs';
import ApprovalModals from '@/components/account-approvals/ApprovalModals';
import { useApprovalModals } from '@/hooks/useApprovalModals';
import { businessApprovalTabs, businessApprovalColumns, createBusinessApprovalActions } from './constants';
import {
  useBusinessAccountApprovals,
  useApproveBusinessAccount,
  useDeclineBusinessAccount,
} from '@/store/features/approvals/useBusinessAccountApprovals';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const BusinessAccountApprovals = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pending');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const { data: approvalsResponse, isLoading } = useBusinessAccountApprovals({
    status: activeTab.toLowerCase(),
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });
  const approveBusinessAccount = useApproveBusinessAccount();
  const declineBusinessAccount = useDeclineBusinessAccount();

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
    if (approveBusinessAccount.isPending || !selectedUser) return;
    approveBusinessAccount.mutate(selectedUser.userId || selectedUser._id, {
      onSuccess: () => {
        setFeedbackType('approved');
        setters.setShowAcceptModal(false);
        setters.setShowSuccessModal(true);
        handleSuccess('Business Account approved successfully');
      },
      onError: (error) => {
        setters.setShowAcceptModal(false);
        handleError(error);
      },
    });
  }, [selectedUser, approveBusinessAccount, setFeedbackType, setters]);

  const handleDeclineApproval = useCallback(() => {
    if (declineBusinessAccount.isPending || !selectedUser) return;
    declineBusinessAccount.mutate({ userId: selectedUser.userId || selectedUser._id, reason: declineReason }, {
      onSuccess: () => {
        setFeedbackType('declined');
        setters.setShowDeclineModal(false);
        setters.setShowSuccessModal(true);
        handleSuccess('Business Account request declined successfully');
      },
      onError: (error) => {
        setters.setShowDeclineModal(false);
        handleError(error);
      },
    });
  }, [selectedUser, declineReason, declineBusinessAccount, setFeedbackType, setters]);

  const tableActions = useMemo(
    () =>
      createBusinessApprovalActions(
        navigate,
        activeTab,
        handleAcceptClick,
        handleDeclineClick
      ),
    [navigate, activeTab, handleAcceptClick, handleDeclineClick]
  );

  const tabCounts = {
    Pending: activeTab === 'Pending' ? approvals.length : '-',
    Approved: activeTab === 'Approved' ? approvals.length : '-',
    Declined: activeTab === 'Declined' ? approvals.length : '-',
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Business Account Approvals"
          subtitle="Review Tier 4 Business Account requests submitted by Agents and Merchants"
          showTimeFilter={false}
        />

        <ApprovalTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={businessApprovalTabs}
          tabCounts={tabCounts}
        />

        <DataTable
          data={approvals}
          title={`${activeTab} Business Accounts`}
          columns={businessApprovalColumns}
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
        isLoading={approveBusinessAccount.isPending || declineBusinessAccount.isPending}
      />
    </div>
  );
};

export default BusinessAccountApprovals;

