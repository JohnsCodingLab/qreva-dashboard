import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useProfileModals } from '@/hooks/useProfileModals';
import {
  useUserById,
  useUserMetrics,
  useUserTransactions,
  useSuspendUser,
  useActivateUser,
  useRetryUserAccountCreation,
  useUpdateUserProfile,
  useUpdateUserTransactionLevel,
} from '@/store/features/users/useUsers';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileDetailsView from '@/components/profile/ProfileDetailsView';
import TransactionView from '@/components/profile/TransactionView';
import ProfileModals from '@/components/profile/ProfileModals';
import LoadingState from '@/components/common/LoadingState';
import PaymentComparisonPie from '@/components/charts/PaymentComparisonPie';
import MultiLineChart from '@/components/charts/MultiLineChart';
import UpdateCustomerProfileModal from '@/components/modals/UpdateCustomerProfileModal';
import { createTransactionActions } from '@/utils/profileUtils';
import { useAuth } from '@/hooks/useAuth';
import { formatProfileMetrics, getProfileChartData } from '@/utils/formatProfileMetrics';
import { userTransactionColumns } from '@/pages/users/constants';
import { availableTabs, createChartSeries } from '../constants'

const TRANSACTION_LEVELS = ['STARTER', 'BRONZE', 'SILVER', 'GOLD'];

const formatLevelLabel = (value) => {
  const normalized = String(value || '').trim().toUpperCase();
  return normalized ? `${normalized.charAt(0)}${normalized.slice(1).toLowerCase()}` : 'Starter';
};

