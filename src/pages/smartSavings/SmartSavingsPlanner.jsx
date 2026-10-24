import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/base/DashboardStats";
import DataTable from "@/components/tables/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCreateSavingsOffer,
  useGenerateSuggestions,
  useMarkOfferDisbursed,
  useReleaseSavingsOffer,
  useSavingsOffers,
  useSavingsPlanner,
  useWithdrawSavingsOffer,
} from "@/store/features/smartSavings/useSmartSavings";
import { formatDate, money, offerColumns, StatusPill } from "./constants";
import CustomEye from "@/components/icons/CustomEye";

/**
 * The lending planner: who has earned credit, and when the pool can afford it.
 *
 * Two questions, answered separately and in that order. Eligibility is about
 * one member's own record — four unbroken months of saving, a consistency
 * threshold, money still in. Affordability is about the pool, and a hundred
 * qualified members do not mean a hundred loans, because the money being lent
 * is the same money the foundation owes back to whoever matures next month.
 *
 * The output is therefore a *schedule*, not a list: each candidate is fitted
 * into a week whose remaining capacity can carry them. An admin can work down
 * it in order and never be asked to pay out money the pool does not have.
 */
const SmartSavingsPlanner = () => {
  const [weeks, setWeeks] = useState(8);
  const [tab, setTab] = useState("plan");
  const [selected, setSelected] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerTenor, setOfferTenor] = useState("3");
  const [offerNote, setOfferNote] = useState("");

  const { data, isLoading, refetch, isFetching } = useSavingsPlanner({
    weeks,
    limit: 100,
  });
  const { data: offersData } = useSavingsOffers({});

  const generate = useGenerateSuggestions();
  const createOffer = useCreateSavingsOffer();
  const release = useReleaseSavingsOffer();
  const disburse = useMarkOfferDisbursed();
  const withdrawOffer = useWithdrawSavingsOffer();

  const plan = data?.data;
  const pool = plan?.pool;
  const offers = useMemo(() => offersData?.data ?? [], [offersData]);

  const scheduled = useMemo(
    () =>
      (plan?.scheduled || []).flatMap((week) =>
        week.candidates.map((candidate) => ({ ...candidate, week: week.week })),
      ),
    [plan],
  );

  const stats = useMemo(
    () => [
      {
        label: "Lending Capacity",
        value: money(pool?.lendingCapacity),
        change: "",
        subtext: `After obligations, ${pool?.utilisationCapPercent ?? 0}% cap applied`,
      },
      {
        label: "Qualified Members",
        value: String(plan?.qualifiedCount ?? 0),
        change: "",
        subtext: "Meeting the scheme’s saving test",
      },
      {
        label: "Schedulable Now",
        value: String(scheduled.length),
        change: "",
        subtext: `Across the next ${plan?.horizonWeeks ?? weeks} weeks`,
      },
      {
        label: "Deferred",
        value: String((plan?.deferred || []).length),
        change: "",
        subtext: "Qualified, but the pool cannot reach them yet",
      },
    ],
    [pool, plan, scheduled, weeks],
  );

  const handleGenerate = async () => {
    try {
      const result = await generate.mutateAsync(25);
      toast.success(result?.message || "Suggestions created");
      setTab("offers");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not create suggestions",
      );
    }
  };

  const handleCreateOffer = async () => {
    if (!selected) return;
    const amount = Number(offerAmount);
    if (!amount) {
      toast.error("Enter an amount");
      return;
    }
    if (amount > selected.recommendedAmount) {
      toast.error(
        `The planner recommends no more than ${money(selected.recommendedAmount)} for this member`,
      );
      return;
    }
    try {
      await createOffer.mutateAsync({
        memberId: selected.memberId,
        amount,
        tenorMonths: Number(offerTenor) || 3,
        interestPercent: 0,
        recommendedDisbursementDate: selected.recommendedDisbursementDate,
        note: offerNote.trim() || undefined,
      });
      toast.success(`Offer sent to ${selected.fullName}`);
      setSelected(null);
      setOfferAmount("");
      setOfferNote("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not create this offer",
      );
    }
  };

  const offerActions = [
    {
      label: "Release to member",
      icon: CustomEye,
      onClick: async (row) => {
        if (row.status !== "Suggested") {
          toast.error("Only a planner suggestion can be released");
          return;
        }
        try {
          await release.mutateAsync(row.offerId);
          toast.success("Offer sent to the member");
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Could not release this offer",
          );
        }
      },
    },
    {
      label: "Mark disbursed",
      icon: CustomEye,
      onClick: async (row) => {
        if (row.status !== "Accepted") {
          toast.error("Only an accepted offer can be disbursed");
          return;
        }
        try {
          await disburse.mutateAsync(row.offerId);
          toast.success("Marked as disbursed");
        } catch (error) {
          toast.error(
            error?.response?.data?.message ||
              "Could not mark this as disbursed",
          );
        }
      },
    },
    {
      label: "Withdraw offer",
      icon: CustomEye,
      onClick: async (row) => {
        try {
          await withdrawOffer.mutateAsync({
            offerId: row.offerId,
            reason: "Withdrawn by admin",
          });
          toast.success("Offer withdrawn");
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Could not withdraw this offer",
          );
        }
      },
    },
  ];

  return (
    // Every page supplies its own scroll container and padding; the layout does
    // not. Without this the content sits flush against the sidebar and the
    // window edge — matching Affiliates and Promotions.
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Loan planner"
          subtitle="Who has earned credit, and when the savings pool can afford to give it"
          hidden
          actionButton={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="h-10 rounded-full border border-[#E4E7EC] px-4 text-sm font-semibold disabled:opacity-50"
              >
                {isFetching ? "Recalculating…" : "Recalculate"}
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generate.isPending || scheduled.length === 0}
                className="h-10 rounded-full bg-[#FF5B04] px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {generate.isPending ? "Creating…" : "Create suggestions"}
              </button>
            </div>
          }
        />

        <DashboardStats stats={stats} />

        <div className="mt-6 mb-4 flex flex-wrap items-center gap-2">
          {[
            { value: "plan", label: `Schedule (${scheduled.length})` },
            {
              value: "deferred",
              label: `Deferred (${(plan?.deferred || []).length})`,
            },
            { value: "offers", label: `Offers (${offers.length})` },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                tab === item.value
                  ? "bg-[#084059] text-white"
                  : "bg-[#F1F3F4] text-[#808C91] hover:bg-[#E4E7EC]"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="planner-weeks" className="text-sm text-[#808C91]">
              Horizon
            </label>
            <select
              id="planner-weeks"
              value={weeks}
              onChange={(event) => setWeeks(Number(event.target.value))}
              className="h-9 rounded-full border border-[#E4E7EC] px-3 text-sm"
            >
              {[4, 8, 12, 26].map((option) => (
                <option key={option} value={option}>
                  {option} weeks
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="h-40 animate-pulse rounded-2xl bg-[#F1F3F4]" />
        )}

        {tab === "plan" && plan && (
          <div className="space-y-4">
            {scheduled.length === 0 ? (
              <Card className="border-[#E4E7EC]">
                <CardContent className="p-8 text-center">
                  <p className="font-urbanist text-lg font-bold">
                    Nothing to schedule
                  </p>
                  <p className="mt-1 text-sm text-[#808C91]">
                    {plan.qualifiedCount === 0
                      ? "No member has met the saving test yet."
                      : `${plan.qualifiedCount} members qualify, but the pool has ${money(pool?.lendingCapacity)} of capacity. Deposits need to grow, or the utilisation cap raised.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              (plan.scheduled || []).map((week) => (
                <Card key={week.week} className="border-[#E4E7EC]">
                  <CardContent className="p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-urbanist text-base font-bold">
                          Week {week.week} · from {formatDate(week.startsOn)}
                        </h3>
                        <p className="text-xs text-[#808C91]">
                          {week.candidates.length}{" "}
                          {week.candidates.length === 1 ? "member" : "members"}{" "}
                          · {money(week.allocated)} of {money(week.capacity)}{" "}
                          allocated
                        </p>
                      </div>
                      <div className="w-40">
                        <div className="h-2 overflow-hidden rounded-full bg-[#E4E7EC]">
                          <div
                            className="h-full rounded-full bg-[#26C8B9]"
                            style={{
                              width: `${Math.min(100, Math.round((week.allocated / Math.max(week.capacity, 1)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-[#E4E7EC]">
                      {week.candidates.map((candidate) => (
                        <CandidateRow
                          key={candidate.memberId}
                          candidate={candidate}
                          onOffer={() => {
                            setSelected(candidate);
                            setOfferAmount(
                              String(Math.floor(candidate.recommendedAmount)),
                            );
                            setOfferTenor("3");
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {tab === "deferred" && plan && (
          <Card className="border-[#E4E7EC]">
            <CardContent className="p-5">
              <h3 className="font-urbanist text-base font-bold">
                Qualified but deferred
              </h3>
              <p className="mb-4 text-sm text-[#808C91]">
                These members have earned credit, but the pool cannot reach them
                inside the {plan.horizonWeeks}-week horizon. This number is the
                clearest signal the scheme needs more deposits before it
                promises more loans.
              </p>

              {(plan.deferred || []).length === 0 ? (
                <p className="py-6 text-center text-sm text-[#808C91]">
                  Nobody is waiting on capacity.
                </p>
              ) : (
                <div className="divide-y divide-[#E4E7EC]">
                  {plan.deferred.map((candidate) => (
                    <CandidateRow
                      key={candidate.memberId}
                      candidate={candidate}
                      deferred
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {tab === "offers" && (
          <DataTable
            title="Loan offers"
            data={offers}
            columns={offerColumns}
            actions={offerActions}
            getRowId={(row) => row.offerId}
            showCheckbox={false}
          />
        )}

        {selected && (
          <OfferModal
            candidate={selected}
            amount={offerAmount}
            tenor={offerTenor}
            note={offerNote}
            onAmount={setOfferAmount}
            onTenor={setOfferTenor}
            onNote={setOfferNote}
            onClose={() => setSelected(null)}
            onSubmit={handleCreateOffer}
            busy={createOffer.isPending}
          />
        )}
      </div>
    </div>
  );
};

const CandidateRow = ({ candidate, onOffer, deferred = false }) => (
  <div className="flex flex-wrap items-center gap-4 py-3">
    <div className="min-w-[180px] flex-1">
      <p className="text-sm font-semibold">{candidate.fullName}</p>
      <p className="text-xs text-[#808C91]">
        {candidate.memberNo}
        {candidate.businessName ? ` · ${candidate.businessName}` : ""}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-4 text-xs">
      <Metric label="Months saved" value={candidate.monthsSaved} />
      <Metric label="Kept to plan" value={`${candidate.consistencyPercent}%`} />
      <Metric label="Balance" value={money(candidate.currentBalance)} />
      <Metric label="Avg/month" value={money(candidate.averageMonthly)} />
      <Metric label="Score" value={candidate.score} strong />
    </div>

    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-xs text-[#808C91]">Recommended</p>
        <p className="text-sm font-bold">
          {money(candidate.recommendedAmount)}
        </p>
      </div>
      {deferred ? (
        <StatusPill tone="neutral">Awaiting capacity</StatusPill>
      ) : (
        <button
          type="button"
          onClick={onOffer}
          className="h-9 rounded-full bg-[#FF5B04] px-4 text-sm font-semibold text-white"
        >
          Offer
        </button>
      )}
    </div>
  </div>
);

const Metric = ({ label, value, strong = false }) => (
  <div>
    <p className="text-[#B0B7C3]">{label}</p>
    <p className={strong ? "text-sm font-bold" : "font-semibold"}>{value}</p>
  </div>
);

const OfferModal = ({
  candidate,
  amount,
  tenor,
  note,
  onAmount,
  onTenor,
  onNote,
  onClose,
  onSubmit,
  busy,
}) => {
  const monthly = Number(amount) / (Number(tenor) || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(8,64,89,0.5)]"
      />

      <div className="relative w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-urbanist text-lg font-bold">Offer a loan</h2>
        <p className="mb-5 text-sm text-[#808C91]">
          {candidate.fullName} · {candidate.memberNo}
        </p>

        <div className="mb-5 rounded-xl bg-[#F8FAFB] p-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Metric label="Months saved" value={candidate.monthsSaved} />
            <Metric
              label="Kept to plan"
              value={`${candidate.consistencyPercent}%`}
            />
            <Metric
              label="Current balance"
              value={money(candidate.currentBalance)}
            />
            <Metric
              label="Saved in total"
              value={money(candidate.totalSaved)}
            />
          </div>
          <p className="mt-3 border-t border-[#E4E7EC] pt-3 text-xs text-[#808C91]">
            The planner recommends up to{" "}
            <strong>{money(candidate.recommendedAmount)}</strong> and a
            disbursement date of{" "}
            {formatDate(candidate.recommendedDisbursementDate)}.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="mb-1.5 block text-sm font-semibold"
              htmlFor="offer-amount"
            >
              Amount
            </label>
            <input
              id="offer-amount"
              inputMode="numeric"
              value={amount}
              onChange={(event) =>
                onAmount(event.target.value.replace(/\D/g, ""))
              }
              className="h-11 w-full rounded-full border border-[#E4E7EC] px-4 text-sm focus:border-[#FF5B04] focus:outline-none"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-semibold"
              htmlFor="offer-tenor"
            >
              Repayment period
            </label>
            <select
              id="offer-tenor"
              value={tenor}
              onChange={(event) => onTenor(event.target.value)}
              className="h-11 w-full rounded-full border border-[#E4E7EC] px-4 text-sm"
            >
              {[3, 6, 9, 12].map((months) => (
                <option key={months} value={months}>
                  {months} months
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-[#808C91]">
            Repayment of <strong>{money(monthly)}</strong> a month for {tenor}{" "}
            months.
          </p>

          <div>
            <label
              className="mb-1.5 block text-sm font-semibold"
              htmlFor="offer-note"
            >
              Note for the member (optional)
            </label>
            <textarea
              id="offer-note"
              rows={2}
              value={note}
              onChange={(event) => onNote(event.target.value)}
              maxLength={240}
              className="w-full rounded-xl border border-[#E4E7EC] p-3 text-sm focus:border-[#FF5B04] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-full border border-[#E4E7EC] text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onSubmit}
            className="h-11 flex-1 rounded-full bg-[#FF5B04] text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send offer"}
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-[#808C91]">
          The member is notified immediately and has 14 days to respond.
        </p>
      </div>
    </div>
  );
};

export default SmartSavingsPlanner;
