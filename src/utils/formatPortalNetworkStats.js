const formatNumber = (value) => Number(value || 0).toLocaleString('en-US');

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const mapTimeFilterToRange = (timeFilter = 'Today') => {
  const normalized = String(timeFilter || '').trim().toLowerCase();
  switch (normalized) {
    case 'today':
      return 'today';
    case 'hourly':
      return 'hourly';
    case 'last 12 hours':
    case 'last12hours':
      return 'last12hours';
    case 'weekly':
      return 'weekly';
    case 'monthly':
      return 'monthly';
    case 'yearly':
      return 'yearly';
    default:
      return 'today';
  }
};

export const buildPortalNetworkStats = (metrics, role) => {
  const normalizedRole = String(role || '').trim().toLowerCase();
  const totalAgents = Number(metrics?.agents || 0);
  const totalAggregators = Number(metrics?.aggregators || 0);
  const downlineTransactions = Number(metrics?.downlineTransactions || 0);
  const downlineCommission = Number(metrics?.downlineCommission || 0);

  if (normalizedRole === 'aggregator_manager') {
    return [
      {
        label: 'Total Aggregators',
        value: formatNumber(totalAggregators),
        change: String(metrics?.aggregatorsChange || ''),
        subtext: 'Aggregators under you',
      },
      {
        label: 'Total Agents',
        value: formatNumber(totalAgents),
        change: String(metrics?.agentsChange || ''),
        subtext: 'Agents in your network',
      },
      {
        label: 'Total Transactions',
        value: formatNumber(downlineTransactions),
        change: String(metrics?.downlineTransactionsChange || ''),
        subtext: 'Successful downline transactions in period',
      },
      {
        label: 'Total Commission',
        value: formatCurrency(downlineCommission),
        change: String(metrics?.downlineCommissionChange || ''),
        subtext: 'Commission earned from downline in period',
      },
    ];
  }

  return [
    {
      label: 'Total Agents',
      value: formatNumber(totalAgents),
      change: String(metrics?.agentsChange || ''),
      subtext: 'Agents under you',
    },
    {
      label: 'Total Transactions',
      value: formatNumber(downlineTransactions),
      change: String(metrics?.downlineTransactionsChange || ''),
      subtext: 'Successful agent transactions in period',
    },
    {
      label: 'Total Commission',
      value: formatCurrency(downlineCommission),
      change: String(metrics?.downlineCommissionChange || ''),
      subtext: 'Commission earned from agents in period',
    },
  ];
};
