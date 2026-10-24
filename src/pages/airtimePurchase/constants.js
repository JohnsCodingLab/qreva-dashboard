import CustomEye from "@/components/icons/CustomEye";
import CustomShare from "@/components/icons/CustomShare";
import CustomHistory from "@/components/icons/CustomHistory";

export const createTransactionActions = (onView, onShare) => [
  {
    label: "View Transaction Details",
    icon: CustomEye,
    type: "view",
    onClick: (transaction) => onView(transaction),
  },
  {
    label: "Download Receipt",
    icon: CustomShare,
    type: "share",
    onClick: (transaction) => onShare(transaction),
  },
];

// Custom stats for region view
export const getRegionStats = (region) => [
  {
    label: "Total Transaction Volume",
    value: region.total?.toLocaleString() || "-",
    change: "%",
    subtext: "-",
  },
  {
    label: "Total Revenue (₦)",
    value: `₦${region.revenue?.toLocaleString() || "-"}`,
    change: "%",
    subtext: "-",
  },
  {
    label: "Transaction Volume (₦)",
    value: `₦${region.volume?.toLocaleString() || "-"}`,
    change: "%",
    subtext: "-",
  },
  {
    label: "Success Rate",
    value: `${region.rate}%`,
    change: "%",
    subtext: "-",
  },
];

// Actions for region transactions
export const regionTransactionActions = [
  {
    label: "View Transaction Details",
    type: "view",
    onClick: (transaction) => {
      setSelectedTransaction(transaction);
      setShowDetailsModal(true);
    },
  },
  {
    label: "Download Receipt",
    type: "share",
    onClick: (transaction) => {
      setSelectedTransaction(transaction);
      setShowShareModal(true);
    },
  },
];

export const createCustomerStats = (customer) => [
  {
    label: "Total Transaction Volume",
    value: customer.totalTransactions?.toLocaleString() || "0",
    change: "+20%",
    subtext: "Last 24 hours",
  },
  {
    label: "Total Transaction Value",
    value: `₦${customer.totalVolume?.toLocaleString() || "0"}`,
    change: "-10%",
    subtext: "Last 24 hours",
  },
  {
    label: "Highest One Time Purchase",
    value: `₦${customer.highestPurchase?.toLocaleString() || "0"}`,
    change: "-5%",
    subtext: "Last 24 hours",
  },
  {
    label: "Success Rate",
    value: `${customer.successRate || 0}%`,
    change: "+2%",
    subtext: "Last 24 hours",
  },
];

export const createCustomerTransactionActions = (onView, onShare) => [
  {
    label: "View Transaction Details",
    type: "view",
    icon: CustomEye,
    onClick: (row) => onView(row),
  },
  {
    label: "Download Receipt",
    type: "share",
    icon: CustomShare,
    onClick: (row) => onShare(row),
  },
];
