import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  useRemoveSavingsBroadcast,
  useSavingsBroadcasts,
  useSavingsConfig,
  useSendSavingsBroadcast,
  useUpdateSavingsConfig,
} from "@/store/features/smartSavings/useSmartSavings";
import { formatDate, StatusPill } from "./constants";

/**
 * The commercial terms of the savings scheme, and the broadcast tool.
 *
 * Every figure on this page is printed on the paper passbook today — 25%
 * forfeited on an early withdrawal, 3% for leaving the money six months past
 * tenure, six or twelve month contribution periods. Holding them as
 * configuration rather than code is the whole point of moving off paper: the
 * foundation can change its terms without a release.
 *
 * What it cannot do is change them retroactively. Each plan snapshots the terms
 * it was opened under, so a rate changed here applies to plans opened from now
 * on — the warning says so, because an admin raising the penalty needs to know
 * it will not claw back from existing members.
 */
const SmartSavingsSettings = () => {
  const { data, isLoading } = useSavingsConfig();
  const update = useUpdateSavingsConfig();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data?.data && !form) setForm(data.data);
  }, [data, form]);

  const set = (key) => (value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const dirty = useMemo(() => {
    if (!form || !data?.data) return false;
    return Object.keys(form).some((key) => {
      if (Array.isArray(form[key])) {
        return form[key].join(",") !== (data.data[key] || []).join(",");
      }
      return form[key] !== data.data[key];
    });
  }, [form, data]);

  const handleSave = async () => {
    try {
      await update.mutateAsync({
        managementFeeModel: form.managementFeeModel,
        managementFeePercent: Number(form.managementFeePercent),
        managementFeeFlat: Number(form.managementFeeFlat),
        managementFeeMinimumBalance: Number(form.managementFeeMinimumBalance),
        earlyWithdrawalPenaltyPercent: Number(
          form.earlyWithdrawalPenaltyPercent,
        ),
        penaltyGraceDays: Number(form.penaltyGraceDays),
        maturityBonusPercent: Number(form.maturityBonusPercent),
        maturityBonusHoldMonths: Number(form.maturityBonusHoldMonths),
        allowedTenureMonths: form.allowedTenureMonths,
        allowEndlessPlans: form.allowEndlessPlans,
        loanEligibilityMinMonths: Number(form.loanEligibilityMinMonths),
        loanMaxMultipleOfSavings: Number(form.loanMaxMultipleOfSavings),
        loanMaxAmount: Number(form.loanMaxAmount),
        poolUtilisationCapPercent: Number(form.poolUtilisationCapPercent),
        loanMinConsistencyPercent: Number(form.loanMinConsistencyPercent),
        memberEntriesRequireConfirmation: form.memberEntriesRequireConfirmation,
        disputeWindowDays: Number(form.disputeWindowDays),
        itemPhotosRequired: Number(form.itemPhotosRequired),
        weeklyDigestEnabled: form.weeklyDigestEnabled,
        weeklyDigestWeekday: Number(form.weeklyDigestWeekday),
        minimumContributionAmount: Number(form.minimumContributionAmount),
        minimumWithdrawalAmount: Number(form.minimumWithdrawalAmount),
      });
      toast.success("Scheme terms updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not save these terms",
      );
    }
  };

  if (isLoading || !form) {
    return (
      <div className="flex-1 overflow-auto bg-[#F7FAFA]">
        <div className="p-4 sm:p-6">
          <PageHeader
            title="Savings settings"
            subtitle="Scheme terms and member messaging"
            hidden
          />
          <div className="h-64 animate-pulse rounded-2xl bg-[#F1F3F4]" />
        </div>
      </div>
    );
  }

  return (
    // Every page supplies its own scroll container and padding; the layout does
    // not. Without this the content sits flush against the sidebar and the
    // window edge — matching Affiliates and Promotions.
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Savings settings"
          subtitle="The commercial terms of the scheme, and messaging to members"
          hidden
          actionButton={
            <button
              type="button"
              disabled={!dirty || update.isPending}
              onClick={handleSave}
              className="h-10 rounded-full bg-[#FF5B04] px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {update.isPending ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </button>
          }
        />

        <div className="mb-6 rounded-xl bg-[#FFF8E6] p-4">
          <p className="text-sm font-semibold text-[#B58202]">
            Changes apply to plans opened from now on
          </p>
          <p className="mt-1 text-xs text-[#808C91]">
            Every plan snapshots the terms it was opened under. A member told
            25% is owed 25% for the life of their plan, whatever is set here
            afterwards.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Section
            title="Management fee"
            blurb="Qreva's charge for running the scheme. Members see this on every plan."
          >
            <Choice
              label="How the fee is taken"
              value={form.managementFeeModel}
              onChange={set("managementFeeModel")}
              options={[
                { value: "Monthly", label: "Monthly, on the balance" },
                { value: "PerContribution", label: "From each contribution" },
                { value: "OnPayout", label: "Once, at payout" },
              ]}
            />
            <NumberField
              label="Fee percentage"
              suffix="%"
              value={form.managementFeePercent}
              onChange={set("managementFeePercent")}
            />
            <NumberField
              label="Flat fee alongside it"
              prefix="₦"
              hint="Usually zero"
              value={form.managementFeeFlat}
              onChange={set("managementFeeFlat")}
            />
            <NumberField
              label="No fee below this balance"
              prefix="₦"
              hint="Protects the smallest savers from being eaten by the charge"
              value={form.managementFeeMinimumBalance}
              onChange={set("managementFeeMinimumBalance")}
            />
          </Section>

          <Section
            title="Early withdrawal"
            blurb="What a member forfeits for taking money out before their term is up."
          >
            <NumberField
              label="Forfeit on early withdrawal"
              suffix="%"
              hint="25% on the paper passbook"
              value={form.earlyWithdrawalPenaltyPercent}
              onChange={set("earlyWithdrawalPenaltyPercent")}
            />
            <NumberField
              label="Grace period"
              suffix="days"
              hint="A member who changes their mind in the first week is not fined"
              value={form.penaltyGraceDays}
              onChange={set("penaltyGraceDays")}
            />
            <NumberField
              label="Smallest withdrawal"
              prefix="₦"
              hint="Or the whole balance, whichever is less"
              value={form.minimumWithdrawalAmount}
              onChange={set("minimumWithdrawalAmount")}
            />
          </Section>

          <Section
            title="Maturity"
            blurb="What a member earns for leaving a matured balance where it is."
          >
            <NumberField
              label="Maturity bonus"
              suffix="%"
              hint="3% on the paper passbook"
              value={form.maturityBonusPercent}
              onChange={set("maturityBonusPercent")}
            />
            <NumberField
              label="Hold period to earn it"
              suffix="months"
              value={form.maturityBonusHoldMonths}
              onChange={set("maturityBonusHoldMonths")}
            />
            <div>
              <p className="mb-2 text-xs font-semibold text-[#808C91]">
                Contribution periods offered
              </p>
              <div className="flex flex-wrap gap-2">
                {[3, 6, 9, 12, 18, 24].map((months) => {
                  const on = (form.allowedTenureMonths || []).includes(months);
                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={() =>
                        set("allowedTenureMonths")(
                          on
                            ? form.allowedTenureMonths.filter(
                                (value) => value !== months,
                              )
                            : [
                                ...(form.allowedTenureMonths || []),
                                months,
                              ].sort((a, b) => a - b),
                        )
                      }
                      className={`h-9 rounded-full border px-4 text-sm font-semibold transition-colors ${
                        on
                          ? "border-[#FF5B04] bg-[#FFEFE6] text-[#B54103]"
                          : "border-[#E4E7EC] text-[#808C91]"
                      }`}
                    >
                      {months}m
                    </button>
                  );
                })}
              </div>
            </div>
            <Toggle
              label="Allow open-ended plans"
              hint="Members can save with no end date and withdraw with no forfeit"
              value={form.allowEndlessPlans}
              onChange={set("allowEndlessPlans")}
            />
          </Section>

          <Section
            title="Loans and eligibility"
            blurb="The test a member has to pass before the planner will suggest them for credit."
          >
            <NumberField
              label="Unbroken months of saving required"
              suffix="months"
              value={form.loanEligibilityMinMonths}
              onChange={set("loanEligibilityMinMonths")}
            />
            <NumberField
              label="Minimum consistency"
              suffix="%"
              hint="Share of the contributions they set out to make"
              value={form.loanMinConsistencyPercent}
              onChange={set("loanMinConsistencyPercent")}
            />
            <NumberField
              label="Lend up to this multiple of savings"
              suffix="×"
              value={form.loanMaxMultipleOfSavings}
              onChange={set("loanMaxMultipleOfSavings")}
            />
            <NumberField
              label="Hard ceiling on one offer"
              prefix="₦"
              value={form.loanMaxAmount}
              onChange={set("loanMaxAmount")}
            />
            <NumberField
              label="Pool utilisation cap"
              suffix="%"
              hint="Share of the available pool the planner will put out on loan at once"
              value={form.poolUtilisationCapPercent}
              onChange={set("poolUtilisationCapPercent")}
            />
          </Section>

          <Section
            title="Field operations"
            blurb="How entries are recorded and checked in the market."
          >
            <Toggle
              label="Member entries need a marketer's confirmation"
              hint="The digital version of the staff signature column on the paper card"
              value={form.memberEntriesRequireConfirmation}
              onChange={set("memberEntriesRequireConfirmation")}
            />
            <NumberField
              label="Dispute window"
              suffix="days"
              hint="How long a member has to query an entry"
              value={form.disputeWindowDays}
              onChange={set("disputeWindowDays")}
            />
            <NumberField
              label="Photos required per item entry"
              hint="The photographs are the receipt for goods handed over"
              value={form.itemPhotosRequired}
              onChange={set("itemPhotosRequired")}
            />
            <NumberField
              label="Smallest contribution accepted"
              prefix="₦"
              value={form.minimumContributionAmount}
              onChange={set("minimumContributionAmount")}
            />
          </Section>

          <Section
            title="Member messaging"
            blurb="The automatic summaries members receive."
          >
            <Toggle
              label="Send the weekly summary"
              hint="Every member with an active plan, whether or not they saved"
              value={form.weeklyDigestEnabled}
              onChange={set("weeklyDigestEnabled")}
            />
            <Choice
              label="Day it goes out"
              value={String(form.weeklyDigestWeekday)}
              onChange={(value) => set("weeklyDigestWeekday")(Number(value))}
              options={[
                { value: "1", label: "Monday" },
                { value: "2", label: "Tuesday" },
                { value: "3", label: "Wednesday" },
                { value: "4", label: "Thursday" },
                { value: "5", label: "Friday" },
                { value: "6", label: "Saturday" },
                { value: "7", label: "Sunday" },
              ]}
            />
          </Section>
        </div>

        <Broadcasts />
      </div>
    </div>
  );
};

