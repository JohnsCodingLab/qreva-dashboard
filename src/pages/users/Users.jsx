import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import DashboardStats from '@/components/base/DashboardStats';
import DataTable from '@/components/tables/DataTable';
import UserModals from '@/components/user/UserModal';
import { useUserModals } from '@/hooks/useUserModals';
import { useUsers, useUserMetrics, useSuspendUser, useActivateUser } from '@/store/features/users/useUsers';
import { userStats, userColumns, createUserActions } from './constants';

const Users = () => {
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();
  
  const { modals, setters, selectedUser, setSelectedUser } = useUserModals();

  // Fetch user metrics
  const { data: metricsData } = useUserMetrics();

  // Fetch users with pagination and search
  const {
    data: usersData,
    isLoading: isLoadingUsers
  } = useUsers({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchQuery || undefined,
  });

  const users = usersData?.data || [];

  // Map metrics data to stats format
  const stats = useMemo(() => {
    if (!metricsData?.data) return userStats;

    const d = metricsData.data;

    return [
      { label: 'Total Users', value: (d.users || 0).toLocaleString(), change: d.usersChange || '+0%', subtext: 'in last 24 hours' },
      { label: 'Personal Accounts', value: (d.personalAccounts || 0).toLocaleString(), change: d.personalAccountsChange || '+0%', subtext: 'in last 24 hours' },
      { label: 'Business Accounts', value: (d.businessAccounts || 0).toLocaleString(), change: d.businessAccountsChange || '+0%', subtext: 'in last 24 hours' },
      { label: 'Total Agents', value: (d.agents || 0).toLocaleString(), change: d.agentsChange || '+0%', subtext: 'in last 24 hours' },
      { label: 'Total Aggregators', value: (d.aggregators || 0).toLocaleString(), change: d.aggregatorsChange || '+0%', subtext: 'in last 24 hours' },
      { label: 'Total Aggregator Managers', value: (d.aggregatorManagers || 0).toLocaleString(), change: d.aggregatorManagersChange || '+0%', subtext: 'in last 24 hours' },
      { label: 'Merchants', value: (d.merchants || 0).toLocaleString(), change: d.merchantsChange || '+0%', subtext: 'in last 24 hours' },
    ];
  }, [metricsData]);

  const handleSuspendClick = useCallback((user) => {
    setSelectedUser(user);
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


  const userColumnsWithStatus = useMemo(() => {
    return [
      ...userColumns,
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
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            
            const lastDate = lastTransactionDate ? new Date(lastTransactionDate) : null;
            if (!lastDate || lastDate < threeMonthsAgo) {
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
    [navigate, handleSuspendClick]
  );

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
          title="Users"
          subtitle="Here is the full list of users on the platform"
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />

        <DashboardStats stats={stats} />

        <DataTable
          className="font-general"
          data={users}
          columns={userColumnsWithStatus}
          title="Users Overview"
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

export default Users;