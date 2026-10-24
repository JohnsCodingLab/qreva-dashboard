import React from 'react';

export default function StateManagerPerformance({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
        <h3 className="text-lg font-bold text-[#084059] mb-4">State Manager Performance</h3>
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
      <h3 className="text-lg font-bold text-[#084059] mb-4">State Manager Performance</h3>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[11px] text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">State Manager</th>
              <th className="px-4 py-3 font-medium">State</th>
              <th className="px-4 py-3 font-medium text-center">Network Size</th>
              <th className="px-4 py-3 font-medium text-right">Transactions</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
              <th className="px-4 py-3 font-medium text-right text-green-600">Revenue</th>
              <th className="px-4 py-3 font-medium text-right">Onboarding</th>
              <th className="px-4 py-3 font-medium text-right">Hardware POS Distribution</th>
              <th className="px-4 py-3 font-medium text-right">Target Achievement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((manager, index) => (
              <tr key={manager._id || index} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 text-gray-500 font-medium">
                  <div className="w-6 h-6 rounded-full bg-[#FF8A4C] text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-[#084059]">{manager.name}</td>
                <td className="px-4 py-4 text-gray-600">{manager.state}</td>
                <td className="px-4 py-4 text-center font-medium text-gray-700">{formatNum(manager.networkSize)}</td>
                <td className="px-4 py-4 text-right text-gray-600">{formatNum(manager.transactions)}</td>
                <td className="px-4 py-4 text-right font-medium text-gray-800">{formatCur(manager.value)}</td>
                <td className="px-4 py-4 text-right font-bold text-green-600">{formatCur(manager.revenue)}</td>
                <td className="px-4 py-4 text-right text-gray-600">{formatNum(manager.onboarding)}</td>
                <td className="px-4 py-4 text-right text-gray-600">{formatNum(manager.hardwarePos)}</td>
                <td className="px-4 py-4 text-right text-gray-600">{manager.targetAchievement}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex">
        <a href="#" className="text-[#FF5B04] font-semibold text-sm hover:underline flex items-center gap-1">
          View all state managers <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
