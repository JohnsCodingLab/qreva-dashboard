import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@mui/x-charts/LineChart';

const TIME_RANGE_TITLE = {
  today: 'Daily Transaction Value',
  hourly: 'Hourly Transaction Value',
  last12hours: 'Hourly Transaction Value',
  weekly: 'Weekly Transaction Value',
  monthly: 'Monthly Transaction Value',
  yearly: 'Yearly Transaction Value',
  all: 'Transaction Trend',
  custom: 'Transaction Trend',
};

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

const getXAxisLabel = (index) => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Yesterday';
  return `${index} days`;
};

const formatYAxis = (value) => {
  const formatNumber = (num, divisor, suffix) => {
    const result = num / divisor;
    const decimals = result < 10 && result % 1 !== 0 ? 1 : 0;
    return `₦${result.toFixed(decimals)}${suffix}`;
  };

  const absValue = Math.abs(value);

  if (absValue >= 1000000) {
    return formatNumber(value, 1000000, 'M');
  } else if (absValue >= 1000) {
    return formatNumber(value, 1000, 'K');
  } else {
    return `₦${value.toLocaleString()}`;
  }
};

export default function TransactionTrendChart({ data = [], title, timeFilter, loading = false }) {
  const filterKey = typeof timeFilter === 'string' ? timeFilter : timeFilter?.range;
  const resolvedTitle = title || TIME_RANGE_TITLE[filterKey] || 'Transaction Trend';

  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map((d, idx) => {
      const rawLabel = d.label || d.date || d.name || getXAxisLabel(idx);
      const val =
        d.value !== undefined
          ? Number(d.value)
          : d.valueMillions !== undefined
          ? Number(d.valueMillions) * 1000000
          : d.amount !== undefined
          ? Number(d.amount)
          : 0;

      return {
        label: formatDateLabel(rawLabel),
        value: val,
      };
    });
  }, [data]);

  const isEmpty = !loading && (chartData.length === 0 || chartData.every((d) => !d.value));

  return (
    <Card className="mb-1 h-full bg-white rounded-xl border border-slate-200/80 card-shadow flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-urbanist font-semibold text-[#1E1E1E]">
          {resolvedTitle}
        </CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">Transaction value progression over time</p>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-[#084059]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qreva-orange mb-3"></div>
            <p className="text-sm font-general text-slate-400">Loading transaction trend...</p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-[#084059]">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D0D5DD] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <p className="text-sm font-general text-slate-500">No data available</p>
          </div>
        ) : (
          <LineChart
            xAxis={[
              {
                data: chartData.map((d, idx) => d.label || getXAxisLabel(idx)),
                scaleType: 'point',
                tickLabelStyle: {
                  fontSize: 11,
                  fill: '#084059',
                  fontFamily: 'General Sans, sans-serif',
                },
                axisLine: {
                  stroke: '#D0D5DD',
                  strokeWidth: 1,
                },
                tickLine: {
                  stroke: 'none',
                },
              },
            ]}
            yAxis={[
              {
                valueFormatter: formatYAxis,
                tickLabelStyle: {
                  fontSize: 11,
                  fill: '#084059',
                  fontFamily: 'General Sans, sans-serif',
                },
                axisLine: {
                  stroke: 'none',
                },
                tickLine: {
                  stroke: 'none',
                },
              },
            ]}
            series={[
              {
                data: chartData.map((d) => d.value),
                area: true,
                color: '#06b6d4',
                curve: 'natural',
                showMark: chartData.length === 1,
                valueFormatter: (value) => (value ? `₦${Math.round(value).toLocaleString()}` : '₦0'),
              },
            ]}
            height={300}
            margin={{ left: 65, right: 20, top: 20, bottom: 40 }}
            grid={{
              vertical: false,
              horizontal: true,
              horizontalStrokeDasharray: '4 4',
            }}
            sx={{
              '.MuiLineElement-root': {
                strokeWidth: 2,
              },
              '.MuiAreaElement-root': {
                fillOpacity: 0.1,
              },
              '.MuiChartsGrid-line': {
                stroke: '#E8EBED',
                strokeDasharray: '4 4',
              },
              '.MuiChartsAxis-bottom .MuiChartsAxis-line': {
                stroke: '#D0D5DD',
                strokeWidth: 1,
              },
              '.MuiChartsAxis-left .MuiChartsAxis-line': {
                stroke: 'none',
              },
              '.MuiChartsAxis-left .MuiChartsAxis-tick': {
                stroke: 'none',
              },
              '.MuiChartsAxis-bottom .MuiChartsAxis-tick': {
                stroke: 'none',
              },
              '.MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
                transform: 'translateX(-10px)',
                fontSize: '11px',
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
