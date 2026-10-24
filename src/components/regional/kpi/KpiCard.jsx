import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  growth,
  isPositive = true,
  comparePeriod = 'vs 1 Jul - 31 Jul 2026',
  icon: Icon,
  iconBgColor = 'bg-qreva-orange',
  iconColor = 'text-white',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4.5 border border-slate-200/80 card-shadow card-hover transition-all flex flex-col justify-between ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Card Header: Icon & Title */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0 shadow-xs font-bold`}>
          {Icon ? <Icon className="w-5 h-5" /> : null}
        </div>
        <div className="text-xs font-medium text-qreva-navy tracking-tight">{title}</div>
      </div>

      {/* Card Value */}
      <div className="mt-3">
        <div className="text-xl font-extrabold text-black tracking-tight">{value}</div>
      </div>

      {/* Card Footer: Growth pill & Comparative Period */}
      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-qreva-ash">
        <div
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3 text-qreva-blue stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-rose-600 stroke-[2.5]" />
          )}
          <span>{growth}%</span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium truncate">{comparePeriod}</span>
      </div>
    </div>
  );
}
