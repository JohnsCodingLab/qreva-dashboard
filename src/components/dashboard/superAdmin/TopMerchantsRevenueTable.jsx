import React from "react";

export default function TopMerchantsRevenueTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
        <h3 className="text-lg font-bold text-[#084059] mb-4">Top Merchants by Qreva Revenue</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const formatCur = (val) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h3 className="text-lg font-bold text-qreva-navy mb-4">Top Merchants by Qreva Revenue</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Merchant Name</th>
              <th className="px-4 py-3 font-medium text-right">Transactions</th>
              <th className="px-4 py-3 font-medium text-right text-green-600">Qreva Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((merchant, index) => (
              <tr key={merchant._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-gray-500 font-medium">#{index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {merchant.name || `${merchant.firstName || ""} ${merchant.lastName || ""}`.trim() || "Unknown"}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{new Intl.NumberFormat().format(merchant.count)}</td>
                <td className="px-4 py-3 text-right font-bold text-green-600">{formatCur(merchant.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}