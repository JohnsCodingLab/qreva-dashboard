import CustomEye from '@/components/icons/CustomEye';
import CustomShare from '@/components/icons/CustomShare';
import CustomHistory from '@/components/icons/CustomHistory';
import { isAbandonedCheckout } from '@/utils/cardFailureReason';

const resolveCustomerName = (row) =>
    row.customerName ||
    row.senderName ||
    row.clientName ||
    row.transferId?.nameEnquiryId?.accountName ||
    row.utilityId?.vasVerificationId?.name ||
    row.title ||
    '-';

const resolveCustomerSub = (row) =>
    row.senderPhone ||
    row.phoneNumber ||
    row.utilityId?.phoneNumber ||
    row.creditAccountNumber ||
    row.accountNumber ||
    row.utilityId?.accountNumber ||
    row.acc ||
    '';

const resolveLocation = (row) => {
    const meta = row.metadata || {};
    const sender = row.senderId || row.userId || {};
    const senderPersonal = sender.personalDetails || {};
    const senderAddress = sender.address || {};
    const state =
        row.location?.state ||
        meta.state ||
        meta.location?.state ||
        senderPersonal.state ||
        senderAddress.state ||
        '';
    const lga =
        row.location?.lga ||
        meta.lga ||
        meta.location?.lga ||
        senderPersonal.lga ||
        senderAddress.lga ||
        senderAddress.city ||
        '';
    if (state && lga) return `${lga}, ${state}`;
    return state || lga || row.state || row.region || row.location || '-';
};

