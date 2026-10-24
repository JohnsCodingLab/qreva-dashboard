// I/A/M badge for the transaction's own account holder (Individual/Agent/
// Merchant) - resolved backend-side onto row.accountTypeBadge. Only ever
// describes our own customer, never an external transfer counterparty.
export const AccountTypeBadge = ({ code }) => {
  if (!code) return null;
  const labels = { I: "Individual", A: "Agent", M: "Merchant" };
  return (
    <span
      title={labels[code] || code}
      className="ml-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[#D9D9D9] bg-[#F7FAFA] text-[10px] font-semibold text-[#808C91]"
    >
      {code}
    </span>
  );
};

export const DirectionBadge = ({ direction }) => {
  if (!direction) return null;
  const isInternal = direction === "internal";
  return (
    <span
      className={`ml-1 inline-flex w-fit shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
        isInternal ? "bg-[#E9F9EF] text-[#188C43]" : "bg-[#FFF8E6] text-[#B58202]"
      }`}
    >
      {isInternal ? "Intra-bank" : "Interbank"}
    </span>
  );
};
