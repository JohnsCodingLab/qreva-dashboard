import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartners } from '@/store/features/partnerApi/usePartnerApi';

const KYB_TONES = {
  approved: 'bg-green-50 text-green-700 border-green-200',
  submitted: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  not_submitted: 'bg-gray-50 text-gray-600 border-gray-200',
};

const KYB_LABELS = {
  approved: 'Approved',
  submitted: 'Under review',
  rejected: 'Rejected',
  not_submitted: 'Not submitted',
};

const STATUS_TONES = {
  Active: 'bg-green-50 text-green-700 border-green-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Blocked: 'bg-red-50 text-red-700 border-red-200',
};

const formatCurrency = (value) =>
  `₦${Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

/**
 * Partners, as a module rather than a tab inside Settings.
 *
 * Partner management lived in a 1,358 line settings page with six sections
 * sharing one file, and the one thing it did not have was a way to find a
 * partner: the list came back whole, unsearchable and unpaged, which works at
 * forty partners and not at four hundred.
 *
 * This is the list, and it links to a page per partner. Pricing, service
 * providers and agents stay in Settings deliberately - those configure the
 * partner platform, this manages the partners on it, and they are different
 * jobs done by different people.
 */
const Partners = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [kybStatus, setKybStatus] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      search: search.trim() || undefined,
      kybStatus: kybStatus || undefined,
      status: status || undefined,
      page,
      limit: 20,
    }),
    [search, kybStatus, status, page],
  );

  const { data, isLoading, isError, error } = usePartners(params);
  const partners = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 };

  const onFilterChange = (setter) => (value) => {
    setter(value);
    // Any filter change returns to the first page. Staying on page four of a
    // result set that now has one page shows an empty table and reads as no
    // results rather than as a stale page number.
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#11435A]">Partners</h1>
        <p className="mt-1 text-sm text-[#7C8D96]">
          Businesses verifying identities through the Qreva API.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => onFilterChange(setSearch)(e.target.value)}
          placeholder="Search name, email, partner ID or legal name"
          className="h-10 min-w-[280px] flex-1 rounded-lg border border-[#E4E7EC] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
        <select
          value={kybStatus}
          onChange={(e) => onFilterChange(setKybStatus)(e.target.value)}
          className="h-10 rounded-lg border border-[#E4E7EC] px-3 text-sm"
        >
          <option value="">All verification states</option>
          <option value="submitted">Under review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="not_submitted">Not submitted</option>
        </select>
        <select
          value={status}
          onChange={(e) => onFilterChange(setStatus)(e.target.value)}
          className="h-10 rounded-lg border border-[#E4E7EC] px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error?.response?.data?.message || 'The partner list could not be loaded.'}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[#F7FAFA] text-left text-xs uppercase text-[#7C8D96]">
              <tr>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !partners.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#7C8D96]">
                    Loading…
                  </td>
                </tr>
              ) : !partners.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#7C8D96]">
                    {search || kybStatus || status
                      ? 'No partners match those filters.'
                      : 'No partners yet.'}
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr
                    key={partner.partnerId}
                    onClick={() => navigate(`/partners/${partner.partnerId}`)}
                    className="cursor-pointer border-t border-[#E4E7EC] hover:bg-[#F7FAFA]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#11435A]">
                        {partner.business?.legalName || partner.name}
                      </div>
                      <div className="text-xs text-[#7C8D96]">{partner.emailAddress}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        tone={KYB_TONES[partner.kybStatus] || KYB_TONES.not_submitted}
                        label={KYB_LABELS[partner.kybStatus] || partner.kybStatus}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        tone={STATUS_TONES[partner.status] || STATUS_TONES.Pending}
                        label={partner.status}
                      />
                    </td>
                    <td className="px-4 py-3 text-[#11435A]">
                      {formatCurrency(partner.balance)}
                    </td>
                    <td className="px-4 py-3 text-[#7C8D96]">{formatDate(partner.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[#7C8D96]">
            {meta.total.toLocaleString('en-NG')} partner{meta.total === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-[#E4E7EC] px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[#7C8D96]">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-[#E4E7EC] px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Pill = ({ tone, label }) => (
  <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}>
    {label}
  </span>
);

export default Partners;
