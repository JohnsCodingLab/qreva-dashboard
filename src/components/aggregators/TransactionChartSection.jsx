import PaymentComparisonPie from '@/components/charts/PaymentComparisonPie';
import MultiLineChart from '@/components/charts/MultiLineChart';

const defaultPieData = [
  { id: 0, value: 0, label: 'Card Payments', color: '#E85304' },
  { id: 1, value: 0, label: 'QR Payments', color: '#26C8B9' },
];

const TransactionChartsSection = ({ chartData, chartSeries, pieData }) => {
  const resolvedPieData = pieData || defaultPieData;

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PaymentComparisonPie
          data={resolvedPieData}
          title="Card Payments vs QR Payments %"
          showPercentage={true}
        />
        <PaymentComparisonPie
          data={resolvedPieData}
          title="Card Payments vs QR Payments Commission"
          showPercentage={false}
        />
      </div>

      <MultiLineChart
        data={chartData}
        series={chartSeries}
        title="Daily Transaction Volume"
      />
    </>
  );
};

export default TransactionChartsSection;
