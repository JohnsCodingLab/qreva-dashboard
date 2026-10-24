import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/base/DashboardStats";
import DataTable from "@/components/tables/DataTable";
import ManagerModals from "@/components/modals/ManagerModals";
import { useManagerModals } from "@/hooks/useManagerModals";
import {
  regionalManagerColumns,
  createManagerActions,
} from "./constants";
import {
  useAdminUsers,
  useInviteAdmin,
  useUpdateAdminStatus,
  useResendAdminInvite
} from "@/store/features/admin/useAdminUsers";
import { formatUserStats } from "@/utils/formatUserStats";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { handleError } from "@/store/utils/handleError";

const RegionalManagers = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const { user } = useAuth();
  const normalizedRole = (user?.role || "").toLowerCase();
  
  // Super Admins can manage Regional Managers
  const canManageManagers = normalizedRole === "superadmin" || normalizedRole === "super_admin";

  const { data: usersResponse, isLoading } = useAdminUsers({
    role: "RegionalManager",
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchQuery || undefined,
  });

  const managers = usersResponse?.data || [];

  const { data: totalManagersResponse } = useAdminUsers({
    role: "RegionalManager",
    limit: 1,
  });

  const { data: activeManagersResponse } = useAdminUsers({
    role: "RegionalManager",
    status: "Active",
    limit: 1,
  });

  const metricsStats = useMemo(
    () =>
      formatUserStats(
        totalManagersResponse,
        activeManagersResponse,
        "Regional Managers",
      ),
    [totalManagersResponse, activeManagersResponse],
  );

  const { modals, setters, selectedManager, setSelectedManager } = useManagerModals();

  const handleSuspendClick = useCallback(
    (manager) => {
      setSelectedManager(manager);
      setters.setShowSuspendModal(true);
    },
    [setSelectedManager, setters],
  );

  const updateStatusMutation = useUpdateAdminStatus();
  const inviteAdminMutation = useInviteAdmin();
  const resendInviteMutation = useResendAdminInvite();

  const handleConfirmSuspend = useCallback(() => {
    if (!selectedManager?._id) return;
    const isActive = selectedManager.status === "Active" || selectedManager.status === "active";
    
    updateStatusMutation.mutate({ adminId: selectedManager._id, status: isActive ? "Inactive" : "Active" }, {
      onSettled: () => {
        setters.setShowSuspendModal(false);
        setSelectedManager(null);
      },
    });
  }, [
    selectedManager,
    setters,
    setSelectedManager,
    updateStatusMutation,
  ]);

  const handleAddManager = useCallback(
    (managerData) => {
      if (!canManageManagers) return;
      inviteAdminMutation.mutate(managerData, {
        onSuccess: async () => {
          setters.setShowAddModal(false);
          setters.setShowSuccessModal(true);
        },
        onError: (err) => {
          handleError(err, "Failed to invite manager");
        }
      });
    },
    [setters, inviteAdminMutation, canManageManagers],
  );

  const handleResendInvite = useCallback((row) => {
    if (!canManageManagers || !row?._id) return;
    resendInviteMutation.mutate(row._id, {
      onSuccess: () => {
        toast.success("Invite resent successfully.");
      },
      onError: (err) => {
        handleError(err, "Failed to resend invite.");
      }
    });
  }, [resendInviteMutation, canManageManagers]);

  const openAddModal = useCallback(() => {
    setters.setShowAddModal(true);
  }, [setters]);

  const handleViewProfileClick = useCallback(
    (manager) => {
      navigate('/regional-manager/' + manager._id, { state: { manager } });
    },
    [navigate],
  );


  const regionalManagerColumnsWithStatus = useMemo(() => {
    return [
      ...regionalManagerColumns,
      {
        field: "activityStatus",
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
      createManagerActions(
        handleViewProfileClick,
        canManageManagers ? handleSuspendClick : undefined,
        canManageManagers ? handleResendInvite : undefined
      ),
    [handleViewProfileClick, handleSuspendClick, handleResendInvite, canManageManagers],
  );

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Regional Managers"
          subtitle="Here is the full list of regional managers on the platform"
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          actionButton={canManageManagers ? (
            <div className="flex items-center gap-2">
              <button
                onClick={openAddModal}
                className="px-6 py-2.5 bg-qreva-orange text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
              >
                Add Regional Manager
              </button>
            </div>
          ) : null}
        />

        <DashboardStats stats={metricsStats} route="regional-managers" />

        <DataTable
          className="font-general"
          data={managers}
          columns={regionalManagerColumnsWithStatus}
          title="Regional Managers Overview"
          actions={tableActions}
          onSearch={setSearchQuery}
          onFilter={() => console.log("Filter clicked")}
          loading={isLoading}
          paginationMode="server"
          rowCount={usersResponse?.pagination?.total || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      <ManagerModals
        modals={modals}
        setters={setters}
        selectedManager={selectedManager}
        onAddManager={handleAddManager}
        isSubmittingInvite={inviteAdminMutation.isPending}
        onSuspendManager={handleConfirmSuspend}
        roleLabel="Regional Manager"
        roleType="RegionalManager"
      />
    </div>
  );
};

export default RegionalManagers;

