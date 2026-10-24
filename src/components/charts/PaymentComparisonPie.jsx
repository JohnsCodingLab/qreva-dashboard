import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from '@mui/x-charts/PieChart';

const PaymentComparisonPie = ({ 
  data, 
  title, 
  showPercentage = true,
  amountData = null 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-[#1E1E1E] font-urbanist font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {(!data || data.length === 0 || data.every(d => !d.value)) ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-[#084059]">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D0D5DD] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            </div>
            <p className="text-sm font-general">No data available</p>
          </div>
        ) : (
        <div className="flex flex-col items-center">
          <PieChart
            series={[{
              data: data,
              innerRadius: 80,
              outerRadius: 100,
              paddingAngle: 0,
              cornerRadius: 5,
            }]}
            height={200}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            slotProps={{
              legend: { hidden: true }
            }}
          />
          <div className="flex gap-6 mt-4">
            {data.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="w-1 h-7 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-[#808C91] font-general  ">{item.label}</span>
                <span className="text-sm font-medium">
                  {showPercentage ? `${item.value}%` : amountData?.[idx] || ''}
                </span>
              </div>
            ))}
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentComparisonPie;