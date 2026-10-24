import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useProfileModals } from '@/hooks/useProfileModals';
import { useTransactionSearch } from '@/hooks/useTransactionSearch';
import {
  useUserById,
  useUserTransactions,
  useSuspendUser,
  useActivateUser,
  useRetryUserAccountCreation,
  useUpdateUserProfile,
} from '@/store/features/users/useUsers';
import { useAssignRole } from '@/store/features/settings/useRbac';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileDetailsView from '@/components/profile/ProfileDetailsView';
import TransactionView from '@/components/profile/TransactionView';
import ProfileModals from '@/components/profile/ProfileModals';
import LoadingState from '@/components/common/LoadingState';
import UpdateCustomerProfileModal from '@/components/modals/UpdateCustomerProfileModal';
import {
  createUserActions,
  getAvailableTabs,
  tabConfig
} from '@/utils/profileUtils';

const UserProfileDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const currentTab = tabConfig[activeTab] || tabConfig.transactions;

  const { data: userResponse, isLoading: loading } = useUserById(id, 'users');
  const userData = userResponse?.data;
  const { data: txResponse } = useUserTransactions(id, 'users');
  const userTransactions = txResponse?.data || [];

  // Both POS tabs behave identically: show only that channel's transactions,
  // narrowed to one terminal when the picker is used.
  const posType =
    activeTab === 'physicalPos' ? 'physical' : activeTab === 'softpos' ? 'softpos' : null;

  const [selectedTerminal, setSelectedTerminal] = useState('');

  // Clear the picker when moving between tabs, otherwise a terminal chosen on
  // one tab keeps filtering the other, where its id does not exist — which
  // reads as "this terminal has no transactions" rather than a stale filter.
  useEffect(() => {
    setSelectedTerminal('');
  }, [activeTab]);

  // Physical terminals come back as documents; SoftPOS terminals are bare ids,
  // since a SoftPOS terminal is only ever known by what its transactions
  // reported. Normalised here so the picker renders one shape.
  const terminalOptions = useMemo(() => {
    if (posType === 'physical') {
      return (userData?.physicalTerminals || []).map((term) => ({
        value: term.terminalId,
        label: `${term.terminalId}${term.serialNumber ? ` (SN: ${term.serialNumber})` : ''} - ${term.status || 'Active'}`,
        key: term.terminalId || term._id,
      }));
    }
    if (posType === 'softpos') {
      return (userData?.softposTerminals || []).map((terminalId) => ({
        value: terminalId,
        label: terminalId,
        key: terminalId,
      }));
    }
    return [];
  }, [posType, userData]);

  const { data: posTxResponse } = useUserTransactions(
    id,
    'users',
    posType
      ? {
          posType,
          ...(selectedTerminal ? { terminalId: selectedTerminal } : {}),
        }
      : {},
  );
  const posTransactions = posTxResponse?.data || [];

  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();
  const retryAccountCreationMutation = useRetryUserAccountCreation();
  const updateUserProfileMutation = useUpdateUserProfile();
  const assignRoleMutation = useAssignRole();

  const data = posType
    ? posTransactions
    : userData?.[currentTab.dataKey] || userTransactions;

  const { searchQuery, setSearchQuery, filteredTransactions } =
    useTransactionSearch(data);

  const {
    modals,
    setters,
    selectedTransaction,
    promotionType,
    setPromotionType
  } = useProfileModals();

  const handleSuspend = () => {
    if (!userData?._id) return;
    const isActive = userData.status === 'Active' || userData.status === 'active';
    const mutation = isActive ? suspendUserMutation : activateUserMutation;
    mutation.mutate(userData._id, {
      onSettled: () => setters.setShowSuspendModal(false),
    });
  };

  const handleAssignRole = (roleId) => {
    if (!userData?._id) return;
    assignRoleMutation.mutate(
      { userId: userData._id, roleId },
      { onSettled: () => setters.setShowAssignRoleModal(false) }
    );
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleRetryAccountCreation = () => {
    if (!userData?._id) return;
    retryAccountCreationMutation.mutate({ userId: userData._id, userType: 'users' });
  };

  const handleUpdateProfile = (payload) => {
    if (!userData?._id) return;
    updateUserProfileMutation.mutate(
      { userId: userData._id, userType: 'users', payload },
      { onSuccess: () => setShowEditProfileModal(false) },
    );
  };


  const userActions = createUserActions(
    userData,
    setters.setShowSuspendModal,
    setters.setShowPromoteModal,
    setPromotionType,
    setters.setShowActionsMenu,
    setters.setShowAssignRoleModal
  );
  userActions.unshift({
    label: 'Edit Details',
    onClick: () => {
      setters.setShowActionsMenu(false);
      setShowEditProfileModal(true);
    },
  });

  if (loading) return <LoadingState />;
  if (!userData) return <LoadingState message="User not found" />;

  return (
    <ProfileLayout
      userData={userData}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      availableTabs={getAvailableTabs(userData.type || userData.accountType)}
      actions={userActions}
    >
      {activeTab === 'profile' ? (
        <ProfileDetailsView
          userData={userData}
          userType="users"
          showBusinessDetails={userData.type !== 'Individual' && userData.accountType !== 'Personal Account'}
          onRetryAccountCreation={handleRetryAccountCreation}
          isRetryingAccountCreation={retryAccountCreationMutation.isPending}
          canRetryAccountCreation
        />
      ) : (
        <TransactionView
          title={currentTab.title}
          transactions={filteredTransactions}
          columns={currentTab.columns}
          setSearchQuery={setSearchQuery}
        >
          {posType && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  {posType === 'physical' ? 'Physical Terminal:' : 'SoftPOS Terminal:'}
                </span>
                <select
                  value={selectedTerminal}
                  onChange={(e) => setSelectedTerminal(e.target.value)}
                  disabled={terminalOptions.length === 0}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {terminalOptions.length === 0
                      ? `No ${posType === 'physical' ? 'physical' : 'SoftPOS'} terminals`
                      : `All ${posType === 'physical' ? 'Physical' : 'SoftPOS'} Terminals`}
                  </option>
                  {terminalOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {posType === 'physical' ? 'Total Assigned Terminals: ' : 'Terminals Seen: '}
                <span className="font-semibold text-slate-800">{terminalOptions.length}</span>
              </div>
            </div>
          )}
        </TransactionView>
      )}

      <ProfileModals
        modals={modals}
        setters={setters}
        selectedTransaction={selectedTransaction}
        promotionType={promotionType}
        onSuspend={handleSuspend}
        onAssignRole={handleAssignRole}
        currentRoleId={userData?.roleId || userData?.role?._id || userData?.role?.id}
        isAssigningRole={assignRoleMutation.isPending}
      />
      <UpdateCustomerProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={userData}
        onSubmit={handleUpdateProfile}
        isSaving={updateUserProfileMutation.isPending}
      />
    </ProfileLayout>
  );
};

export default UserProfileDetails;

