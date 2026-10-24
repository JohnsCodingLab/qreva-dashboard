import { useNavigate } from 'react-router-dom';
import TopTransactionValueCard from '@/components/cards/TopTransactionValueCard';
import TopCustomersCard from '@/components/cards/TopCustomersCard';
import TransactionVolumeChart from '@/components/charts/TransactionVolumeChart';
import TransactionPercentagePie from '@/components/charts/TransactionPercentagePie';
import RegionsTable from '@/components/tables/RegionsTable';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import {
  TRANSACTION_TYPE_FILTER_GROUP,
  TRANSACTION_STATUS_FILTER_GROUP,
  DATE_RANGE_FILTER_GROUP,
} from '@/constants/transactionFilters';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import DashboardStats from '@/components/base/DashboardStats';
import SuperAdminKpiSection from '@/components/dashboard/superAdmin/SuperAdminKpiSection';

import SuperAdminTrendsChart from "./superAdmin/SuperAdminTrendsChart";
import SuperAdminOnboardingsChart from "./superAdmin/SuperAdminOnboardingsChart";
import SuperAdminAverageTransactionChart from "./superAdmin/SuperAdminAverageTransactionChart";
import SuperAdminServiceCharts from "./superAdmin/SuperAdminServiceCharts";
import SuperAdminStatusAndGrowth from "./superAdmin/SuperAdminStatusAndGrowth";
import TopMerchantsRevenueTable from "./superAdmin/TopMerchantsRevenueTable";
import RegionalManagerPerformance from "./superAdmin/RegionalManagerPerformance";
import StateManagerPerformance from "./superAdmin/StateManagerPerformance";
import AggregatorManagerPerformance from "./superAdmin/AggregatorManagerPerformance";
import AggregatorPerformance from "./superAdmin/AggregatorPerformance";
import MerchantRevenuePerformance from "./superAdmin/MerchantRevenuePerformance";
import AgentPerformance from "./superAdmin/AgentPerformance";
import PersonalAccountPerformance from "./superAdmin/PersonalAccountPerformance";
import InactiveNetworkMembers from "./superAdmin/InactiveNetworkMembers";
import RecentOnboardings from "./superAdmin/RecentOnboardings";




const AdminDashboard = ({
  formattedStats,
  metrics,
  transactions,
  pagination,
  timeFilter,
  transactionActions,
  handlePageChange,
  handleSearch,
  handleFilter,
  sortModel,
  handleSortChange,
  showDetailsModal,
  setShowDetailsModal,
  showShareModal,
  setShowShareModal,
  selectedTransaction,
  isTransactionsLoading
}) => {
  const navigate = useNavigate();

  const handleViewRegionDetails = (regionId) => {
    navigate(`/dashboard/details/region/${regionId}`);
  };

  return (
    <>
      {metrics?.superAdminKpis ? <SuperAdminKpiSection kpis={metrics.superAdminKpis} /> : <DashboardStats stats={formattedStats} route="dashboard" />}


      {metrics?.superAdminKpis ? (
        <div className="flex flex-col gap-4 mb-6">
          <SuperAdminTrendsChart data={metrics?.trendData || []} />
          <SuperAdminOnboardingsChart data={metrics?.dailyOnboardings || []} />
          <SuperAdminAverageTransactionChart data={metrics?.trendData || []} />
          <SuperAdminServiceCharts data={metrics?.serviceBreakdown || []} />
          <SuperAdminStatusAndGrowth statusData={metrics?.statusBreakdown || []} userData={metrics?.userTypeBreakdown || []} />
          {/* <TopMerchantsRevenueTable data={metrics?.topMerchantsRevenue || []} /> */}
          <RegionalManagerPerformance data={metrics?.regionalManagers || []} />
          <StateManagerPerformance data={metrics?.stateManagers || []} />
          <AggregatorManagerPerformance data={metrics?.aggregatorManagers || []} />
          <AggregatorPerformance data={metrics?.aggregators || []} />
          <MerchantRevenuePerformance data={metrics?.merchantRevenues || []} />
          <AgentPerformance data={metrics?.agentRevenues || []} />
          <PersonalAccountPerformance data={metrics?.personalRevenues || []} />
          <InactiveNetworkMembers data={metrics?.inactiveMembers || []} />
          <RecentOnboardings data={metrics?.recentOnboardings || []} />
        </div>
      ) : (
        <>
          {/* Top Transaction Value + Top Performing Agents */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TopTransactionValueCard data={metrics.topTransactionValues} />
            </div>
            <div className="lg:col-span-3">
              <TopCustomersCard data={metrics.topCustomers} agentsData={metrics.topAgents} />
            </div>
          </div>

          {/* Top % Purchase from Customers */}
          <div className="mb-1">
            <TransactionPercentagePie data={metrics.topPurchasePercentages} title="Top % Purchase from Customers" />
          </div>

          {/* Daily Transaction Value */}
          <TransactionVolumeChart data={metrics?.dailyTransactionVolume || []} timeFilter={timeFilter} />
        </>
      )}

      {/* Transaction History */}
      <TransactionHistoryTable
        data={transactions}
        actions={transactionActions}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        sortModel={sortModel}
        onSortChange={handleSortChange}
        filterGroups={[
          TRANSACTION_STATUS_FILTER_GROUP,
          TRANSACTION_TYPE_FILTER_GROUP,
          DATE_RANGE_FILTER_GROUP,
        ]}
        isLoading={isTransactionsLoading}
      />

      <TransactionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        transaction={selectedTransaction}
      />

      <ShareReceiptModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default AdminDashboard;