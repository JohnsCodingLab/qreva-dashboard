import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@mui/x-charts/PieChart";

const DEFAULT_COLORS = ['#26C8B9', '#E85304', '#FF9157', '#FFC535', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];

const TransactionPercentagePie = ({
  data = [],
  title = "Top % Transactions",
  wrapped,
}) => {
  // Normalize API format { provider, percentage } to MUI format { id, value, label, color }
  const normalizedData = useMemo(() => {
    return (data || []).map((item, index) => ({
      id: item.id ?? index,
      value: item.value ?? item.percentage ?? 0,
      label: item.label || item.provider || 'Unknown',
      color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {normalizedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] gap-2">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#E8EBED]" />
            <p className="text-sm text-[#808C91]">No purchase data available</p>
          </div>
        ) : (
          <div
            className={`flex items-center gap-8 ${wrapped ? "flex flex-col justify-between h-full space-y-3" : ""}`}
          >
            <div className="w-full min-w-0">
              <PieChart
                series={[
                  {
                    data: normalizedData,
                    innerRadius: 80,
                    outerRadius: 100,
                    paddingAngle: 0,
                    cornerRadius: 5,
                  },
                ]}
                height={200}
                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                slotProps={{
                  legend: { hidden: true },
                }}
              />
            </div>
            <div className="w-full px-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {normalizedData.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div
                      className="w-1 h-7 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-[#808C91] font-general">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium ml-auto flex items-center gap-1">
                      {item.value}
                      <p className="text-[#808C91]">%</p>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionPercentagePie;
