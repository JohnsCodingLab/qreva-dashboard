import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/tables/DataTable";
import DashboardStats from "@/components/base/DashboardStats";
import { Card, CardContent } from "@/components/ui/card";
import {
  useBlockMarketer,
  useInviteMarketers,
  useResendInvite,
  useRevokeInvite,
  useSavingsInvites,
  useSavingsMarketers,
  useUnblockMarketer,
  useUpdateMarketer,
} from "@/store/features/smartSavings/useSmartSavings";
import { formatDate, marketerColumns, money, StatusPill } from "./constants";
import CustomEye from "@/components/icons/CustomEye";

const BLANK_INVITE = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  territory: "",
  canReviewWithdrawals: false,
};

/**
 * Marketers — the credit officers who collect from members in the field.
 *
 * There is no self-signup: the people in this list can write money onto a
 * member's record, so the only way one comes to exist is an admin invitation.
 * The invite form takes a list rather than one officer, because a foundation
 * onboarding a market team invites eleven in a sitting and eleven round trips
 * through a single-row form is how half of them end up never invited.
 */
const SmartSavingsMarketers = () => {
  const [tab, setTab] = useState("marketers");
  const [inviting, setInviting] = useState(false);
  const [rows, setRows] = useState([{ ...BLANK_INVITE }]);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useSavingsMarketers({});
  const { data: invitesData } = useSavingsInvites({});

  const invite = useInviteMarketers();
  const resend = useResendInvite();
  const revoke = useRevokeInvite();
  const block = useBlockMarketer();
  const unblock = useUnblockMarketer();

  const marketers = useMemo(() => data?.data ?? [], [data]);
  const invites = useMemo(() => invitesData?.data ?? [], [invitesData]);

  const stats = useMemo(() => {
    const active = marketers.filter((row) => row.status === "Active").length;
    const members = marketers.reduce(
      (sum, row) => sum + (row.liveMemberCount || 0),
      0,
    );
    const portfolio = marketers.reduce(
      (sum, row) => sum + (row.portfolioBalance || 0),
      0,
    );
    return [
      {
        label: "Active Marketers",
        value: String(active),
        change: "",
        subtext: `${marketers.length} on the register`,
      },
      {
        label: "Members Covered",
        value: String(members),
        change: "",
        subtext: "Assigned across all officers",
      },
      {
        label: "Portfolio Balance",
        value: money(portfolio),
        change: "",
        subtext: "Savings held by their members",
      },
      {
        label: "Pending Invitations",
        value: String(invites.filter((row) => row.status === "Pending").length),
        change: "",
        subtext: "Sent, not yet accepted",
      },
    ];
  }, [marketers, invites]);

  const addRow = () =>
    setRows((previous) => [...previous, { ...BLANK_INVITE }]);
  const setRow = (index, key, value) =>
    setRows((previous) =>
      previous.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
  const removeRow = (index) =>
    setRows((previous) =>
      previous.length === 1 ? previous : previous.filter((_, i) => i !== index),
    );

  const handleInvite = async () => {
    const payload = rows
      .map((row) => ({
        firstName: row.firstName.trim(),
        lastName: row.lastName.trim(),
        emailAddress: row.emailAddress.trim().toLowerCase(),
        phoneNumber: row.phoneNumber.replace(/\D/g, ""),
        territory: row.territory.trim() || undefined,
        canReviewWithdrawals: row.canReviewWithdrawals,
      }))
      .filter(
        (row) =>
          row.firstName && row.lastName && row.emailAddress && row.phoneNumber,
      );

    if (payload.length === 0) {
      toast.error("Fill in at least one complete row");
      return;
    }

    const badPhone = payload.find(
      (row) => !/^(0\d{10}|234\d{10})$/.test(row.phoneNumber),
    );
    if (badPhone) {
      toast.error(
        `${badPhone.firstName}'s phone number is not a valid Nigerian number`,
      );
      return;
    }

    try {
      const result = await invite.mutateAsync(payload);
      const skipped = result?.data?.skipped || [];
      toast.success(result?.message || "Invitations sent");
      if (skipped.length) {
        toast.warning(
          `Skipped ${skipped.length}: ${skipped.map((row) => `${row.emailAddress} (${row.reason})`).join(", ")}`,
        );
      }
      setRows([{ ...BLANK_INVITE }]);
      setInviting(false);
      setTab("invites");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not send these invitations",
      );
    }
  };

  const marketerActions = [
    {
      label: "Edit",
      icon: CustomEye,
      onClick: (row) => setEditing(row),
    },
    {
      label: "Block / unblock",
      icon: CustomEye,
      onClick: async (row) => {
        try {
          if (row.status === "Blocked") {
            await unblock.mutateAsync(row.marketerId);
            toast.success(`${row.firstName} restored`);
          } else {
            const result = await block.mutateAsync({
              marketerId: row.marketerId,
              reason: "Blocked by admin",
            });
            const affected = result?.data?.membersNeedingReassignment || 0;
            toast.success(
              affected
                ? `${row.firstName} blocked — ${affected} members need reassigning`
                : `${row.firstName} blocked`,
            );
          }
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Could not change this marketer",
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
          title="Savings marketers"
          subtitle="Credit officers who collect contributions from members in the field"
          hidden
          actionButton={
            <button
              type="button"
              onClick={() => {
                setInviting(true);
                setTab("invites");
              }}
              className="h-10 rounded-full bg-[#FF5B04] px-5 text-sm font-semibold text-white"
            >
              Invite marketers
            </button>
          }
        />

        <DashboardStats stats={stats} />

        <div className="mt-6 mb-4 flex flex-wrap gap-2">
          {[
            { value: "marketers", label: `Marketers (${marketers.length})` },
            { value: "invites", label: `Invitations (${invites.length})` },
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
        </div>

        {tab === "marketers" && (
          <DataTable
            title="Field team"
            data={marketers}
            columns={marketerColumns}
            actions={marketerActions}
            loading={isLoading}
            getRowId={(row) => row.marketerId}
            showCheckbox={false}
          />
        )}

        {tab === "invites" && (
          <div className="space-y-4">
            {inviting && (
              <Card className="border-[#E4E7EC]">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-urbanist text-base font-bold">
                        Invite a field team
                      </h3>
                      <p className="text-sm text-[#808C91]">
                        Each officer gets an email and an SMS with a link that
                        expires in 14 days.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addRow}
                      className="h-9 rounded-full border border-[#E4E7EC] px-4 text-sm font-semibold"
                    >
                      Add another
                    </button>
                  </div>

                  <div className="space-y-4">
                    {rows.map((row, index) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-xl border border-[#E4E7EC] p-4 md:grid-cols-2 xl:grid-cols-3"
                      >
                        <Field
                          label="First name"
                          value={row.firstName}
                          onChange={(value) =>
                            setRow(index, "firstName", value)
                          }
                        />
                        <Field
                          label="Last name"
                          value={row.lastName}
                          onChange={(value) => setRow(index, "lastName", value)}
                        />
                        <Field
                          label="Email address"
                          type="email"
                          value={row.emailAddress}
                          onChange={(value) =>
                            setRow(index, "emailAddress", value)
                          }
                        />
                        <Field
                          label="Phone number"
                          placeholder="08039661975"
                          value={row.phoneNumber}
                          onChange={(value) =>
                            setRow(index, "phoneNumber", value)
                          }
                        />
                        <Field
                          label="Territory"
                          placeholder="Ogbete Main Market"
                          value={row.territory}
                          onChange={(value) =>
                            setRow(index, "territory", value)
                          }
                        />

                        <div className="flex items-end justify-between gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={row.canReviewWithdrawals}
                              onChange={(event) =>
                                setRow(
                                  index,
                                  "canReviewWithdrawals",
                                  event.target.checked,
                                )
                              }
                              className="h-4 w-4 accent-[#FF5B04]"
                            />
                            Can approve withdrawals
                          </label>
                          {rows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow(index)}
                              className="text-sm font-semibold text-[#9E2D2D]"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-[#808C91]">
                    Leave "can approve withdrawals" off for most officers. An
                    officer who can both check and approve a payout can release
                    a member's savings on their own, which is the one thing the
                    two-stage review exists to prevent.
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setInviting(false);
                        setRows([{ ...BLANK_INVITE }]);
                      }}
                      className="h-11 rounded-full border border-[#E4E7EC] px-6 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={invite.isPending}
                      onClick={handleInvite}
                      className="h-11 rounded-full bg-[#FF5B04] px-6 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {invite.isPending
                        ? "Sending…"
                        : `Send ${rows.length} ${rows.length === 1 ? "invitation" : "invitations"}`}
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <h3 className="font-urbanist text-base font-bold">
                  Invitations
                </h3>
                <p className="mb-4 text-sm text-[#808C91]">
                  Revoked and expired invitations stay listed as a record of who
                  was approached.
                </p>

                {invites.length === 0 ? (
                  <p className="py-6 text-center text-sm text-[#808C91]">
                    No invitations sent yet.
                  </p>
                ) : (
                  <div className="divide-y divide-[#E4E7EC]">
                    {invites.map((row) => (
                      <div
                        key={row.inviteId}
                        className="flex flex-wrap items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-[200px]">
                          <p className="text-sm font-semibold">
                            {row.firstName} {row.lastName}
                          </p>
                          <p className="text-xs text-[#808C91]">
                            {row.emailAddress}
                            {row.territory ? ` · ${row.territory}` : ""}
                          </p>
                        </div>

                        <div className="text-xs text-[#808C91]">
                          Expires {formatDate(row.expiresAt)}
                          {row.resendCount > 0
                            ? ` · resent ${row.resendCount}×`
                            : ""}
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusPill
                            tone={
                              row.status === "Accepted"
                                ? "success"
                                : row.status === "Pending"
                                  ? "warning"
                                  : "neutral"
                            }
                          >
                            {row.status}
                          </StatusPill>

                          {row.status === "Pending" && (
                            <>
                              <button
                                type="button"
                                onClick={async () => {
                                  await resend.mutateAsync(row.inviteId);
                                  toast.success(
                                    "Invitation resent with a fresh link",
                                  );
                                }}
                                className="h-8 rounded-full border border-[#E4E7EC] px-3 text-xs font-semibold"
                              >
                                Resend
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  await revoke.mutateAsync(row.inviteId);
                                  toast.success("Invitation withdrawn");
                                }}
                                className="h-8 rounded-full border border-[#E4E7EC] px-3 text-xs font-semibold text-[#9E2D2D]"
                              >
                                Revoke
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {editing && (
          <EditMarketerModal
            marketer={editing}
            onClose={() => setEditing(null)}
          />
        )}
      </div>
    </div>
  );
};

const EditMarketerModal = ({ marketer, onClose }) => {
  const update = useUpdateMarketer();
  const [territory, setTerritory] = useState(marketer.territory || "");
  const [entryLimit, setEntryLimit] = useState(
    String(marketer.entryLimit || 0),
  );
  const [canReview, setCanReview] = useState(
    Boolean(marketer.canReviewWithdrawals),
  );

  const handleSave = async () => {
    try {
      await update.mutateAsync({
        marketerId: marketer.marketerId,
        territory: territory.trim() || undefined,
        entryLimit: Number(entryLimit) || 0,
        canReviewWithdrawals: canReview,
      });
      toast.success("Marketer updated");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not update this marketer",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(8,64,89,0.5)]"
      />
      <div className="relative w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-urbanist text-lg font-bold">
          {marketer.firstName} {marketer.lastName}
        </h2>
        <p className="mb-5 text-sm text-[#808C91]">
          {marketer.staffNo} · {marketer.liveMemberCount} members
        </p>

        <div className="space-y-4">
          <Field label="Territory" value={territory} onChange={setTerritory} />
          <Field
            label="Entry limit"
            hint="Largest single contribution this officer may record. Zero means no limit."
            value={entryLimit}
            onChange={(value) => setEntryLimit(value.replace(/\D/g, ""))}
          />
          <label className="flex items-start gap-3 rounded-xl border border-[#E4E7EC] p-3.5">
            <input
              type="checkbox"
              checked={canReview}
              onChange={(event) => setCanReview(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#FF5B04]"
            />
            <span>
              <span className="block text-sm font-semibold">
                Can approve withdrawals
              </span>
              <span className="block text-xs text-[#808C91]">
                Lets this officer release a payout without a second signature.
                Grant sparingly.
              </span>
            </span>
          </label>
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
            disabled={update.isPending}
            onClick={handleSave}
            className="h-11 flex-1 rounded-full bg-[#FF5B04] text-sm font-semibold text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-[#808C91]">
      {label}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-full border border-[#E4E7EC] px-4 text-sm focus:border-[#FF5B04] focus:outline-none"
    />
    {hint && <p className="mt-1 text-xs text-[#B0B7C3]">{hint}</p>}
  </div>
);

export default SmartSavingsMarketers;
