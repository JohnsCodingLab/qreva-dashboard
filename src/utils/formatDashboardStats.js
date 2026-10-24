const RANGE_SUBTEXT = {
  today: 'Current day total',
  yesterday: 'Previous day total',
  last12hours: 'In the last 12 hours',
  hourly: 'In the last 1 hour',
  weekly: 'In the last 7 days',
  current_week: 'This week',
  monthly: 'In the last 30 days',
  current_month: 'This month',
  previous_month: 'Previous month',
  quarter: 'This quarter',
  yearly: 'In the last 12 months',
  year: 'This year',
  custom: 'Selected date range'
};

export const formatDashboardStats = (summary, changePercentages = {}, timeFilter = 'today') => {
  if (!summary) return null;

  const filterKey = typeof timeFilter === 'object' ? timeFilter.range : timeFilter;
  const periodLabel = RANGE_SUBTEXT[filterKey] || RANGE_SUBTEXT.today;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getChange = (val) => {
    if (val === undefined || val === null) return '0%';
    const prefix = val > 0 ? '+' : '';
    return `${prefix}${val}%`;
  };

  return [
    {
      label: 'Total Transaction Volume',
      value: formatNumber(summary.totalTransactions || 0),
      change: getChange(changePercentages.totalTransactions),
      subtext: periodLabel,
    },
    {
      label: 'Total Transaction Value',
      value: formatCurrency(summary.totalTransactionVolume || 0),
      change: getChange(changePercentages.totalTransactionVolume),
      subtext: periodLabel,
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue || 0),
      change: getChange(changePercentages.totalRevenue),
      subtext: periodLabel,
    },
    {
      label: 'Success Rate',
      value: `${summary.successRate || 0}%`,
      change: getChange(changePercentages.successRate),
      subtext: periodLabel,
    },
  ];
};