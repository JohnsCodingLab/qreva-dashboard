import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import {
  VERIFICATION_ATTEMPT_COLUMNS,
  VERIFICATION_ATTEMPT_ACTIONS,
  PURPOSE_OPTIONS,
  OUTCOME_OPTIONS,
} from './constants';
import { OutcomeBadge, PurposeBadge } from '@/components/verification/VerificationBadges';
import { useVerificationAttempts } from '@/store/features/verification/useVerificationAttempts';

const PAGE_LIMIT = 25;

// Every facial-verification attempt across all three flows (registration,
// login step-up, and the transaction-verification preview), each with its
// 3 saved captures, for an admin to review if something looks wrong. See
// backend/src/verification-attempts/verification-attempts.service.ts for
// where rows are written.
const VerificationAttempts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterUserId = searchParams.get('userId') || '';

  const [page, setPage] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [outcome, setOutcome] = useState('');
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useVerificationAttempts({
    page,
    limit: PAGE_LIMIT,
    purpose: purpose || undefined,
    outcome: outcome || undefined,
    userId: filterUserId || undefined,
  });

  const clearUserFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('userId');
    setSearchParams(next);
  };

  const attempts = data?.data || [];
  const pagination = data?.pagination || {};

  const actionsWithHandler = VERIFICATION_ATTEMPT_ACTIONS.map((action) => ({
    ...action,
    onClick: (row) => setSelected(row),
  }));

  const selectedUser = selected?.userId && typeof selected.userId === 'object' ? selected.userId : null;
  const selectedUserName = selectedUser
    ? [selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(' ') || '—'
    : '—';

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Verification Reviews</h1>
          <p className="text-[#808C91] mt-1">
            Every facial-verification attempt, with its 3 saved captures, for review if something goes wrong
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
            value={purpose}
            onChange={(e) => { setPurpose(e.target.value); setPage(1); }}
          >
            {PURPOSE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
            value={outcome}
            onChange={(e) => { setOutcome(e.target.value); setPage(1); }}
          >
            {OUTCOME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filterUserId && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-[#FFF4E5] px-4 py-2 text-sm text-[#B25E00]">
          <span>Showing verification attempts for one flagged user only</span>
          <button className="font-medium underline" onClick={clearUserFilter}>Clear filter</button>
        </div>
      )}

      <DataTable
        className="font-general"
        data={attempts}
        columns={VERIFICATION_ATTEMPT_COLUMNS}
        title="Verification Attempts"
        actions={actionsWithHandler}
        showSearch={false}
        showCheckbox={false}
        showFilter={false}
        loading={isLoading}
        pagination={pagination}
        pageSize={PAGE_LIMIT}
        onPageChange={setPage}
      />

      <BaseModal isOpen={!!selected} onClose={() => setSelected(null)} title="Verification Attempt" maxWidth="max-w-2xl">
        {selected && (
          <div className="space-y-4 text-left text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[#808C91]">User</span><p className="font-medium">{selectedUserName}</p></div>
              <div><span className="text-[#808C91]">Contact</span><p className="font-medium">{selectedUser?.emailAddress || selectedUser?.phoneNumber || '—'}</p></div>
              <div><span className="text-[#808C91]">Flow</span><div className="mt-1"><PurposeBadge purpose={selected.purpose} /></div></div>
              <div><span className="text-[#808C91]">Outcome</span><div className="mt-1"><OutcomeBadge outcome={selected.outcome} /></div></div>
              <div><span className="text-[#808C91]">Attempted</span><p className="font-medium">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</p></div>
            </div>

            {selected.failureReason && (
              <div>
                <span className="text-[#808C91]">Failure reason</span>
                <p className="mt-1 text-[#D92D20]">{selected.failureReason}</p>
              </div>
            )}

            <div>
              <span className="text-[#808C91]">Captures ({selected.captureUrls?.length || 0})</span>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {(selected.captureUrls || []).map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt={`Capture ${idx + 1}`} className="w-full h-32 object-cover" />
                  </a>
                ))}
                {!selected.captureUrls?.length && (
                  <p className="text-[#808C91] col-span-3">No captures were saved for this attempt.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
};

export default VerificationAttempts;
