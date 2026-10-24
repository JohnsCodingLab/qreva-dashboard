import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function SuperAdminOnboardingsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
        <h3 className="text-lg font-bold text-[#084059] mb-4">Onboardings Over Time</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const chartData = data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-[#084059] mb-4">Onboardings Over Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOnboardings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#26C8B9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#26C8B9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />

            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              labelStyle={{ fontWeight: "bold", color: "#0f172a", marginBottom: "4px" }}
            />

            <Area type="monotone" dataKey="amount" name="New Users" stroke="#26C8B9" fillOpacity={1} fill="url(#colorOnboardings)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
