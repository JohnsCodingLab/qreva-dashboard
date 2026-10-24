import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@mui/x-charts/LineChart';

const TIME_RANGE_TITLE = {
  today: 'Daily Transaction Value',
  hourly: 'Hourly Transaction Value',
  last12hours: 'Hourly Transaction Value',
  weekly: 'Weekly Transaction Value',
  monthly: 'Monthly Transaction Value',
  yearly: 'Yearly Transaction Value',
};

const TransactionVolumeChart = ({ data = [], title, timeFilter }) => {
  const resolvedTitle = title || TIME_RANGE_TITLE[timeFilter] || 'Daily Transaction Value';

  // Format labels for x-axis
  const getXAxisLabel = (index) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Yesterday';
    return `${index} days`;
  };

  const formatYAxis = (value) => {
    const formatNumber = (num, divisor, suffix) => {
      const result = num / divisor;
      // Show decimal only if needed and value is small
      const decimals = (result < 10 && result % 1 !== 0) ? 1 : 0;
      return `N${result.toFixed(decimals)}${suffix}`;
    };

    const absValue = Math.abs(value);

    if (absValue >= 1000000) {
      return formatNumber(value, 1000000, 'M');
    } else if (absValue >= 1000) {
      return formatNumber(value, 1000, 'K');
    } else {
      return `N${value}`;
    }
  };

  const isEmpty = !data || data.length === 0 || data.every(d => !d.value);

  return (
    <Card className="mb-1 h-full">
      <CardHeader>
        <CardTitle className="text-base font-urbanist font-semibold text-[#1E1E1E]">
          {resolvedTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-[#084059]">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D0D5DD] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <p className="text-sm font-general">No data available</p>
          </div>
        ) : (
          <LineChart
            xAxis={[{
              data: data.map((d, idx) => d.label || getXAxisLabel(idx)),
              scaleType: 'point',
              tickLabelStyle: {
                fontSize: 12,
                fill: '#084059',
                fontFamily: 'General Sans, sans-serif'
              },
              axisLine: {
                stroke: '#D0D5DD',
                strokeWidth: 1
              },
              tickLine: {
                stroke: 'none'
              }
            }]}
            yAxis={[{
              valueFormatter: formatYAxis,
              tickLabelStyle: {
                fontSize: 12,
                fill: '#084059',
                fontFamily: 'General Sans, sans-serif'
              },
              axisLine: {
                stroke: 'none'
              },
              tickLine: {
                stroke: 'none'
              }
            }]}
            series={[{
              data: data.map(d => d.value),
              area: true,
              color: '#06b6d4',
              curve: 'natural',
              showMark: false
            }]}
            height={300}
            margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
            grid={{
              vertical: false,
              horizontal: true,
              horizontalStrokeDasharray: '4 4'
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
                strokeWidth: 1
              },
              '.MuiChartsAxis-left .MuiChartsAxis-line': {
                stroke: 'none'
              },
              '.MuiChartsAxis-left .MuiChartsAxis-tick': {
                stroke: 'none'
              },
              '.MuiChartsAxis-bottom .MuiChartsAxis-tick': {
                stroke: 'none'
              },
              '.MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
                transform: 'translateX(-10px)',
                fontSize: '11px',
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionVolumeChart;