import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@mui/x-charts/BarChart';

const TIME_RANGE_TITLE = {
  today: 'Daily Transaction Count',
  hourly: 'Hourly Transaction Count',
  last12hours: 'Hourly Transaction Count',
  weekly: 'Weekly Transaction Count',
  monthly: 'Monthly Transaction Count',
  yearly: 'Yearly Transaction Count',
};

const BarChartComponent = ({
  data = [],
  series = [],
  title,
  timeFilter,
  height = 300
}) => {
  const resolvedTitle = title || TIME_RANGE_TITLE[timeFilter] || 'Daily Transaction Count';
  const getXAxisLabel = (index) => {
    const labels = [
      'Today', 'Yesterday', '2 Days Ago', '3 Days Ago', '4 Days Ago', 
      '5 Days Ago', '6 Days Ago', '7 Days Ago', 'Week Ago', 
      '2 Weeks Ago', '3 Weeks Ago', '4 Weeks Ago'
    ];
    return labels[index] || `${index} days ago`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-urbanist font-semibold text-[#1E1E1E]">
            {resolvedTitle}
          </CardTitle>
          <div className="flex gap-4">
            {series.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: s.color }}
                ></div>
                <span className="text-xs font-general text-[#084059]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {(!data || data.length === 0 || data.every(d => !d.value && !d.count) || !series.length || series.every(s => !s.data || s.data.length === 0)) ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-[#084059]">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D0D5DD] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/></svg>
            </div>
            <p className="text-sm font-general">No data available</p>
          </div>
        ) : (
        <BarChart
          xAxis={[{ 
            data: data.map((d, idx) => d.label || getXAxisLabel(idx)),
            scaleType: 'band',
            tickLabelStyle: { 
              fontSize: 12,
              fill: '#084059',
              fontFamily: 'General Sans, sans-serif',
              transform: 'rotate(0deg)',
            },
          }]}
          series={series.map(s => ({
            data: s.data,
            color: s.color,
            label: s.label,
          }))}
          height={height}
          margin={{ left: 50, right: 20, top: 20, bottom: 40 }}
          grid={{
            horizontal: true,
          }}
          sx={{
             ".MuiChartsAxis-left .MuiChartsAxis-line": {
              stroke: "transparent",
            },
            ".MuiChartsGrid-horizontal line": {
              stroke: "#BCC6CC",
              strokeDasharray: "4 4",
              opacity: 0.4,
            },
            ".MuiChartsAxis-bottom .MuiChartsAxis-line": {
              stroke: "transparent",
            },
            ".MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
              dy: "10px",
            },
            ".MuiBarElement-root": {
              rx: 4,
            },
          }}
        />
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;