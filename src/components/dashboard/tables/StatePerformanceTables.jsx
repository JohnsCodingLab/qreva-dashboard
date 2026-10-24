import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';

const TAB_MAPPINGS = [
  { id: 'top-agg-managers', label: 'Top Aggregator Managers' },
  { id: 'agg-manager-perf', label: 'Aggregator Manager Performance' },
  { id: 'top-aggs', label: 'Top Aggregators' },
  { id: 'merchant-revenue', label: 'Merchant Revenue' },
  { id: 'pos-perf', label: 'POS Performance' },
  { id: 'lowest-perf', label: 'Lowest Performing' },
  { id: 'recent-onboards', label: 'Recent Onboardings' },
  { id: 'state-perf-summary', label: 'State Performance Summary' },
  { id: 'inactive-members', label: 'Inactive Members' },
];

const MOCK_DATA = {
  'top-agg-managers': [
    { id: 1, rank: 1, name: 'Emeka Obi', aggregators: 5, agents: 120, merchants: 45, txns: 42000, revenue: '₦1.2M', pos: 15, posAchieved: '150%' },
    { id: 2, rank: 2, name: 'Sarah Ahmed', aggregators: 3, agents: 85, merchants: 22, txns: 28000, revenue: '₦850K', pos: 12, posAchieved: '120%' },
  ],
  'agg-manager-perf': [
    { id: 1, manager: 'Emeka Obi', aggregators: 5, agents: 120, merchants: 45, txns: 42000, value: '₦45M', revenue: '₦1.2M', posVsTarget: '15 / 10', success: '98%', target: 'Met' },
    { id: 2, manager: 'Sarah Ahmed', aggregators: 3, agents: 85, merchants: 22, txns: 28000, value: '₦32M', revenue: '₦850K', posVsTarget: '12 / 10', success: '95%', target: 'Met' },
  ],
  'top-aggs': [
    { id: 1, name: 'Aggregator A', manager: 'Emeka Obi', agents: 50, merchants: 20, txns: 15000, revenue: '₦400K', posVsTarget: '8 / 10', growth: '+15%', success: '99%' },
    { id: 2, name: 'Aggregator B', manager: 'Sarah Ahmed', agents: 40, merchants: 15, txns: 12000, revenue: '₦320K', posVsTarget: '6 / 10', growth: '+10%', success: '96%' },
  ],
  'merchant-revenue': [
    { id: 1, merchant: 'Olu Stores', aggregator: 'Aggregator A', lga: 'Ikeja', txnValue: '₦5M', posValue: '₦3.5M', revenue: '₦150K', posStatus: 'Met' },
    { id: 2, merchant: 'Adebayo Supermart', aggregator: 'Aggregator B', lga: 'Surulere', txnValue: '₦3.2M', posValue: '₦2M', revenue: '₦90K', posStatus: 'Below' },
  ],
  'pos-perf': [
    { id: 1, posId: 'POS-00123', merchant: 'Olu Stores', aggManager: 'Emeka Obi', aggregator: 'Aggregator A', distDate: '2026-07-15', monthlyValue: '₦8M', targetStatus: 'Met', lastTxn: '2026-09-07' },
    { id: 2, posId: 'POS-00124', merchant: 'Adebayo Supermart', aggManager: 'Sarah Ahmed', aggregator: 'Aggregator B', distDate: '2026-07-20', monthlyValue: '₦4M', targetStatus: 'Below', lastTxn: '2026-09-06' },
  ],
  'lowest-perf': [
    { id: 1, rank: 45, name: 'John Doe', issue: 'Low POS activity', onboarding: 2, txns: 500, posTarget: '2 / 10', failure: '12%', followUp: 'Required' },
    { id: 2, rank: 46, name: 'Jane Smith', issue: 'High failure rate', onboarding: 5, txns: 800, posTarget: '4 / 10', failure: '15%', followUp: 'Scheduled' },
  ],
  'recent-onboards': [
    { id: 1, name: 'Kingsway Pharmacy', type: 'Merchant', aggregator: 'Aggregator A', manager: 'Emeka Obi', lga: 'Ikeja', date: '2026-09-05', status: 'Active' },
    { id: 2, name: 'Aliu Trading', type: 'Agent', aggregator: 'Aggregator B', manager: 'Sarah Ahmed', lga: 'Mainland', date: '2026-09-04', status: 'Pending' },
  ],
  'state-perf-summary': [
    { id: 1, manager: 'Emeka Obi', aggregators: 5, agents: 120, merchants: 45, txns: 42000, value: '₦45M', revenue: '₦1.2M', pos: 15, posAchieved: '150%', success: '98%' },
    { id: 2, manager: 'Sarah Ahmed', aggregators: 3, agents: 85, merchants: 22, txns: 28000, value: '₦32M', revenue: '₦850K', pos: 12, posAchieved: '120%', success: '95%' },
  ],
  'inactive-members': [
    { id: 1, name: 'Goodluck Ventures', type: 'Merchant', aggregator: 'Aggregator C', lastAct: '2026-08-10', inactiveDur: '28 Days' },
    { id: 2, name: 'Fatima Stores', type: 'Agent', aggregator: 'Aggregator D', lastAct: '2026-07-20', inactiveDur: '49 Days' },
  ],
};

