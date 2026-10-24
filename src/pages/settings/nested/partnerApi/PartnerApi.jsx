import { useMemo, useState } from 'react';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';
import {
  usePartnerPricing,
  usePartnerBilling,
  usePartnerUsage,
  useUpsertPartnerPricing,
  useDeletePartnerPricingOverride,
  usePartnerKybQueue,
  useApproveKyb,
  useRejectKyb,
  useBlockPartner,
  useUnblockPartner,
  useAgents,
  useAgentInvites,
  useInviteAgent,
  useRevokeAgentInvite,
  useBlockAgent,
  useUnblockAgent,
  useMarkEarningPaid,
  useAgentEarnings,
  useServiceProviders,
  useCreateServiceProvider,
  useGenerateServiceProviderCredentials,
} from '@/store/features/partnerApi/usePartnerApi';
import KybDocumentModal from '@/components/modals/KybDocumentModal';
import { documentLabel, isImageDocument, isPdfDocument } from '@/utils/kybDocuments';

const SECTIONS = [
  { key: 'pricing', label: 'Verification Charges' },
  { key: 'review', label: 'Verification Queue' },
  { key: 'billing', label: 'Partners' },
  { key: 'agents', label: 'Agents' },
  { key: 'usage', label: 'Usage & Revenue' },
  { key: 'serviceProviders', label: 'Service Providers' },
];

const naira = (value) =>
  value === null || value === undefined || value === '' ? '-' : `₦${Number(value).toLocaleString()}`;

// null means nothing has been answered yet. Showing 0% there would read as
// "everything failed", which is a very different alarm from "no data".
const percent = (value) => (value === null || value === undefined ? '—' : `${value}%`);

const rateTone = (value, { inverse = false } = {}) => {
  if (value === null || value === undefined) return 'text-gray-400';
  const bad = inverse ? value >= 10 : value < 80;
  const warn = inverse ? value >= 5 : value < 95;
  if (bad) return 'text-red-700';
  if (warn) return 'text-amber-700';
  return 'text-green-700';
};

