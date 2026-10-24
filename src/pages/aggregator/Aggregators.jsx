import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/tables/DataTable";
import AggregatorModals from "@/components/aggregators/AggregatorModals";
import { useAggregatorModals } from "@/hooks/useAggregatorModals";
import { aggregatorColumns, createAggregatorActions } from "./constants";
import DashboardStats from "@/components/base/DashboardStats";
import {
  useUsers,
  useUserMetrics,
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
import { buildPortalNetworkStats, mapTimeFilterToRange } from "@/utils/formatPortalNetworkStats";
import { useTableControls } from "@/hooks/useTableControls";
import { SCOPED_USER_FILTER_GROUPS } from "@/constants/userFilters";

const Aggregators = () => {
  const [timeFilter, setTimeFilter] = useState("Today");
  const [showManageNetworkModal, setShowManageNetworkModal] = useState(false);
  const [selectedNetworkOwner, setSelectedNetworkOwner] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const normalizedRole = (user?.role || "").toLowerCase();
  const canManageAggregators = normalizedRole !== "aggregator" && normalizedRole !== "aggregator_manager";
  const isPortalAggregatorManager = normalizedRole === "aggregator_manager";
  const metricsRange = mapTimeFilterToRange(timeFilter);

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
    type: "Aggregator",
  });

  const aggregators = usersResponse?.data || [];

  const { data: totalAggregatorsResponse } = useUsers({
    type: "Aggregator",
    limit: 1,
  });

  const { data: activeAggregatorsResponse } = useUsers({
    type: "Aggregator",
    status: "Active",
    limit: 1,
  });

  const { data: userMetricsResponse } = useUserMetrics(
    isPortalAggregatorManager ? { range: metricsRange } : {},
  );

  const metricsStats = useMemo(
    () =>
      isPortalAggregatorManager
        ? buildPortalNetworkStats(userMetricsResponse?.data, normalizedRole)
        : formatUserStats(totalAggregatorsResponse, activeAggregatorsResponse, "Aggregators"),
    [
      totalAggregatorsResponse,
      activeAggregatorsResponse,
      isPortalAggregatorManager,
      userMetricsResponse,
      normalizedRole,
    ],
  );

  const { modals, setters, selectedAggregator, setSelectedAggregator } =
    useAggregatorModals();

  const handleSuspendClick = useCallback(
    (aggregator) => {
      setSelectedAggregator(aggregator);
      setters.setShowSuspendModal(true);
    },
    [setSelectedAggregator, setters],
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
    if (!selectedAggregator?._id) return;
    const isActive =
      selectedAggregator.status === "Active" ||
      selectedAggregator.status === "active";
    const mutation = isActive ? suspendUserMutation : activateUserMutation;
    mutation.mutate(selectedAggregator._id, {
      onSettled: () => {
        setters.setShowSuspendModal(false);
        setSelectedAggregator(null);
      },
    });
  }, [
    selectedAggregator,
    setters,
    setSelectedAggregator,
    suspendUserMutation,
    activateUserMutation,
  ]);

  const handleAddAggregator = useCallback(
    (aggregatorData) => {
      if (!canManageAggregators) return;
      inviteAggregatorMutation.mutate(
        {
          fullName: aggregatorData.fullName,
          email: aggregatorData.email,
          inviteType: 'aggregator',
        },
        {
          onSuccess: async () => {
            setters.setShowAddAggregatorModal(false);
            setters.setShowAggregatorAddedModal(true);
          },
        },
      );
    },
    [setters, inviteAggregatorMutation, canManageAggregators],
  );

  const handleResolveInvitee = useCallback(async (email) => {
    if (!canManageAggregators) return null;
    const response = await resolveInviteeMutation.mutateAsync({
      email,
      inviteType: 'aggregator',
    });
    return response?.data || null;
  }, [resolveInviteeMutation, canManageAggregators]);

  const openAddAggregatorModal = useCallback(() => {
    setters.setShowAddAggregatorModal(true);
  }, [setters]);

  const openManageNetworkModal = useCallback((owner) => {
    setSelectedNetworkOwner(owner);
    setShowManageNetworkModal(true);
  }, []);


  const aggregatorColumnsWithStatus = useMemo(() => {
    return [
      ...aggregatorColumns,
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
      createAggregatorActions(
        navigate,
        canManageAggregators ? handleSuspendClick : undefined,
        canManageAggregators ? openManageNetworkModal : undefined,
      ),
    [navigate, handleSuspendClick, canManageAggregators, openManageNetworkModal],
  );

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Aggregators"
          subtitle={
            isPortalAggregatorManager
              ? "Here are the aggregators within your network"
              : "Here is the full list of aggregators on the platform"
          }
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          actionButton={canManageAggregators ? (
            <div className="flex items-center gap-2">
              <button
                onClick={openAddAggregatorModal}
                className="px-6 py-2.5 bg-[#FF5B04] text-white rounded-lg text-sm font-medium hover:bg-[#E54F03] transition-colors"
              >
                Add Aggregator
              </button>
            </div>
          ) : null}
        />

        <DashboardStats stats={metricsStats} route="aggregators" />

        <DataTable
          data={aggregators}
          columns={aggregatorColumnsWithStatus}
          title="Aggregators Overview"
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

      <AggregatorModals
        modals={modals}
        setters={setters}
        selectedAggregator={selectedAggregator}
        onAddAggregator={handleAddAggregator}
        onResolveInvitee={handleResolveInvitee}
        isResolvingInvitee={resolveInviteeMutation.isPending}
        isSubmittingInvite={inviteAggregatorMutation.isPending}
        onSuspendAggregator={handleConfirmSuspend}
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
          assignNetworkMemberMutation.mutate(
            { ownerUserId, payload: { email } },
            {
              onSuccess: () => {
                setShowManageNetworkModal(true);
              },
            },
          )
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

export default Aggregators;

