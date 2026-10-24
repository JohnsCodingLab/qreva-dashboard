import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/tables/DataTable";
import DashboardStats from "@/components/base/DashboardStats";
import {
  useAssignMarketer,
  useReinstateMember,
  useSavingsMember,
  useSavingsMemberEligibility,
  useSavingsMarketers,
  useSavingsMembers,
  useSuspendMember,
} from "@/store/features/smartSavings/useSmartSavings";
import { formatDate, memberColumns, money, StatusPill } from "./constants";
import CustomEye from "@/components/icons/CustomEye";

/**
 * The member register.
 *
 * The detail panel deliberately shows the same figures the member sees in their
 * own app — same balance, same passbook, same streak. An admin and a member
 * looking at different numbers for the same savings is how a dispute becomes
 * unresolvable, so there is nothing here the member cannot also see.
 */
const SmartSavingsMembers = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [openMemberId, setOpenMemberId] = useState(null);

  const { data, isLoading } = useSavingsMembers({
    search: search || undefined,
    status: status || undefined,
    page,
    limit: 25,
  });

  const members = useMemo(() => data?.data?.members ?? [], [data]);
  const pagination = data?.data?.pagination;

  const stats = useMemo(() => {
    const balance = members.reduce(
      (sum, row) => sum + (row.currentBalance || 0),
      0,
    );
    const saved = members.reduce((sum, row) => sum + (row.totalSaved || 0), 0);
    const unassigned = members.filter((row) => !row.marketerId).length;
    return [
      {
        label: "Members (page)",
        value: String(pagination?.total ?? members.length),
        change: "",
        subtext: `Showing ${members.length} of ${pagination?.total ?? members.length}`,
      },
      {
        label: "Balance On Page",
        value: money(balance),
        change: "",
        subtext: "Held for these members",
      },
      {
        label: "Saved On Page",
        value: money(saved),
        change: "",
        subtext: "Lifetime contributions",
      },
      {
        label: "Unassigned",
        value: String(unassigned),
        change: "",
        subtext: "No marketer collecting from them",
      },
    ];
  }, [members, pagination]);

  const actions = [
    {
      label: "View member",
      icon: CustomEye,
      onClick: (row) => setOpenMemberId(row.memberId),
    },
  ];

  return (
    // Every page supplies its own scroll container and padding; the layout does
    // not. Without this the content sits flush against the sidebar and the
    // window edge — matching Affiliates and Promotions.
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Savings members"
          subtitle="Everyone enrolled in the Qreva Empowerment Foundation savings scheme"
          hidden
        />

        <DashboardStats stats={stats} />

        <div className="mt-6 mb-4 flex flex-wrap gap-2">
          {["", "Active", "Pending", "Suspended", "Closed"].map((value) => (
            <button
              key={value || "all"}
              type="button"
              onClick={() => {
                setStatus(value);
                setPage(1);
              }}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                status === value
                  ? "bg-[#084059] text-white"
                  : "bg-[#F1F3F4] text-[#808C91] hover:bg-[#E4E7EC]"
              }`}
            >
              {value || "All"}
            </button>
          ))}
        </div>

        <DataTable
          title="Member register"
          data={members}
          columns={memberColumns}
          actions={actions}
          loading={isLoading}
          getRowId={(row) => row.memberId}
          showCheckbox={false}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          paginationMode="server"
          rowCount={pagination?.total ?? 0}
          onPageChange={(next) => setPage(next)}
        />

        {openMemberId && (
          <MemberPanel
            memberId={openMemberId}
            onClose={() => setOpenMemberId(null)}
          />
        )}
      </div>
    </div>
  );
};

const MemberPanel = ({ memberId, onClose }) => {
  const { data, isLoading } = useSavingsMember(memberId);
  const { data: eligibilityData } = useSavingsMemberEligibility(memberId);
  const { data: marketersData } = useSavingsMarketers({ status: "Active" });

  const assign = useAssignMarketer();
  const suspend = useSuspendMember();
  const reinstate = useReinstateMember();

  const [marketerId, setMarketerId] = useState("");
  const [reason, setReason] = useState("");
  const [suspending, setSuspending] = useState(false);

  const detail = data?.data;
  const member = detail?.member;
  const eligibility = eligibilityData?.data;
  const marketers = marketersData?.data ?? [];

  const handleAssign = async () => {
    if (!marketerId) return;
    try {
      const result = await assign.mutateAsync({ memberId, marketerId });
      toast.success(result?.message || "Marketer assigned");
      setMarketerId("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not reassign this member",
      );
    }
  };

  const handleSuspend = async () => {
    if (!reason.trim()) {
      toast.error("Give a reason — the member is told");
      return;
    }
    try {
      await suspend.mutateAsync({ memberId, reason: reason.trim() });
      toast.success("Member suspended");
      setSuspending(false);
      setReason("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not suspend this member",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(8,64,89,0.5)]"
      />

      <aside className="relative flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-white shadow-xl">
        {isLoading || !member ? (
          <div className="p-6">
            <div className="h-24 animate-pulse rounded-2xl bg-[#F1F3F4]" />
          </div>
        ) : (
          <>
            <header className="sticky top-0 z-10 border-b border-[#E4E7EC] bg-white px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-urbanist text-lg font-bold">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-[#808C91]">
                    {member.memberNo} · {member.phoneNumber}
                  </p>
                </div>
                <StatusPill
                  tone={
                    member.status === "Active"
                      ? "success"
                      : member.status === "Suspended"
                        ? "danger"
                        : "warning"
                  }
                >
                  {member.status}
                </StatusPill>
              </div>
            </header>

            <div className="flex-1 space-y-6 px-6 py-5">
              <section className="grid grid-cols-2 gap-4 rounded-xl bg-[#F8FAFB] p-4">
                <Detail
                  label="Current balance"
                  value={money(member.currentBalance)}
                />
                <Detail
                  label="Saved in total"
                  value={money(member.totalSaved)}
                />
                <Detail
                  label="Withdrawn"
                  value={money(member.totalWithdrawn)}
                />
                <Detail
                  label="Items held"
                  value={String(member.totalItemsSaved || 0)}
                />
                <Detail
                  label="First contribution"
                  value={formatDate(member.firstContributionAt)}
                />
                <Detail
                  label="Last contribution"
                  value={formatDate(member.lastContributionAt)}
                />
              </section>

              {eligibility && (
                <section
                  className={`rounded-xl p-4 ${
                    eligibility.qualified ? "bg-[#E9F9EF]" : "bg-[#F1F3F4]"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold">
                      {eligibility.qualified
                        ? "Qualifies for credit"
                        : "Not yet qualified"}
                    </h3>
                    {eligibility.qualified && (
                      <StatusPill tone="success">
                        Up to {money(eligibility.maxOffer)}
                      </StatusPill>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <Detail
                      label="Months saved"
                      value={`${eligibility.monthsSaved} / ${eligibility.monthsRequired}`}
                    />
                    <Detail
                      label="Kept to plan"
                      value={`${eligibility.consistencyPercent}%`}
                    />
                    <Detail label="Score" value={String(eligibility.score)} />
                  </div>
                  {eligibility.reasons?.length > 0 && (
                    <ul className="mt-3 space-y-1 border-t border-[#D6DADB] pt-3 text-xs text-[#808C91]">
                      {eligibility.reasons.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              <section>
                <h3 className="mb-2 text-sm font-bold">Plans</h3>
                {(detail.plans || []).length === 0 ? (
                  <p className="text-sm text-[#808C91]">No plans opened.</p>
                ) : (
                  <div className="divide-y divide-[#E4E7EC]">
                    {detail.plans.map((plan) => (
                      <div
                        key={plan.planId}
                        className="flex items-center justify-between py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold">{plan.name}</p>
                          <p className="text-xs text-[#808C91]">
                            {plan.savingsType === "Item" ? "Goods" : "Cash"} ·{" "}
                            {plan.frequency} ·{" "}
                            {plan.mode === "Fixed"
                              ? `${plan.tenureMonths} months`
                              : "open-ended"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {plan.savingsType === "Item"
                              ? `${plan.itemQuantity} ${plan.itemUnit || "item"}(s)`
                              : money(plan.balance)}
                          </p>
                          <StatusPill
                            tone={
                              plan.status === "Active" ? "success" : "neutral"
                            }
                          >
                            {plan.status}
                          </StatusPill>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="mb-2 text-sm font-bold">Recent entries</h3>
                {(detail.entries || []).length === 0 ? (
                  <p className="text-sm text-[#808C91]">
                    Nothing recorded yet.
                  </p>
                ) : (
                  <div className="divide-y divide-[#E4E7EC]">
                    {detail.entries.slice(0, 12).map((entry) => (
                      <div
                        key={entry.contributionId}
                        className="flex items-center justify-between py-2.5"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {entry.savingsType === "Item"
                              ? `${entry.item?.quantity ?? 0} ${entry.item?.unit || "item"}(s)`
                              : money(entry.amount)}
                          </p>
                          <p className="text-xs text-[#808C91]">
                            {formatDate(entry.entryDate)} · by{" "}
                            {entry.recordedByType}
                            {entry.capturedOffline ? " · offline" : ""}
                          </p>
                        </div>
                        <StatusPill
                          tone={
                            entry.status === "Confirmed"
                              ? "success"
                              : entry.status === "Pending"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {entry.status}
                        </StatusPill>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="mb-2 text-sm font-bold">Assigned marketer</h3>
                <p className="mb-3 text-sm text-[#808C91]">
                  {detail.marketer
                    ? `${detail.marketer.firstName} ${detail.marketer.lastName} · ${detail.marketer.staffNo}`
                    : "Nobody is collecting from this member."}
                </p>
                <div className="flex gap-2">
                  <select
                    value={marketerId}
                    onChange={(event) => setMarketerId(event.target.value)}
                    className="h-11 flex-1 rounded-full border border-[#E4E7EC] px-4 text-sm"
                  >
                    <option value="">Reassign to…</option>
                    {marketers.map((marketer) => (
                      <option
                        key={marketer.marketerId}
                        value={marketer.marketerId}
                      >
                        {marketer.firstName} {marketer.lastName} (
                        {marketer.liveMemberCount} members)
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!marketerId || assign.isPending}
                    onClick={handleAssign}
                    className="h-11 rounded-full bg-[#084059] px-5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Assign
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#808C91]">
                  Their plans move with them, so the new officer's collection
                  sheet is correct immediately.
                </p>
              </section>
            </div>

            <footer className="sticky bottom-0 border-t border-[#E4E7EC] bg-white px-6 py-4">
              {suspending ? (
                <div className="space-y-3">
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Why is this member being suspended? They are told."
                    className="w-full rounded-xl border border-[#E4E7EC] p-3 text-sm focus:border-[#FF5B04] focus:outline-none"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSuspending(false)}
                      className="h-11 flex-1 rounded-full border border-[#E4E7EC] text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={suspend.isPending || !reason.trim()}
                      onClick={handleSuspend}
                      className="h-11 flex-1 rounded-full bg-[#DF3F40] text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Suspend member
                    </button>
                  </div>
                </div>
              ) : member.status === "Suspended" ? (
                <button
                  type="button"
                  disabled={reinstate.isPending}
                  onClick={async () => {
                    await reinstate.mutateAsync(memberId);
                    toast.success("Member reinstated");
                  }}
                  className="h-11 w-full rounded-full bg-[#084059] text-sm font-semibold text-white disabled:opacity-50"
                >
                  Reinstate member
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSuspending(true)}
                  className="h-11 w-full rounded-full border border-[#E4E7EC] text-sm font-semibold text-[#9E2D2D]"
                >
                  Suspend member
                </button>
              )}
            </footer>
          </>
        )}
      </aside>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-[#808C91]">{label}</p>
    <p className="text-sm font-semibold">{value}</p>
  </div>
);

export default SmartSavingsMembers;