const PartnerApi = () => {
  const [section, setSection] = useState('pricing');

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Partner API</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review partner businesses, set what they are charged per verification, and see what they have
          consumed. Partners sign up and manage their own credentials in the partner console.
        </p>
      </div>

      <div className="flex gap-2 border-b mb-6 overflow-x-auto">
        {SECTIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSection(item.key)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${
              section === item.key
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {section === 'pricing' && <PricingSection />}
      {section === 'review' && <ReviewSection />}
      {section === 'billing' && <BillingSection />}
      {section === 'agents' && <AgentsSection />}
      {section === 'usage' && <UsageSection />}
      {section === 'serviceProviders' && <ServiceProvidersSection />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* API charges                                                         */
/* ------------------------------------------------------------------ */

const PricingSection = () => {
  // Empty = global defaults. Choosing a partner reveals their overrides
  // alongside the defaults, so it is always visible which one is in force.
  const [partnerId, setPartnerId] = useState('');
  const [drafts, setDrafts] = useState({});

  const { data, isLoading } = usePartnerPricing(partnerId || undefined);
  const { data: billingData } = usePartnerBilling();
  const upsert = useUpsertPartnerPricing();
  const removeOverride = useDeletePartnerPricingOverride();

  // Memoised because `|| []` allocates a new array each render, which would
  // make the grouping below recompute on every render regardless.
  const items = useMemo(() => data?.data?.items || [], [data]);
  const partners = billingData?.data || [];

  const grouped = useMemo(
    () =>
      items.reduce((acc, item) => {
        (acc[item.group] = acc[item.group] || []).push(item);
        return acc;
      }, {}),
    [items],
  );

  const draftKey = (code) => `${partnerId || 'global'}:${code}`;

  const save = async (item) => {
    const raw = drafts[draftKey(item.code)];
    if (raw === undefined || raw === '') {
      handleError({ message: 'Enter an amount first' });
      return;
    }
    const amount = Number(raw);
    if (Number.isNaN(amount) || amount < 0) {
      handleError({ message: 'Amount must be zero or greater' });
      return;
    }

    try {
      await upsert.mutateAsync({
        endpointCode: item.code,
        partnerId: partnerId || null,
        amount,
        active: true,
      });
      setDrafts((prev) => ({ ...prev, [draftKey(item.code)]: '' }));
      handleSuccess(
        partnerId ? `Override saved for ${item.label}` : `Default price saved for ${item.label}`,
      );
    } catch (error) {
      handleError(error);
    }
  };

  const clearOverride = async (item) => {
    try {
      await removeOverride.mutateAsync({ endpointCode: item.code, partnerId });
      handleSuccess(`Override removed. ${item.label} now uses the default.`);
    } catch (error) {
      handleError(error);
    }
  };


  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Pricing for</label>
          <select
            value={partnerId}
            onChange={(event) => setPartnerId(event.target.value)}
            className="border rounded-md px-3 py-2 text-sm min-w-[240px]"
          >
            <option value="">All partners (default price list)</option>
            {partners.map((partner) => (
              <option key={partner.partnerId} value={partner.partnerId}>
                {partner.name} — override
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading pricing…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No billable endpoints are configured.</p>
      ) : (
        Object.entries(grouped).map(([group, rows]) => (
          <div key={group} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">{group}</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Endpoint</th>
                    <th className="px-4 py-3">Default</th>
                    {partnerId && <th className="px-4 py-3">Override</th>}
                    <th className="px-4 py-3">In force</th>
                    <th className="px-4 py-3 w-[260px]">Set price</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.code} className="border-t">
                      <td className="px-4 py-3">
                        <div>{item.label}</div>
                        <code className="text-xs text-gray-400">{item.code}</code>
                      </td>
                      <td className="px-4 py-3">{naira(item.defaultAmount)}</td>
                      {partnerId && <td className="px-4 py-3">{naira(item.overrideAmount)}</td>}
                      <td className="px-4 py-3">
                        {item.unpriced ? (
                          <span className="text-amber-700 font-medium">Not priced</span>
                        ) : (
                          <span className="font-medium">{naira(item.effectiveAmount)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder={partnerId ? 'Override amount' : 'Default amount'}
                            value={drafts[draftKey(item.code)] ?? ''}
                            onChange={(event) =>
                              setDrafts((prev) => ({
                                ...prev,
                                [draftKey(item.code)]: event.target.value,
                              }))
                            }
                            className="border rounded-md px-2 py-1.5 w-28 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => save(item)}
                            disabled={upsert.isPending}
                            className="px-3 py-1.5 rounded-md bg-primary text-white text-xs disabled:opacity-50"
                          >
                            Save
                          </button>
                          {partnerId && item.overrideAmount !== null && (
                            <button
                              type="button"
                              onClick={() => clearOverride(item)}
                              disabled={removeOverride.isPending}
                              className="px-3 py-1.5 rounded-md border text-xs disabled:opacity-50"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Partner billing                                                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Verification queue                                                  */
/* ------------------------------------------------------------------ */

const ReviewSection = () => {
  const [filter, setFilter] = useState('submitted');
  const { data, isLoading } = usePartnerKybQueue(filter);
  const approve = useApproveKyb();
  const reject = useRejectKyb();

  const partners = data?.data || [];
  // One viewer for the whole queue rather than one per row: only a single
  // document is ever on screen, and this keeps the modal out of the map.
  const [viewer, setViewer] = useState(null);

  const handleApprove = async (partner) => {
    try {
      await approve.mutateAsync(partner.partnerId);
      handleSuccess(`${partner.name} approved — their API credentials are now live`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleReject = async (partner) => {
    // Required, not optional. A rejection without a reason is unactionable:
    // the partner cannot fix what they are not told about and will resubmit
    // the same thing.
    const reason = window.prompt(`Why is ${partner.name} being rejected?\n\nThis is shown to them.`);
    if (reason === null) return;
    if (!reason.trim()) {
      handleError({ message: 'A rejection reason is required' });
      return;
    }
    try {
      await reject.mutateAsync({ partnerId: partner.partnerId, reason: reason.trim() });
      handleSuccess(`${partner.name} rejected`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <div className="flex items-end gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Showing</label>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="border rounded-md px-3 py-2 text-sm min-w-[200px]"
          >
            <option value="submitted">Awaiting review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="not_submitted">Not yet submitted</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : partners.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing here.</p>
      ) : (
        <div className="space-y-4">
          {partners.map((partner) => (
            <article key={partner.partnerId} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{partner.business?.legalName || partner.name}</h3>
                  <code className="text-xs text-gray-400">{partner.partnerId}</code>
                </div>
                {filter === 'submitted' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(partner)}
                      disabled={approve.isPending}
                      className="px-3 py-1.5 rounded-md bg-primary text-white text-xs disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(partner)}
                      disabled={reject.isPending}
                      className="px-3 py-1.5 rounded-md border text-xs text-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2 mt-3 text-sm">
                <Detail label="Registration number" value={partner.business?.registrationNumber} />
                <Detail label="Tax ID" value={partner.business?.taxIdentificationNumber} />
                <Detail label="Address" value={partner.business?.registeredAddress} />
                <Detail label="Industry" value={partner.business?.industry} />
                <Detail label="Contact" value={partner.emailAddress} />
                <Detail label="Submitted" value={partner.kybSubmittedAt && new Date(partner.kybSubmittedAt).toLocaleString()} />
              </dl>

              {/* The reason identity access is being requested. Approving BVN
                  and NIN lookups without knowing the purpose is the part a
                  regulator would ask about, so it is given its own space
                  rather than sitting in a row of fields. */}
              {partner.business?.useCase && (
                <div className="mt-3 rounded-md bg-gray-50 border px-3 py-2 text-sm">
                  <p className="text-xs text-gray-500 mb-0.5">What they will use verification for</p>
                  {partner.business.useCase}
                </div>
              )}

              {partner.kybRejectionReason && (
                <p className="mt-3 text-sm text-red-700">
                  <span className="font-medium">Previously rejected:</span> {partner.kybRejectionReason}
                </p>
              )}

              {/* Thumbnails rather than links. A reviewer can tell at a glance
                  whether a certificate is a real scan or a blurry photo of a
                  desk without opening anything. */}
              <DocumentThumbnails
                documents={partner.business?.documents}
                onOpen={(documents, index) =>
                  setViewer({ documents, index, partnerName: partner.business?.legalName || partner.name })
                }
              />
            </article>
          ))}
        </div>
      )}

      <KybDocumentModal
        isOpen={Boolean(viewer)}
        onClose={() => setViewer(null)}
        documents={viewer?.documents || []}
        startIndex={viewer?.index || 0}
        partnerName={viewer?.partnerName}
      />
    </div>
  );
};

// A preview per document: an image thumbnail where we can render one, and a
// labelled file tile where we cannot.
const DocumentThumbnails = ({ documents, onOpen }) => {
  const entries = Object.entries(documents || {}).filter(([, url]) => url);
  if (entries.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs text-gray-500">Documents</p>
      <div className="flex flex-wrap gap-3">
        {entries.map(([name, url], index) => (
          <button
            key={name}
            type="button"
            onClick={() => onOpen(entries, index)}
            className="w-36 overflow-hidden rounded-lg border bg-white text-left transition-colors hover:border-primary"
          >
            <div className="flex h-24 items-center justify-center overflow-hidden bg-gray-50">
              {isImageDocument(url) ? (
                <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  {isPdfDocument(url) ? 'PDF' : 'File'}
                </span>
              )}
            </div>
            <p className="truncate px-2 py-1.5 text-[11px] text-[#1E1E1E]">{documentLabel(name)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <dt className="text-xs text-gray-500">{label}</dt>
    <dd>{value || '—'}</dd>
  </div>
);

/* ------------------------------------------------------------------ */
/* Partners                                                            */
/* ------------------------------------------------------------------ */

const BillingSection = () => {
  const { data, isLoading } = usePartnerBilling();
  const block = useBlockPartner();
  const unblock = useUnblockPartner();

  const partners = data?.data || [];

  const handleBlock = async (partner) => {
    const reason = window.prompt(`Why is ${partner.name} being blocked?`);
    if (reason === null) return;
    try {
      await block.mutateAsync({ partnerId: partner.partnerId, reason: reason.trim() || undefined });
      handleSuccess(`${partner.name} blocked`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleUnblock = async (partner) => {
    try {
      await unblock.mutateAsync(partner.partnerId);
      handleSuccess(`${partner.name} unblocked`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      {/* Partners are not created here any more. They sign up in the partner
          console and issue their own credentials, so admin's levers are
          approval and blocking. */}
      <p className="text-sm text-gray-500 mb-4">
        Partners sign up themselves in the partner console and generate their own API credentials. Approve their
        business in the Verification Queue; block one here if you need to cut off access.
      </p>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading partners…</p>
      ) : partners.length === 0 ? (
        <p className="text-sm text-gray-500">No partners yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Billing account</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.partnerId} className="border-t">
                  <td className="px-4 py-3">
                    <div>{partner.name}</div>
                    <code className="text-xs text-gray-400">{partner.partnerId}</code>
                  </td>
                  <td className="px-4 py-3">{String(partner.kybStatus || '').replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    {partner.billingAccountNumber || <span className="text-amber-700">not set up</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={partner.status === 'active' ? 'text-green-700' : 'text-gray-500'}>
                      {partner.status}
                    </span>
                    {partner.blockedReason && (
                      <div className="text-xs text-gray-400">{partner.blockedReason}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {partner.status === 'blocked' ? (
                      <button type="button" onClick={() => handleUnblock(partner)} className="underline">
                        Unblock
                      </button>
                    ) : (
                      <button type="button" onClick={() => handleBlock(partner)} className="underline text-red-700">
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Agents                                                              */
/* ------------------------------------------------------------------ */

const AgentsSection = () => {
  const { data: agentsData, isLoading } = useAgents();
  const { data: invitesData } = useAgentInvites();
  const invite = useInviteAgent();
  const revokeInvite = useRevokeAgentInvite();
  const block = useBlockAgent();
  const unblock = useUnblockAgent();
  const markPaid = useMarkEarningPaid();

  const [form, setForm] = useState({ emailAddress: '', firstName: '', lastName: '' });
  // Shown once so the admin can send it. The service issues the token but does
  // not send the email - the wording and the destination URL differ per
  // environment, so that is the caller's job.
  const [issuedInvite, setIssuedInvite] = useState(null);
  const [payoutFor, setPayoutFor] = useState(null);

  const agents = agentsData?.data || [];
  const invites = invitesData?.data || [];

  const submit = async (event) => {
    event.preventDefault();
    if (!form.emailAddress.trim()) {
      handleError({ message: 'An email address is required' });
      return;
    }
    try {
      const result = await invite.mutateAsync({
        emailAddress: form.emailAddress.trim(),
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
      });
      setIssuedInvite(result?.data || null);
      setForm({ emailAddress: '', firstName: '', lastName: '' });
      // The server says whether the email actually went out. Reporting a flat
      // "Invitation created" while nothing was sent is how invited agents ended
      // up waiting on an email nobody had sent them.
      handleSuccess(result?.message || 'Invitation created');
    } catch (error) {
      handleError(error);
    }
  };

  // Taken from the server, which builds the same link it emails. The fallback
  // used to default to console.qreva.app - which is this dashboard, not the
  // partner console - so every agent who followed an invitation link landed on
  // an app with no such route and got a 404.
  const inviteUrl = (invitation) =>
    invitation?.inviteUrl ||
    (import.meta.env.VITE_PARTNER_CONSOLE_URL
      ? `${import.meta.env.VITE_PARTNER_CONSOLE_URL.replace(/\/+$/, '')}/invite/${invitation?.token}`
      : '');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <form onSubmit={submit} className="border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-1">Invite an agent</h2>
          {/* Agents cannot sign themselves up, so this form is the only way one
              can come to exist. */}
          <p className="text-xs text-gray-500 mb-4">
            They will receive a link to set their own password. Invitations expire after 7 days.
          </p>

          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={form.emailAddress}
            onChange={(event) => setForm({ ...form, emailAddress: event.target.value })}
            className="border rounded-md px-3 py-2 text-sm w-full mb-3"
          />

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">First name</label>
              <input
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Last name</label>
              <input
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={invite.isPending}
            className="w-full px-4 py-2 rounded-md bg-primary text-white text-sm disabled:opacity-50"
          >
            {invite.isPending ? 'Creating…' : 'Create invitation'}
          </button>
        </form>

        {issuedInvite && (
          <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm">
            <p className="font-medium text-green-900">Send this link to {issuedInvite.emailAddress}</p>
            <p className="text-green-800 text-xs mt-1">
              It expires in {issuedInvite.expiresInDays} days. Creating another invitation for the same address
              retires this one.
            </p>
            {inviteUrl(issuedInvite) ? (
              <>
                <code className="mt-2 block text-xs break-all bg-white border rounded px-2 py-1">
                  {inviteUrl(issuedInvite)}
                </code>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(inviteUrl(issuedInvite))}
                  className="mt-2 underline text-green-900 text-xs"
                >
                  Copy link
                </button>
              </>
            ) : (
              <p className="mt-2 text-xs text-red-800">
                The partner console address is not configured on the server, so no link could be
                built and no email was sent. Set PARTNER_CONSOLE_URL on the backend.
              </p>
            )}
          </div>
        )}

        {invites.length > 0 && (
          <div className="border rounded-lg p-4">
            <h2 className="text-sm font-semibold mb-3">Pending invitations</h2>
            <ul className="space-y-2 text-sm">
              {invites.map((row) => (
                <li key={row.token} className="flex items-start justify-between gap-2">
                  <div>
                    <div>{row.emailAddress}</div>
                    {/* Expired invitations stay listed rather than vanishing, so
                        they can be resent instead of looking like they were
                        never sent at all. */}
                    <div className={`text-xs ${row.expired ? 'text-amber-700' : 'text-gray-400'}`}>
                      {row.expired ? 'expired — send a new one' : `expires ${new Date(row.expiresAt).toLocaleDateString()}`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => revokeInvite.mutate(row.token)}
                    className="text-xs underline text-red-700 shrink-0"
                  >
                    Revoke
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        {payoutFor && (
          <AgentPayouts
            agent={payoutFor}
            markPaid={markPaid}
            onClose={() => setPayoutFor(null)}
          />
        )}
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading agents…</p>
        ) : agents.length === 0 ? (
          <p className="text-sm text-gray-500">No agents yet. Invite one to get started.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Partners</th>
                  <th className="px-4 py-3">Owed</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.agentId} className="border-t">
                    <td className="px-4 py-3">
                      <div>{agent.firstName} {agent.lastName}</div>
                      <div className="text-xs text-gray-400">{agent.emailAddress}</div>
                    </td>
                    <td className="px-4 py-3"><code className="text-xs">{agent.referralCode}</code></td>
                    <td className="px-4 py-3">
                      {/* Active out of total, because an agent who brought in
                          ten businesses of which none converted is a different
                          story from one who brought in two that both did. */}
                      {agent.referrals?.active ?? 0} active of {agent.referrals?.total ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      {naira(agent.earnings?.accrued)}
                      {/* Marking paid is per earning rather than per agent: the
                          record of which partner each payment was for is what
                          answers a dispute, and a single "pay all" button would
                          erase it. */}
                      {agent.earnings?.accrued > 0 && (
                        <button
                          type="button"
                          onClick={() => setPayoutFor(agent)}
                          className="block text-xs underline mt-0.5"
                        >
                          Record payout
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">{naira(agent.earnings?.paidOut)}</td>
                    <td className="px-4 py-3">
                      <span className={agent.status === 'active' ? 'text-green-700' : 'text-gray-500'}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {agent.status === 'blocked' ? (
                        <button type="button" onClick={() => unblock.mutate(agent.agentId)} className="underline">
                          Unblock
                        </button>
                      ) : agent.status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => {
                            const reason = window.prompt(`Why is ${agent.firstName} being blocked?`);
                            if (reason === null) return;
                            block.mutate({ agentId: agent.agentId, reason: reason.trim() || undefined });
                          }}
                          className="underline text-red-700"
                        >
                          Block
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const AgentPayouts = ({ agent, markPaid, onClose }) => {
  const { data, isLoading } = useAgentEarnings(agent.agentId);
  const entries = data?.data?.entries || [];
  const unpaid = entries.filter((entry) => entry.status === 'accrued');

  const pay = async (entry) => {
    try {
      await markPaid.mutateAsync(entry._id);
      handleSuccess(`Recorded payout for ${entry.partnerName}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">
          Commissions for {agent.firstName} {agent.lastName}
        </h2>
        <button type="button" onClick={onClose} className="text-xs underline">Close</button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : unpaid.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing outstanding.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="py-2">Partner</th>
              <th className="py-2">Earned</th>
              <th className="py-2">Amount</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {unpaid.map((entry) => (
              <tr key={entry._id} className="border-t">
                <td className="py-2">{entry.partnerName}</td>
                <td className="py-2 text-gray-500">
                  {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '—'}
                </td>
                <td className="py-2">{naira(entry.amount)}</td>
                <td className="py-2 text-right">
                  {/* Records that a payment was made outside the system. It does
                      not move money - Qreva pays agents by transfer - so the
                      wording says "record", not "pay". */}
                  <button
                    type="button"
                    onClick={() => pay(entry)}
                    disabled={markPaid.isPending}
                    className="text-xs underline disabled:opacity-50"
                  >
                    Record as paid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Usage                                                               */
/* ------------------------------------------------------------------ */

const UsageSection = () => {
  const [filters, setFilters] = useState({ partnerId: '', startDate: '', endDate: '', page: 1 });
  const { data: billingData } = usePartnerBilling();
  const { data, isLoading } = usePartnerUsage({
    partnerId: filters.partnerId || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    page: filters.page,
    limit: 25,
  });

  const partners = billingData?.data || [];
  const items = data?.data?.items || [];
  const outcomes = data?.data?.outcomes || {};
  const byEndpoint = data?.data?.byEndpoint || [];
  const byPartner = data?.data?.byPartner || [];
  const total = data?.data?.total || 0;
  const limit = data?.data?.limit || 25;
  const pages = Math.max(1, Math.ceil(total / limit));

  const setFilter = (field, value) => setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Partner</label>
          <select
            value={filters.partnerId}
            onChange={(event) => setFilter('partnerId', event.target.value)}
            className="border rounded-md px-3 py-2 text-sm min-w-[200px]"
          >
            <option value="">All partners</option>
            {partners.map((partner) => (
              <option key={partner.partnerId} value={partner.partnerId}>
                {partner.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => setFilter('startDate', event.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => setFilter('endDate', event.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500">Billed revenue</p>
          <p className="text-2xl font-semibold mt-1">{naira(data?.data?.billedAmount || 0)}</p>
          {/* Refunds are excluded rather than netted, so this reads as
              "billed and kept" - a refunded call earned nothing. */}
          <p className="text-xs text-gray-400 mt-1">Excludes refunded calls</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500">Billed calls</p>
          <p className="text-2xl font-semibold mt-1">{(data?.data?.billedCalls || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{total.toLocaleString()} records in range</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500">Success rate</p>
          <p className={`text-2xl font-semibold mt-1 ${rateTone(outcomes.successRate)}`}>
            {percent(outcomes.successRate)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {(outcomes.success || 0).toLocaleString()} of {(outcomes.answered || 0).toLocaleString()} answered
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500">Provider errors</p>
          <p className={`text-2xl font-semibold mt-1 ${rateTone(outcomes.providerErrorRate, { inverse: true })}`}>
            {percent(outcomes.providerErrorRate)}
          </p>
          {/* Separated from rejections on purpose: a rejected identity is
              normal at some rate, a provider error is an incident. */}
          <p className="text-xs text-gray-400 mt-1">
            {(outcomes.provider_error || 0).toLocaleString()} unreachable ·{' '}
            {(outcomes.rejected || 0).toLocaleString()} rejected
          </p>
        </div>
      </div>

      {outcomes.pending > 0 && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>{outcomes.pending}</strong> call{outcomes.pending === 1 ? '' : 's'} still recorded as pending —
          charged but never resolved to success or failure. That usually means the process died mid-call, and the
          partner may have been charged for nothing.
        </div>
      )}

      {byPartner.length > 1 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">By partner</h2>
          {/* Busiest first, because a 0% rate over two calls is noise next to
              92% over four thousand. Comparing partners is what separates "one
              partner sends bad identities" from "the provider is degrading". */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Partner</th>
                  <th className="px-4 py-3">Answered</th>
                  <th className="px-4 py-3">Success</th>
                  <th className="px-4 py-3">Rejected</th>
                  <th className="px-4 py-3">Provider errors</th>
                  <th className="px-4 py-3">Success rate</th>
                  <th className="px-4 py-3">Billed</th>
                </tr>
              </thead>
              <tbody>
                {byPartner.map((row) => (
                  <tr key={row.partnerId} className="border-t">
                    <td className="px-4 py-3">
                      <div>{row.partnerName}</div>
                      <code className="text-xs text-gray-400">{row.partnerId}</code>
                    </td>
                    <td className="px-4 py-3">{row.answered}</td>
                    <td className="px-4 py-3">{row.success}</td>
                    <td className="px-4 py-3">{row.rejected}</td>
                    <td className={`px-4 py-3 ${rateTone(row.providerErrorRate, { inverse: true })}`}>
                      {row.provider_error}
                    </td>
                    <td className={`px-4 py-3 font-medium ${rateTone(row.successRate)}`}>
                      {percent(row.successRate)}
                    </td>
                    <td className="px-4 py-3">{naira(row.billedAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {byEndpoint.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">By verification type</h2>
          {/* An overall rate hides the one product that is broken - five healthy
              NIN products will mask BVN failing outright. */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Verification</th>
                  <th className="px-4 py-3">Success</th>
                  <th className="px-4 py-3">Rejected</th>
                  <th className="px-4 py-3">Provider errors</th>
                  <th className="px-4 py-3">Success rate</th>
                </tr>
              </thead>
              <tbody>
                {byEndpoint.map((row) => (
                  <tr key={row.endpointCode} className="border-t">
                    <td className="px-4 py-3">{row.endpointCode}</td>
                    <td className="px-4 py-3">{row.success}</td>
                    <td className="px-4 py-3">{row.rejected}</td>
                    <td className="px-4 py-3">{row.provider_error}</td>
                    <td className={`px-4 py-3 font-medium ${rateTone(row.successRate)}`}>
                      {percent(row.successRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading usage…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No API usage in this range.</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Partner</th>
                  <th className="px-4 py-3">Endpoint</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Billing</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row._id} className="border-t">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs">{row.partnerId}</code>
                    </td>
                    <td className="px-4 py-3">{row.endpointCode}</td>
                    <td className="px-4 py-3">{row.reference || '-'}</td>
                    <td className="px-4 py-3">{naira(row.amount)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          row.outcome === 'success'
                            ? 'text-green-700'
                            : row.outcome === 'provider_error'
                              ? 'text-red-700'
                              : row.outcome === 'rejected'
                                ? 'text-amber-700'
                                : 'text-gray-500'
                        }
                        title={row.failureReason || ''}
                      >
                        {row.outcome || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          row.status === 'refunded'
                            ? 'text-amber-700'
                            : row.status === 'charged'
                              ? 'text-green-700'
                              : 'text-gray-500'
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-gray-500">
                Page {filters.page} of {pages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                  className="px-3 py-1.5 border rounded-md disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={filters.page >= pages}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                  className="px-3 py-1.5 border rounded-md disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Service providers                                                   */
/* ------------------------------------------------------------------ */

/**
 * Credentials for parties Qreva contracted directly onto the accounts, ledger
 * and transfer endpoints - not KYC partners, who sign up and issue their own
 * keys in the partner console.
 *
 * The scope list is fixed by the server and shown read-only. Letting an
 * operator tick scopes here would make it possible to hand out NIN and BVN
 * access from a screen that is not the KYB queue, which is the one place that
 * access is supposed to be decided.
 */
const ServiceProvidersSection = () => {
  const { data, isLoading } = useServiceProviders();
  const create = useCreateServiceProvider();
  const generate = useGenerateServiceProviderCredentials();

  const [form, setForm] = useState({ name: '', emailAddress: '', phoneNumber: '' });
  const [showForm, setShowForm] = useState(false);
  // Held in state, not refetched: the secret is returned once and there is no
  // endpoint that can show it again.
  const [issued, setIssued] = useState(null);

  const providers = data?.data || [];

  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await create.mutateAsync({
        ...form,
        phoneNumber: form.phoneNumber.trim() || undefined,
      });
      handleSuccess(`${form.name} added. Generate credentials to give them access.`);
      setForm({ name: '', emailAddress: '', phoneNumber: '' });
      setShowForm(false);
    } catch (error) {
      handleError(error);
    }
  };

  const issue = async (provider) => {
    const rotating = provider.hasCredentials;
    if (rotating && !window.confirm(
      `Rotate credentials for ${provider.name}?\n\nTheir current key stops working immediately and their integration will fail until they are given the new one.`,
    )) {
      return;
    }
    try {
      const result = await generate.mutateAsync(provider.partnerId);
      setIssued({ ...result.data, name: provider.name });
      handleSuccess(rotating ? 'Credentials rotated' : 'Credentials issued');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-gray-500">
          Service providers use <code className="text-xs">X-API-KEY</code> and{' '}
          <code className="text-xs">X-API-SECRET</code> on the account, ledger, transfer and
          transaction endpoints. They cannot reach NIN or BVN verification.
        </p>
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="shrink-0 rounded-md bg-primary px-3 py-2 text-xs text-white"
        >
          {showForm ? 'Cancel' : 'Add provider'}
        </button>
      </div>

      {issued && <IssuedCredentials issued={issued} onDismiss={() => setIssued(null)} />}

      {showForm && (
        <form onSubmit={submit} className="mb-6 rounded-lg border p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Name</label>
              <input required value={form.name} onChange={set('name')} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Email</label>
              <input required type="email" value={form.emailAddress} onChange={set('emailAddress')} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Phone (optional)</label>
              <input value={form.phoneNumber} onChange={set('phoneNumber')} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="submit" disabled={create.isPending} className="mt-4 rounded-md bg-primary px-4 py-2 text-xs text-white disabled:opacity-50">
            {create.isPending ? 'Adding…' : 'Add provider'}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : providers.length === 0 ? (
        <p className="text-sm text-gray-500">No service providers yet.</p>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <article key={provider.partnerId} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{provider.name}</h3>
                  <p className="text-xs text-gray-500">{provider.emailAddress}</p>
                  <code className="text-xs text-gray-400">{provider.partnerId}</code>
                </div>
                <button
                  type="button"
                  onClick={() => issue(provider)}
                  disabled={generate.isPending}
                  className="shrink-0 rounded-md border px-3 py-1.5 text-xs disabled:opacity-50"
                >
                  {provider.hasCredentials ? 'Rotate credentials' : 'Generate credentials'}
                </button>
              </div>

              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                <Detail label="API key" value={provider.apiKey || 'Not generated'} />
                <Detail label="Secret" value={provider.secretLast4 ? `ends ${provider.secretLast4}` : '—'} />
                <Detail label="Status" value={provider.status} />
                <Detail
                  label="Signed requests"
                  value={provider.requireSignature ? 'Required on ledger and transfers' : 'Not required'}
                />
                <Detail
                  label="Last rotated"
                  value={provider.secretRotatedAt && new Date(provider.secretRotatedAt).toLocaleString()}
                />
                <Detail
                  label="Last used"
                  value={provider.lastUsedAt ? new Date(provider.lastUsedAt).toLocaleString() : 'Never'}
                />
              </dl>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {(provider.permissions || []).map((scope) => (
                  <code key={scope} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
                    {scope}
                  </code>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

// Shown once. There is no endpoint that can return the secret again, so this
// stays until dismissed rather than disappearing on the next render.
const IssuedCredentials = ({ issued, onDismiss }) => (
  <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-amber-900">Credentials for {issued.name}</p>
        <p className="mt-0.5 text-xs text-amber-800">
          Copy the secret now. It is stored encrypted and cannot be shown again — losing it means
          rotating.
        </p>
      </div>
      <button type="button" onClick={onDismiss} className="shrink-0 text-xs text-amber-900 underline">
        Dismiss
      </button>
    </div>

    <div className="mt-3 space-y-2">
      <CredentialRow label="X-API-KEY" value={issued.apiKey} />
      <CredentialRow label="X-API-SECRET" value={issued.apiSecret} />
    </div>
  </div>
);

const CredentialRow = ({ label, value }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="w-32 shrink-0 text-xs font-medium text-amber-900">{label}</span>
    <code className="min-w-0 flex-1 overflow-x-auto rounded border bg-white px-2 py-1.5 text-xs">
      {value}
    </code>
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        handleSuccess(`${label} copied`);
      }}
      className="shrink-0 rounded-md border bg-white px-2 py-1.5 text-xs"
    >
      Copy
    </button>
  </div>
);

export default PartnerApi;

