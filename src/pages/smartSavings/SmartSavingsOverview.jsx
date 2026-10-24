import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/base/DashboardStats";
import { Card, CardContent } from "@/components/ui/card";
import {
  useSavingsOverview,
  useSavingsQueueCounts,
} from "@/store/features/smartSavings/useSmartSavings";
import { formatMonth, money, StatusPill } from "./constants";

/**
 * The Smart Savings scheme at a glance.
 *
 * The figure that matters most on this page is the lending capacity, and it is
 * deliberately not the same thing as the total balance. Members' savings are a
 * liability the foundation owes back; what it can actually lend is that balance
 * less the withdrawals already approved, less the plans maturing in the next
 * ninety days, and then capped. Showing the headline balance as though it were
 * available is how a savings scheme ends up unable to pay a maturity.
 */
const SmartSavingsOverview = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useSavingsOverview();
  const { data: queueData } = useSavingsQueueCounts();

  const overview = data?.data;
  const queue = queueData?.data;
  const pool = overview?.pool;

  const stats = useMemo(() => {
    if (!pool) return [];
    return [
      {
        label: "Total Savings Pool",
        value: money(pool.totalBalance),
        change: "",
        subtext: `${pool.savingMembers} members saving across ${pool.activePlans} plans`,
      },
      {
        label: "Available to Lend",
        value: money(pool.lendingCapacity),
        change: "",
        subtext: `After obligations, capped at ${pool.utilisationCapPercent}%`,
      },
      {
        label: "Management Fees",
        value: money(overview?.revenue?.managementFees, true),
        change: "",
        subtext: "Earned by Qreva since launch",
      },
      {
        label: "Out On Loan",
        value: money(pool.outstandingLoans),
        change: "",
        subtext: "Accepted and disbursed offers",
      },
    ];
  }, [pool, overview]);

  const inflow = overview?.inflowByMonth || [];
  const peak = Math.max(...inflow.map((row) => row.total), 1);

  return (
    // Every page supplies its own scroll container and padding; the layout does
    // not. Without this the content sits flush against the sidebar and the
    // window edge — matching Affiliates and Promotions.
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Smart Savings"
          subtitle="Qreva Empowerment Foundation savings scheme — pool, members and performance"
          hidden
        />

        {isLoading ? (
          <div className="h-32 animate-pulse rounded-2xl bg-[#F1F3F4]" />
        ) : (
          <DashboardStats stats={stats} />
        )}

        {/* The queues, as the first thing after the headline figures: an admin
          opening this page is usually here to clear something. */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QueueTile
            label="Withdrawals to approve"
            value={
              (queue?.withdrawals?.pending || 0) +
              (queue?.withdrawals?.marketerReviewed || 0)
            }
            hint={`${queue?.withdrawals?.marketerReviewed || 0} already checked by an officer`}
            onClick={() => navigate("/smart-savings/withdrawals")}
            urgent
          />
          <QueueTile
            label="Entries awaiting confirmation"
            value={queue?.pendingEntries || 0}
            hint="Recorded by members, not yet counter-signed"
            onClick={() => navigate("/smart-savings/entries")}
          />
          <QueueTile
            label="Open queries"
            value={queue?.disputes || 0}
            hint="Members disputing a recorded entry"
            onClick={() => navigate("/smart-savings/entries?status=Disputed")}
            urgent={Boolean(queue?.disputes)}
          />
          <QueueTile
            label="Matured plans"
            value={queue?.maturedPlans || 0}
            hint="Payable with no forfeit"
            onClick={() => navigate("/smart-savings/members")}
          />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card className="border-[#E4E7EC]">
            <CardContent className="p-5">
              <h2 className="font-urbanist text-lg font-bold">
                Monthly inflow
              </h2>
              <p className="mb-5 text-sm text-[#808C91]">
                Contributions confirmed each month, and how many members saved
              </p>

              {inflow.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#808C91]">
                  No contributions recorded yet.
                </p>
              ) : (
                <div className="flex items-end gap-2">
                  {inflow.map((row) => (
                    <div
                      key={row.month}
                      className="flex min-w-0 flex-1 flex-col items-center gap-2"
                    >
                      <div className="flex h-36 w-full items-end">
                        <div
                          className="w-full rounded-t-md bg-[#26C8B9] transition-all"
                          style={{
                            height: `${Math.max(3, (row.total / peak) * 100)}%`,
                          }}
                          title={`${formatMonth(row.month)}: ${money(row.total)} from ${row.activeSavers} members`}
                        />
                      </div>
                      <span className="truncate text-[10px] text-[#808C91]">
                        {formatMonth(row.month).split(" ")[0]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EC]">
            <CardContent className="p-5">
              <h2 className="font-urbanist text-lg font-bold">Pool position</h2>
              <p className="mb-4 text-sm text-[#808C91]">
                What the scheme holds, and what it already owes
              </p>

              <dl className="space-y-3">
                <PoolRow
                  label="Member balances"
                  value={money(pool?.totalBalance)}
                />
                <PoolRow
                  label="Approved withdrawals"
                  value={`−${money(pool?.committedWithdrawals)}`}
                  tone="negative"
                  hint="Signed off, not yet paid"
                />
                <PoolRow
                  label="Maturing within 90 days"
                  value={`−${money(pool?.maturingWithin90Days)}`}
                  tone="negative"
                  hint="Payable on demand with no forfeit"
                />
                <PoolRow
                  label="Available after obligations"
                  value={money(pool?.availableAfterObligations)}
                  strong
                />
                <PoolRow
                  label={`Lending capacity (${pool?.utilisationCapPercent ?? 0}% cap)`}
                  value={money(pool?.lendingCapacity)}
                  tone="positive"
                  strong
                />
              </dl>

              {pool?.itemValueHeld > 0 && (
                <p className="mt-4 border-t border-[#E4E7EC] pt-3 text-xs text-[#808C91]">
                  Plus {money(pool.itemValueHeld)} of goods held on behalf of
                  members
                  {overview?.items?.quantityHeld
                    ? ` (${overview.items.quantityHeld} items across ${overview.items.plans} plans)`
                    : ""}
                  .
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <Card className="border-[#E4E7EC]">
            <CardContent className="p-5">
              <h2 className="font-urbanist text-lg font-bold">
                Maturity schedule
              </h2>
              <p className="mb-4 text-sm text-[#808C91]">
                What the foundation owes back, month by month
              </p>

              {(pool?.maturitySchedule || []).length === 0 ? (
                <p className="py-6 text-center text-sm text-[#808C91]">
                  Nothing matures in the next 90 days.
                </p>
              ) : (
                <div className="divide-y divide-[#E4E7EC]">
                  {pool.maturitySchedule.map((row) => (
                    <div
                      key={row.month}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {formatMonth(row.month)}
                        </p>
                        <p className="text-xs text-[#808C91]">
                          {row.plans} {row.plans === 1 ? "plan" : "plans"}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {money(row.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EC]">
            <CardContent className="p-5">
              <h2 className="font-urbanist text-lg font-bold">Plan mix</h2>
              <p className="mb-4 text-sm text-[#808C91]">
                How active members are choosing to save
              </p>

              {(overview?.planMix || []).length === 0 ? (
                <p className="py-6 text-center text-sm text-[#808C91]">
                  No active plans yet.
                </p>
              ) : (
                <div className="divide-y divide-[#E4E7EC]">
                  {overview.planMix.map((row) => (
                    <div
                      key={`${row.savingsType}-${row.frequency}`}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-2">
                        <StatusPill
                          tone={row.savingsType === "Item" ? "info" : "neutral"}
                        >
                          {row.savingsType === "Item" ? "Goods" : "Cash"}
                        </StatusPill>
                        <span className="text-sm">{row.frequency}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {row.count} plans
                        </p>
                        <p className="text-xs text-[#808C91]">
                          {money(row.balance)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#E4E7EC] pt-4">
                <div>
                  <p className="text-xs text-[#808C91]">Active members</p>
                  <p className="text-lg font-bold">
                    {overview?.members?.Active || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#808C91]">Pending enrolment</p>
                  <p className="text-lg font-bold">
                    {overview?.members?.Pending || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const QueueTile = ({ label, value, hint, onClick, urgent = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-2xl border p-4 text-left transition-colors ${
      urgent && value > 0
        ? "border-[#FF5B04] bg-[#FFF4EE] hover:bg-[#FFEDE3]"
        : "border-[#E4E7EC] bg-white hover:bg-[#F8FAFB]"
    }`}
  >
    <p className="text-xs font-medium text-[#808C91]">{label}</p>
    <p className="mt-1 font-urbanist text-2xl font-bold">{value}</p>
    <p className="mt-1 text-xs text-[#808C91]">{hint}</p>
  </button>
);

const PoolRow = ({ label, value, hint, tone = "neutral", strong = false }) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="text-sm text-[#808C91]">
      {label}
      {hint && <span className="block text-xs text-[#B0B7C3]">{hint}</span>}
    </dt>
    <dd
      className={`shrink-0 text-sm ${strong ? "font-bold" : "font-medium"} ${
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

export default SmartSavingsOverview;
