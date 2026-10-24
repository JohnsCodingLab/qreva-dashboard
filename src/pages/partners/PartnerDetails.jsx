import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useApproveKyb,
  useBlockPartner,
  usePartner,
  useRejectKyb,
  useUnblockPartner,
} from '@/store/features/partnerApi/usePartnerApi';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const formatCurrency = (value) =>
  `₦${Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const DOCUMENT_LABELS = {
  certificateOfIncorporation: 'Certificate of incorporation',
  directorIdentification: 'Director identification',
  memorandumOfAssociation: 'Memorandum of association',
  proofOfAddress: 'Proof of address',
};

/**
 * One partner, in one place.
 *
 * There was no such page. To answer "who is this partner and what state are
 * they in", an operator read the billing list for the balance, the KYB queue
 * for the documents and the usage report for activity - three screens, none of
 * which showed the others, and no way to act on what they found without going
 * back to a fourth.
 *
 * Everything here comes from one request, so the page is either loaded or it
 * is not, rather than filling in piece by piece.
 */
const PartnerDetails = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = usePartner(partnerId);

  const approve = useApproveKyb();
  const reject = useRejectKyb();
  const block = useBlockPartner();
  const unblock = useUnblockPartner();

  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  const partner = data?.data;

  if (isLoading) return <div className="p-6 text-sm text-[#7C8D96]">Loading…</div>;
  if (isError || !partner) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error?.response?.data?.message || 'This partner could not be loaded.'}
        </div>
      </div>
    );
  }

  const business = partner.business || {};
  const documents = business.documents || {};
  const directors = business.directors || [];

  const run = async (mutation, payload, success) => {
    try {
      await mutation.mutateAsync(payload);
      handleSuccess(success);
    } catch (err) {
      handleError(err);
    }
  };

  const onReject = async () => {
    if (rejectReason.trim().length < 10) {
      handleError({ message: 'Give a reason of at least 10 characters. The partner is shown it.' });
      return;
    }
    await run({ mutateAsync: (p) => reject.mutateAsync(p) }, { partnerId, reason: rejectReason.trim() }, 'Submission rejected');
    setShowReject(false);
    setRejectReason('');
  };

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={() => navigate('/partners')}
        className="mb-4 text-sm text-[#7C8D96] hover:text-[#11435A]"
      >
        ← Back to partners
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#11435A]">
            {business.legalName || partner.name}
          </h1>
          <p className="mt-1 text-sm text-[#7C8D96]">
            {partner.emailAddress} · {partner.partnerId}
          </p>
        </div>

        {/* The actions sit with the partner they act on. Previously an operator
            read a partner on one screen and acted on them from another, which
            is how the wrong partner gets approved. */}
        <div className="flex flex-wrap gap-2">
          {partner.kybStatus === 'submitted' && (
            <>
              <button
                type="button"
                disabled={approve.isPending}
                onClick={() => run(approve, partnerId, 'Partner approved')}
                className="rounded-lg bg-[#11435A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {approve.isPending ? 'Approving…' : 'Approve verification'}
              </button>
              <button
                type="button"
                onClick={() => setShowReject((current) => !current)}
                className="rounded-lg border border-[#E4E7EC] px-4 py-2 text-sm"
              >
                Reject
              </button>
            </>
          )}
          {partner.status === 'Blocked' ? (
            <button
              type="button"
              disabled={unblock.isPending}
              onClick={() => run(unblock, partnerId, 'Partner unblocked')}
              className="rounded-lg border border-[#E4E7EC] px-4 py-2 text-sm disabled:opacity-50"
            >
              Unblock
            </button>
          ) : (
            <button
              type="button"
              disabled={block.isPending}
              onClick={() =>
                run(block, { partnerId, reason: 'Blocked from the partners module' }, 'Partner blocked')
              }
              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 disabled:opacity-50"
            >
              Block
            </button>
          )}
        </div>
      </div>

      {showReject && (
        <div className="mb-6 rounded-xl border border-[#E4E7EC] bg-white p-4">
          <label className="mb-1.5 block text-sm font-medium text-[#11435A]">
            Why is this being rejected?
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="Shown to the partner so they know what to correct."
            className="w-full rounded-lg border border-[#E4E7EC] p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="button"
            disabled={reject.isPending}
            onClick={onReject}
            className="mt-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {reject.isPending ? 'Rejecting…' : 'Reject submission'}
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Account">
          <Detail label="Status" value={partner.status} />
          <Detail label="Verification" value={partner.kybStatus} />
          <Detail label="Balance" value={formatCurrency(partner.balance)} />
          <Detail label="Billing account" value={partner.billingAccountNumber || 'Not opened'} />
          <Detail label="API key" value={partner.apiKey || 'Not generated'} />
          <Detail
            label="Secret"
            value={partner.secretLast4 ? `ends …${partner.secretLast4}` : 'Not generated'}
          />
        </Card>

        <Card title="Business">
          <Detail label="Legal name" value={business.legalName} />
          <Detail label="RC / BN" value={business.registrationNumber} />
          <Detail label="Industry" value={business.industry} />
          <Detail label="Country" value={business.country} />
          <Detail label="Website" value={business.website} />
          <Detail label="Address" value={business.registeredAddress} />
        </Card>

        <Card title="Timeline">
          <Detail label="Joined" value={formatDate(partner.createdAt)} />
          <Detail label="Submitted for review" value={formatDate(partner.kybSubmittedAt)} />
          <Detail label="Reviewed" value={formatDate(partner.kybReviewedAt)} />
          <Detail label="Last signed in" value={formatDate(partner.lastLoginAt)} />
          <Detail label="Referred by agent" value={partner.referredByAgentId || 'Direct'} />
          {partner.kybRejectionReason && (
            <Detail label="Rejection reason" value={partner.kybRejectionReason} />
          )}
        </Card>
      </div>

      {business.useCase && (
        <div className="mt-4">
          <Card title="What they will use verification for">
            <p className="text-sm text-[#2C3134]">{business.useCase}</p>
          </Card>
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Documents">
          {Object.keys(DOCUMENT_LABELS).filter((key) => documents[key]).length === 0 ? (
            <p className="text-sm text-[#7C8D96]">Nothing uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(DOCUMENT_LABELS).map(([key, label]) =>
                documents[key] ? (
                  <li key={key}>
                    <a
                      href={documents[key]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#11435A] underline"
                    >
                      {label}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </Card>

        <Card title="Directors">
          {directors.length === 0 ? (
            <p className="text-sm text-[#7C8D96]">None listed.</p>
          ) : (
            <ul className="space-y-3">
              {directors.map((director, index) => (
                <li key={index} className="text-sm">
                  <div className="font-medium text-[#11435A]">{director.name || '—'}</div>
                  <div className="text-xs text-[#7C8D96]">
                    {[director.email, director.phoneNumber].filter(Boolean).join(' · ') || '—'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
    <h2 className="mb-3 text-sm font-semibold text-[#11435A]">{title}</h2>
    {children}
  </div>
);

const Detail = ({ label, value }) => (
  <div className="mb-2.5 last:mb-0">
    <dt className="text-xs text-[#7C8D96]">{label}</dt>
    <dd className="break-words text-sm text-[#2C3134]">{value || '—'}</dd>
  </div>
);

export default PartnerDetails;
