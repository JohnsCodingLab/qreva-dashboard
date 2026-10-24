import React, { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function SuperAdminAverageTransactionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
        <h3 className="text-lg font-bold text-[#084059] mb-4">Average Transaction Value</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  // Calculate the average transaction value (Total Amount / Count) for each day
  const chartData = useMemo(() => {
    return data.map(item => ({
      _id: item._id,
      averageValue: item.count && item.count > 0 ? (item.value / item.count) : 0,
      firstTimeAverageValue: item.firstTimeCount && item.firstTimeCount > 0 ? (item.firstTimeValue / item.firstTimeCount) : 0,
      count: item.count
    }));
  }, [data]);

  const formatCurrency = (val) => new Intl.NumberFormat("en-NG", { notation: "compact", compactDisplay: "short" }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-[#084059] mb-4">Average Transaction Value Over Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAvgValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFirstTimeValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={formatCurrency} />

            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value, name) => {
                if (name === "Average Value" || name === "First-Time Avg Value") return ["\u20A6" + new Intl.NumberFormat().format(value), name];
                return [value, name];
              }}
              labelStyle={{ fontWeight: "bold", color: "#0f172a", marginBottom: "4px" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />

            <Area 
              type="monotone" 
              dataKey="averageValue" 
              name="Average Value" 
              stroke="#8b5cf6" 
              fillOpacity={1} 
              fill="url(#colorAvgValue)" 
              strokeWidth={3} 
            />
            <Area 
              type="monotone" 
              dataKey="firstTimeAverageValue" 
              name="First-Time Avg Value" 
              stroke="#f59e0b" 
              fillOpacity={1} 
              fill="url(#colorFirstTimeValue)" 
              strokeWidth={3} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
