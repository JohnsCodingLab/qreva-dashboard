import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/base/DashboardStats";
import DataTable from "@/components/tables/DataTable";
import AggregatorManagerModals from "@/components/aggregatorManager/AggregatorManagerModals";
import { useAggregatorManagerModals } from "@/hooks/useAggregatorManagerModals";
import {
  aggregatorManagerColumns,
  createAggregatorManagerActions,
} from "./constants";
import {
  useUsers,
  useSuspendUser,
  useActivateUser,
  useInviteAggregator,
  useResolveAggregatorInvitee,
  useAggregatorNetwork,
  useResolveAggregatorNetworkCandidate,
  useAssignAggregatorNetworkMember,
  useRemoveAggregatorNetworkMember,
} from "@/store/features/users/useUsers";
import { formatUserStats } from "@/utils/formatUserStats";
import { useAuth } from "@/hooks/useAuth";
import ManageNetworkModal from "@/components/modals/ManageNetworkModal";
import { useTableControls } from "@/hooks/useTableControls";
import { SCOPED_USER_FILTER_GROUPS } from "@/constants/userFilters";

const AggregatorManagers = () => {
  const [timeFilter, setTimeFilter] = useState("Today");
  const [showManageNetworkModal, setShowManageNetworkModal] = useState(false);
  const [selectedNetworkOwner, setSelectedNetworkOwner] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const normalizedRole = (user?.role || "").toLowerCase();
  const canManageAggregatorManagers = normalizedRole !== "aggregator" && normalizedRole !== "aggregator_manager";

  const {
    params: tableParams,
    sortModel,
    handleSearch,
    handleFilter,
    handleSortChange,
    handlePageChange,
  } = useTableControls();

  const { data: usersResponse, isLoading } = useUsers({
    ...tableParams,
    // Last, so the page's own scope can never be overridden by a filter.
    type: "AggregatorManager",
  });

  const managers = usersResponse?.data || [];

  const { data: totalAggregatorManagersResponse } = useUsers({
    type: "AggregatorManager",
    limit: 1,
  });

  const { data: activeAggregatorManagersResponse } = useUsers({
    type: "AggregatorManager",
    status: "Active",
    limit: 1,
  });

  const metricsStats = useMemo(
    () =>
      formatUserStats(
        totalAggregatorManagersResponse,
        activeAggregatorManagersResponse,
        "Aggregator Managers",
      ),
    [totalAggregatorManagersResponse, activeAggregatorManagersResponse],
  );

  const { modals, setters, selectedManager, setSelectedManager } =
    useAggregatorManagerModals();

  const handleSuspendClick = useCallback(
    (manager) => {
      setSelectedManager(manager);
      setters.setShowSuspendModal(true);
    },
    [setSelectedManager, setters],
  );

  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();
  const inviteAggregatorMutation = useInviteAggregator();
  const resolveInviteeMutation = useResolveAggregatorInvitee();
  const resolveNetworkCandidateMutation = useResolveAggregatorNetworkCandidate();
  const assignNetworkMemberMutation = useAssignAggregatorNetworkMember();
  const removeNetworkMemberMutation = useRemoveAggregatorNetworkMember();
  const { data: networkResponse, isLoading: isLoadingNetwork } = useAggregatorNetwork(
    selectedNetworkOwner?._id,
    {
      page: 1,
      limit: 100,
    },
    {
      enabled: showManageNetworkModal && !!selectedNetworkOwner?._id,
    },
  );
  const handleConfirmSuspend = useCallback(() => {
    if (!selectedManager?._id) return;
    const isActive =
      selectedManager.status === "Active" ||
      selectedManager.status === "active";
    const mutation = isActive ? suspendUserMutation : activateUserMutation;
    mutation.mutate(selectedManager._id, {
      onSettled: () => {
        setters.setShowSuspendModal(false);
        setSelectedManager(null);
      },
    });
  }, [
    selectedManager,
    setters,
    setSelectedManager,
    suspendUserMutation,
    activateUserMutation,
  ]);

  const handleAddAggregator = useCallback(
    (aggregatorData) => {
      if (!canManageAggregatorManagers) return;
      inviteAggregatorMutation.mutate(
        {
          fullName: aggregatorData.fullName,
          email: aggregatorData.email,
          inviteType: 'aggregator_manager',
        },
        {
          onSuccess: async () => {
            setters.setShowAddAggregatorModal(false);
            setters.setShowAggregatorAddedModal(true);
          },
        },
      );
    },
    [setters, inviteAggregatorMutation, canManageAggregatorManagers],
  );

  const handleResolveInvitee = useCallback(async (email) => {
    if (!canManageAggregatorManagers) return null;
    const response = await resolveInviteeMutation.mutateAsync({
      email,
      inviteType: 'aggregator_manager',
    });
    return response?.data || null;
  }, [resolveInviteeMutation, canManageAggregatorManagers]);

  const openAddAggregatorModal = useCallback(() => {
    setters.setShowAddAggregatorModal(true);
  }, [setters]);

  const openManageNetworkModal = useCallback((owner) => {
    setSelectedNetworkOwner(owner);
    setShowManageNetworkModal(true);
  }, []);


  const aggregatorManagerColumnsWithStatus = useMemo(() => {
    return [
      ...aggregatorManagerColumns,
      {
        field: "userStatus",
        headerName: "Activity Status",
        width: 140,
        renderCell: (params) => {
          const { transactionCount, lastTransactionDate } = params.row;
          
          let statusStr = "";
          let colorClass = "";

          if (!transactionCount || transactionCount === 0) {
            statusStr = "Zero-Balance";
            colorClass = "border-gray-300 bg-gray-100 text-gray-700";
          } else {
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            
            const lastDate = lastTransactionDate ? new Date(lastTransactionDate) : null;
            if (!lastDate || lastDate < twoWeeksAgo) {
              statusStr = "Dormant";
              colorClass = "border-[#FFC535] bg-[#FFF8E6] text-[#B58202]";
            } else {
              statusStr = "Transacting";
              colorClass = "border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]";
            }
          }

          return (
            <span className={`px-2 py-1.5 text-center border ${colorClass} font-general font-medium text-xs rounded-md flex items-center justify-center h-full`}>
              {statusStr}
            </span>
          );
        }
      }
    ];
  }, []);

  const tableActions = useMemo(
    () =>
      createAggregatorManagerActions(
        navigate,
        canManageAggregatorManagers ? handleSuspendClick : undefined,
        canManageAggregatorManagers ? openManageNetworkModal : undefined,
      ),
    [navigate, handleSuspendClick, canManageAggregatorManagers, openManageNetworkModal],
  );

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Aggregator Manager"
          subtitle="Here is the full list of aggregators on the platform"
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          actionButton={canManageAggregatorManagers ? (
            <div className="flex items-center gap-2">
              <button
                onClick={openAddAggregatorModal}
                className="px-6 py-2.5 bg-[#FF5B04] text-white rounded-lg text-sm font-medium hover:bg-[#E54F03] transition-colors"
              >
                Add Aggregator Manager
              </button>
            </div>
          ) : null}
        />

        <DashboardStats stats={metricsStats} route="aggregator-managers" />

        <DataTable
          className="font-general"
          data={managers}
          columns={aggregatorManagerColumnsWithStatus}
          title="Aggregator Managers Overview"
          actions={tableActions}
          onSearch={handleSearch}
          onFilter={handleFilter}
          showFilter={true}
          filterGroups={SCOPED_USER_FILTER_GROUPS}
          sortModel={sortModel}
          onSortChange={handleSortChange}
          loading={isLoading}
          pagination={usersResponse?.pagination || {}}
          onPageChange={handlePageChange}
        />
      </div>

      <AggregatorManagerModals
        modals={modals}
        setters={setters}
        selectedManager={selectedManager}
        onAddAggregator={handleAddAggregator}
        onResolveInvitee={handleResolveInvitee}
        isResolvingInvitee={resolveInviteeMutation.isPending}
        isSubmittingInvite={inviteAggregatorMutation.isPending}
        onSuspendManager={handleConfirmSuspend}
      />

      <ManageNetworkModal
        isOpen={showManageNetworkModal}
        onClose={() => setShowManageNetworkModal(false)}
        owner={selectedNetworkOwner}
        networkResponse={networkResponse}
        isLoadingNetwork={isLoadingNetwork}
        onResolveCandidate={(ownerUserId, email) =>
          resolveNetworkCandidateMutation.mutateAsync({ ownerUserId, email })
        }
        isResolvingCandidate={resolveNetworkCandidateMutation.isPending}
        onAssign={(ownerUserId, email) =>
          assignNetworkMemberMutation.mutate({ ownerUserId, payload: { email } })
        }
        isAssigning={assignNetworkMemberMutation.isPending}
        onRemove={(ownerUserId, memberUserId) => {
          removeNetworkMemberMutation.mutate({ ownerUserId, memberUserId });
        }}
        isRemoving={removeNetworkMemberMutation.isPending}
      />
    </div>
  );
};

export default AggregatorManagers;