const TransactionLevelCard = ({
  currentLevel,
  selectedLevel,
  onChange,
  onSave,
  isSaving,
  canManage,
}) => {
  const hasChanges = String(selectedLevel || '').trim().toUpperCase() !== String(currentLevel || '').trim().toUpperCase();

  return (
    <div className="mb-6 rounded-2xl border border-[#E8EBED] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#808C91]">Transaction Level</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex rounded-full bg-[#FFF1EA] px-3 py-1 text-sm font-semibold text-[#FF5B04]">
              {formatLevelLabel(currentLevel)}
            </span>
            <p className="text-sm text-[#505C61]">
              This controls the agent&apos;s active contract tier on the platform.
            </p>
          </div>
        </div>

        {canManage ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={selectedLevel}
              onChange={(e) => onChange(e.target.value)}
              className="h-11 min-w-[180px] rounded-lg border border-[#D9D9D9] bg-white px-4 text-sm text-[#1E1E1E] focus:border-[#FF5B04] focus:outline-none"
            >
              {TRANSACTION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {formatLevelLabel(level)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onSave}
              disabled={!hasChanges || isSaving}
              className="h-11 rounded-lg bg-[#FF5B04] px-5 text-sm font-semibold text-white hover:bg-[#E54F03] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Update Level'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-[#808C91]">Only Operation and SuperAdmin can change this level.</p>
        )}
      </div>
    </div>
  );
};

const AgentProfileDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'transactions';
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('STARTER');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  
  
  const { data: agentResponse, isLoading: loading } = useUserById(id, 'agents');
  const agentData = agentResponse?.data;
  const { data: metricsResponse } = useUserMetrics({
    type: 'Agent',
    userId: id,
  });
  const { data: txResponse, isLoading: loadingTransactions } = useUserTransactions(id, 'agents', {
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchQuery || undefined,
  });
  const agentTransactions = txResponse?.data || [];
  const transactionPagination = txResponse?.pagination || {};
  const { modals, setters, selectedTransaction, setSelectedTransaction } = useProfileModals();
  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();
  const retryAccountCreationMutation = useRetryUserAccountCreation();
  const updateUserProfileMutation = useUpdateUserProfile();
  const updateTransactionLevelMutation = useUpdateUserTransactionLevel();
  const canManageTransactionLevel = useMemo(
    () => ['SuperAdmin', 'Operation'].includes(user?.role || ''),
    [user?.role],
  );

  useEffect(() => {
    const currentLevel = String(agentData?.transactionLevel || agentData?.transcationLevel || 'STARTER').toUpperCase();
    setSelectedLevel(currentLevel);
  }, [agentData?.transactionLevel, agentData?.transcationLevel]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const transactionActions = createTransactionActions(
    setSelectedTransaction,
    setters.setShowDetailsModal,
    setters.setShowShareModal
  );

  const agentStats = useMemo(() => {
    return formatProfileMetrics(metricsResponse, agentData?.stats);
  }, [agentData?.stats, metricsResponse]);

  const chartData = useMemo(() => {
    return getProfileChartData(metricsResponse, agentData?.chartData);
  }, [agentData?.chartData, metricsResponse]);

  const handleTransactionSearch = (value) => {
    setSearchQuery(value);
    setPaginationModel((model) => ({ ...model, page: 0 }));
  };

  const handleSuspend = () => {
    if (!agentData?._id) return;
    const isActive = agentData.status === 'Active' || agentData.status === 'active';
    const mutation = isActive ? suspendUserMutation : activateUserMutation;
    mutation.mutate(agentData._id, {
      onSettled: () => setters.setShowSuspendModal(false),
    });
  };

  if (loading) return <LoadingState />;
  if (!agentData) return <LoadingState message="Agent not found" />;

  const currentTransactionLevel = String(
    agentData.transactionLevel || agentData.transcationLevel || 'STARTER',
  ).toUpperCase();

  const handleUpdateTransactionLevel = () => {
    if (!agentData?._id) return;
    updateTransactionLevelMutation.mutate({
      userId: agentData._id,
      payload: {
        transactionLevel: selectedLevel,
      },
    });
  };

  const handleRetryAccountCreation = () => {
    if (!agentData?._id) return;
    retryAccountCreationMutation.mutate({ userId: agentData._id, userType: 'agents' });
  };

  const handleUpdateProfile = (payload) => {
    if (!agentData?._id) return;
    updateUserProfileMutation.mutate(
      { userId: agentData._id, userType: 'agents', payload },
      { onSuccess: () => setShowEditProfileModal(false) },
    );
  };

  return (
     <ProfileLayout
      userData={agentData}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      availableTabs={availableTabs}
      actions={[
        {
          label: 'Edit Details',
          onClick: () => {
            setters.setShowActionsMenu(false);
            setShowEditProfileModal(true);
          }
        },
        {
          label: 'Suspend Agent',
          onClick: () => {
            setters.setShowActionsMenu(false);
            setters.setShowSuspendModal(true);
          }
        }
      ]}
    >
      {activeTab === 'profile' ? (
        <>
          <TransactionLevelCard
            currentLevel={currentTransactionLevel}
            selectedLevel={selectedLevel}
            onChange={setSelectedLevel}
            onSave={handleUpdateTransactionLevel}
            isSaving={updateTransactionLevelMutation.isPending}
            canManage={canManageTransactionLevel}
          />
          <ProfileDetailsView
            userData={agentData}
            userType="agents"
            showBusinessDetails
            onRetryAccountCreation={handleRetryAccountCreation}
            isRetryingAccountCreation={retryAccountCreationMutation.isPending}
            canRetryAccountCreation
          />
        </>
      ) : (
        <TransactionView
          stats={agentStats}
          transactions={agentTransactions}
          actions={transactionActions}
          columns={userTransactionColumns}
          setSearchQuery={handleTransactionSearch}
          loading={loadingTransactions}
          paginationMode="server"
          rowCount={transactionPagination.total || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        >
          <TransactionLevelCard
            currentLevel={currentTransactionLevel}
            selectedLevel={selectedLevel}
            onChange={setSelectedLevel}
            onSave={handleUpdateTransactionLevel}
            isSaving={updateTransactionLevelMutation.isPending}
            canManage={canManageTransactionLevel}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PaymentComparisonPie data={chartData} />
            <MultiLineChart data={chartData} series={createChartSeries(chartData)} />
          </div>
        </TransactionView>
      )}

      <ProfileModals
        modals={modals}
        setters={setters}
        selectedTransaction={selectedTransaction}
        onSuspend={handleSuspend}
        suspendTitle="Suspend Agent"
        suspendMessage="Are you sure you want to suspend this agent?"
      />
      <UpdateCustomerProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={agentData}
        onSubmit={handleUpdateProfile}
        isSaving={updateUserProfileMutation.isPending}
      />
    </ProfileLayout>
  );
};

export default AgentProfileDetails;

