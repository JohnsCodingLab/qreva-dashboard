// Mirrors the exact typeCategory values the backend's GET
// admin/dashboard/transactions/all endpoint matches against (see
// AdminDashboardService's UtilityType-based filters plus Transfer/SoftPOS/
// ScanToPay/PaymentRequest/Funding/TerminalSweep/KYC). Exported so pages
// that show a mixed-type transaction list (e.g. the main superadmin
// dashboard) can opt into a "Transaction Type" filter group without this
// being forced on pages already scoped to a single type (Data Purchase,
// Airtime, etc).
// The only statuses ever stored are Completed, Pending and Failed. Several
// pages used to offer 'Successful' as a value of its own, which matched
// nothing - it is the label for Completed, not a status in its own right.
export const TRANSACTION_STATUS_FILTER_GROUP = {
  key: "status",
  label: "Status",
  options: [
    { label: "Successful", value: "Completed" },
    { label: "Pending", value: "Pending" },
    { label: "Failed", value: "Failed" },
  ],
};

// Held as { from, to }; useTableControls flattens it into the two query params
// the API takes. A date-only 'to' covers the whole of that day server-side.
export const DATE_RANGE_FILTER_GROUP = {
  key: "dateRange",
  label: "Date Range",
  type: "dateRange",
};

export const TRANSACTION_TYPE_FILTER_GROUP = {
  key: "transactionType",
  label: "Transaction Type",
  options: [
    "Transfer",
    "Airtime",
    "Data",
    "Electricity",
    "Dstv",
    "GoTV",
    "Startimes",
    "SoftPOS",
    "ScanToPay",
    "PaymentRequest",
    "Funding",
    "TerminalSweep",
    "KYC",
    "Adjustment",
  ].map((value) => ({ label: value, value })),
};
