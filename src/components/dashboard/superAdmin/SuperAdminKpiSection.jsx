import React from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminKpiCard from "./SuperAdminKpiCard";
import AttentionCard from "./AttentionCard";
import { Users, UserSquare2, ShoppingBag, Network, Briefcase, MapPin, Globe, CreditCard, Activity, CheckCircle, XCircle, Clock, Percent } from "lucide-react";

export default function SuperAdminKpiSection({ kpis }) {
  const navigate = useNavigate();
  if (!kpis) return null;

  const fmt = (num) => new Intl.NumberFormat("en-US").format(num);
  const fmtCur = (num) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(num);

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Row 1: Company Network */}
      <div>
        <h3 className="text-sm font-bold text-qreva-navy mb-3">Company Network</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <SuperAdminKpiCard title="Total Users" value={fmt(kpis.network?.users?.total || 0)} change={kpis.network?.users?.change} icon={Users} colorClass="text-qreva-blue" onClick={() => navigate("/users")} />
          <SuperAdminKpiCard title="Agents" value={fmt(kpis.network?.agents?.total || 0)} change={kpis.network?.agents?.change} icon={UserSquare2} colorClass="text-qreva-orange" onClick={() => navigate("/agents")} />
          <SuperAdminKpiCard title="Merchants" value={fmt(kpis.network?.merchants?.total || 0)} change={kpis.network?.merchants?.change} icon={ShoppingBag} colorClass="text-qreva-navy" onClick={() => navigate("/merchants")} />
          <SuperAdminKpiCard title="Aggregators" value={fmt(kpis.network?.aggregators?.total || 0)} change={kpis.network?.aggregators?.change} icon={Network} colorClass="text-qreva-blue" onClick={() => navigate("/aggregators")} />
          <SuperAdminKpiCard title="Agg. Managers" value={fmt(kpis.network?.aggMgrs?.total || 0)} change={kpis.network?.aggMgrs?.change} icon={Briefcase} colorClass="text-qreva-navy" onClick={() => navigate("/aggregator-manager")} />
          <SuperAdminKpiCard title="State Managers" value={fmt(kpis.network?.stateMgrs?.total || 0)} change={kpis.network?.stateMgrs?.change} icon={MapPin} colorClass="text-qreva-blue" onClick={() => navigate("/state-manager")} />
          <SuperAdminKpiCard title="Regional Managers" value={fmt(kpis.network?.regMgrs?.total || 0)} change={kpis.network?.regMgrs?.change} icon={Globe} colorClass="text-qreva-orange" onClick={() => navigate("/regional-manager")} />
          <SuperAdminKpiCard title="Hardware POS" value={fmt(kpis.network?.hardwarePos?.total || 0)} change={kpis.network?.hardwarePos?.change} icon={CreditCard} colorClass="text-qreva-navy" />
        </div>
      </div>

      {/* Row 2: Transactions & Revenue */}
      <div>
        <h3 className="text-sm font-bold text-qreva-navy mb-3">Transaction & Revenue Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <SuperAdminKpiCard title="Total Transactions" value={fmt(kpis.transactions?.total?.val || 0)} change={kpis.transactions?.total?.change} icon={Activity} colorClass="text-qreva-blue" />
          <SuperAdminKpiCard title="Transaction Value" value={fmtCur(kpis.transactions?.value?.val || 0)} change={kpis.transactions?.value?.change} icon={CreditCard} colorClass="text-qreva-orange" />
          <SuperAdminKpiCard title="Qreva Revenue" value={fmtCur(kpis.transactions?.revenue?.val || 0)} change={kpis.transactions?.revenue?.change} icon={Briefcase} colorClass="text-qreva-navy" />
          <SuperAdminKpiCard title="Successful" value={fmt(kpis.transactions?.success?.val || 0)} change={kpis.transactions?.success?.change} icon={CheckCircle} colorClass="text-qreva-navy" />
          <SuperAdminKpiCard title="Failed" value={fmt(kpis.transactions?.failed?.val || 0)} change={kpis.transactions?.failed?.change} icon={XCircle} colorClass="text-qreva-orange" />
          <SuperAdminKpiCard title="Pending" value={fmt(kpis.transactions?.pending?.val || 0)} change={kpis.transactions?.pending?.change} icon={Clock} colorClass="text-qreva-orange" />
          <SuperAdminKpiCard title="Success Rate" value={`${(kpis.transactions?.successRate?.val || 0).toFixed(1)}%`} change={kpis.transactions?.successRate?.change} icon={Percent} colorClass="text-qreva-navy" />
        </div>
      </div>

      {/* Row 3: New Onboardings */}
      <div>
        <h3 className="text-sm font-bold text-qreva-navy mb-3">New Onboardings (This Period)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <SuperAdminKpiCard title="New Users" value={fmt(kpis.onboarding?.users?.val || 0)} change={kpis.onboarding?.users?.change} icon={Users} colorClass="text-qreva-blue" onClick={() => navigate("/users")} />
          <SuperAdminKpiCard title="New Agents" value={fmt(kpis.onboarding?.agents?.val || 0)} change={kpis.onboarding?.agents?.change} icon={UserSquare2} colorClass="text-qreva-orange" onClick={() => navigate("/agents")} />
          <SuperAdminKpiCard title="New Merchants" value={fmt(kpis.onboarding?.merchants?.val || 0)} change={kpis.onboarding?.merchants?.change} icon={ShoppingBag} colorClass="text-qreva-navy" onClick={() => navigate("/merchants")} />
          <SuperAdminKpiCard title="New Aggregators" value={fmt(kpis.onboarding?.aggregators?.val || 0)} change={kpis.onboarding?.aggregators?.change} icon={Network} colorClass="text-qreva-blue" onClick={() => navigate("/aggregators")} />
          <SuperAdminKpiCard title="New Agg. Managers" value={fmt(kpis.onboarding?.aggMgrs?.val || 0)} change={kpis.onboarding?.aggMgrs?.change} icon={Briefcase} colorClass="text-qreva-navy" onClick={() => navigate("/aggregator-manager")} />
          <SuperAdminKpiCard title="New State Mgrs" value={fmt(kpis.onboarding?.stateMgrs?.val || 0)} change={kpis.onboarding?.stateMgrs?.change} icon={MapPin} colorClass="text-qreva-blue" onClick={() => navigate("/state-manager")} />
          <SuperAdminKpiCard title="New Reg. Mgrs" value={fmt(kpis.onboarding?.regMgrs?.val || 0)} change={kpis.onboarding?.regMgrs?.change} icon={Globe} colorClass="text-qreva-blue" onClick={() => navigate("/regional-manager")} />
        </div>
      </div>

      {/* Row 4: Attention Needed */}
      <div>
        <h3 className="text-sm font-bold text-qreva-orange mb-3">Attention Needed</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <AttentionCard title="Inactive Users (90+ Days)" value={fmt(kpis.attention?.inactive || 0)} onClick={() => navigate("/users")} />
          <AttentionCard title="Pending Account Approvals" value={fmt(kpis.attention?.pendingAcct || 0)} onClick={() => navigate("/account-approvals")} />
          <AttentionCard title="Pending Business Approvals" value={fmt(kpis.attention?.pendingBiz || 0)} onClick={() => navigate("/business-account-approvals")} />
          <AttentionCard title="Pending Disputes" value={fmt(kpis.attention?.disputes || 0)} onClick={() => navigate("/disputed-transactions")} />
          <AttentionCard title="Pending Transactions" value={fmt(kpis.attention?.pendingTxns || 0)} />
          {kpis.attention?.highFailure ? (
             <AttentionCard title="High Failure Alert" value="Warning" />
          ) : (
             <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center opacity-50">
               <h4 className="text-gray-400 text-xs font-medium mb-1 text-center">High Failure Alert</h4>
               <p className="text-xl font-bold text-qreva-navy">Normal</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}