// The table is server-paginated, so a column can only offer sorting if the
// server has a stored field to order the whole set by. Card number, terminal
// ID and serial number live on metadata, and revenue is derived per row, so
// those are marked unsortable rather than sorting the ten rows on screen.
const softposTransactionColumns = [
    {
        field: 'customerName',
        headerName: 'Customer Name',
        width: 200,
        flex: 1,
        valueGetter: (value, row) => resolveCustomerName(row),
        renderCell: (params) => {
            const name = resolveCustomerName(params.row);
            const sub = resolveCustomerSub(params.row);
            return (
                <div className="flex flex-col justify-center h-full">
                    <div className="text-sm font-general font-medium">{name}</div>
                    {sub && <div className="text-xs text-qreva-navy">{sub}</div>}
                </div>
            );
        },
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 110,
        flex: 0.7,
        renderCell: (params) => (
            <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
                {params.value || '-'}
            </span>
        ),
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        flex: 0.8,
        renderCell: (params) => {
            const statusColors = {
                Pending: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]',
                Successful: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]',
                Completed: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#4ED17E]',
                Failed: 'border border-[#E85304] bg-[#FCECE8] text-[#E85304]',
                Cancelled: 'border border-[#9055FD] bg-[#F2EDFD] text-[#9055FD]',
                Abandoned: 'border border-[#D9D9D9] bg-[#F7FAFA] text-[#808C91]',
                Initiated: 'border border-[#3572FF] bg-[#EBF2FF] text-[#3572FF]',
            };
            const rawStatus = params.value;
            const abandoned = rawStatus === 'Abandoned' || isAbandonedCheckout(params.row);
            const displayLabel = abandoned ? 'Abandoned' : (rawStatus || '-');
            const statusClass = statusColors[rawStatus] || (abandoned ? statusColors.Abandoned : 'border border-gray-300 bg-qreva-ash text-qreva-navy');
            return (
                <div className="flex flex-col justify-center h-full gap-1">
                    <span
                        title={abandoned ? 'Checkout expired before card tap' : undefined}
                        className={`px-2 py-1.5 text-center w-fit ${statusClass} font-general font-medium text-xs rounded-md flex items-center justify-center`}
                    >
                        {displayLabel}
                    </span>
                    {params.row.requiresManualRefund && (
                        <span className="px-2 py-0.5 text-center w-fit border border-[#E85304] bg-[#FCECE8] text-[#E85304] font-general font-medium text-[10px] rounded-md">
                            Needs Manual Refund
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        field: 'cardNumber',
        sortable: false,
        headerName: 'Card Number',
        width: 150,
        flex: 0.8,
        renderCell: (params) => (
            <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
                {params.value || '-'}
            </span>
        ),
    },
    {
        field: 'terminalId',
        sortable: false,
        headerName: 'Terminal ID',
        width: 140,
        flex: 0.8,
        valueGetter: (value, row) => row.metadata?.terminalId,
        renderCell: (params) => (
            <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
                {params.value || '-'}
            </span>
        ),
    },
    {
        field: 'serialNumber',
        sortable: false,
        headerName: 'Serial Number',
        width: 150,
        flex: 0.8,
        valueGetter: (value, row) => row.metadata?.serialNumber,
        renderCell: (params) => (
            <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
                {params.value || '-'}
            </span>
        ),
    },
    {
        field: 'location',
        headerName: 'Location',
        width: 160,
        flex: 0.9,
        valueGetter: (value, row) => resolveLocation(row),
        renderCell: (params) => (
            <span className="text-sm font-general text-[#1E1E1E] flex items-center h-full">
                {params.value || '-'}
            </span>
        ),
    },
    {
        field: 'revenue',
        sortable: false,
        headerName: 'Revenue (₦)',
        width: 130,
        flex: 0.8,
        // The fee we charge IS the SoftPOS revenue. commission is explicitly 0
        // on these transactions, and ?? only falls through on null/undefined -
        // so having it ahead of fees short-circuited on that real 0 and showed
        // every row as zero, while the detail view read the charge directly.
        // Only a completed transaction earned anything. The fee is deducted
        // from the merchant's credit, so on a failed or pending transaction no
        // credit happened and no fee was ever collected. Counting those would
        // badly overstate revenue - production currently carries far more fee
        // value on failed transactions than on completed ones.
        valueGetter: (value, row) => {
            const settled = row.status === 'Completed' || row.status === 'Successful';
            if (!settled) return 0;
            return row.revenue ?? row.charges ?? row.fees ?? row.metadata?.revenue ?? 0;
        },
        renderCell: (params) => (
            <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
                {Number(params.value || 0).toLocaleString()}
            </span>
        ),
    },
    {
        field: 'amount',
        headerName: 'Amount (₦)',
        width: 140,
        flex: 1,
        renderCell: (params) => (
            <span className="text-sm font-general text-[#1E1E1E] flex items-center font-medium h-full">
                {Number(params.value || 0).toLocaleString()}
            </span>
        ),
    },
    {
        field: 'createdAt',
        headerName: 'Transaction Date',
        width: 180,
        flex: 1,
        renderCell: (params) => {
            const val = params.value || params.row.date;
            if (!val) return <span className="text-sm text-qreva-navy flex items-center h-full">-</span>;
            const d = new Date(val);
            if (isNaN(d)) return <span className="text-sm text-qreva-navy flex items-center h-full">{val}</span>;
            return (
                <span className="text-sm text-qreva-navy flex items-center h-full">
                    {d.toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            );
        },
    },
];

const multiLineData = [
    { day: 'Today', cardPayments: 14500, qrPayments: 14200 },
    { day: 'Yesterday', cardPayments: 14200, qrPayments: 14800 },
    { day: '2 Days Ago', cardPayments: 14800, qrPayments: 14600 },
    { day: '3 Days Ago', cardPayments: 14600, qrPayments: 15200 },
    { day: '4 Days Ago', cardPayments: 15200, qrPayments: 15800 },
    { day: '5 Days Ago', cardPayments: 15800, qrPayments: 16200 },
    { day: '6 Days Ago', cardPayments: 16200, qrPayments: 15600 },
    { day: '7 Days Ago', cardPayments: 15600, qrPayments: 16800 },
    { day: 'Week Ago', cardPayments: 16800, qrPayments: 16200 },
    { day: '2 Weeks Ago', cardPayments: 16200, qrPayments: 13800 },
    { day: '3 Weeks Ago', cardPayments: 13800, qrPayments: 17200 },
    { day: '4 Weeks Ago', cardPayments: 17200, qrPayments: 18000 }
];

const chartSeries = [
    { data: multiLineData.map(d => d.cardPayments), color: '#26C8B9', label: 'Card Payments' },
    { data: multiLineData.map(d => d.qrPayments), color: '#E85304', label: 'QR Payments ' }
];

  const createRegioncolumns = (handleViewRegionDetails) => {
    if (typeof handleViewRegionDetails !== 'function') {
    console.error('handleViewRegionDetails is not a function', handleViewRegionDetails);
    } 
    return [
    { 
      field: 'location', 
      headerName: 'Location', 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="font-general text-sm flex items-center gap-3">
          <p className='bg-[#F7FAFA] rounded-full w-6 h-6 flex items-center justify-center text-[#808C91] text-center border-2 border-[#E9F1F3]'>{params.row.id}</p> <p className='font-medium leading-[148%] text-[#1E1E1E]'>{params.row.location}</p>
        </span>
      )
    },
    { 
      field: 'totalSoftPOSTransactions', 
      headerName: 'Total SOftPOS Transactions', 
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center leading-[156%]">
          {params.value?.toLocaleString()}
        </span>
      )
    },
    { 
      field: 'totalTansactionVolume', 
      headerName: 'Total Transaction Volume(N)', 
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center font-medium">
          {params.value?.toLocaleString()}
        </span>
      )
    },
    { 
      field: 'revenue', 
      headerName: 'Total Revenue (N)', 
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center font-medium">
          {params.value?.toLocaleString()}
        </span>
      )
    },
    { 
      field: 'commission', 
      headerName: 'Total Commissions (N)', 
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center">
          {params.value}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <button 
          onClick={() => handleViewRegionDetails(params.row._id || params.row.id || params.row.location)}
          className="font-general flex items-center text-sm text-[#26C8B9] underline underline-offset-2 cursor-pointer font-semibold"
        >
          View Details
        </button>
      )
    }
  ];}

   const createTransactionActions = ({
    setSelectedTransaction,
    setShowDetailsModal,
    setShowShareModal,
    navigate
   }) => [
    {
      label: 'View Transaction Details',
      type: 'view',
      icon: CustomEye,
      onClick: (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
      }
    },
    {
      label: 'Download Receipt',
      type: 'share',
      icon: CustomShare,
      onClick: (transaction) => {
        setSelectedTransaction(transaction);
        setShowShareModal(true);
      }
    },
    {
      label: 'View Transaction History',
      type: 'history',
      icon: CustomHistory,
      onClick: (transaction) => {
        navigate(`/softpos/details/transaction/${transaction.id}`);
      }
    }
  ];

  const createRegionTransactionActions = ({
    setSelectedTransaction,
    setShowDetailsModal,
    setShowShareModal,
    navigate
  }) => [
      {
        label: 'View Transaction Details',
        type: 'view',
        onClick: (transaction) => {
          setSelectedTransaction(transaction);
          setShowDetailsModal(true);
        }
      },
      {
        label: 'Download Receipt',
        type: 'share',
        onClick: (transaction) => {
          setSelectedTransaction(transaction);
          setShowShareModal(true);
        }
      },
      {
        label: 'View Transaction History',
        type: 'history',
        onClick: (transaction) => {
          navigate(`/softpos/details/transaction/${transaction.id}`);
        }
      }
    ];

    const createAgentTransactionActions = ({
        setSelectedTransaction,
        setShowDetailsModal,
        setShowShareModal,
    }) => [
      {
        label: 'View Transaction Details',
        type: 'view',
        icon: CustomEye,
        onClick: (tx) => {
          setSelectedTransaction(tx);
          setShowDetailsModal(true);
        }
      },
      {
        label: 'Download Receipt',
        type: 'share',
        icon: CustomShare,
        onClick: (tx) => {
          setSelectedTransaction(tx);
          setShowShareModal(true);
        }
      }
    ];


export {multiLineData, chartSeries, createTransactionActions, createRegionTransactionActions, createAgentTransactionActions, createRegioncolumns, softposTransactionColumns};