const COLUMNS = {
  'top-agg-managers': [
    { field: 'rank', headerName: 'Rank', flex: 0.5 },
    { field: 'name', headerName: 'Aggregator Manager', flex: 1.5 },
    { field: 'aggregators', headerName: 'Aggregators', flex: 1 },
    { field: 'agents', headerName: 'Agents', flex: 1 },
    { field: 'merchants', headerName: 'Merchants', flex: 1 },
    { field: 'txns', headerName: 'Txns', flex: 1 },
    { field: 'revenue', headerName: 'Revenue', flex: 1 },
    { field: 'pos', headerName: 'POS Dist.', flex: 1 },
    { field: 'posAchieved', headerName: 'Target Achieved', flex: 1 },
  ],
  'agg-manager-perf': [
    { field: 'manager', headerName: 'Manager', flex: 1.5 },
    { field: 'aggregators', headerName: 'Aggregators', flex: 1 },
    { field: 'agents', headerName: 'Agents', flex: 1 },
    { field: 'merchants', headerName: 'Merchants', flex: 1 },
    { field: 'txns', headerName: 'Txns', flex: 1 },
    { field: 'value', headerName: 'Value', flex: 1 },
    { field: 'revenue', headerName: 'Revenue', flex: 1 },
    { field: 'posVsTarget', headerName: 'POS (Act/Tgt)', flex: 1.2 },
    { field: 'success', headerName: 'Success %', flex: 1 },
    { field: 'target', headerName: 'Target Status', flex: 1 },
  ],
  'top-aggs': [
    { field: 'name', headerName: 'Aggregator', flex: 1.5 },
    { field: 'manager', headerName: 'Manager', flex: 1.5 },
    { field: 'agents', headerName: 'Agents', flex: 1 },
    { field: 'merchants', headerName: 'Merchants', flex: 1 },
    { field: 'txns', headerName: 'Txns', flex: 1 },
    { field: 'revenue', headerName: 'Revenue', flex: 1 },
    { field: 'posVsTarget', headerName: 'POS (Act/Tgt)', flex: 1.2 },
    { field: 'growth', headerName: 'Growth', flex: 1 },
    { field: 'success', headerName: 'Success %', flex: 1 },
  ],
  'merchant-revenue': [
    { field: 'merchant', headerName: 'Merchant', flex: 1.5 },
    { field: 'aggregator', headerName: 'Aggregator', flex: 1.5 },
    { field: 'lga', headerName: 'LGA', flex: 1 },
    { field: 'txnValue', headerName: 'Txn Value', flex: 1.2 },
    { field: 'posValue', headerName: 'POS Value', flex: 1.2 },
    { field: 'revenue', headerName: 'Revenue Generated', flex: 1.5 },
    { field: 'posStatus', headerName: 'POS Target Status', flex: 1.2 },
  ],
  'pos-perf': [
    { field: 'posId', headerName: 'POS ID', flex: 1.2 },
    { field: 'merchant', headerName: 'Merchant', flex: 1.5 },
    { field: 'aggManager', headerName: 'Manager', flex: 1.5 },
    { field: 'aggregator', headerName: 'Aggregator', flex: 1.5 },
    { field: 'distDate', headerName: 'Dist. Date', flex: 1.2 },
    { field: 'monthlyValue', headerName: 'Monthly Value', flex: 1.2 },
    { field: 'targetStatus', headerName: '₦7.5M Target', flex: 1.2 },
    { field: 'lastTxn', headerName: 'Last Txn Date', flex: 1.2 },
  ],
  'lowest-perf': [
    { field: 'rank', headerName: 'Rank', flex: 0.5 },
    { field: 'name', headerName: 'Name', flex: 1.5 },
    { field: 'issue', headerName: 'Issue', flex: 2 },
    { field: 'onboarding', headerName: 'Onboarded', flex: 1 },
    { field: 'txns', headerName: 'Txns', flex: 1 },
    { field: 'posTarget', headerName: 'POS Target', flex: 1 },
    { field: 'failure', headerName: 'Fail Rate', flex: 1 },
    { field: 'followUp', headerName: 'Follow-up', flex: 1 },
  ],
  'recent-onboards': [
    { field: 'name', headerName: 'Name', flex: 1.5 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'aggregator', headerName: 'Aggregator', flex: 1.5 },
    { field: 'manager', headerName: 'Manager', flex: 1.5 },
    { field: 'lga', headerName: 'City/LGA', flex: 1 },
    { field: 'date', headerName: 'Date Joined', flex: 1.2 },
    { field: 'status', headerName: 'Status', flex: 1 },
  ],
  'state-perf-summary': [
    { field: 'manager', headerName: 'Manager', flex: 1.5 },
    { field: 'aggregators', headerName: 'Aggs', flex: 0.8 },
    { field: 'agents', headerName: 'Agents', flex: 0.8 },
    { field: 'merchants', headerName: 'Merchants', flex: 1 },
    { field: 'txns', headerName: 'Txns', flex: 1 },
    { field: 'value', headerName: 'Value', flex: 1.2 },
    { field: 'revenue', headerName: 'Revenue', flex: 1.2 },
    { field: 'pos', headerName: 'POS Dist.', flex: 1 },
    { field: 'posAchieved', headerName: 'Achieved', flex: 1 },
    { field: 'success', headerName: 'Success', flex: 1 },
  ],
  'inactive-members': [
    { field: 'name', headerName: 'Account Name', flex: 2 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'aggregator', headerName: 'Assigned Aggregator', flex: 2 },
    { field: 'lastAct', headerName: 'Last Activity Date', flex: 1.5 },
    { field: 'inactiveDur', headerName: 'Inactive Duration', flex: 1.5 },
  ],
};

