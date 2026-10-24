import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Label } from "recharts";

export default function SuperAdminServiceCharts({ data }) {
  const COLORS = ["#FF5B04", "#084059", "#26C8B9", "#FF8A4C", "#0C6086", "#51D6C9", "#B54103", "#04202C"];

  const formatCur = (val) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", notation: "compact", compactDisplay: "short" }).format(val);

  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-64">
          <p className="text-gray-400">No trend data available for this period</p>
        </div>
      </div>
    );
  }

  const totalValue = data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const totalRevenue = data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

  const renderCustomLegend = (dataList, dataKey, total) => {
    return (
      <ul className="flex flex-col gap-2.5 text-[11px] text-[#084059]">
        {dataList.map((entry, index) => {
          const val = entry[dataKey] || 0;
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
          return (
            <li key={"item-" + index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full block flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="font-medium truncate max-w-[100px]" title={entry._id || 'Unknown'}>{entry._id || 'Unknown'}</span>
              </div>
              <span className="font-bold text-[#084059]">{pct}%</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderCustomLabel = ({ viewBox, totalText, subText }) => {
    const { cx, cy } = viewBox;
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} dy="-0.2em" fontSize="18" fontWeight="bold" fill="#084059">{totalText}</tspan>
        <tspan x={cx} dy="1.4em" fontSize="11" fill="#64748b">{subText}</tspan>
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Transactions by Service (Value) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <h3 className="text-sm font-bold text-qreva-navy mb-4">Transactions by Service (Value)</h3>
        <div className="flex-1 flex items-center justify-between">
          <div className="w-1/2 h-56 relative -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                  
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCur(value).replace("NGN", "\u20A6").replace("\u20A6\u20A6", "\u20A6"), "Value"]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center mt-1">
              <span className="text-[17px] font-bold text-[#084059]">{formatCur(totalValue).replace("NGN", "\u20A6").replace("\u20A6\u20A6", "\u20A6")}</span>
              <span className="text-[11px] text-[#64748b]">Total Value</span>
            </div>
          </div>
          <div className="w-1/2 flex justify-end">
            {renderCustomLegend(data, "value", totalValue)}
          </div>
        </div>
      </div>

      {/* Revenue by Service */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <h3 className="text-sm font-bold text-qreva-navy mb-4">Revenue by Service</h3>
        <div className="flex-1 flex items-center justify-between">
          <div className="w-1/2 h-56 relative -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="revenue"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                  
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCur(value).replace("NGN", "\u20A6").replace("\u20A6\u20A6", "\u20A6"), "Revenue"]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center mt-1">
              <span className="text-[17px] font-bold text-[#084059]">{formatCur(totalRevenue).replace("NGN", "\u20A6").replace("\u20A6\u20A6", "\u20A6")}</span>
              <span className="text-[11px] text-[#64748b]">Total Revenue</span>
            </div>
          </div>
          <div className="w-1/2 flex justify-end">
            {renderCustomLegend(data, "revenue", totalRevenue)}
          </div>
        </div>
      </div>

    </div>
  );
}
