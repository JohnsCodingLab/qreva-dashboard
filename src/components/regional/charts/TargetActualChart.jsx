import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function TargetActualChart({ data }) {
  // Mock data if none provided
  const activeData = data || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-3 rounded-lg text-xs shadow-xl border border-qreva-navy">
          <div className="font-bold text-slate-200 mb-2">{label}</div>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center gap-4 mb-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
              <span className="font-semibold">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden">
      <div className="mb-2 shrink-0">
        <h3 className="font-bold text-qreva-navy text-lg">Target vs Actual Performance</h3>
        <p className="text-slate-500 text-sm">State-level KPI achievement</p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} iconType="circle" />
            <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="actual" name="Actual" fill="#E86C33" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
