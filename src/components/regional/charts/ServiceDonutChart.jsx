import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function ServiceDonutChart({ data, totalFormatted = '₦0' }) {
  const normalizedData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    const defaultColors = ['#FF5B04', '#084059', '#26C8B9', '#82ca9d', '#8884d8'];
    return data.map((item, index) => ({
      ...item,
      color: item.color || defaultColors[index % defaultColors.length],
      percentage: item.percentage !== undefined ? item.percentage : item.value,
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-black text-white p-3 rounded-lg text-xs shadow-xl border border-qreva-navy">
          <div className="font-bold mb-1" style={{ color: d.color }}>{d.name}</div>
          {d.displayValue && <div>Value: {d.displayValue}</div>}
          {d.count !== undefined && <div className="text-slate-300">Volume: {d.count?.toLocaleString()} txns</div>}
          <div className="text-slate-400 mt-1">Share: {d.percentage}%</div>
        </div>
      );
    }
    return null;
  };

  // Only pass non-zero slices to Pie so zero-slices don't distort angles or leave gaps
  const chartSlices = React.useMemo(() => {
    return normalizedData.filter(d => Number(d.percentage ?? d.value ?? 0) > 0);
  }, [normalizedData]);

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 card-shadow h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="font-bold text-black text-sm tracking-tight">Transaction by Service</h3>
        <p className="text-xs text-slate-400 mt-0.5">Value distribution across eligible income services</p>
      </div>

      {/* Donut Chart + Legend Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-auto pt-2">
        {/* Donut Container with Center Label */}
        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {chartSlices.length > 0 && <Tooltip content={<CustomTooltip />} />}
              {chartSlices.length > 0 ? (
                <Pie
                  data={chartSlices}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={chartSlices.length > 1 ? 3 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {chartSlices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              ) : (
                <Pie
                  data={[{ value: 1 }]}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false}
                >
                  <Cell fill="#E2E8F0" />
                </Pie>
              )}
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm font-black text-black leading-none">{totalFormatted}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Total Value</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-3 pl-2">
          {normalizedData.map((item) => (
            <div key={item.name} className="flex items-start gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-qreva-navy flex items-center justify-between">
                  <span>{item.name}</span>
                </div>
                <div className="text-[11px] text-qreva-navy font-medium mt-0.5">
                  {item.displayValue} <span className="text-slate-400">({item.percentage}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
