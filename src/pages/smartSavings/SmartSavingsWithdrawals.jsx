import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/tables/DataTable";
import DashboardStats from "@/components/base/DashboardStats";
import {
  useApproveSavingsWithdrawal,
  useMarkSavingsWithdrawalPaid,
  useRejectSavingsWithdrawal,
  useSavingsWithdrawals,
} from "@/store/features/smartSavings/useSmartSavings";
import { formatDate, money, StatusPill, withdrawalColumns } from "./constants";
import CustomEye from "@/components/icons/CustomEye";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "Pending", label: "With officer" },
  { value: "MarketerReviewed", label: "Ready to approve" },
  { value: "Approved", label: "Approved, unpaid" },
  { value: "Paid", label: "Paid" },
  { value: "Rejected", label: "Rejected" },
];

/**
 * The withdrawal approval queue.
 *
 * The figures are recomputed server-side at the moment of approval, not taken
 * from the request — a member can go on contributing while their application
 * sits here, and the amount quoted three weeks ago against a smaller balance is
 * not the amount that should be paid. The panel shows the current arithmetic so
 * an approver is signing off what will actually leave the account.
 */
const SmartSavingsWithdrawals = () => {
  const [status, setStatus] = useState("MarketerReviewed");
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view");
  const [note, setNote] = useState("");
  const [payoutReference, setPayoutReference] = useState("");

  const { data, isLoading } = useSavingsWithdrawals({
    status: status || undefined,
    limit: 100,
  });
  const approve = useApproveSavingsWithdrawal();
  const reject = useRejectSavingsWithdrawal();
  const markPaid = useMarkSavingsWithdrawalPaid();

  const requests = useMemo(() => data?.data?.requests ?? [], [data]);

  const stats = useMemo(() => {
    const payable = requests
      .filter((row) => row.status === "Approved")
      .reduce((sum, row) => sum + (row.breakdown?.netPayable || 0), 0);
    const forfeits = requests.reduce(
      (sum, row) => sum + (row.breakdown?.penaltyAmount || 0),
      0,
    );
    return [
      {
        label: "Requests Shown",
        value: String(requests.length),
        change: "",
        subtext:
          STATUS_TABS.find((tab) => tab.value === status)?.label || "All",
      },
      {
        label: "Approved, Awaiting Payment",
        value: money(payable),
        change: "",
        subtext: "Committed but not yet sent",
      },
      {
        label: "Early Withdrawal Forfeits",
        value: money(forfeits, true),
        change: "",
        subtext: "Retained by the scheme on these requests",
      },
      {
        label: "Item Releases",
        value: String(
          requests.filter((row) => row.type === "ItemRelease").length,
        ),
        change: "",
        subtext: "Goods to hand back",
      },
    ];
  }, [requests, status]);

  const close = () => {
    setSelected(null);
    setMode("view");
    setNote("");
    setPayoutReference("");
  };

  const actions = [
    {
      label: "Review",
      icon: CustomEye,
      onClick: (row) => {
        setSelected(row);
        setMode("view");
      },
    },
  ];

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({
        withdrawalId: selected.withdrawalId,
        note: note.trim() || undefined,
      });
      toast.success(`${selected.reference} approved`);
      close();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not approve this withdrawal",
      );
    }
  };

  const handleReject = async () => {
    if (!note.trim()) {
      toast.error("Give the member a reason");
      return;
    }
    try {
      await reject.mutateAsync({
        withdrawalId: selected.withdrawalId,
        reason: note.trim(),
      });
      toast.success(`${selected.reference} rejected`);
      close();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not reject this withdrawal",
      );
    }
  };

  const handlePaid = async () => {
    try {
      await markPaid.mutateAsync({
        withdrawalId: selected.withdrawalId,
        payoutReference: payoutReference.trim() || undefined,
        payoutChannel: "Transfer",
      });
      toast.success(`${selected.reference} marked as paid`);
      close();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not mark this as paid",
      );
    }
  };

  return (
    // Every page supplies its own scroll container and padding; the layout does
    // not. Without this the content sits flush against the sidebar and the
    // window edge — matching Affiliates and Promotions.
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Savings withdrawals"
          subtitle="Applications from scheme members — review, approve and settle"
          hidden
        />

        <DashboardStats stats={stats} />

        <div className="mt-6 mb-4 flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value || "all"}
              type="button"
              onClick={() => setStatus(tab.value)}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                status === tab.value
                  ? "bg-[#084059] text-white"
                  : "bg-[#F1F3F4] text-[#808C91] hover:bg-[#E4E7EC]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable
          title="Withdrawal requests"
          data={requests}
          columns={withdrawalColumns}
          actions={actions}
          loading={isLoading}
          getRowId={(row) => row.withdrawalId}
          showCheckbox={false}
        />

        {selected && (
          <ReviewPanel
            row={selected}
            mode={mode}
            note={note}
            payoutReference={payoutReference}
            onNote={setNote}
            onPayoutReference={setPayoutReference}
            onMode={setMode}
            onClose={close}
            onApprove={handleApprove}
            onReject={handleReject}
            onPaid={handlePaid}
            busy={approve.isPending || reject.isPending || markPaid.isPending}
          />
        )}
      </div>
    </div>
  );
};