// ── Broadcasts ────────────────────────────────────────────────────

const Broadcasts = () => {
  const { data } = useSavingsBroadcasts();
  const send = useSendSavingsBroadcast();
  const remove = useRemoveSavingsBroadcast();

  const [audience, setAudience] = useState("AllMembers");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [alsoSms, setAlsoSms] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");

  const broadcasts = data?.data ?? [];

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("A broadcast needs a title and a message");
      return;
    }
    try {
      await send.mutateAsync({
        audience,
        category: "Promotional",
        title: title.trim(),
        body: body.trim(),
        imageUrl: imageUrl.trim() || undefined,
        ctaUrl: ctaUrl.trim() || undefined,
        scheduledFor: scheduledFor || undefined,
        alsoSms,
      });
      toast.success(scheduledFor ? "Broadcast scheduled" : "Broadcast sent");
      setTitle("");
      setBody("");
      setImageUrl("");
      setCtaUrl("");
      setAlsoSms(false);
      setScheduledFor("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not send this broadcast",
      );
    }
  };

  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      <Card className="border-[#E4E7EC]">
        <CardContent className="p-5">
          <h3 className="font-urbanist text-base font-bold">
            Send a broadcast
          </h3>
          <p className="mb-4 text-sm text-[#808C91]">
            Promotional and programme updates. Members who have turned
            promotional messages off do not receive it — alerts about their own
            money are always sent and are not configurable here.
          </p>

          <div className="space-y-4">
            <Choice
              label="Audience"
              value={audience}
              onChange={setAudience}
              options={[
                { value: "AllMembers", label: "All members" },
                { value: "AllMarketers", label: "All marketers" },
              ]}
            />
            <TextField
              label="Title"
              value={title}
              onChange={setTitle}
              maxLength={80}
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#808C91]">
                Message
              </label>
              <textarea
                rows={3}
                value={body}
                maxLength={400}
                onChange={(event) => setBody(event.target.value)}
                className="w-full rounded-xl border border-[#E4E7EC] p-3 text-sm focus:border-[#FF5B04] focus:outline-none"
              />
            </div>
            <TextField
              label="Image URL"
              hint="Optional artwork for the notification card"
              value={imageUrl}
              onChange={setImageUrl}
            />
            <TextField
              label="Link"
              hint="Optional — an in-app route like /opportunities, or an external URL"
              value={ctaUrl}
              onChange={setCtaUrl}
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#808C91]">
                Schedule for later
              </label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                className="h-11 w-full rounded-full border border-[#E4E7EC] px-4 text-sm"
              />
            </div>
            <Toggle
              label="Also send by SMS"
              hint="Costs money per recipient — off unless the message warrants it"
              value={alsoSms}
              onChange={setAlsoSms}
            />
          </div>

          <button
            type="button"
            disabled={send.isPending}
            onClick={handleSend}
            className="mt-5 h-11 w-full rounded-full bg-[#FF5B04] text-sm font-semibold text-white disabled:opacity-50"
          >
            {send.isPending
              ? "Sending…"
              : scheduledFor
                ? "Schedule broadcast"
                : "Send now"}
          </button>
        </CardContent>
      </Card>

      <Card className="border-[#E4E7EC]">
        <CardContent className="p-5">
          <h3 className="font-urbanist text-base font-bold">
            Sent and scheduled
          </h3>
          <p className="mb-4 text-sm text-[#808C91]">
            Removing a broadcast takes it off every member's notification list.
          </p>

          {broadcasts.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#808C91]">
              Nothing sent yet.
            </p>
          ) : (
            <div className="divide-y divide-[#E4E7EC]">
              {broadcasts.map((row) => (
                <div key={row.notificationId} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{row.title}</p>
                      <p className="text-xs text-[#808C91]">{row.body}</p>
                    </div>
                    <StatusPill tone={row.sentAt ? "success" : "warning"}>
                      {row.sentAt ? "Sent" : "Scheduled"}
                    </StatusPill>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-[#B0B7C3]">
                      {row.audience === "AllMembers" ? "Members" : "Marketers"}{" "}
                      · {formatDate(row.sentAt || row.scheduledFor)} ·{" "}
                      {row.reads} reads
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        await remove.mutateAsync(row.notificationId);
                        toast.success("Broadcast removed");
                      }}
                      className="text-xs font-semibold text-[#9E2D2D]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── Field primitives ──────────────────────────────────────────────

const Section = ({ title, blurb, children }) => (
  <Card className="border-[#E4E7EC]">
    <CardContent className="p-5">
      <h3 className="font-urbanist text-base font-bold">{title}</h3>
      <p className="mb-4 text-sm text-[#808C91]">{blurb}</p>
      <div className="space-y-4">{children}</div>
    </CardContent>
  </Card>
);

const NumberField = ({ label, value, onChange, prefix, suffix, hint }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-[#808C91]">
      {label}
    </label>
    <div className="flex items-center gap-2">
      {prefix && <span className="text-sm text-[#808C91]">{prefix}</span>}
      <input
        inputMode="decimal"
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value.replace(/[^\d.]/g, ""))
        }
        className="h-11 w-full rounded-full border border-[#E4E7EC] px-4 text-sm focus:border-[#FF5B04] focus:outline-none"
      />
      {suffix && <span className="text-sm text-[#808C91]">{suffix}</span>}
    </div>
    {hint && <p className="mt-1 text-xs text-[#B0B7C3]">{hint}</p>}
  </div>
);

const TextField = ({ label, value, onChange, hint, maxLength }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-[#808C91]">
      {label}
    </label>
    <input
      value={value}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-full border border-[#E4E7EC] px-4 text-sm focus:border-[#FF5B04] focus:outline-none"
    />
    {hint && <p className="mt-1 text-xs text-[#B0B7C3]">{hint}</p>}
  </div>
);

const Choice = ({ label, value, onChange, options }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-[#808C91]">
      {label}
    </label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-full border border-[#E4E7EC] px-4 text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, value, onChange, hint }) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E4E7EC] p-3.5">
    <input
      type="checkbox"
      checked={Boolean(value)}
      onChange={(event) => onChange(event.target.checked)}
      className="mt-0.5 h-4 w-4 accent-[#FF5B04]"
    />
    <span>
      <span className="block text-sm font-semibold">{label}</span>
      {hint && <span className="block text-xs text-[#808C91]">{hint}</span>}
    </span>
  </label>
);

export default SmartSavingsSettings;
