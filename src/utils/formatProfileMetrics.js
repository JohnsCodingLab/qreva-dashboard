export const formatProfileMetrics = (metricsResponse, fallbackStats = []) => {
  const metricsData = metricsResponse?.data || metricsResponse || {};
  const responseStats = metricsData?.stats;

  if (Array.isArray(responseStats) && responseStats.length > 0) {
    return responseStats;
  }

  const totalTransactions =
    metricsData?.totalTransactions ??
    metricsData?.transactions ??
    metricsData?.transactionCount;
  const totalVolume =
    metricsData?.totalVolume ??
    metricsData?.transactionVolume ??
    metricsData?.volume;
  const totalCommissions =
    metricsData?.totalCommissions ??
    metricsData?.totalCommission ??
    metricsData?.commission;

  const hasMetricValue = [totalTransactions, totalVolume, totalCommissions].some(
    (value) => value !== undefined && value !== null,
  );

  if (!hasMetricValue) {
    return fallbackStats || [];
  }

  return [
    {
      label: 'Total Transactions',
      value: Number(totalTransactions || 0).toLocaleString('en-US'),
      change: metricsData?.transactionsChange || '',
      subtext: metricsData?.transactionsSubtext || 'Transactions by this profile',
    },
    {
      label: 'Transaction Volume',
      value: `\u20a6${Number(totalVolume || 0).toLocaleString('en-US')}`,
      change: metricsData?.volumeChange || '',
      subtext: metricsData?.volumeSubtext || 'Total processed value',
    },
    {
      label: 'Commission',
      value: `\u20a6${Number(totalCommissions || 0).toLocaleString('en-US')}`,
      change: metricsData?.commissionChange || '',
      subtext: metricsData?.commissionSubtext || 'Total earned commission',
    },
  ];
};

export const getProfileChartData = (metricsResponse, fallbackChartData = []) => {
  const metricsData = metricsResponse?.data || metricsResponse || {};
  return metricsData?.chartData || fallbackChartData || [];
};
