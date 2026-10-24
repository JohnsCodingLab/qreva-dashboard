import React from "react";
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function SuperAdminTrendsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
        <h3 className="text-lg font-bold text-[#084059] mb-4">Revenue & Transaction Trends</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (val) => new Intl.NumberFormat("en-NG", { notation: "compact", compactDisplay: "short" }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-qreva-navy mb-4">Revenue & Transaction Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={formatCurrency} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />

            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value, name) => {
                if (name === "Transaction Value" || name === "Qreva Revenue") return ["\u20A6" + new Intl.NumberFormat().format(value), name];
                return [new Intl.NumberFormat().format(value), name];
              }}
              labelStyle={{ fontWeight: "bold", color: "#0f172a", marginBottom: "4px" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />

            {/* Transaction Value (Area) */}
            <Area yAxisId="left" type="monotone" dataKey="value" name="Transaction Value" fill="url(#colorValue)" stroke="#084059" strokeWidth={2} />

            {/* Qreva Revenue (Line) */}
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Qreva Revenue" stroke="#26C8B9" strokeWidth={3} dot={{ r: 4, fill: "#26C8B9", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />

            {/* Transaction Count (Line on Right Axis) */}
            <Line yAxisId="right" type="monotone" dataKey="count" name="Transaction Count" stroke="#FF5B04" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}