const ReviewPanel = ({
  row,
  mode,
  note,
  payoutReference,
  onNote,
  onPayoutReference,
  onMode,
  onClose,
  onApprove,
  onReject,
  onPaid,
  busy,
}) => {
  const isItem = row.type === "ItemRelease";
  const open = ["Pending", "MarketerReviewed"].includes(row.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(8,64,89,0.5)]"
      />

      <aside className="relative flex h-full w-full max-w-[520px] flex-col overflow-y-auto bg-white shadow-xl">
        <header className="sticky top-0 z-10 border-b border-[#E4E7EC] bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-urbanist text-lg font-bold">{row.reference}</p>
              <p className="text-sm text-[#808C91]">
                {row.member
                  ? `${row.member.firstName} ${row.member.lastName} · ${row.member.memberNo}`
                  : row.memberId}
              </p>
            </div>
            <StatusPill
              tone={
                row.status === "Approved" || row.status === "Paid"
                  ? "success"
                  : row.status === "Rejected"
                    ? "danger"
                    : "warning"
              }
            >
              {row.status === "MarketerReviewed"
                ? "Officer checked"
                : row.status}
            </StatusPill>
          </div>
        </header>

        <div className="flex-1 space-y-6 px-6 py-5">
          <section>
            <h3 className="mb-3 text-sm font-bold">What the member receives</h3>
            {isItem ? (
              <div className="rounded-xl bg-[#F8FAFB] p-4">
                <p className="text-lg font-bold">
                  {row.requestedItemQuantity} {row.plan?.itemUnit || "item"}(s)
                </p>
                <p className="text-xs text-[#808C91]">
                  From {row.plan?.name} — goods to be handed back and
                  photographed
                </p>
              </div>
            ) : (
              <dl className="space-y-2.5 rounded-xl bg-[#F8FAFB] p-4">
                <Row
                  label="Amount requested"
                  value={money(row.breakdown?.grossAmount)}
                />
                {row.breakdown?.managementFee > 0 && (
                  <Row
                    label="Management fee"
                    value={`−${money(row.breakdown.managementFee, true)}`}
                    tone="negative"
                  />
                )}
                {row.breakdown?.penaltyAmount > 0 && (
                  <Row
                    label={`Early withdrawal charge (${row.breakdown.penaltyPercent}%)`}
                    hint={`${row.breakdown.monthsCompleted} of ${row.breakdown.monthsRequired} months completed`}
                    value={`−${money(row.breakdown.penaltyAmount, true)}`}
                    tone="negative"
                  />
                )}
                {row.breakdown?.bonusAmount > 0 && (
                  <Row
                    label="Maturity bonus"
                    value={`+${money(row.breakdown.bonusAmount, true)}`}
                    tone="positive"
                  />
                )}
                <div className="flex items-center justify-between border-t border-[#E4E7EC] pt-2.5">
                  <span className="text-sm font-bold">Net payable</span>
                  <span className="text-lg font-bold">
                    {money(row.breakdown?.netPayable, true)}
                  </span>
                </div>
              </dl>
            )}
            <p className="mt-2 text-xs text-[#808C91]">
              Recomputed against the live balance when you approve, so a member
              who has contributed since applying is paid the correct figure.
            </p>
          </section>

          {row.payoutAccount && (
            <section>
              <h3 className="mb-2 text-sm font-bold">Paying into</h3>
              <div className="rounded-xl border border-[#E4E7EC] p-4">
                <p className="text-sm font-semibold">
                  {row.payoutAccount.accountName}
                </p>
                <p className="text-sm text-[#808C91]">
                  {row.payoutAccount.accountNumber} ·{" "}
                  {row.payoutAccount.bankName}
                </p>
                {!row.payoutAccount.verified && (
                  <p className="mt-2 text-xs text-[#B58202]">
                    Not verified by name enquiry — the member's own assertion.
                  </p>
                )}
              </div>
            </section>
          )}

          <section className="grid grid-cols-2 gap-4">
            <Detail label="Plan" value={row.plan?.name || "—"} />
            <Detail label="Applied" value={formatDate(row.createdAt)} />
            <Detail
              label="Officer"
              value={
                row.marketer
                  ? `${row.marketer.firstName} ${row.marketer.lastName}`
                  : "Unassigned"
              }
            />
            <Detail label="Balance on plan" value={money(row.plan?.balance)} />
          </section>

          {row.reason && (
            <section>
              <h3 className="mb-1 text-sm font-bold">Member's reason</h3>
              <p className="text-sm text-[#333333]">{row.reason}</p>
            </section>
          )}

          {row.marketerNote && (
            <section className="rounded-xl bg-[#E9FAF8] p-4">
              <h3 className="mb-1 text-sm font-bold text-[#1B8E83]">
                Officer's note
              </h3>
              <p className="text-sm text-[#333333]">{row.marketerNote}</p>
              <p className="mt-1 text-xs text-[#808C91]">
                Checked {formatDate(row.marketerReviewedAt)}
              </p>
            </section>
          )}

          {row.status === "Pending" && (
            <section className="rounded-xl bg-[#FFF8E6] p-4">
              <p className="text-sm font-semibold text-[#B58202]">
                Not yet checked by the field officer
              </p>
              <p className="mt-1 text-xs text-[#808C91]">
                You can still approve it, but the officer's check is what
                confirms the member is who they say they are.
              </p>
            </section>
          )}

          {row.rejectionReason && (
            <section className="rounded-xl bg-[#FCECEC] p-4">
              <h3 className="mb-1 text-sm font-bold text-[#9E2D2D]">
                Rejected
              </h3>
              <p className="text-sm text-[#333333]">{row.rejectionReason}</p>
            </section>
          )}

          {mode === "view" && open && (
            <section>
              <label
                className="mb-1.5 block text-sm font-semibold"
                htmlFor="savings-wd-note"
              >
                Note (optional)
              </label>
              <textarea
                id="savings-wd-note"
                rows={3}
                value={note}
                onChange={(event) => onNote(event.target.value)}
                maxLength={240}
                placeholder="Anything worth recording against this approval"
                className="w-full rounded-xl border border-[#E4E7EC] p-3 text-sm focus:border-[#FF5B04] focus:outline-none"
              />
            </section>
          )}

          {mode === "reject" && (
            <section>
              <label
                className="mb-1.5 block text-sm font-semibold"
                htmlFor="savings-wd-reason"
              >
                Why are you rejecting this?
              </label>
              <textarea
                id="savings-wd-reason"
                rows={3}
                value={note}
                onChange={(event) => onNote(event.target.value)}
                maxLength={240}
                placeholder="The member is told this, by notification and SMS"
                className="w-full rounded-xl border border-[#E4E7EC] p-3 text-sm focus:border-[#FF5B04] focus:outline-none"
              />
            </section>
          )}

          {row.status === "Approved" && (
            <section>
              <label
                className="mb-1.5 block text-sm font-semibold"
                htmlFor="savings-wd-ref"
              >
                Payment reference
              </label>
              <input
                id="savings-wd-ref"
                value={payoutReference}
                onChange={(event) => onPayoutReference(event.target.value)}
                placeholder="Transfer reference, or how the cash was handed over"
                className="h-11 w-full rounded-full border border-[#E4E7EC] px-4 text-sm focus:border-[#FF5B04] focus:outline-none"
              />
            </section>
          )}
        </div>

        <footer className="sticky bottom-0 border-t border-[#E4E7EC] bg-white px-6 py-4">
          {open && mode === "view" && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onMode("reject")}
                className="h-11 flex-1 rounded-full border border-[#E4E7EC] text-sm font-semibold text-[#9E2D2D]"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onApprove}
                className="h-11 flex-[2] rounded-full bg-[#FF5B04] text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy
                  ? "Working…"
                  : `Approve ${money(row.breakdown?.netPayable, true)}`}
              </button>
            </div>
          )}

          {open && mode === "reject" && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onMode("view")}
                className="h-11 flex-1 rounded-full border border-[#E4E7EC] text-sm font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                disabled={busy || !note.trim()}
                onClick={onReject}
                className="h-11 flex-1 rounded-full bg-[#DF3F40] text-sm font-semibold text-white disabled:opacity-50"
              >
                Confirm rejection
              </button>
            </div>
          )}

          {row.status === "Approved" && (
            <button
              type="button"
              disabled={busy}
              onClick={onPaid}
              className="h-11 w-full rounded-full bg-[#084059] text-sm font-semibold text-white disabled:opacity-50"
            >
              Mark as paid
            </button>
          )}

          {!open && row.status !== "Approved" && (
            <button
              type="button"
              onClick={onClose}
              className="h-11 w-full rounded-full border border-[#E4E7EC] text-sm font-semibold"
            >
              Close
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
};

const Row = ({ label, value, hint, tone = "neutral" }) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="text-sm text-[#808C91]">
      {label}
      {hint && <span className="block text-xs text-[#B0B7C3]">{hint}</span>}
    </dt>
    <dd
      className={`shrink-0 text-sm font-semibold ${
        tone === "negative"
          ? "text-[#9E2D2D]"
          : tone === "positive"
            ? "text-[#188C43]"
            : "text-[#1E1E1E]"
      }`}
    >
      {value}
    </dd>
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-[#808C91]">{label}</p>
    <p className="text-sm font-semibold">{value}</p>
  </div>
);

export default SmartSavingsWithdrawals;
