import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function LeaderboardCard({
  title,
  subtitle,
  items = [],
  columns = [],
  viewAllLink,
  onViewAll,
  type = 'state', // dynamic type
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 card-shadow overflow-hidden flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="p-4 border-b border-qreva-ash flex items-center justify-between">
        <div>
          <h3 className="font-bold text-black text-xs tracking-tight">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[11px] font-semibold text-qreva-orange hover:text-orange-700 transition-colors"
          >
            View all
          </button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-qreva-ash bg-qreva-ash/50 text-[10px] font-semibold text-qreva-navy uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-2 px-3 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {col.label || col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-qreva-ash">
            {items.slice(0, 7).map((item, idx) => (
              <tr key={idx} className="hover:bg-qreva-ash/80 transition-colors">
                {type === 'state' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-black">#{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-qreva-navy">{item.state}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.agents?.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.transactions?.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-blue">{item.commission}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.posDistributed?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600 text-right">{item.posTargetAchievement || 0}%</td>
                  </>
                )}

                {type === 'stateManager' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-black">#{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-qreva-navy">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.state}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.transactions?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.networkGrowth || '15%'}</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-blue">{item.totalCommission || '₦0'}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-right">{item.posDistVsTarget || '85 / 100'}</td>
                  </>
                )}

                {type === 'aggregatorManager' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-black">#{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-qreva-navy">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.aggregators?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.agents?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.merchants?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.transactions?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-blue">{item.totalCommission || '₦0'}</td>
                  </>
                )}

                {type === 'aggregator' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-black">#{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-qreva-navy">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.networkSize?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.transactions?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-blue">{item.commission || '₦0'}</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold text-right">{item.growth || '0%'}</td>
                  </>
                )}
                
                {type === 'merchant' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-qreva-navy">{item.merchantName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.state}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.aggregator || 'Direct'}</td>
                    <td className="py-2.5 px-3 font-bold text-black">{item.transactionValue?.toLocaleString() || '₦0'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.posValue?.toLocaleString() || '₦0'}</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-blue">{item.revenueGenerated?.toLocaleString() || '₦0'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.posTargetStatus === 'Met' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {item.posTargetStatus || 'Pending'}
                      </span>
                    </td>
                  </>
                )}

                {type === 'posDistribution' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-qreva-navy">{item.state}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.posDistributed?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.target?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{item.achievement || 0}%</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-blue text-right">{item.posValue || '₦0'}</td>
                  </>
                )}

                {type === 'posPerformance' && (
                  <>
                    <td className="py-2.5 px-3 font-mono font-semibold text-black">{item.posId}</td>
                    <td className="py-2.5 px-3 text-qreva-navy font-semibold">{item.merchant}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.state}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.aggregatorManager}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.aggregator}</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-blue">{item.monthlyPosValue}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.targetStatus === 'Met' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {item.targetStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-right">{item.lastActivity}</td>
                  </>
                )}

                {type === 'recentOnboardings' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-black">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.type}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.state}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.assignedTo}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.dateOnboarded}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status}
                      </span>
                    </td>
                  </>
                )}
                
                {type === 'lowestStates' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-rose-600">#{item.rank}</td>
                    <td className="py-2.5 px-3 font-semibold text-qreva-navy">{item.state}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[120px] truncate" title={item.issue}>{item.issue}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.transactions}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.onboarding}</td>
                    <td className="py-2.5 px-3 text-rose-600">{item.posTargetPerformance}</td>
                    <td className="py-2.5 px-3 text-rose-600 font-bold">{item.failureRate}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-right">{item.followUp}</td>
                  </>
                )}

                {type === 'stateSummary' && (
                  <>
                    <td className="py-2.5 px-3 font-semibold text-black">{item.state}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.agents}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.merchants}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.aggregators}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.aggregatorManagers}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.transactions}</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-navy">{item.value}</td>
                    <td className="py-2.5 px-3 font-bold text-qreva-blue">{item.commission}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.posDistributed}</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-bold">{item.posTargetAchievement}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-right">{item.successRate}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
