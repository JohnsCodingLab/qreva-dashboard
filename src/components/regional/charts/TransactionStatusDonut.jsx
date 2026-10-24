import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const STATUS_COLORS = {
  Completed: '#26C8B9',
  Pending: '#F59E0B',
  Failed: '#EF4444',
};

export default function TransactionStatusDonut({ data }) {
  // Normalize data to ensure it has name, count, percentage, and color
  const normalizedData = React.useMemo(() => {
    const defaultList = [
      { name: 'Completed', count: 0, color: STATUS_COLORS.Completed },
      { name: 'Pending', count: 0, color: STATUS_COLORS.Pending },
      { name: 'Failed', count: 0, color: STATUS_COLORS.Failed },
    ];

    const source = (data && data.length > 0) ? data : defaultList;
    const totalCount = source.reduce((acc, curr) => acc + Number(curr.count ?? curr.value ?? 0), 0);

    return source.map((item, index) => {
      const name = item.name || item.label || item.status || item.id || `Status ${index + 1}`;
      const count = Number(item.count ?? item.value ?? 0);
      const percentage = item.percentage !== undefined
        ? Number(item.percentage).toFixed(2)
        : (totalCount > 0 ? ((count / totalCount) * 100).toFixed(2) : '0.00');

      return {
        ...item,
        name,
        count,
        percentage,
        color: item.color || STATUS_COLORS[name] || [STATUS_COLORS.Completed, STATUS_COLORS.Pending, STATUS_COLORS.Failed][index % 3],
      };
    });
  }, [data]);

  const total = React.useMemo(() => {
    return normalizedData.reduce((acc, curr) => acc + curr.count, 0);
  }, [normalizedData]);

  // Only pass non-zero slices to Pie so zero-slices don't induce padding gaps or distort the circle
  const chartSlices = React.useMemo(() => {
    return normalizedData.filter(d => d.count > 0);
  }, [normalizedData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-black text-white p-2.5 rounded-lg text-xs shadow-xl border border-qreva-navy">
          <div className="font-bold mb-1" style={{ color: d.color }}>{d.name}</div>
          <div>Volume: {d.count?.toLocaleString()}</div>
          <div className="text-slate-400 mt-0.5">Share: {d.percentage}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 card-shadow h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="font-bold text-black text-sm tracking-tight">Transaction Status</h3>
        <p className="text-xs text-slate-400 mt-0.5">Overall execution health</p>
      </div>

      {/* Donut & Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 my-auto pt-2">
        {/* Donut */}
        <div className="h-40 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {chartSlices.length > 0 && <Tooltip content={<CustomTooltip />} />}
              {chartSlices.length > 0 ? (
                <Pie
                  data={chartSlices}
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={chartSlices.length > 1 ? 3 : 0}
                  dataKey="count"
                  stroke="none"
                >
                  {chartSlices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              ) : (
                <Pie
                  data={[{ count: 1 }]}
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={0}
                  dataKey="count"
                  stroke="none"
                  isAnimationActive={false}
                >
                  <Cell fill="#E2E8F0" />
                </Pie>
              )}
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-bold text-qreva-navy leading-none">{total?.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 pl-2">
          {normalizedData.map((item) => (
            <div key={item.name} className="flex items-start gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-qreva-navy flex items-center justify-between">
                  <span>{item.name}</span>
                </div>
                <div className="text-[11px] text-qreva-navy font-medium">
                  {item.count?.toLocaleString()}{' '}
                  <span className="text-slate-400">({item.percentage}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
