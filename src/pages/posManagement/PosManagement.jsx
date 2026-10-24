import React, { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardMetrics } from '@/store/features/dashboard/useDashboard';
import { useTransactions } from '@/store/features/transactions/useTransactions';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, CreditCard, Smartphone, Calculator, Coins, Briefcase, BarChart3, ArrowRightLeft, User, WifiOff, Building2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { getDefaultDateRange } from '@/components/common/DateRangePicker';
import TransactionHistoryTable from '@/components/tables/TransactionHistoryTable';
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import CustomEye from '@/components/icons/CustomEye';
import CustomShare from '@/components/icons/CustomShare';
import {
  TRANSACTION_STATUS_FILTER_GROUP,
  DATE_RANGE_FILTER_GROUP,
} from '@/constants/transactionFilters';


const formatTransactionDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${month} ${year}, ${time}`;
};

const PosStatCard = ({ title, value, change, icon: Icon, iconBg, iconColor, isPositive }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center ${iconBg} ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[11px] xl:text-xs font-semibold text-[#808C91] truncate" title={title}>{title}</span>
          <span className="text-lg xl:text-xl 2xl:text-[22px] font-bold text-[#084059] mt-0.5 tracking-tight truncate" title={value}>{value}</span>

          <div className="flex flex-col mt-1.5">
            <span className={`text-[12px] font-bold ${isPositive ? 'text-[#00B060]' : 'text-rose-500'}`}>
              {change}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">vs previous period</span>
          </div>
        </div>
      </div>
    </div>
  );
};


const PosTrendChart = ({ xLabels = [], transactions = [], values = [] }) => {
  return (
    <Card className="h-full border border-slate-100 shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold text-[#084059]">Transaction Trend</CardTitle>
        <button className="flex items-center gap-1 border border-slate-200 bg-white rounded-md px-2 py-1 text-xs text-[#084059] font-medium hover:bg-slate-50 transition-colors">
          Daily <ChevronDown size={14} />
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-2 ml-4">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#E85304]"></div><span className="text-[11px] font-semibold text-[#084059]">Transactions</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#26C8B9]"></div><span className="text-[11px] font-semibold text-[#084059]">Transaction Value (N)</span></div>
        </div>
        <div className="h-[250px] w-full">
          {(!transactions.length && !values.length) ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">No trend data available</div>
          ) : (
            <LineChart
              series={[
                {
                  label: 'Transactions',
                  data: transactions,
                  yAxisKey: 'left',
                  color: '#E85304',
                  showMark: true,
                  valueFormatter: (v) => `${v ?? 0} txns`,
                },
                {
                  label: 'Transaction Value',
                  data: values,
                  yAxisKey: 'right',
                  color: '#26C8B9',
                  showMark: true,
                  valueFormatter: (v) => {
                    if (v == null || v === 0) return '₦0';
                    const naira = v * 1000000;
                    return `₦${Math.round(naira).toLocaleString()}`;
                  },
                }
              ]}
              xAxis={[{ scaleType: 'point', data: xLabels.length ? xLabels : transactions.map((_, i) => i), tickLabelStyle: { fill: '#808C91', fontSize: 10, fontFamily: 'sans-serif' } }]}
              yAxis={[
                {
                  id: 'left',
                  min: 0,
                  valueFormatter: (v) => {
                    if (v == null || v === 0) return '0';
                    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
                    return `${v}`;
                  },
                  tickLabelStyle: { fill: '#808C91', fontSize: 10, fontFamily: 'sans-serif' },
                },
                {
                  id: 'right',
                  min: 0,
                  valueFormatter: (v) => {
                    if (v == null || v === 0) return '₦0';
                    if (v >= 1) return `₦${v.toFixed(1)}M`;
                    return `₦${Math.round(v * 1000)}K`;
                  },
                  tickLabelStyle: { fill: '#808C91', fontSize: 10, fontFamily: 'sans-serif' },
                }
              ]}
              leftAxis="left"
              rightAxis="right"
              margin={{ left: 40, right: 55, top: 10, bottom: 25 }}
              grid={{ horizontal: true }}
              sx={{ '.MuiChartsGrid-line': { stroke: '#E8EBED', strokeDasharray: '4 4' } }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PosTypePieChart = ({ data = [], total = 0 }) => {
  return (
    <Card className="h-full border border-slate-100 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-[#084059]">Transaction by Type</CardTitle>
      </CardHeader>
      <CardContent>
        {(!data || data.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-slate-400 text-sm">No transaction type data</div>
        ) : (
          <div className="flex flex-col xl:flex-row items-center justify-center h-[250px] gap-4">
            <div className="relative h-full w-[160px] flex items-center justify-center shrink-0">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                <span className="text-lg font-bold text-[#084059]">{total}</span>
                <span className="text-[9px] font-semibold text-[#808C91]">Total Transactions</span>
              </div>
              <PieChart
                series={[{ data, innerRadius: 55, outerRadius: 75, paddingAngle: 2, cornerRadius: 4 }]}
                height={180}
                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                slotProps={{ legend: { hidden: true } }}
              />
            </div>
            <div className="flex flex-col gap-4 justify-center flex-1 w-full xl:w-auto px-4 xl:px-0">
              {data.map(item => (
                <div key={item.id || item.label} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[11px] text-[#084059] font-semibold">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#084059] ml-2">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PosDevicePieChart = ({ data = [], total = 0 }) => {
  return (
    <Card className="h-full border border-slate-100 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-[#084059]">Device Status</CardTitle>
      </CardHeader>
      <CardContent>
        {(!data || data.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-slate-400 text-sm">No device status data</div>
        ) : (
          <div className="flex flex-col xl:flex-row items-center justify-center h-[250px] gap-4">
            <div className="relative h-full w-[160px] flex items-center justify-center shrink-0">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                <span className="text-lg font-bold text-[#084059]">{total}</span>
                <span className="text-[9px] font-semibold text-[#808C91]">Total Terminals</span>
              </div>
              <PieChart
                series={[{ data, innerRadius: 55, outerRadius: 75, paddingAngle: 2, cornerRadius: 4 }]}
                height={180}
                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                slotProps={{ legend: { hidden: true } }}
              />
            </div>
            <div className="flex flex-col gap-4 justify-center flex-1 w-full xl:w-auto px-4 xl:px-0">
              {data.map(item => (
                <div key={item.id || item.label} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[11px] text-[#084059] font-semibold">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#084059] ml-2">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function PosManagement() {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState(() => getDefaultDateRange('today'));
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { data: dashboardResponse, isLoading, isError, refetch } = useDashboardMetrics({ range: timeFilter.range, from: timeFilter.from, to: timeFilter.to });
  const metrics = dashboardResponse?.data || dashboardResponse || {};

  // Fetch transactions using useTransactions hook (matching Super Admin Dashboard)
  const {
    data: transactionData,
    isLoading: isTransactionsLoading,
  } = useTransactions({
    page,
    limit,
    search,
    status,
    typeCategory: 'HardwarePOS',
    from: timeFilter.from,
    to: timeFilter.to,
  });

  const transactions = useMemo(() => {
    const raw = transactionData?.data || [];
    return raw.map((item, index) => ({
      ...item,
      index: ((page - 1) * limit) + index + 1,
    }));
  }, [transactionData, page, limit]);

  const pagination = useMemo(() => transactionData?.pagination || {}, [transactionData]);

  const transactionActions = [
    {
      label: 'View Details',
      icon: CustomEye,
      onClick: (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
      },
    },
    {
      label: 'Download Receipt',
      type: 'share',
      icon: CustomShare,
      onClick: (transaction) => {
        setSelectedTransaction(transaction);
        setShowShareModal(true);
      },
    },
  ];

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = ({ status: filterStatus } = {}) => {
    setStatus(filterStatus || '');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Role checks
  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isRegionalManager = user?.role === 'RegionalManager';
  const isStateManager = user?.role === 'StateManager';
  const canViewDistribution = isSuperAdmin || isRegionalManager || isStateManager;
  const canViewRevenue = !isRegionalManager && !isStateManager;

  // KPIs
  const posKpis = metrics.posKpis || {};

  // Charts (memoized to prevent SVG re-render cycles)
  const { trendTransactions, trendValues, trendXLabels } = useMemo(() => ({
    trendTransactions: metrics.posTrend?.transactions || [],
    trendValues: metrics.posTrend?.values || [],
    trendXLabels: metrics.posTrend?.xLabels || [],
  }), [metrics.posTrend]);

  const { typeData, typeTotal } = useMemo(() => ({
    typeData: metrics.posTypeData || [],
    typeTotal: metrics.posTypeTotal || 0,
  }), [metrics.posTypeData, metrics.posTypeTotal]);

  const { deviceData, deviceTotal } = useMemo(() => ({
    deviceData: metrics.posDeviceData || [],
    deviceTotal: metrics.posDeviceTotal || 0,
  }), [metrics.posDeviceData, metrics.posDeviceTotal]);

  // Tables
  const posDistributionItems = metrics.posDistribution || [];
  const posPerformanceItems = metrics.posPerformance || [];

  // Transaction Table Columns
  const transactionColumns = useMemo(() => [
    {
      field: 'index',
      headerName: '#',
      width: 60,
      renderCell: (params) => (
        <span className="flex items-center h-full text-sm font-general text-[#1E1E1E]">
          {params.row.index}
        </span>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      width: 180,
      renderCell: (params) => (
        <span className="flex items-center h-full text-sm font-general text-qreva-navy">
          {formatTransactionDate(params.value || params.row.createdAt || params.row.date)}
        </span>
      )
    },
    {
      field: 'terminalId',
      headerName: 'Terminal ID (TID)',
      width: 150,
      renderCell: (params) => (
        <span className="flex items-center h-full text-sm font-general text-[#1E1E1E]">
          {params.row.metadata?.terminalId || params.row.terminalId || params.value || '-'}
        </span>
      )
    },
    {
      field: 'merchantName',
      headerName: 'Merchant Name',
      width: 200,
      renderCell: (params) => (
        <span className="flex items-center h-full text-sm font-general text-[#1E1E1E] font-medium">
          {params.row.merchantName || params.row.customerName || params.row.clientName || 'Qreva Merchant'}
        </span>
      )
    },
    {
      field: 'type',
      headerName: 'Transaction Type',
      width: 200,
      renderCell: (params) => {
        const method = String(params.row.metadata?.method || params.row.typeCategory || params.value || '');
        const isCard = method.toLowerCase().includes('card');
        const displayType = isCard ? 'Card Payment' : 'Inward Transfer';
        return (
          <div className="flex items-center gap-2 h-full">
            {isCard ? (
              <div className="text-[#26C8B9]"><CreditCard size={18} /></div>
            ) : (
              <div className="text-[#00B060]"><Building2 size={18} /></div>
            )}
            <span className="text-[#084059] font-medium whitespace-nowrap">{displayType}</span>
          </div>
        );
      }
    },
    {
      field: 'amount',
      headerName: 'Amount (₦)',
      width: 130,
      renderCell: (params) => (
        <span className="flex items-center h-full text-sm font-general font-medium text-[#1E1E1E]">
          {Number(params.value || 0).toLocaleString()}
        </span>
      )
    },
    {
      field: 'fee',
      headerName: 'Qreva Fee (₦)',
      width: 130,
      renderCell: (params) => (
        <span className="flex items-center h-full text-sm font-general text-green-600 font-medium">
          {Number(params.row.fees ?? params.row.fee ?? params.row.qreva_fee ?? 0).toLocaleString()}
        </span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const raw = String(params.value || params.row.status || '').trim();
        const normalized = raw ? (raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()) : '-';
        const statusColors = {
          Completed: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]',
          Successful: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]',
          Pending: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]',
          Failed: 'border border-[#E85304] bg-[#FCECE8] text-[#E85304]',
          Reversed: 'border border-[#9055FD] bg-[#F2EDFD] text-[#9055FD]',
          Cancelled: 'border border-[#9055FD] bg-[#F2EDFD] text-[#9055FD]',
        };
        const statusClass = statusColors[normalized] || 'border border-gray-300 bg-gray-50 text-gray-600';
        return (
          <div className="flex items-center h-full">
            <span
              className={`px-2.5 py-1 text-center w-fit ${statusClass} font-general font-medium text-xs rounded-md inline-flex items-center justify-center`}
            >
              {normalized}
            </span>
          </div>
        );
      }
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 130,
      renderCell: (params) => (
        <span className="flex items-center h-full text-sm font-general text-[#1E1E1E]">
          {params.value || params.row.location || params.row.state || '-'}
        </span>
      )
    }
  ], []);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-qreva-ash">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qreva-orange mx-auto mb-4"></div>
            <p className="text-qreva-navy font-bold font-urbanist">Loading POS management...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 overflow-auto bg-qreva-ash">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-qreva-orange mb-4">Failed to load POS management data</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-qreva-orange text-white rounded hover:bg-qreva-orange"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="POS Management"
        subtitle="Overview of POS terminals, distribution targets, and performance."
        timeFilter={timeFilter}
        onTimeFilterChange={handleTimeFilterChange}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Row 1 */}
        <PosStatCard title="Total POS Terminals" value={posKpis.totalTerminals?.value || "0"} change={posKpis.totalTerminals?.change || "0%"} isPositive={posKpis.totalTerminals?.isPositive ?? true} icon={Smartphone} iconBg="bg-[#FFF4ED]" iconColor="text-[#E85304]" />
        <PosStatCard title="Active Terminals" value={posKpis.activeTerminals?.value || "0"} change={posKpis.activeTerminals?.change || "0%"} isPositive={posKpis.activeTerminals?.isPositive ?? true} icon={Calculator} iconBg="bg-[#EAF9F8]" iconColor="text-[#26C8B9]" />
        <PosStatCard title="Total Transactions" value={posKpis.totalTransactions?.value || "0"} change={posKpis.totalTransactions?.change || "0%"} isPositive={posKpis.totalTransactions?.isPositive ?? true} icon={Coins} iconBg="bg-[#FFF4ED]" iconColor="text-[#E85304]" />
        <PosStatCard title="Total Transaction Value" value={posKpis.totalTransactionValue?.value || "₦0"} change={posKpis.totalTransactionValue?.change || "0%"} isPositive={posKpis.totalTransactionValue?.isPositive ?? true} icon={Briefcase} iconBg="bg-[#EAF9F8]" iconColor="text-[#26C8B9]" />
        {canViewRevenue && (
          <PosStatCard title="Qreva Revenue" value={posKpis.qrevaRevenue?.value || "₦0"} change={posKpis.qrevaRevenue?.change || "0%"} isPositive={posKpis.qrevaRevenue?.isPositive ?? true} icon={BarChart3} iconBg="bg-[#FFF4ED]" iconColor="text-[#E85304]" />
        )}

        {/* Row 2 */}
        <PosStatCard title="Card Payments (Free)" value={posKpis.cardPayments?.value || "0"} change={posKpis.cardPayments?.change || "0%"} isPositive={posKpis.cardPayments?.isPositive ?? true} icon={CreditCard} iconBg="bg-[#EAF9F8]" iconColor="text-[#26C8B9]" />
        <PosStatCard title="Inward Transfers (Charged)" value={posKpis.inwardTransfers?.value || "0"} change={posKpis.inwardTransfers?.change || "0%"} isPositive={posKpis.inwardTransfers?.isPositive ?? true} icon={ArrowRightLeft} iconBg="bg-[#EAF9F8]" iconColor="text-[#26C8B9]" />
        <PosStatCard title="Average Transaction Value" value={posKpis.avgTransactionValue?.value || "₦0"} change={posKpis.avgTransactionValue?.change || "0%"} isPositive={posKpis.avgTransactionValue?.isPositive ?? true} icon={User} iconBg="bg-[#EAF9F8]" iconColor="text-[#26C8B9]" />
        <PosStatCard title="Average Qreva Fee (Inward)" value={posKpis.avgQrevaFee?.value || "₦0"} change={posKpis.avgQrevaFee?.change || "0%"} isPositive={posKpis.avgQrevaFee?.isPositive ?? true} icon={Coins} iconBg="bg-[#FFF4ED]" iconColor="text-[#E85304]" />
        <PosStatCard title="Terminals Offline" value={posKpis.terminalsOffline?.value || "0"} change={posKpis.terminalsOffline?.change || "0%"} isPositive={posKpis.terminalsOffline?.isPositive ?? false} icon={WifiOff} iconBg="bg-red-50" iconColor="text-rose-500" />
      </div>

      {/* Charts Rows */}
      <div className="flex flex-col gap-6">
        <PosTrendChart
          xLabels={trendXLabels}
          transactions={trendTransactions}
          values={trendValues}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PosTypePieChart data={typeData} total={typeTotal} />
          <PosDevicePieChart data={deviceData} total={deviceTotal} />
        </div>
      </div>

      {/* <div className="mt-6"> */}
      <TransactionHistoryTable
        title="Recent Hardware POS Transactions"
        data={transactions}
        columns={transactionColumns}
        actions={transactionActions}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterGroups={[
          TRANSACTION_STATUS_FILTER_GROUP,
          DATE_RANGE_FILTER_GROUP,
        ]}
        isLoading={isTransactionsLoading}
      />
      {/* </div> */}

      <TransactionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        transaction={selectedTransaction}
      />

      <ShareReceiptModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        transaction={selectedTransaction}
      />

    </div>
  );
}
