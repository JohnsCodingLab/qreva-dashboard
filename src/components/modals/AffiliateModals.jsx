import { useState } from "react";
import { Check, Copy, X } from "lucide-react";

const inputClass =
  "w-full border border-[#E8EBED] rounded-lg px-3 py-2.5 text-sm font-general outline-none focus:border-[#FF5B04]";

const Shell = ({ title, subtitle, onClose, children, width = "max-w-xl" }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div
      className={`bg-white rounded-xl w-full ${width} p-6 relative max-h-[90vh] overflow-y-auto`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black cursor-pointer"
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-urbanist font-bold text-[#1E1E1E] mb-1">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-[#808C91] font-general mb-5">{subtitle}</p>
      )}
      {children}
    </div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-general font-medium text-[#1E1E1E]">
      {label}
    </span>
    {children}
    {hint && (
      <span className="mt-1 block text-xs font-general text-[#808C91]">
        {hint}
      </span>
    )}
  </label>
);

export const CreateAffiliateModal = ({ isOpen, onClose, onSubmit, isSaving }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });

  if (!isOpen) return null;

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  return (
    <Shell
      title="New affiliate"
      subtitle="They get a referral code immediately; the invite link is for setting their portal password later."
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
        className="grid gap-4 md:grid-cols-2"
      >
        <Field label="First name">
          <input
            required
            value={form.firstName}
            onChange={setField("firstName")}
            className={inputClass}
          />
        </Field>
        <Field label="Last name">
          <input
            required
            value={form.lastName}
            onChange={setField("lastName")}
            className={inputClass}
          />
        </Field>
        <div className="md:col-span-2">
          <Field
            label="Email address"
            hint="Also how the mobile app recognises them. If they hold a Qreva account on this address, their points appear in it."
          >
            <input
              required
              type="email"
              value={form.emailAddress}
              onChange={setField("emailAddress")}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Phone number (optional)">
            <input
              value={form.phoneNumber}
              onChange={setField("phoneNumber")}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E8EBED] px-5 py-2.5 text-sm font-general font-semibold text-[#1E1E1E]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-[#FF5B04] px-5 py-2.5 text-sm font-general font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? "Creating…" : "Create affiliate"}
          </button>
        </div>
      </form>
    </Shell>
  );
};

/**
 * Shown once, straight after creation.
 *
 * The invite token is generated during create and never returned again —
 * there is no endpoint to fetch it later — so the panel says so rather than
 * letting an admin close it and find out.
 */
export const AffiliateCreatedModal = ({ affiliate, onClose }) => {
  const [copied, setCopied] = useState("");

  if (!affiliate) return null;

  const copy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      // Clipboard blocked; the value is on screen to copy by hand.
    }
  };

  const rows = [
    {
      key: "link",
      label: "Referral link — this is what they share",
      value: affiliate.referralLink,
    },
    { key: "code", label: "Referral code", value: affiliate.referralCode },
    ...(affiliate.inviteToken
      ? [
          {
            key: "invite",
            label: "Invite token — for setting their portal password",
            value: affiliate.inviteToken,
          },
        ]
      : []),
  ];

  return (
    <Shell
      title={`${affiliate.firstName} ${affiliate.lastName} is set up`}
      subtitle="Copy these now. The invite token is shown once and cannot be retrieved later."
      onClose={onClose}
    >
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="rounded-lg border border-[#E8EBED] p-3"
          >
            <p className="text-xs font-general text-[#808C91]">{row.label}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="flex-1 truncate text-sm text-[#1E1E1E]">
                {row.value}
              </code>
              <button
                type="button"
                onClick={() => copy(row.value, row.key)}
                className="flex items-center gap-1.5 rounded-lg border border-[#E8EBED] px-3 py-1.5 text-xs font-general font-semibold text-[#1E1E1E]"
              >
                {copied === row.key ? (
                  <>
                    <Check size={13} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-[#084059] px-5 py-2.5 text-sm font-general font-semibold text-white"
        >
          Done
        </button>
      </div>
    </Shell>
  );
};

export const AffiliateSignupsModal = ({
  affiliate,
  referrals,
  meta,
  isLoading,
  page,
  onPageChange,
  onClose,
}) => {
  if (!affiliate) return null;

  return (
    <Shell
      title={`Signed up through ${affiliate.firstName}`}
      subtitle={`${meta?.total ?? 0} in total · ${affiliate.points ?? 0} points earned`}
      onClose={onClose}
      width="max-w-2xl"
    >
      {isLoading ? (
        <p className="py-10 text-center text-sm font-general text-[#808C91]">
          Loading…
        </p>
      ) : referrals.length === 0 ? (
        <div className="rounded-lg border border-[#E8EBED] p-6 text-center">
          <p className="text-sm font-general text-[#808C91]">
            Nobody has signed up with this code yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#E8EBED]">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFB]">
              <tr className="text-xs font-general uppercase tracking-wide text-[#808C91]">
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Joined</th>
                <th className="px-4 py-2.5 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((row) => (
                <tr
                  key={row.userId}
                  className="border-t border-[#E8EBED] text-sm font-general"
                >
                  <td className="px-4 py-2.5 text-[#1E1E1E]">
                    {row.name || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-[#808C91]">
                    {row.emailAddress || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-[#808C91]">
                    {row.awardedAt
                      ? new Date(row.awardedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-[#1E1E1E]">
                    {row.pointsAwarded}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(meta?.pages ?? 1) > 1 && (
        <div className="mt-4 flex items-center justify-end gap-4 text-sm font-general">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="font-semibold text-[#084059] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-[#808C91]">
            {meta.page} of {meta.pages}
          </span>
          <button
            type="button"
            disabled={page >= meta.pages}
            onClick={() => onPageChange(page + 1)}
            className="font-semibold text-[#084059] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </Shell>
  );
};
