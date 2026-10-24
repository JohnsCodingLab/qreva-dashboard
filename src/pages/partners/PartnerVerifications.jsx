import React, { useMemo, useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import { usePartnerUsage } from '@/store/features/partnerApi/usePartnerApi';
import { usePartnerBilling } from '@/store/features/partnerApi/usePartnerApi';
import {
  makeColumns,
  ROW_ACTIONS,
  OUTCOME_OPTIONS,
  VerificationTypeBadge,
  OutcomeBadge,
  BillingBadge,
  formatNaira,
} from './partnerVerificationsConstants';

const PAGE_LIMIT = 25;

const StatTile = ({ label, value, sub, accent }) => (
  <div className="border border-gray-200 rounded-xl p-4 bg-white">
    <p className="text-xs text-[#808C91] font-medium uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent || 'text-[#1E1E1E]'}`}>{value}</p>
    {sub && <p className="text-xs text-[#808C91] mt-1">{sub}</p>}
  </div>
);

const PartnerVerifications = () => {
  const [page, setPage] = useState(1);
  const [partnerId, setPartnerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selected, setSelected] = useState(null);

  const { data: billingData } = usePartnerBilling();
  const partnerList = billingData?.data || [];

  const { data, isLoading } = usePartnerUsage({
    partnerId: partnerId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page,
    limit: PAGE_LIMIT,
  });

  const items = data?.data?.items || [];
  const outcomes = data?.data?.outcomes || {};
  const byPartner = data?.data?.byPartner || [];
  const total = data?.data?.total || 0;
  const pagination = {
    page: data?.data?.page || 1,
    limit: PAGE_LIMIT,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_LIMIT)),
  };

  const partnerNameMap = useMemo(
    () => Object.fromEntries(byPartner.map((p) => [p.partnerId, p.partnerName])),
    [byPartner],
  );

  const columns = useMemo(() => makeColumns(partnerNameMap), [partnerNameMap]);

  const actionsWithHandler = ROW_ACTIONS.map((action) => ({
    ...action,
    onClick: (row) => setSelected(row),
  }));

  const resetFilters = () => {
    setPartnerId('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasFilters = partnerId || startDate || endDate;

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Partner Verifications</h1>
          <p className="text-[#808C91] mt-1">
            Every BVN and NIN check made by partners via the API or console
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-[#808C91] mb-1">Partner</label>
            <select
              className="h-10 px-3 border border-gray-300 rounded-lg text-sm min-w-[180px]"
              value={partnerId}
              onChange={(e) => { setPartnerId(e.target.value); setPage(1); }}
            >
              <option value="">All partners</option>
              {partnerList.map((p) => (
                <option key={p.partnerId} value={p.partnerId}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#808C91] mb-1">From</label>
            <input
              type="date"
              className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            />
          </div>
          <div>
            <label className="block text-xs text-[#808C91] mb-1">To</label>
            <input
              type="date"
              className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            />
          </div>
          {hasFilters && (
            <button
              className="h-10 px-4 text-sm text-[#F57C00] border border-[#F57C00] rounded-lg hover:bg-orange-50"
              onClick={resetFilters}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile
          label="Billed Revenue"
          value={formatNaira(data?.data?.billedAmount || 0)}
          sub="Excludes refunded calls"
        />
        <StatTile
          label="Billed Calls"
          value={(data?.data?.billedCalls || 0).toLocaleString()}
          sub={`${total.toLocaleString()} total records`}
        />
        <StatTile
          label="Success Rate"
          value={outcomes.successRate != null ? `${outcomes.successRate}%` : '—'}
          sub={`${(outcomes.success || 0).toLocaleString()} of ${(outcomes.answered || 0).toLocaleString()} answered`}
          accent={
            outcomes.successRate >= 90
              ? 'text-green-600'
              : outcomes.successRate >= 70
              ? 'text-yellow-600'
              : 'text-red-600'
          }
        />
        <StatTile
          label="Rejected"
          value={outcomes.rejectedRate != null ? `${outcomes.rejectedRate}%` : '—'}
          sub={`${(outcomes.rejected || 0).toLocaleString()} rejected · ${(outcomes.provider_error || 0).toLocaleString()} provider errors`}
          accent={
            outcomes.rejectedRate > 20
              ? 'text-red-600'
              : outcomes.rejectedRate > 10
              ? 'text-yellow-600'
              : 'text-[#1E1E1E]'
          }
        />
      </div>

      {outcomes.pending > 0 && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>{outcomes.pending}</strong> call{outcomes.pending === 1 ? '' : 's'} still pending — charged but
          never resolved. The partner may have been billed for nothing.
        </div>
      )}

      {/* Verifications table */}
      <DataTable
        className="font-general"
        data={items}
        columns={columns}
        title="Verification Log"
        actions={actionsWithHandler}
        showSearch={false}
        showCheckbox={false}
        showFilter={false}
        loading={isLoading}
        pagination={pagination}
        pageSize={PAGE_LIMIT}
        onPageChange={setPage}
      />

      {/* Detail modal */}
      <BaseModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Verification Detail"
        maxWidth="max-w-lg"
      >
        {selected && (
          <div className="space-y-4 text-left text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#808C91]">Partner</span>
                <p className="font-medium text-[#1E1E1E] mt-0.5">
                  {partnerNameMap[selected.partnerId] || selected.partnerId}
                </p>
                <p className="text-xs text-[#808C91] font-mono">{selected.partnerId}</p>
              </div>
              <div>
                <span className="text-[#808C91]">Date</span>
                <p className="font-medium mt-0.5">
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <span className="text-[#808C91]">Verification Type</span>
                <div className="mt-1">
                  <VerificationTypeBadge code={selected.endpointCode} />
                </div>
              </div>
              <div>
                <span className="text-[#808C91]">Outcome</span>
                <div className="mt-1">
                  <OutcomeBadge outcome={selected.outcome} />
                </div>
              </div>
              <div>
                <span className="text-[#808C91]">Charge</span>
                <p className="font-semibold text-[#1E1E1E] mt-0.5">{formatNaira(selected.amount)}</p>
              </div>
              <div>
                <span className="text-[#808C91]">Billing Status</span>
                <div className="mt-1">
                  <BillingBadge status={selected.status} />
                </div>
              </div>
            </div>

            {selected.reference && (
              <div>
                <span className="text-[#808C91]">Partner Reference</span>
                <p className="font-mono text-sm mt-0.5 break-all">{selected.reference}</p>
              </div>
            )}

            {selected.failureReason && (
              <div>
                <span className="text-[#808C91]">Failure Reason</span>
                <p className="mt-0.5 text-red-600">{selected.failureReason}</p>
              </div>
            )}

            {selected.metadata && Object.keys(selected.metadata).length > 0 && (
              <div>
                <span className="text-[#808C91]">Metadata</span>
                <pre className="mt-1 text-xs bg-gray-50 border rounded-lg p-3 overflow-x-auto">
                  {JSON.stringify(selected.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </BaseModal>
    </div>
  );
};

export default PartnerVerifications;
