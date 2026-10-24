import React, { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const formatDateLabel = (dateStr) => {
  if (!dateStr) return '';
  if (typeof dateStr !== 'string') return String(dateStr);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const parts = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
    const day = parseInt(parts[2], 10);
    return `${day} ${month}`;
  }
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const parts = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
    return `${month} ${parts[0]}`;
  }
  return dateStr;
};

export default function NetworkGrowthChart({ data, dataByTimeframe, loading = false }) {
  const { xLabels, agentsData, merchantsData, aggregatorsData, aggregatorManagersData } = useMemo(() => {
    let sourceData = [];

    if (Array.isArray(data)) {
      sourceData = data;
    } else if (dataByTimeframe?.daily) {
      sourceData = dataByTimeframe.daily;
    } else if (Array.isArray(dataByTimeframe)) {
      sourceData = dataByTimeframe;
    }

    if (!Array.isArray(sourceData) || sourceData.length === 0) {
      return { xLabels: [], agentsData: [], merchantsData: [], aggregatorsData: [], aggregatorManagersData: [] };
    }

    sourceData = sourceData.map((d) => ({
      ...d,
      date: formatDateLabel(d.date || d.label),
    }));

    // To prevent overcrowding when date range is wide (e.g. 30+ days)
    if (sourceData.length > 31) {
      const sampled = [];
      const step = Math.ceil(sourceData.length / 30);
      for (let i = 0; i < sourceData.length; i += step) {
        const slice = sourceData.slice(i, i + step);
        sampled.push({
          date: slice[0].date,
          agents: slice.reduce((acc, c) => acc + (Number(c.agents) || 0), 0),
          merchants: slice.reduce((acc, c) => acc + (Number(c.merchants) || 0), 0),
          aggregators: slice.reduce((acc, c) => acc + (Number(c.aggregators) || 0), 0),
          aggregatorManagers: slice.reduce((acc, c) => acc + (Number(c.aggregatorManagers) || 0), 0),
        });
      }
      sourceData = sampled;
    }

    return {
      xLabels: sourceData.map((d) => d.date || ''),
      agentsData: sourceData.map((d) => Number(d.agents || 0)),
      merchantsData: sourceData.map((d) => Number(d.merchants || 0)),
      aggregatorsData: sourceData.map((d) => Number(d.aggregators || 0)),
      aggregatorManagersData: sourceData.map((d) => Number(d.aggregatorManagers || 0)),
    };
  }, [data, dataByTimeframe]);

  const isEmpty = !loading && xLabels.length === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <div className="mb-5">
        <h3 className="font-bold text-black text-sm tracking-tight">Network Growth</h3>
        <p className="text-xs text-slate-400 mt-0.5">New Agents, Merchants, and Aggregators</p>
      </div>

      {/* Chart Area */}
      <div className="h-64 w-full flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qreva-orange mb-2"></div>
            <span>Loading network growth...</span>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center text-slate-400 text-sm">
            No onboarding data available
          </div>
        ) : (
          <BarChart
            series={[
              { data: agentsData, label: 'Agents', color: '#FF5B04', stack: 'total' },
              { data: merchantsData, label: 'Merchants', color: '#26C8B9', stack: 'total' },
              { data: aggregatorsData, label: 'Aggregators', color: '#084059', stack: 'total' },
              { data: aggregatorManagersData, label: 'Aggregator Managers', color: '#B0BEC5', stack: 'total' },
            ]}
            xAxis={[
              {
                scaleType: 'band',
                data: xLabels,
                tickLabelStyle: { fill: '#64748b', fontSize: 10, fontFamily: 'sans-serif' },
              },
            ]}
            yAxis={[
              {
                min: 0,
                tickLabelStyle: { fill: '#64748b', fontSize: 10, fontFamily: 'sans-serif' },
              },
            ]}
            height={240}
            margin={{ left: 35, right: 20, top: 20, bottom: 30 }}
          />
        )}
      </div>
    </div>
  );
}
