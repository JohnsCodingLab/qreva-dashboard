import React from 'react';

export default function RecentOnboardings({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
        <h3 className="text-lg font-bold text-[#084059] mb-4">Recent Onboardings</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  // Group onboardings by account type
  const groupedCounts = data.reduce((acc, user) => {
    const type = user.accountType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const groupedData = Object.entries(groupedCounts).map(([accountType, count]) => ({
    accountType,
    count
  }));

  const totalOnboardings = data.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-6">
      <h3 className="text-lg font-bold text-[#084059] mb-4">Recent Onboardings</h3>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[11px] text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium text-left">Account Type</th>
              <th className="px-4 py-3 font-medium text-left">Number Recent Onboardings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {groupedData.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 font-semibold text-[#084059]">{row.accountType}</td>
                <td className="px-4 py-4 text-gray-600 font-medium">{row.count}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-bold border-t border-gray-100">
            <tr>
              <td className="px-4 py-3 text-[#084059]">Total</td>
              <td className="px-4 py-3 text-qreva-orange">{totalOnboardings}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
