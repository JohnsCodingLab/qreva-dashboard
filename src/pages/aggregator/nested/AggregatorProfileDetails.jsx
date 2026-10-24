
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import UserProfileHeader from '@/components/base/UserProfileHeader';
import PersonalDetailsCard from '@/components/cards/PersonalDetailsCard';
import WalletBalanceCard from '@/components/cards/WalletBalanceCard';
import BusinessDetailsCard from '@/components/cards/BusinessDetailsCard';
import TierDetailsCard from '@/components/cards/TierDetailsCard';
import ProfileModals from '@/components/profile/ProfileModals';
import LoadingState from '@/components/common/LoadingState';
import AgentsTable from '@/components/aggregators/AgentsTable';
import AgentDropdownMenu from '@/components/aggregators/AgentDropdownMenu';
import TransactionChartsSection from '@/components/aggregators/TransactionChartSection';
import {
  useUserById,
  useUserMetrics,
  useUserTransactions,
  useSuspendUser,
  useActivateUser,
  useUpdateUserProfile,
} from '@/store/features/users/useUsers';
import AggregatorCommissionSettingsModal from '@/components/modals/AggregatorCommissionSettingsModal';
import {
  useAggregatorCommissionSettingsForUser,
  useUpdateAggregatorCommissionSettingsForUser,
} from '@/store/features/contracts/useContracts';
import { useAggregatorProfileModals } from '@/hooks/useAggregatorProfileModals';
import { useAgentDropdown } from '@/hooks/useAgentDropdown';
import { createTransactionActions } from '@/utils/profileUtils';
import { formatProfileMetrics, getProfileChartData } from '@/utils/formatProfileMetrics';
import { aggregatorProfileTabs, createChartSeries } from '../constants';
import { useAuth } from '@/hooks/useAuth';
import UpdateCustomerProfileModal from '@/components/modals/UpdateCustomerProfileModal';

const AggregatorProfileDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');
  const [transactionPaginationModel, setTransactionPaginationModel] = useState({ page: 0, pageSize: 25 });
  
  const { data: aggregatorResponse, isLoading: loading } = useUserById(id, 'aggregators');
  const aggregatorData = aggregatorResponse?.data;
  const { data: metricsResponse } = useUserMetrics({
    type: 'Aggregator',
    userId: id,
  });
  const { data: txResponse, isLoading: loadingTransactions } = useUserTransactions(id, 'aggregators', {
    page: transactionPaginationModel.page + 1,
    limit: transactionPaginationModel.pageSize,
    search: transactionSearchQuery || undefined,
  });
  const aggregatorTransactions = txResponse?.data || [];
  const transactionPagination = txResponse?.pagination || {};
  const { modals, setters, selectedTransaction, setSelectedTransaction } = useAggregatorProfileModals();
  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();
  const updateUserProfileMutation = useUpdateUserProfile();
  const { agentDropdown, openDropdown, closeDropdown } = useAgentDropdown();
  const canManageCommission = ['SuperAdmin', 'Operation'].includes(user?.role || '');
  const { data: profileCommissionResponse, isLoading: isLoadingProfileCommission, refetch: refetchProfileCommission } =
    useAggregatorCommissionSettingsForUser(id, {
      enabled: canManageCommission && !!id && isCommissionModalOpen,
    });
  const updateProfileCommission = useUpdateAggregatorCommissionSettingsForUser();
  const profileCommissionRules = profileCommissionResponse?.data?.rules || [];
  const profileCommissionOwnerType = profileCommissionResponse?.data?.ownerType;

  // Sync tab with URL
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  }, [setSearchParams]);

  const handleAgentActionClick = useCallback((row, rect) => {
    openDropdown(row, rect.right - 192, rect.bottom + window.scrollY + 4);
  }, [openDropdown]);

  const transactionActions = createTransactionActions(
    setSelectedTransaction,
    setters.setShowDetailsModal,
    setters.setShowShareModal
  );

  const aggregatorStats = useMemo(() => {
    return formatProfileMetrics(metricsResponse, aggregatorData?.stats);
  }, [aggregatorData?.stats, metricsResponse]);

  const chartData = useMemo(() => {
    return getProfileChartData(metricsResponse, aggregatorData?.chartData);
  }, [aggregatorData?.chartData, metricsResponse]);

  const handleTransactionSearch = useCallback((value) => {
    setTransactionSearchQuery(value);
    setTransactionPaginationModel((model) => ({ ...model, page: 0 }));
  }, []);

  const aggregatorActions = [
    {
      label: 'Edit Details',
      onClick: () => {
        setters.setShowActionsMenu(false);
        setShowEditProfileModal(true);
      }
    },
    {
      label: 'Suspend Aggregator',
      onClick: () => {
        setters.setShowActionsMenu(false);
        setters.setShowSuspendModal(true);
      }
    }
  ];

  const handleSuspend = useCallback(() => {
    if (!aggregatorData?._id) return;
    const isActive = aggregatorData.status === 'Active' || aggregatorData.status === 'active';
    const mutation = isActive ? suspendUserMutation : activateUserMutation;
    mutation.mutate(aggregatorData._id, {
      onSettled: () => setters.setShowSuspendModal(false),
    });
  }, [aggregatorData, setters, suspendUserMutation, activateUserMutation]);

  const handleUpdateProfile = useCallback((payload) => {
    if (!aggregatorData?._id) return;
    updateUserProfileMutation.mutate(
      { userId: aggregatorData._id, userType: 'aggregators', payload },
      { onSuccess: () => setShowEditProfileModal(false) },
    );
  }, [aggregatorData?._id, updateUserProfileMutation]);

  if (loading) return <LoadingState />;
  if (!aggregatorData) return <LoadingState message="Aggregator not found" />;

  const chartSeries = createChartSeries(chartData);
  const commissionActionButton =
    canManageCommission && aggregatorData?._id ? (
      <button
        onClick={() => setIsCommissionModalOpen(true)}
        className="h-11 rounded-lg border border-[#FF5B04] bg-white px-4 text-sm font-semibold text-[#FF5B04] hover:bg-[#FFF5F2]"
      >
        Personalize Commission
      </button>
    ) : null;

  // Profile View
  if (activeTab === 'profile') {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader
            title="View Profile Details"
            subtitle="Here is the full profile details of this user"
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
            actionButton={commissionActionButton}
          />

          <UserProfileHeader
            user={aggregatorData}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            availableTabs={aggregatorProfileTabs}
            showActionsMenu={modals.showActionsMenu}
            onToggleActionsMenu={() => setters.setShowActionsMenu(!modals.showActionsMenu)}
            actions={aggregatorActions}
          />

          <WalletBalanceCard wallet={aggregatorData?.wallet} accounts={aggregatorData?.accounts} />
          <PersonalDetailsCard user={aggregatorData} />
          {aggregatorData.businessDetails && <BusinessDetailsCard business={aggregatorData.businessDetails} />}
          <TierDetailsCard tier={1} data={aggregatorData.tier1} />
          <TierDetailsCard tier={2} data={aggregatorData.tier2} />
          <TierDetailsCard tier={3} data={aggregatorData.tier3} />
        </div>

        <ProfileModals
          modals={modals}
          setters={setters}
          selectedTransaction={selectedTransaction}
          onSuspend={handleSuspend}
          suspendTitle="Suspend Aggregator"
          suspendMessage="Are you sure you want to suspend this aggregator?"
        />
        <UpdateCustomerProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={aggregatorData}
          onSubmit={handleUpdateProfile}
          isSaving={updateUserProfileMutation.isPending}
        />
        <AggregatorCommissionSettingsModal
          isOpen={isCommissionModalOpen}
          onClose={() => setIsCommissionModalOpen(false)}
          settings={profileCommissionRules}
          ownerType={profileCommissionOwnerType}
          isLoading={isLoadingProfileCommission}
          isSaving={updateProfileCommission.isPending}
          title="Aggregator Commission Settings"
          subtitle="Override commission split for this aggregator. Unchanged entries will continue using defaults."
          onSave={(payload) => {
            updateProfileCommission.mutate(
              { ownerUserId: aggregatorData._id, payload },
              {
                onSuccess: () => {
                  setIsCommissionModalOpen(false);
                  refetchProfileCommission();
                },
              },
            );
          }}
        />
      </div>
    );
  }

  // Agents View
  if (activeTab === 'agents') {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-6">
          <PageHeader
            title="View Profile Details"
            subtitle="Here is the full profile details of this user"
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
            actionButton={commissionActionButton}
          />

          <UserProfileHeader
            user={aggregatorData}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            availableTabs={aggregatorProfileTabs}
            showActionsMenu={modals.showActionsMenu}
            onToggleActionsMenu={() => setters.setShowActionsMenu(!modals.showActionsMenu)}
            actions={aggregatorActions}
          />

          <DashboardStats stats={aggregatorStats} />
          <AgentsTable agents={aggregatorData.agents} onActionClick={handleAgentActionClick} />
        </div>

        <AgentDropdownMenu dropdown={agentDropdown} onClose={closeDropdown} />
        <UpdateCustomerProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={aggregatorData}
          onSubmit={handleUpdateProfile}
          isSaving={updateUserProfileMutation.isPending}
        />
        <AggregatorCommissionSettingsModal
          isOpen={isCommissionModalOpen}
          onClose={() => setIsCommissionModalOpen(false)}
          settings={profileCommissionRules}
          ownerType={profileCommissionOwnerType}
          isLoading={isLoadingProfileCommission}
          isSaving={updateProfileCommission.isPending}
          title="Aggregator Commission Settings"
          subtitle="Override commission split for this aggregator. Unchanged entries will continue using defaults."
          onSave={(payload) => {
            updateProfileCommission.mutate(
              { ownerUserId: aggregatorData._id, payload },
              {
                onSuccess: () => {
                  setIsCommissionModalOpen(false);
                  refetchProfileCommission();
                },
              },
            );
          }}
        />
      </div>
    );
  }

  // Transaction History View
  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="View Profile Details"
          subtitle="Here is the full profile details of this user"
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          actionButton={commissionActionButton}
        />

        <UserProfileHeader
          user={aggregatorData}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          availableTabs={aggregatorProfileTabs}
          showActionsMenu={modals.showActionsMenu}
          onToggleActionsMenu={() => setters.setShowActionsMenu(!modals.showActionsMenu)}
          actions={aggregatorActions}
        />

        <DashboardStats stats={aggregatorStats} />

        <TransactionChartsSection 
          chartData={chartData}
          chartSeries={chartSeries}
        />

        <TransactionHistoryTable 
          data={aggregatorTransactions}
          title="Transaction History"
          actions={transactionActions}
          onSearch={handleTransactionSearch}
          loading={loadingTransactions}
          paginationMode="server"
          rowCount={transactionPagination.total || 0}
          paginationModel={transactionPaginationModel}
          onPaginationModelChange={setTransactionPaginationModel}
        />
      </div>

      <ProfileModals
        modals={modals}
        setters={setters}
        selectedTransaction={selectedTransaction}
        onSuspend={handleSuspend}
        suspendTitle="Suspend Aggregator"
        suspendMessage="Are you sure you want to suspend this aggregator?"
      />
      <UpdateCustomerProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={aggregatorData}
        onSubmit={handleUpdateProfile}
        isSaving={updateUserProfileMutation.isPending}
      />
      <AggregatorCommissionSettingsModal
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
        settings={profileCommissionRules}
        ownerType={profileCommissionOwnerType}
        isLoading={isLoadingProfileCommission}
        isSaving={updateProfileCommission.isPending}
        title="Aggregator Commission Settings"
        subtitle="Override commission split for this aggregator. Unchanged entries will continue using defaults."
        onSave={(payload) => {
          updateProfileCommission.mutate(
            { ownerUserId: aggregatorData._id, payload },
            {
              onSuccess: () => {
                setIsCommissionModalOpen(false);
                refetchProfileCommission();
              },
            },
          );
        }}
      />
    </div>
  );
};

export default AggregatorProfileDetails;