export default function StatePerformanceTables({ metrics }) {
  const [activeTab, setActiveTab] = useState("top-agg-managers");

  const data = React.useMemo(() => {
    if (!metrics) return [];
    
    switch (activeTab) {
      case "top-agg-managers":
        return (metrics.aggregatorManagerPerformance || []).map((am, i) => ({
          id: am.name + i,
          rank: i + 1,
          name: am.name,
          aggregators: am.aggregators || 0,
          agents: am.agents || 0,
          merchants: am.merchants || 0,
          txns: am.transactions?.toLocaleString() || 0,
          revenue: `?${(am.totalCommission || 0).toLocaleString()}`,
          pos: am.posDistributed || 0,
          posAchieved: `${am.posTargetAchievement || 0}%`
        }));
      case "agg-manager-perf":
        return (metrics.aggregatorManagerPerformance || []).map((am, i) => ({
          id: am.name + i,
          manager: am.name,
          aggregators: am.aggregators || 0,
          agents: am.agents || 0,
          merchants: am.merchants || 0,
          txns: am.transactions?.toLocaleString() || 0,
          value: `?${(am.totalValue || 0).toLocaleString()}`,
          revenue: `?${(am.totalCommission || 0).toLocaleString()}`,
          posVsTarget: `${am.posDistributed || 0} / ${am.posTarget || 0}`,
          success: "95%",
          target: am.posDistributed >= am.posTarget ? "Met" : "Below"
        }));
      case "top-aggs":
        return (metrics.aggregatorPerformance || []).map((agg, i) => ({
          id: agg.name + i,
          name: agg.name,
          manager: agg.manager || "N/A",
          agents: agg.agents || 0,
          merchants: agg.merchants || 0,
          txns: agg.transactions?.toLocaleString() || 0,
          revenue: `?${(agg.commission || 0).toLocaleString()}`,
          posVsTarget: "0 / 0",
          growth: agg.growth || "0%",
          success: "95%"
        }));
      case "merchant-revenue":
        return (metrics.merchantRevenuePerformance || []).map((mr, i) => ({
          id: mr.merchantName + i,
          merchant: mr.merchantName,
          aggregator: mr.aggregator || "Direct",
          lga: mr.state || "Unknown",
          txnValue: `?${(mr.transactionValue || 0).toLocaleString()}`,
          posValue: `?${(mr.posValue || 0).toLocaleString()}`,
          revenue: `?${(mr.revenueGenerated || 0).toLocaleString()}`,
          posStatus: mr.posTargetStatus || "Pending"
        }));
      case "pos-perf":
        return (metrics.posPerformance || []).map((p, i) => ({
          id: p.posId + i,
          posId: p.posId,
          merchant: p.merchant,
          aggManager: p.aggManager,
          aggregator: p.aggregator,
          distDate: p.distDate,
          monthlyValue: `?${(p.monthlyValue || 0).toLocaleString()}`,
          targetStatus: p.targetStatus,
          lastTxn: p.lastTxn
        }));
      case "lowest-perf":
        return (metrics.lowestPerforming || []).map((lp, i) => ({
          id: lp.name + i,
          rank: lp.rank,
          name: lp.name,
          issue: lp.issue,
          onboarding: lp.onboarding,
          txns: lp.txns,
          posTarget: lp.posTarget,
          failure: lp.failure,
          followUp: lp.followUp
        }));
      case "recent-onboards":
        return (metrics.recentOnboardings || []).map((ro, i) => ({
          id: ro.name + i,
          name: ro.name,
          type: ro.type,
          aggregator: ro.aggregator,
          manager: ro.manager,
          lga: ro.lga,
          date: new Date(ro.date).toLocaleDateString(),
          status: ro.status
        }));
      case "state-perf-summary":
        return (metrics.stateManagerPerformance || []).map((sm, i) => ({
          id: sm.state + i,
          manager: sm.manager || "N/A",
          aggregators: sm.aggregators || 0,
          agents: sm.agents || 0,
          merchants: sm.merchants || 0,
          txns: sm.transactions?.toLocaleString() || 0,
          value: `?${(sm.totalValue || 0).toLocaleString()}`,
          revenue: `?${(sm.totalCommission || 0).toLocaleString()}`,
          pos: sm.posDistributed || 0,
          posAchieved: `${sm.posTargetAchievement || 0}%`,
          success: sm.successRate || "0%"
        }));
      case "inactive-members":
        return (metrics.inactiveMembers || []).map((im, i) => ({
          id: im.name + i,
          name: im.name,
          type: im.type,
          aggregator: im.aggregator,
          lastAct: new Date(im.lastAct).toLocaleDateString(),
          inactiveDur: im.inactiveDur
        }));
      default:
        return [];
    }
  }, [metrics, activeTab]);

  const columns = COLUMNS[activeTab] || [];
  const currentTabName = TAB_MAPPINGS.find(t => t.id === activeTab)?.label || "Table";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col mt-8">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-2">
        {TAB_MAPPINGS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-qreva-navy text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-0">
        <DataTable
          title={currentTabName}
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
          showCheckbox={false}
          showSearch={true}
          showExport={true}
        />
      </div>
    </div>
  );
}
