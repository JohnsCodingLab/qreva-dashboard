/**
 * Column definitions and shared formatting for the Smart Savings screens.
 *
 * Kept beside the pages rather than in a global constants file, matching how
 * Affiliates and Promotions are organised: a column set is only ever read by
 * the one table that renders it.
 */

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const nairaExact = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Whole naira by default; kobo only where a percentage has produced them. */
export const money = (value, exact = false) => {
  const amount = Number(value || 0);
  const hasKobo = Math.abs(amount % 1) > 0.004;
  return exact || hasKobo ? nairaExact.format(amount) : naira.format(amount);
};

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "—";

export const formatMonth = (key) => {
  if (!/^\d{4}-\d{2}$/.test(String(key || ""))) return key || "—";
  const [year, month] = key.split("-");
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, 1));
};

const TONES = {
  success: "bg-[#E9F9EF] text-[#188C43]",
  warning: "bg-[#FFF8E6] text-[#B58202]",
  danger: "bg-[#FCECEC] text-[#9E2D2D]",
  info: "bg-[#E9FAF8] text-[#1B8E83]",
  neutral: "bg-[#F1F3F4] text-[#808C91]",
};

export const StatusPill = ({ children, tone = "neutral" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${TONES[tone] || TONES.neutral}`}
  >
    {children}
  </span>
);

const MEMBER_STATUS_TONE = {
  Active: "success",
  Pending: "warning",
  Suspended: "danger",
  Closed: "neutral",
};

const WITHDRAWAL_STATUS_TONE = {
  Pending: "warning",
  MarketerReviewed: "info",
  Approved: "success",
  Paid: "success",
  Rejected: "danger",
  Cancelled: "neutral",
};

const MARKETER_STATUS_TONE = {
  Active: "success",
  Invited: "warning",
  Blocked: "danger",
};

const OFFER_STATUS_TONE = {
  Suggested: "neutral",
  Offered: "info",
  Accepted: "success",
  Disbursed: "success",
  Repaid: "success",
  Declined: "neutral",
  Withdrawn: "neutral",
  Expired: "neutral",
};

export const memberColumns = [
  { field: "memberNo", headerName: "Member No", width: 130 },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 180,
    valueGetter: (_value, row) =>
      `${row.firstName || ""} ${row.lastName || ""}`.trim(),
  },
  { field: "phoneNumber", headerName: "Phone", width: 130 },
  {
    field: "businessName",
    headerName: "Business",
    flex: 1,
    minWidth: 160,
    renderCell: ({ row }) => row.businessName || "—",
  },
  {
    field: "marketer",
    headerName: "Marketer",
    width: 160,
    renderCell: ({ row }) =>
      row.marketer
        ? `${row.marketer.firstName} ${row.marketer.lastName}`
        : "Unassigned",
  },
  {
    field: "currentBalance",
    headerName: "Balance",
    width: 130,
    renderCell: ({ row }) => money(row.currentBalance),
  },
  {
    field: "activePlans",
    headerName: "Plans",
    width: 80,
    renderCell: ({ row }) => row.activePlans ?? 0,
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: ({ row }) => (
      <StatusPill tone={MEMBER_STATUS_TONE[row.status]}>
        {row.status}
      </StatusPill>
    ),
  },
];

export const marketerColumns = [
  { field: "staffNo", headerName: "Staff No", width: 130 },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 170,
    valueGetter: (_value, row) =>
      `${row.firstName || ""} ${row.lastName || ""}`.trim(),
  },
  { field: "emailAddress", headerName: "Email", flex: 1, minWidth: 200 },
  {
    field: "territory",
    headerName: "Territory",
    width: 160,
    renderCell: ({ row }) => row.territory || "—",
  },
  {
    field: "liveMemberCount",
    headerName: "Members",
    width: 100,
    renderCell: ({ row }) => row.liveMemberCount ?? 0,
  },
  {
    field: "portfolioBalance",
    headerName: "Portfolio",
    width: 140,
    renderCell: ({ row }) => money(row.portfolioBalance),
  },
  {
    field: "canReviewWithdrawals",
    headerName: "Can approve",
    width: 120,
    renderCell: ({ row }) =>
      row.canReviewWithdrawals ? (
        <StatusPill tone="info">Yes</StatusPill>
      ) : (
        <span className="text-xs text-[#808C91]">No</span>
      ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 110,
    renderCell: ({ row }) => (
      <StatusPill tone={MARKETER_STATUS_TONE[row.status]}>
        {row.status}
      </StatusPill>
    ),
  },
];

export const withdrawalColumns = [
  { field: "reference", headerName: "Reference", width: 140 },
  {
    field: "member",
    headerName: "Member",
    flex: 1,
    minWidth: 180,
    renderCell: ({ row }) =>
      row.member ? `${row.member.firstName} ${row.member.lastName}` : "—",
  },
  {
    field: "plan",
    headerName: "Plan",
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => row.plan?.name || "—",
  },
  { field: "type", headerName: "Type", width: 110 },
  {
    field: "gross",
    headerName: "Requested",
    width: 130,
    renderCell: ({ row }) => money(row.breakdown?.grossAmount),
  },
  {
    field: "penalty",
    headerName: "Forfeit",
    width: 130,
    renderCell: ({ row }) =>
      row.breakdown?.penaltyAmount > 0 ? (
        <span className="text-[#9E2D2D]">
          −{money(row.breakdown.penaltyAmount, true)} (
          {row.breakdown.penaltyPercent}%)
        </span>
      ) : (
        "—"
      ),
  },
  {
    field: "netPayable",
    headerName: "Payable",
    width: 140,
    renderCell: ({ row }) => (
      <span className="font-semibold">
        {money(row.breakdown?.netPayable, true)}
      </span>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: ({ row }) => (
      <StatusPill tone={WITHDRAWAL_STATUS_TONE[row.status]}>
        {row.status === "MarketerReviewed" ? "Officer checked" : row.status}
      </StatusPill>
    ),
  },
];

export const offerColumns = [
  {
    field: "member",
    headerName: "Member",
    flex: 1,
    minWidth: 180,
    renderCell: ({ row }) =>
      row.member
        ? `${row.member.firstName} ${row.member.lastName}`
        : row.memberId,
  },
  { field: "kind", headerName: "Type", width: 120 },
  {
    field: "amount",
    headerName: "Amount",
    width: 140,
    renderCell: ({ row }) => money(row.amount),
  },
  {
    field: "monthlyRepayment",
    headerName: "Monthly",
    width: 130,
    renderCell: ({ row }) => money(row.monthlyRepayment),
  },
  {
    field: "tenorMonths",
    headerName: "Tenor",
    width: 90,
    renderCell: ({ row }) => `${row.tenorMonths}m`,
  },
  {
    field: "score",
    headerName: "Score",
    width: 90,
    renderCell: ({ row }) => row.rationale?.score ?? "—",
  },
  {
    field: "monthsSaved",
    headerName: "Months saved",
    width: 130,
    renderCell: ({ row }) => row.rationale?.monthsSaved ?? "—",
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: ({ row }) => (
      <StatusPill tone={OFFER_STATUS_TONE[row.status]}>{row.status}</StatusPill>
    ),
  },
];

export const contributionColumns = [
  {
    field: "entryDate",
    headerName: "Date",
    width: 120,
    renderCell: ({ row }) => formatDate(row.entryDate),
  },
  {
    field: "member",
    headerName: "Member",
    flex: 1,
    minWidth: 170,
    renderCell: ({ row }) =>
      row.member ? `${row.member.firstName} ${row.member.lastName}` : "—",
  },
  {
    field: "plan",
    headerName: "Plan",
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => row.plan?.name || "—",
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 130,
    renderCell: ({ row }) =>
      row.savingsType === "Item"
        ? `${row.item?.quantity ?? 0} ${row.item?.unit || "item"}(s)`
        : money(row.amount),
  },
  {
    field: "managementFee",
    headerName: "Fee",
    width: 110,
    renderCell: ({ row }) =>
      row.managementFee > 0 ? money(row.managementFee, true) : "—",
  },
  { field: "recordedByType", headerName: "Recorded by", width: 130 },
  {
    field: "photos",
    headerName: "Photos",
    width: 90,
    renderCell: ({ row }) => row.photos?.length || 0,
  },
  {
    field: "capturedOffline",
    headerName: "Offline",
    width: 90,
    renderCell: ({ row }) =>
      row.capturedOffline ? <StatusPill tone="info">Yes</StatusPill> : "—",
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: ({ row }) => (
      <StatusPill
        tone={
          row.status === "Confirmed"
            ? "success"
            : row.status === "Pending"
              ? "warning"
              : row.status === "Disputed" || row.status === "Rejected"
                ? "danger"
                : "neutral"
        }
      >
        {row.status}
      </StatusPill>
    ),
  },
];
