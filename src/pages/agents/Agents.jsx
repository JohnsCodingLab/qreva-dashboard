import { useState, useMemo, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/base/DashboardStats";
import DataTable from "@/components/tables/DataTable";
import AgentModals from "@/components/agents/AgentsModals";
import { useAgentModals } from "@/hooks/useAgentModals";
import { agentColumns, createAgentActions } from "./constants";
import {
  useUsers,
  useUserMetrics,
  useSuspendUser,
  useActivateUser,
} from "@/store/features/users/useUsers";
import { formatUserStats } from "@/utils/formatUserStats";
import { buildPortalNetworkStats, mapTimeFilterToRange } from "@/utils/formatPortalNetworkStats";
import { useAuth } from "@/hooks/useAuth";
import { useTableControls } from "@/hooks/useTableControls";
import { SCOPED_USER_FILTER_GROUPS } from "@/constants/userFilters";

const Agents = () => {
  const [timeFilter, setTimeFilter] = useState("Today");
  const navigate = useNavigate();

  const {
    params: tableParams,
    sortModel,
    handleSearch,
    handleFilter,
    handleSortChange,
    handlePageChange,
  } = useTableControls();

  const { user } = useAuth();
  const normalizedRole = String(user?.role || "").toLowerCase();
  const isPortalAggregator = normalizedRole === "aggregator";
  const isPortalAggregatorManager = normalizedRole === "aggregator_manager";
  const isPortalUpline = isPortalAggregator || isPortalAggregatorManager;
  const metricsRange = mapTimeFilterToRange(timeFilter);

  const { data: usersResponse, isLoading } = useUsers({
    ...tableParams,
    // Last, so the page's own scope can never be overridden by a filter.
    type: "Agent",
  });

  const agents = usersResponse?.data || [];

  const { data: activeAgentsResponse } = useUsers({
    type: "Agent",
    status: "Active",
    limit: 1,
  });

  const { data: userMetricsResponse } = useUserMetrics(
    isPortalUpline ? { range: metricsRange } : {},
  );

  const metricsStats = useMemo(
    () =>
      isPortalUpline
        ? buildPortalNetworkStats(userMetricsResponse?.data, normalizedRole)
        : formatUserStats(usersResponse, activeAgentsResponse, "Agents"),
    [usersResponse, activeAgentsResponse, isPortalUpline, userMetricsResponse, normalizedRole],
  );

  const { modals, setters, selectedAgent, setSelectedAgent } = useAgentModals();

  const handleSuspendClick = useCallback(
    (agent) => {
      setSelectedAgent(agent);
      setters.setShowSuspendModal(true);
    },
    [setSelectedAgent, setters],
  );

  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();

  const handleConfirmSuspend = useCallback(() => {
    if (!selectedAgent?._id) return;
    const isActive =
      selectedAgent.status === "Active" || selectedAgent.status === "active";
    const mutation = isActive ? suspendUserMutation : activateUserMutation;
    mutation.mutate(selectedAgent._id, {
      onSettled: () => {
        setters.setShowSuspendModal(false);
        setSelectedAgent(null);
      },
    });
  }, [
    selectedAgent,
    setters,
    setSelectedAgent,
    suspendUserMutation,
    activateUserMutation,
  ]);

  const handleAddAgent = useCallback(
    (agentData) => {
      console.log("Add agent:", agentData);
      setters.setShowAddAgentModal(false);
      setters.setShowAgentAddedModal(true);
    },
    [setters],
  );


  const agentColumnsWithStatus = useMemo(() => {
    return [
      ...agentColumns,
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
    () => createAgentActions(navigate, handleSuspendClick),
    [navigate, handleSuspendClick],
  );

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Agents"
          subtitle={
            isPortalAggregator
              ? "Here are the agents under your network"
              : isPortalAggregatorManager
                ? "Here are the agents within your aggregator network"
                : "Here is the full list of agents on the platform"
          }
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          // actionButton={
          //   <button
          //     onClick={() => setters.setShowAddAgentModal(true)}
          //     className="px-6 py-2.5 bg-[#FF5B04] text-white rounded-lg text-sm font-medium hover:bg-[#E54F03] transition-colors"
          //   >
          //     Add Agent
          //   </button>
          // }
        />

        <DashboardStats stats={metricsStats} route="agents" />

        <DataTable
          className="font-general"
          data={agents}
          columns={agentColumnsWithStatus}
          title="Agents Overview"
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

      <AgentModals
        modals={modals}
        setters={setters}
        selectedAgent={selectedAgent}
        onAddAgent={handleAddAgent}
        onSuspendAgent={handleConfirmSuspend}
      />
    </div>
  );
};

export default Agents;

