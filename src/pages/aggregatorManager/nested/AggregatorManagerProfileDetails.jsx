import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
import { createChartSeries } from '@/pages/aggregator/constants';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import UpdateCustomerProfileModal from '@/components/modals/UpdateCustomerProfileModal';

const managerProfileTabs = [
  { key: 'profile', label: 'Profile Details' },
  { key: 'transactions', label: 'Transaction History' },
  { key: 'aggregators', label: 'Aggregators' },
  { key: 'agents', label: 'Agents' },
  { key: 'merchants', label: 'Merchants' },
];

const merchantListColumns = [
  {
    field: 'firstName',
    headerName: 'Merchant Name',
    width: 220,
    flex: 1,
    renderCell: (params) => (
      <div>
        <div className="text-sm font-medium text-[#1E1E1E]">{params.row.firstName} {params.row.lastName}</div>
        <div className="text-xs text-qreva-navy">{params.row.emailAddress}</div>
      </div>
    ),
  },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 160, flex: 1 },
  {
    field: 'businessName',
    headerName: 'Business Name',
    width: 180,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#1E1E1E]">
        {params.row.businessName || params.row.businessDetails?.businessName || '-'}
      </span>
    ),
  },
  {
    field: 'totalTransactions',
    headerName: 'Transactions',
    width: 130,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#1E1E1E]">
        {Number(params.row.totalTransactions ?? params.row.stats?.totalTransactions ?? 0).toLocaleString()}
      </span>
    ),
  },
  {
    field: 'totalCommissions',
    headerName: 'Commissions',
    width: 140,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#1E1E1E]">
        ₦{Number(params.row.totalCommissions ?? params.row.stats?.totalCommissions ?? 0).toLocaleString()}
      </span>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    flex: 1,
    renderCell: (params) => {
      const statusColors = {
        Active: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#1B7D3C]',
        Inactive: 'border border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280]',
        Suspended: 'border border-[#F87171] bg-[#FEE2E2] text-[#B91C1C]',
      };
      return (
        <span className={`px-2 py-1.5 text-center ${statusColors[params.value] || ''} font-general font-medium text-xs rounded-md`}>
          {params.value || '-'}
        </span>
      );
    },
  },
  { field: 'clientId', headerName: 'Client ID', width: 180, flex: 1 },
];

const aggregatorListColumns = [
  {
    field: 'firstName',
    headerName: 'Aggregator Name',
    width: 220,
    flex: 1,
    renderCell: (params) => (
      <div>
        <div className="text-sm font-medium text-[#1E1E1E]">{params.row.firstName} {params.row.lastName}</div>
        <div className="text-xs text-qreva-navy">{params.row.emailAddress}</div>
      </div>
    ),
  },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 160, flex: 1 },
  { field: 'type', headerName: 'Account Type', width: 130, flex: 1 },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    flex: 1,
    renderCell: (params) => {
      const statusColors = {
        Active: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#1B7D3C]',
        Inactive: 'border border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280]',
        Suspended: 'border border-[#F87171] bg-[#FEE2E2] text-[#B91C1C]',
      };
      return (
        <span className={`px-2 py-1.5 text-center ${statusColors[params.value] || ''} font-general font-medium text-xs rounded-md`}>
          {params.value || '-'}
        </span>
      );
    },
  },
  { field: 'clientId', headerName: 'Client ID', width: 180, flex: 1 },
];

const AggregatorManagerProfileDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');
  const [transactionPaginationModel, setTransactionPaginationModel] = useState({ page: 0, pageSize: 25 });

  const { data: managerResponse, isLoading: loading } = useUserById(id, 'aggregator-managers');
  const managerData = managerResponse?.data;
  const { data: metricsResponse } = useUserMetrics({
    type: 'AggregatorManager',
    userId: id,
  });
  const { data: txResponse, isLoading: loadingTransactions } = useUserTransactions(id, 'aggregator-managers', {
    page: transactionPaginationModel.page + 1,
    limit: transactionPaginationModel.pageSize,
    search: transactionSearchQuery || undefined,
  });
  const managerTransactions = txResponse?.data || [];
  const transactionPagination = txResponse?.pagination || {};

  const { modals, setters, selectedTransaction, setSelectedTransaction } = useAggregatorProfileModals();
  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();
  const updateUserProfileMutation = useUpdateUserProfile();
  const { agentDropdown, openDropdown, closeDropdown } = useAgentDropdown();
  const [aggregatorDropdown, setAggregatorDropdown] = useState({ open: false, row: null, x: 0, y: 0 });
  const canManageCommission = ['SuperAdmin', 'Operation'].includes(user?.role || '');
  const { data: profileCommissionResponse, isLoading: isLoadingProfileCommission, refetch: refetchProfileCommission } =
    useAggregatorCommissionSettingsForUser(id, {
      enabled: canManageCommission && !!id && isCommissionModalOpen,
    });
  const updateProfileCommission = useUpdateAggregatorCommissionSettingsForUser();
  const profileCommissionRules = profileCommissionResponse?.data?.rules || [];
  const profileCommissionOwnerType = profileCommissionResponse?.data?.ownerType;

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

  const handleAggregatorActionClick = useCallback((row, rect) => {
    setAggregatorDropdown({ open: true, row, x: rect.right - 200, y: rect.bottom + window.scrollY + 5 });
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setAggregatorDropdown({ open: false, row: null, x: 0, y: 0 });
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const transactionActions = createTransactionActions(
    setSelectedTransaction,
    setters.setShowDetailsModal,
    setters.setShowShareModal
  );

  const managerStats = useMemo(() => {
    return formatProfileMetrics(metricsResponse, managerData?.stats);
  }, [managerData?.stats, metricsResponse]);

  const chartData = useMemo(() => {
    return getProfileChartData(metricsResponse, managerData?.chartData);
  }, [managerData?.chartData, metricsResponse]);

  const handleTransactionSearch = useCallback((value) => {
    setTransactionSearchQuery(value);
    setTransactionPaginationModel((model) => ({ ...model, page: 0 }));
  }, []);

  const managerActions = [
    {
      label: 'Edit Details',
      onClick: () => {
        setters.setShowActionsMenu(false);
        setShowEditProfileModal(true);
      },
    },
    {
      label: 'Suspend Account',
      onClick: () => {
        setters.setShowActionsMenu(false);
        setters.setShowSuspendModal(true);
      },
    },
  ];

  const handleSuspend = useCallback(() => {
    if (!managerData?._id) return;
    const isActive = managerData.status === 'Active' || managerData.status === 'active';
    const mutation = isActive ? suspendUserMutation : activateUserMutation;
    mutation.mutate(managerData._id, {
      onSettled: () => setters.setShowSuspendModal(false),
    });
  }, [managerData, setters, suspendUserMutation, activateUserMutation]);

  const handleUpdateProfile = useCallback((payload) => {
    if (!managerData?._id) return;
    updateUserProfileMutation.mutate(
      { userId: managerData._id, userType: 'aggregator-managers', payload },
      { onSuccess: () => setShowEditProfileModal(false) },
    );
  }, [managerData?._id, updateUserProfileMutation]);

  if (loading) return <LoadingState />;
  if (!managerData) return <LoadingState message="Aggregator Manager not found" />;

  const chartSeries = createChartSeries(chartData);
  const commissionActionButton =
    canManageCommission && managerData?._id ? (
      <button
        onClick={() => setIsCommissionModalOpen(true)}
        className="h-11 rounded-lg border border-[#FF5B04] bg-white px-4 text-sm font-semibold text-[#FF5B04] hover:bg-[#FFF5F2]"
      >
        Personalize Commission
      </button>
    ) : null;

  const aggregatorColumnsWithActions = [
    ...aggregatorListColumns,
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <button
          className="text-[#084059] hover:text-[#1E1E1E]"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            handleAggregatorActionClick(params.row, rect);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      ),
    },
  ];

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
            user={managerData}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            availableTabs={managerProfileTabs}
            showActionsMenu={modals.showActionsMenu}
            onToggleActionsMenu={() => setters.setShowActionsMenu(!modals.showActionsMenu)}
            actions={managerActions}
          />
          <WalletBalanceCard wallet={managerData?.wallet} accounts={managerData?.accounts} />
          <PersonalDetailsCard user={managerData} />
          {managerData.businessDetails && <BusinessDetailsCard business={managerData.businessDetails} />}
          <TierDetailsCard tier={1} data={managerData.tier1} />
          <TierDetailsCard tier={2} data={managerData.tier2} />
          <TierDetailsCard tier={3} data={managerData.tier3} />
        </div>

        <ProfileModals
          modals={modals}
          setters={setters}
          selectedTransaction={selectedTransaction}
          onSuspend={handleSuspend}
          suspendTitle="Suspend Manager"
          suspendMessage="Are you sure you want to suspend this Aggregator Manager account?"
        />
        <UpdateCustomerProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={managerData}
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
          title="Aggregator Manager Commission Settings"
          subtitle="Override commission split for this aggregator manager. Unchanged entries will continue using defaults."
          onSave={(payload) => {
            updateProfileCommission.mutate(
              { ownerUserId: managerData._id, payload },
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

  // Aggregators View
  if (activeTab === 'aggregators') {
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
            user={managerData}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            availableTabs={managerProfileTabs}
            showActionsMenu={modals.showActionsMenu}
            onToggleActionsMenu={() => setters.setShowActionsMenu(!modals.showActionsMenu)}
            actions={managerActions}
          />
          <DashboardStats stats={managerStats} />
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-urbanist font-semibold text-[#1E1E1E]">Aggregators</h2>
            </div>
            <CardContent>
              <DataGrid
                rows={managerData.aggregators || []}
                columns={aggregatorColumnsWithActions}
                getRowId={(row) => row._id || row.id || row.userId || row.clientId}
                checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                sx={{
                  border: 0,
                  '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
                  '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' },
                }}
              />
            </CardContent>
          </Card>
        </div>

        {aggregatorDropdown.open && (
          <div
            className="fixed bg-white rounded-lg shadow-xl border border-qreva-ash w-56 py-1 z-50"
            style={{ top: aggregatorDropdown.y, left: aggregatorDropdown.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => navigate(`/aggregators/${aggregatorDropdown.row._id}`)} className="w-full text-left px-4 py-2.5 text-sm text-qreva-navy hover:bg-qreva-ash">
              View Profile Details
            </button>
            <button onClick={() => navigate(`/aggregators/${aggregatorDropdown.row._id}?tab=transactions`)} className="w-full text-left px-4 py-2.5 text-sm text-qreva-navy hover:bg-qreva-ash">
              View Transaction History
            </button>
          </div>
        )}
        <UpdateCustomerProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={managerData}
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
          title="Aggregator Manager Commission Settings"
          subtitle="Override commission split for this aggregator manager. Unchanged entries will continue using defaults."
          onSave={(payload) => {
            updateProfileCommission.mutate(
              { ownerUserId: managerData._id, payload },
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
            user={managerData}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            availableTabs={managerProfileTabs}
            showActionsMenu={modals.showActionsMenu}
            onToggleActionsMenu={() => setters.setShowActionsMenu(!modals.showActionsMenu)}
            actions={managerActions}
          />
          <DashboardStats stats={managerStats} />
          <AgentsTable agents={managerData.agents || []} onActionClick={handleAgentActionClick} />
        </div>

        <AgentDropdownMenu dropdown={agentDropdown} onClose={closeDropdown} />
        <UpdateCustomerProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={managerData}
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
          title="Aggregator Manager Commission Settings"
          subtitle="Override commission split for this aggregator manager. Unchanged entries will continue using defaults."
          onSave={(payload) => {
            updateProfileCommission.mutate(
              { ownerUserId: managerData._id, payload },
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

  // Merchants View
  if (activeTab === 'merchants') {
    const merchantColumnsWithActions = [
      ...merchantListColumns,
      {
        field: 'actions',
        headerName: '',
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <button
            className="text-[#084059] hover:text-[#1E1E1E]"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              handleAggregatorActionClick(params.row, rect);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        ),
      },
    ];

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
            user={managerData}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            availableTabs={managerProfileTabs}
            showActionsMenu={modals.showActionsMenu}
            onToggleActionsMenu={() => setters.setShowActionsMenu(!modals.showActionsMenu)}
            actions={managerActions}
          />
          <DashboardStats stats={managerStats} />
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-urbanist font-semibold text-[#1E1E1E]">Merchants</h2>
            </div>
            <CardContent>
              <DataGrid
                rows={managerData.merchants || []}
                columns={merchantColumnsWithActions}
                getRowId={(row) => row._id || row.id || row.userId || row.clientId}
                checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                sx={{
                  border: 0,
                  '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
                  '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' },
                }}
              />
            </CardContent>
          </Card>
        </div>

        {aggregatorDropdown.open && (
          <div
            className="fixed bg-white rounded-lg shadow-xl border border-qreva-ash w-56 py-1 z-50"
            style={{ top: aggregatorDropdown.y, left: aggregatorDropdown.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => navigate(`/users/${aggregatorDropdown.row._id}`)} className="w-full text-left px-4 py-2.5 text-sm text-qreva-navy hover:bg-qreva-ash">
              View Profile Details
            </button>
            <button onClick={() => navigate(`/users/${aggregatorDropdown.row._id}?tab=transactions`)} className="w-full text-left px-4 py-2.5 text-sm text-qreva-navy hover:bg-qreva-ash">
              View Transaction History
            </button>
          </div>
        )}
        <UpdateCustomerProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={managerData}
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
          title="Aggregator Manager Commission Settings"
          subtitle="Override commission split for this aggregator manager. Unchanged entries will continue using defaults."
          onSave={(payload) => {
            updateProfileCommission.mutate(
              { ownerUserId: managerData._id, payload },
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

  // Transaction History View (default)
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
          user={managerData}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          availableTabs={managerProfileTabs}
          showActionsMenu={modals.showActionsMenu}
          onToggleActionsMenu={() => setters.setShowActionsMenu(!modals.showActionsMenu)}
          actions={managerActions}
        />
        <DashboardStats stats={managerStats} />

        <TransactionChartsSection
          chartData={chartData}
          chartSeries={chartSeries}
        />

        <TransactionHistoryTable
          data={managerTransactions}
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
        suspendTitle="Suspend Manager"
        suspendMessage="Are you sure you want to suspend this Aggregator Manager account?"
      />
      <UpdateCustomerProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={managerData}
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
        title="Aggregator Manager Commission Settings"
        subtitle="Override commission split for this aggregator manager. Unchanged entries will continue using defaults."
        onSave={(payload) => {
          updateProfileCommission.mutate(
            { ownerUserId: managerData._id, payload },
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

export default AggregatorManagerProfileDetails;

