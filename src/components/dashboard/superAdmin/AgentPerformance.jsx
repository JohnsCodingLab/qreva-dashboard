import React from 'react';

export default function AgentPerformance({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
        <h3 className="text-lg font-bold text-[#084059] mb-4">Agent Performance</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const formatCur = (val) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(val).replace('NGN', '\u20A6');
  const formatNum = (val) => new Intl.NumberFormat().format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
      <h3 className="text-lg font-bold text-[#084059] mb-4">Agent Performance</h3>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[11px] text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium text-left">Agent</th>
              <th className="px-4 py-3 font-medium text-left">Location</th>
              <th className="px-4 py-3 font-medium text-left">Aggregator</th>
              <th className="px-4 py-3 font-medium text-right">Transaction Value</th>
              <th className="px-4 py-3 font-medium text-right text-green-600">Qreva Revenue Generated</th>
              <th className="px-4 py-3 font-medium text-left">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr key={row._id || index} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 text-gray-500 font-medium">
                  <div className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#FF8A4C" }}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-[#084059]">{row.name}</td>
                <td className="px-4 py-4 text-gray-600">{row.location}</td>
                <td className="px-4 py-4 text-gray-600">{row.aggregator}</td>
                <td className="px-4 py-4 text-right font-medium text-gray-800">{formatCur(row.transactionValue)}</td>
                <td className="px-4 py-4 text-right font-bold text-green-600">{formatCur(row.qrevaRevenue)}</td>
                <td className="px-4 py-4 text-gray-600">{row.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex">
        <a href="#" className="text-[#FF5B04] font-semibold text-sm hover:underline flex items-center gap-1">
          View all agents <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
