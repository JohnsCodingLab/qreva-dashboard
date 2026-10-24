import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function SuperAdminKpiCard({ title, value, change, onClick, icon: Icon, colorClass = "text-qreva-navy" }) {
  const isPositive = change > 0;
  const isZero = change === 0;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col items-center justify-center ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    >
      {Icon && <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 mb-2 ${colorClass}`}><Icon size={20} /></div>}
      <h4 className="text-gray-500 text-xs font-medium mb-1 text-center">{title}</h4>
      <p className="text-lg font-bold text-gray-900 mb-2">{value}</p>
      
      {change !== undefined && (
        <div className={`flex items-center text-[10px] font-medium ${isPositive ? "text-qreva-blue" : isZero ? "text-gray-400" : "text-qreva-orange"}`}>
          {isPositive ? <TrendingUp size={12} className="mr-1" /> : isZero ? <Minus size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
          {isZero ? "0%" : `${Math.abs(change).toFixed(1)}%`}
        </div>
      )}
    </div>
  );
}