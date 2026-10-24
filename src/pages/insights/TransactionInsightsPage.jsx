import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Activity,
  Calendar,
  Download,
  PieChart as PieChartIcon,
  Layers,
  Zap,
  Phone,
  Tv,
  CreditCard,
  PiggyBank,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import PageHeader from '@/components/common/PageHeader';
import { getDefaultDateRange } from '@/components/common/DateRangePicker';
import { useTransactions } from '@/store/features/transactions/useTransactions';

const PERIOD_OPTIONS = [
  { id: '7d', label: 'Last 7 Days', range: 'week' },
  { id: 'this_month', label: 'This Month', range: 'current_month' },
  { id: '30d', label: 'Last 30 Days', range: 'month' },
  { id: 'prev_month', label: 'Last Month', range: 'previous_month' },
  { id: 'year', label: 'This Year', range: 'year' },
];

const CATEGORY_COLORS = {
  Transfers: '#3B82F6',
  'Airtime & Data': '#10B981',
  Electricity: '#F59E0B',
  'Cable TV': '#8B5CF6',
  'POS / SoftPOS': '#EC4899',
  'Smart Savings': '#06B6D4',
  Other: '#64748B',
};

const formatNaira = (val) => {
  const num = Number(val || 0);
  return '₦' + num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatCompactNaira = (val) => {
  const num = Number(val || 0);
  if (num >= 1_000_000) return '₦' + (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return '₦' + (num / 1_000).toFixed(0) + 'K';
  return '₦' + num.toFixed(0);
};

export default function TransactionInsightsPage() {
  const [timeFilter, setTimeFilter] = useState(() => getDefaultDateRange('current_month'));
  const [selectedPeriodTab, setSelectedPeriodTab] = useState('this_month');

  // Fetch transactions in selected window
  const { data: transactionRes, isLoading } = useTransactions({
    limit: 200,
    from: timeFilter.from,
    to: timeFilter.to,
  });

  const transactions = transactionRes?.data || [];

  // Compute Analytics and Metrics
  const insights = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let inflowCount = 0;
    let outflowCount = 0;
    let largestOutflow = null;
    let largestInflow = null;

    const categoryMap = {
      Transfers: { amount: 0, count: 0 },
      'Airtime & Data': { amount: 0, count: 0 },
      Electricity: { amount: 0, count: 0 },
      'Cable TV': { amount: 0, count: 0 },
      'POS / SoftPOS': { amount: 0, count: 0 },
      'Smart Savings': { amount: 0, count: 0 },
      Other: { amount: 0, count: 0 },
    };

    const channelMap = {
      Transfer: 0,
      'Card / SoftPOS': 0,
      Bills: 0,
      Wallet: 0,
    };

    const trendByDate = {};

    transactions.forEach((tx) => {
      const amount = Math.abs(Number(tx.amount || 0));
      const type = (tx.type || tx.category || '').toLowerCase();
      const narration = (tx.title || tx.narration || tx.desc || '').toLowerCase();
      const status = (tx.status || '').toLowerCase();

      // Only count successful/completed transactions
      if (status === 'failed' || status === 'reversed') return;

      const isInflow =
        type.includes('credit') ||
        type.includes('inward') ||
        type.includes('deposit') ||
        narration.includes('inward') ||
        narration.includes('received');

      // Date key for trend
      const rawDate = tx.createdAt ? new Date(tx.createdAt) : new Date();
      const dateKey = rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!trendByDate[dateKey]) {
        trendByDate[dateKey] = { date: dateKey, timestamp: rawDate.getTime(), inflow: 0, outflow: 0 };
      }

      if (isInflow) {
        totalInflow += amount;
        inflowCount++;
        trendByDate[dateKey].inflow += amount;
        if (!largestInflow || amount > largestInflow.amount) {
          largestInflow = { ...tx, amount };
        }
      } else {
        totalOutflow += amount;
        outflowCount++;
        trendByDate[dateKey].outflow += amount;
        if (!largestOutflow || amount > largestOutflow.amount) {
          largestOutflow = { ...tx, amount };
        }

        // Categorize Outflows
        if (type.includes('transfer') || narration.includes('transfer')) {
          categoryMap['Transfers'].amount += amount;
          categoryMap['Transfers'].count += 1;
          channelMap['Transfer'] += amount;
        } else if (type.includes('airtime') || type.includes('data') || narration.includes('airtime') || narration.includes('data')) {
          categoryMap['Airtime & Data'].amount += amount;
          categoryMap['Airtime & Data'].count += 1;
          channelMap['Bills'] += amount;
        } else if (type.includes('electric') || type.includes('power') || narration.includes('electric')) {
          categoryMap['Electricity'].amount += amount;
          categoryMap['Electricity'].count += 1;
          channelMap['Bills'] += amount;
        } else if (type.includes('tv') || type.includes('dstv') || type.includes('gotv') || narration.includes('cable')) {
          categoryMap['Cable TV'].amount += amount;
          categoryMap['Cable TV'].count += 1;
          channelMap['Bills'] += amount;
        } else if (type.includes('softpos') || type.includes('pos') || narration.includes('terminal')) {
          categoryMap['POS / SoftPOS'].amount += amount;
          categoryMap['POS / SoftPOS'].count += 1;
          channelMap['Card / SoftPOS'] += amount;
        } else if (type.includes('saving') || narration.includes('saving')) {
          categoryMap['Smart Savings'].amount += amount;
          categoryMap['Smart Savings'].count += 1;
          channelMap['Wallet'] += amount;
        } else {
          categoryMap['Other'].amount += amount;
          categoryMap['Other'].count += 1;
          channelMap['Wallet'] += amount;
        }
      }
    });

    const netCashflow = totalInflow - totalOutflow;
    const totalTransactions = inflowCount + outflowCount;
    const avgTicket = totalTransactions > 0 ? (totalInflow + totalOutflow) / totalTransactions : 0;

    // Format Categories for Charts
    const categorySpending = Object.entries(categoryMap)
      .map(([name, stat]) => ({
        name,
        amount: stat.amount,
        count: stat.count,
        percentage: totalOutflow > 0 ? (stat.amount / totalOutflow) * 100 : 0,
        color: CATEGORY_COLORS[name] || '#64748B',
      }))
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    // Format Trend Points chronologically
    const trendPoints = Object.values(trendByDate)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-14);

    return {
      totalInflow,
      totalOutflow,
      netCashflow,
      inflowCount,
      outflowCount,
      totalTransactions,
      avgTicket,
      largestOutflow,
      largestInflow,
      categorySpending,
      trendPoints,
    };
  }, [transactions]);

  // Handle Export CSV
  const handleExportCsv = () => {
    const rows = [
      ['Date', 'Title', 'Reference', 'Category', 'Type', 'Status', 'Amount (NGN)'],
      ...transactions.map((t) => [
        t.date || '',
        `"${(t.title || '').replace(/"/g, '""')}"`,
        t.reference || t.sessionId || '',
        t.category || '',
        t.type || '',
        t.status || '',
        t.amount || 0,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qreva_insights_${timeFilter.from}_to_${timeFilter.to}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <PageHeader
        title="Transaction Insights & Analytics"
        subtitle="Comprehensive visual overview of your cashflows, spending categories, and high-impact transaction patterns."
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        actionButton={
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 rounded-xl bg-[#00A859] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#008f4c] transition-colors"
          >
            <Download size={16} />
            Export Insights (CSV)
          </button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Total Inflow */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Inflow</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-urbanist text-gray-900">{formatNaira(insights.totalInflow)}</h3>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              <span className="text-emerald-600 font-semibold">{insights.inflowCount}</span> incoming credits
            </p>
          </div>
        </div>

        {/* Total Outflow */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Outflow</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-urbanist text-gray-900">{formatNaira(insights.totalOutflow)}</h3>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              <span className="text-rose-600 font-semibold">{insights.outflowCount}</span> debits & payments
            </p>
          </div>
        </div>

        {/* Net Cashflow */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Net Cashflow</span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                insights.netCashflow >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {insights.netCashflow >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
          </div>
          <div className="mt-3">
            <h3
              className={`text-2xl font-bold font-urbanist ${
                insights.netCashflow >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {insights.netCashflow >= 0 ? '+' : ''}
              {formatNaira(insights.netCashflow)}
            </h3>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              {insights.netCashflow >= 0 ? 'Surplus / Net Positive' : 'Deficit / High Outflow'}
            </p>
          </div>
        </div>

        {/* Avg Ticket Size */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Average Transaction</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-urbanist text-gray-900">{formatNaira(insights.avgTicket)}</h3>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              Across <span className="text-gray-900 font-semibold">{insights.totalTransactions}</span> transactions
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Cashflow Trends Area Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold font-urbanist text-gray-900">Cashflow Trend (Inflow vs Outflow)</h2>
              <p className="text-xs text-gray-500 font-medium">Daily money in and money out over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block"></span>
                <span>Inflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block"></span>
                <span>Outflow</span>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full">
            {insights.trendPoints.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No cashflow activity recorded in this selected timeframe.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insights.trendPoints} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={formatCompactNaira} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [formatNaira(val), '']}
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#FFF',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inflow"
                    name="Inflow"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#inflowGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="outflow"
                    name="Outflow"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#outflowGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Spending Donut Chart (1 Col) */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold font-urbanist text-gray-900">Spending by Category</h2>
            <p className="text-xs text-gray-500 font-medium">Outflow distribution across services</p>
          </div>

          <div className="h-[200px] w-full my-2">
            {insights.categorySpending.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No outflows recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insights.categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {insights.categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatNaira(val)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category List */}
          <div className="space-y-2 mt-2">
            {insights.categorySpending.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                  <span className="text-gray-700 font-medium">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{formatNaira(c.amount)}</span>
                  <span className="text-gray-400">({c.percentage.toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Largest Expense & Category Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Largest Single Expense Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold font-urbanist text-gray-900 mb-1">Peak Transactions</h2>
          <p className="text-xs text-gray-500 font-medium mb-4">Highest value transactions in selected timeframe</p>

          <div className="space-y-4">
            {/* Peak Inflow */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Highest Credit Inflow</span>
              {insights.largestInflow ? (
                <div className="mt-2">
                  <div className="text-xl font-bold font-urbanist text-emerald-800">
                    {formatNaira(insights.largestInflow.amount)}
                  </div>
                  <div className="text-xs text-emerald-900 mt-1 font-medium truncate">
                    {insights.largestInflow.title || insights.largestInflow.desc}
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">{insights.largestInflow.date}</div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-emerald-700">No inflow recorded yet.</div>
              )}
            </div>

            {/* Peak Outflow */}
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Highest Debit Outflow</span>
              {insights.largestOutflow ? (
                <div className="mt-2">
                  <div className="text-xl font-bold font-urbanist text-rose-800">
                    {formatNaira(insights.largestOutflow.amount)}
                  </div>
                  <div className="text-xs text-rose-900 mt-1 font-medium truncate">
                    {insights.largestOutflow.title || insights.largestOutflow.desc}
                  </div>
                  <div className="text-[11px] text-rose-600 mt-0.5">{insights.largestOutflow.date}</div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-rose-700">No outflow recorded yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Category Breakdown Table (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold font-urbanist text-gray-900 mb-1">Detailed Category Breakdown</h2>
          <p className="text-xs text-gray-500 font-medium mb-4">Volume, count, and percentage share across all categories</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Transactions</th>
                  <th className="pb-3 font-semibold text-right">Total Amount</th>
                  <th className="pb-3 font-semibold text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {insights.categorySpending.map((cat) => (
                  <tr key={cat.name} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 font-medium text-gray-900 flex items-center gap-2.5">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      {cat.name}
                    </td>
                    <td className="py-3 text-gray-600 font-medium">{cat.count} txs</td>
                    <td className="py-3 text-right font-semibold text-gray-900">{formatNaira(cat.amount)}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(cat.percentage, 100)}%`, backgroundColor: cat.color }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 w-8">{cat.percentage.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
