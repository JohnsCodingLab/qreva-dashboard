import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import DataTable from '@/components/tables/DataTable';
import UserModals from '@/components/user/UserModal';
import { useUserModals } from '@/hooks/useUserModals';
import { useUsers, useUserMetrics, useSuspendUser, useActivateUser } from '@/store/features/users/useUsers';
import { userColumns, createUserActions } from '@/pages/users/constants';

const Merchants = () => {
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();
  const { modals, setters, selectedUser, setSelectedUser } = useUserModals();

  const { data: metricsData } = useUserMetrics();
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    type: 'Merchant',
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchQuery || undefined,
  });

  const merchants = usersData?.data || [];

  const stats = useMemo(() => {
    const d = metricsData?.data;
    return [
      {
        label: 'Total Merchants',
        value: ((d?.merchants || 0)).toLocaleString(),
        change: d?.merchantsChange || '+0%',
        subtext: 'in last 24 hours',
      },
    ];
  }, [metricsData]);

  const handleSuspendClick = useCallback((selectedMerchant) => {
    setSelectedUser(selectedMerchant);
    setters.setShowSuspendModal(true);
  }, [setSelectedUser, setters]);

  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();

  const handleConfirmSuspend = useCallback(() => {
    if (!selectedUser?._id) return;
    const isActive = selectedUser.status === 'Active' || selectedUser.status === 'active';
    const mutation = isActive ? suspendUserMutation : activateUserMutation;
    mutation.mutate(selectedUser._id, {
      onSettled: () => {
        setters.setShowSuspendModal(false);
        setSelectedUser(null);
      },
    });
  }, [selectedUser, setters, setSelectedUser, suspendUserMutation, activateUserMutation]);


  const merchantColumns = useMemo(() => {
    return [
      ...userColumns,
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
    () => createUserActions(navigate, handleSuspendClick),
    [navigate, handleSuspendClick],
  );

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Merchants"
          subtitle="Here is the full list of merchants on the platform"
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />

        <DashboardStats stats={stats} />

        <DataTable
          className="font-general"
          data={merchants}
          columns={merchantColumns}
          title="Merchants Overview"
          actions={tableActions}
          loading={isLoadingUsers}
          paginationMode="server"
          rowCount={usersData?.pagination?.total || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onSearch={setSearchQuery}
          onFilter={() => console.log('Filter clicked')}
        />
      </div>

      <UserModals
        modals={modals}
        setters={setters}
        selectedUser={selectedUser}
        onSuspendUser={handleConfirmSuspend}
      />
    </div>
  );
};

export default Merchants;
