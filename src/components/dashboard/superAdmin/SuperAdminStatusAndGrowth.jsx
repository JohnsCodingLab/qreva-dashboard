import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SuperAdminStatusAndGrowth({ statusData, userData }) {
  if (!statusData && !userData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-64">
          <p className="text-gray-400">No status data available for this period</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-64">
          <p className="text-gray-400">No user data available for this period</p>
        </div>
      </div>
    );
  }

  const STATUS_COLORS = {
    Completed: "#26C8B9",
    Pending: "#FF5B04",
    Failed: "#084059"
  };

  const USER_COLORS = ["#FF5B04", "#084059", "#26C8B9", "#FF8A4C", "#0C6086", "#51D6C9", "#B54103", "#04202C"];

  const formatCur = (val) => new Intl.NumberFormat("en-NG", { notation: "compact", compactDisplay: "short" }).format(val);
  const formatNum = (val) => new Intl.NumberFormat().format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Transaction Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-qreva-navy mb-4">Transaction Status</h3>
        <div className="h-64">
          {!statusData || statusData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No trend data available for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {statusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatNum(value), "Transactions"]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue by User Type */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 md:mt-0">
        <h3 className="text-lg font-bold text-qreva-navy mb-4">Revenue by User Type</h3>
        <div className="h-64">
          {!userData || userData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No trend data available for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={formatCur} />
                <YAxis type="category" dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b", fontWeight: "bold" }} width={80} />

                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  formatter={(value) => [new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(value), "Revenue"]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {userData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}