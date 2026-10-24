import CustomEye from "@/components/icons/CustomEye";
import CustomShare from "@/components/icons/CustomShare";
import CustomHistory from "@/components/icons/CustomHistory";


 const stats = [
    { 
      label: 'Total KYC Verification Sum', 
      value: '₦4,005,823', 
      subtext: '₦50,000 in last 24 hours',
      change: '+200%',
    },
    { 
      label: 'Total BVN Verification Sum', 
      value: '45,823', 
      subtext: '50,000 in last 24 hours',
      change: '+200%',
    },
    { 
      label: 'Total NIN Verification Sum', 
      value: '₦1,070,823', 
      subtext: '₦50,000 in last 24 hours',
      change: '+200%',
    },
    { 
      label: 'Total Revenue', 
      value: '₦1,070,823', 
      subtext: '₦50,000 in last 24 hours',
      change: '+200%',
    },
     { 
      label: 'Total Verifications', 
      value: '45,823', 
      subtext: '50,000 in last 24 hours',
      change: '-200%',
    },
    { 
      label: 'Total BVN Verifications', 
      value: '5,823', 
      subtext: '1,000 in last 24 hours',
      change: '+200%',
    },
    { 
      label: 'Total NIN Verifications', 
      value: '70,823', 
      subtext: '1,000 in last 24 hours',
      change: '+200%',
    },
    { 
      label: 'Total Agent Commission', 
      value: '₦40,823', 
      subtext: '₦5,000 in last 24 hours',
      change: '+200%',
    },
  ];



// Actions for agent transaction history
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
            navigate(`/kyc/details/transaction/${transaction.id}`);
        }
    }
];

 const createRegioncolumns = (handleViewRegionDetails) => [
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
      field: 'totalKYC', 
      headerName: 'Total KYC Verifications', 
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center leading-[156%]">
          {params.value?.toLocaleString()}
        </span>
      )
    },
    { 
      field: 'totalSum', 
      headerName: 'Total KYC Verifications Sum(N)', 
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
  ];

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
        navigate(`/kyc/details/transaction/${transaction.id}`);
      }
    }
  ];


export {createAgentTransactionActions, createRegionTransactionActions, createRegioncolumns, createTransactionActions, stats}
