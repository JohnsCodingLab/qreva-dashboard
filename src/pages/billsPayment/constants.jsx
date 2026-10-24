import CustomEye from "@/components/icons/CustomEye";
import CustomShare from "@/components/icons/CustomShare";
import CustomHistory from '@/components/icons/CustomHistory';

// Custom stats for transaction/customer view
export const customerStats = [
  {
    label: 'Total Transaction Volume',
    value: '48,920',
    change: '+22%',
    subtext: '55,000 in last 24 hours'
  },
  {
    label: 'Total Transaction Value',
    value: '₦3,980,500',
    change: '-12%',
    subtext: '₦60,000 in last 24 hours'
  },
  { 
    label: 'Highest One Time Purchase', 
    value: '₦6,200', 
    change: '+15%', 
    subtext: '620 in last 24 hours' 
  },
  { 
    label: 'Success Rate', 
    value: '91%', 
    change: '+4%', 
    subtext: '4% in last 24 hours' 
  }
];

// Factory function for customer transaction actions
export const createCustomerTransactionActions = ({
  setSelectedTransaction,
  setShowDetailsModal,
  setShowShareModal
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

// Factory function for region stats
export const createRegionStats = (region) => [
  {
    label: 'Total Transaction Volume',
    value: region.total?.toLocaleString() || '0',
    change: '+15%',
    subtext: '60,000 in last 24 hours'
  },
  { 
    label: 'Total Revenue (₦)', 
    value: `₦${region.revenue?.toLocaleString() || '0'}`, 
    change: '+20%', 
    subtext: '₦30,000 in last 24 hours' 
  },
  { 
    label: 'Transaction Volume (₦)', 
    value: `₦${region.volume?.toLocaleString() || '0'}`, 
    change: '+12%', 
    subtext: '₦40,000 in last 24 hours' 
  },
  { 
    label: 'Success Rate', 
    value: `${region.rate}%`, 
    change: '+4%', 
    subtext: '99% in last 24 hours' 
  }
];

// Factory function for region transaction actions
export const createRegionTransactionActions = ({
  setSelectedTransaction,
  setShowDetailsModal,
  setShowShareModal,
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
];
