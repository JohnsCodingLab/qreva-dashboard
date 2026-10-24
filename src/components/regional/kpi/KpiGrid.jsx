import React from 'react';
import {
  Users,
  Store,
  Briefcase,
  Network,
  Activity,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Receipt,
} from 'lucide-react';
import KpiCard from './KpiCard';
import { useNavigate } from 'react-router-dom';

export default function KpiGrid({ kpis }) {
  const navigate = useNavigate();

  if (!kpis) return null;

  return (
    <div className="space-y-4">
      {/* Row 1: Network KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Agents"
          value={kpis.totalAgents?.value?.toLocaleString() ?? '0'}
          growth={kpis.totalAgents?.growth ?? 0}
          comparePeriod={kpis.totalAgents?.comparePeriod}
          icon={Users}
          iconBgColor="bg-qreva-orange"
          iconColor="text-white"
          onClick={() => navigate('/agents')}
        />
        <KpiCard
          title="Total Merchants"
          value={kpis.totalMerchants?.value?.toLocaleString() ?? '0'}
          growth={kpis.totalMerchants?.growth ?? 0}
          comparePeriod={kpis.totalMerchants?.comparePeriod}
          icon={Store}
          iconBgColor="bg-qreva-blue"
          iconColor="text-white"
          onClick={() => navigate('/merchants')}
        />
        <KpiCard
          title="Aggregator Managers"
          value={kpis.aggregatorManagers?.value?.toLocaleString() ?? '0'}
          growth={kpis.aggregatorManagers?.growth ?? 0}
          comparePeriod={kpis.aggregatorManagers?.comparePeriod}
          icon={Briefcase}
          iconBgColor="bg-qreva-indigo"
          iconColor="text-white"
          onClick={() => navigate('/aggregator-manager')}
        />
        <KpiCard
          title="Aggregators"
          value={kpis.aggregators?.value?.toLocaleString() ?? '0'}
          growth={kpis.aggregators?.growth ?? 0}
          comparePeriod={kpis.aggregators?.comparePeriod}
          icon={Network}
          iconBgColor="bg-qreva-blue"
          iconColor="text-white"
          onClick={() => navigate('/aggregators')}
        />
      </div>

      {/* Row 2: Financial / Transaction KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Transactions"
          value={kpis.totalTransactions?.value?.toLocaleString() ?? '0'}
          growth={kpis.totalTransactions?.growth ?? 0}
          comparePeriod={kpis.totalTransactions?.comparePeriod}
          icon={Activity}
          iconBgColor="bg-[#084059]"
          iconColor="text-white"
        />
        <KpiCard
          title="Transaction Value"
          value={kpis.transactionValue?.formatted ?? '₦0'}
          growth={kpis.transactionValue?.growth ?? 0}
          comparePeriod={kpis.transactionValue?.comparePeriod}
          icon={Coins}
          iconBgColor="bg-qreva-orange"
          iconColor="text-white"
        />
        <KpiCard
          title="Total Commission"
          value={kpis.totalCommission?.formatted ?? '₦0'}
          growth={kpis.totalCommission?.growth ?? 0}
          comparePeriod={kpis.totalCommission?.comparePeriod}
          icon={ShieldCheck}
          iconBgColor="bg-qreva-blue"
          iconColor="text-white"
          onClick={() => navigate('/earnings')}
        />
        <KpiCard
          title="Success Rate"
          value={`${kpis.successRate?.value ?? 0}%`}
          growth={kpis.successRate?.growth ?? 0}
          comparePeriod={kpis.successRate?.comparePeriod}
          icon={CheckCircle2}
          iconBgColor="bg-teal-500"
          iconColor="text-white"
        />
      </div>

      {/* Row 3: POS and Target KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.totalDeductions !== undefined && (
          <KpiCard
            title="Total Deductions (VAT & Stamp Duty)"
            value={kpis.totalDeductions?.formatted || '₦0'}
            growth={kpis.totalDeductions?.growth || 0}
            comparePeriod={kpis.totalDeductions?.comparePeriod}
            icon={Receipt}
            iconBgColor="bg-red-500"
            iconColor="text-white"
          />
        )}
        {kpis.merchantRevenue !== undefined && (
          <KpiCard
            title="Merchant Revenue Generated"
            value={kpis.merchantRevenue?.formatted || '₦0'}
            growth={kpis.merchantRevenue?.growth || 0}
            comparePeriod={kpis.merchantRevenue?.comparePeriod}
            icon={Store}
            iconBgColor="bg-qreva-orange"
            iconColor="text-white"
          />
        )}
        {kpis.posDistributed !== undefined && (
          <KpiCard
            title="POS Distributed"
            value={kpis.posDistributed?.value?.toLocaleString() || '0'}
            growth={kpis.posDistributed?.growth || 0}
            comparePeriod={kpis.posDistributed?.comparePeriod}
            icon={Activity}
            iconBgColor="bg-qreva-blue"
            iconColor="text-white"
          />
        )}
        {kpis.statePosTarget !== undefined && (
          <KpiCard
            title="State POS Dist. Target"
            value={kpis.statePosTarget?.value?.toLocaleString() ?? '0'}
            growth={kpis.statePosTarget?.growth || 0}
            comparePeriod={kpis.statePosTarget?.comparePeriod}
            icon={CheckCircle2}
            iconBgColor="bg-[#084059]"
            iconColor="text-white"
          />
        )}
        {kpis.posTargetAchievement !== undefined && (
          <KpiCard
            title="POS Target Achievement"
            value={`${kpis.posTargetAchievement?.value || 0}%`}
            growth={kpis.posTargetAchievement?.growth || 0}
            comparePeriod={kpis.posTargetAchievement?.comparePeriod}
            icon={CheckCircle2}
            iconBgColor="bg-qreva-indigo"
            iconColor="text-white"
          />
        )}
        {kpis.statesManaged !== undefined && (
          <KpiCard
            title="States Managed"
            value={kpis.statesManaged?.value?.toLocaleString() ?? '0'}
            growth={kpis.statesManaged?.growth || 0}
            comparePeriod={kpis.statesManaged?.comparePeriod}
            icon={Network}
            iconBgColor="bg-teal-500"
            iconColor="text-white"
          />
        )}
        {kpis.stateManagers !== undefined && (
          <KpiCard
            title="State Managers"
            value={kpis.stateManagers?.value?.toLocaleString() ?? '0'}
            growth={kpis.stateManagers?.growth || 0}
            comparePeriod={kpis.stateManagers?.comparePeriod}
            icon={Briefcase}
            iconBgColor="bg-qreva-blue"
            iconColor="text-white"
          />
        )}
      {/* Optional Secondary Cards flow continuously in the same grid */}
          {kpis.newAggregators !== undefined && (
            <KpiCard
              title="New Aggregators"
              value={kpis.newAggregators?.value?.toLocaleString() || '0'}
              growth={kpis.newAggregators?.growth || 0}
              comparePeriod={kpis.newAggregators?.comparePeriod}
              icon={Network}
              iconBgColor="bg-qreva-indigo"
              iconColor="text-white"
            />
          )}
          {kpis.newAgents !== undefined && (
            <KpiCard
              title="New Agents"
              value={kpis.newAgents?.value?.toLocaleString() || '0'}
              growth={kpis.newAgents?.growth || 0}
              comparePeriod={kpis.newAgents?.comparePeriod}
              icon={Users}
              iconBgColor="bg-qreva-orange"
              iconColor="text-white"
            />
          )}
          {kpis.newMerchants !== undefined && (
            <KpiCard
              title="New Merchants"
              value={kpis.newMerchants?.value?.toLocaleString() || '0'}
              growth={kpis.newMerchants?.growth || 0}
              comparePeriod={kpis.newMerchants?.comparePeriod}
              icon={Store}
              iconBgColor="bg-[#084059]"
              iconColor="text-white"
            />
          )}
          {kpis.activeUsers !== undefined && (
            <KpiCard
              title="Active Users"
              value={kpis.activeUsers?.value?.toLocaleString() || '0'}
              growth={kpis.activeUsers?.growth || 0}
              comparePeriod={kpis.activeUsers?.comparePeriod}
              icon={Users}
              iconBgColor="bg-teal-500"
              iconColor="text-white"
            />
          )}
      </div>
    </div>
  );
}
