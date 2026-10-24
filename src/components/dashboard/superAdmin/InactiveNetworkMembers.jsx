import React from 'react';

export default function InactiveNetworkMembers({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
        <h3 className="text-lg font-bold text-[#084059] mb-4">Inactive Network Members</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const totalInactive = data.reduce((sum, row) => sum + (row.count || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
      <h3 className="text-lg font-bold text-[#084059] mb-4">Inactive Network Members</h3>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[11px] text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium text-left">Account Type</th>
              <th className="px-4 py-3 font-medium text-left">Number of Inactive Members</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 font-semibold text-[#084059]">{row.accountType}</td>
                <td className="px-4 py-4 text-red-500 font-medium">{row.count}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-100">
            <tr>
              <td className="px-4 py-4 font-bold text-[#084059]">Total</td>
              <td className="px-4 py-4 font-bold text-red-500">{totalInactive}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
