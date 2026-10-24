import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import { Button } from '@/components/ui/button';
import { AUDIT_LOG_COLUMNS, AUDIT_LOG_ACTIONS, FINAL_ACTION_OPTIONS } from './constants';
import { AuditActionBadge, AuditLabelBadge } from '@/components/fraud/AuditBadges';
import { useFraudAuditLog, useLabelFraudAuditLog } from '@/store/features/fraud/useFraudAuditLog';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const FraudAuditLog = () => {
  const [filters, setFilters] = useState({ finalAction: '', outcomeLabel: '' });
  const { data: entries = [], isLoading } = useFraudAuditLog({
    finalAction: filters.finalAction || undefined,
    outcomeLabel: filters.outcomeLabel || undefined,
    limit: 200,
  });
  const labelAuditLog = useLabelFraudAuditLog();
  const [selected, setSelected] = useState(null);

  const actionsWithHandler = AUDIT_LOG_ACTIONS.map((action) => ({
    ...action,
    onClick: (row) => setSelected(row),
  }));

  const handleLabel = (outcomeLabel) => {
    labelAuditLog.mutate(
      { auditLogId: selected.id, outcomeLabel },
      {
        onSuccess: () => {
          handleSuccess('Decision labeled successfully');
          setSelected((prev) => ({ ...prev, outcome_label: outcomeLabel }));
        },
        onError: (error) => handleError(error),
      },
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Fraud Decision Audit Log</h1>
          <p className="text-[#808C91] mt-1">Every fraud decision ever made — filter, review and label outcomes</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
            value={filters.finalAction}
            onChange={(e) => setFilters({ ...filters, finalAction: e.target.value })}
          >
            <option value="">All decisions</option>
            {FINAL_ACTION_OPTIONS.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
          <select
            className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
            value={filters.outcomeLabel}
            onChange={(e) => setFilters({ ...filters, outcomeLabel: e.target.value })}
          >
            <option value="">All outcomes</option>
            <option value="unlabeled">Unlabeled</option>
            <option value="confirmed_fraud">Confirmed fraud</option>
            <option value="confirmed_legit">Confirmed legit</option>
          </select>
        </div>
      </div>

      <DataTable
        data={entries}
        columns={AUDIT_LOG_COLUMNS}
        title="Decision Audit Log"
        actions={actionsWithHandler}
        showSearch={true}
        showCheckbox={false}
        loading={isLoading}
      />

      <BaseModal isOpen={!!selected} onClose={() => setSelected(null)} title="Decision Detail" maxWidth="max-w-lg">
        {selected && (
          <div className="space-y-4 text-left text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[#808C91]">Event type</span><p className="font-medium">{selected.event_type}</p></div>
              <div><span className="text-[#808C91]">User ID</span><p className="font-medium">{selected.user_id}</p></div>
              <div><span className="text-[#808C91]">Rule score</span><p className="font-medium">{selected.rule_score?.toFixed(1)}</p></div>
              <div><span className="text-[#808C91]">ML score</span><p className="font-medium">{selected.ml_score?.toFixed(1)}</p></div>
              <div><span className="text-[#808C91]">Final score</span><p className="font-medium">{selected.final_score?.toFixed(1)}</p></div>
              <div><span className="text-[#808C91]">Model version</span><p className="font-medium">{selected.ml_model_version || '—'}</p></div>
            </div>

            <div>
              <span className="text-[#808C91]">Decision</span>
              <div className="mt-1"><AuditActionBadge action={selected.final_action} /></div>
            </div>

            {selected.reasons?.length > 0 && (
              <div>
                <span className="text-[#808C91]">Reasons</span>
                <ul className="list-disc list-inside mt-1 text-[#505C61]">
                  {selected.reasons.map((reason, idx) => <li key={idx}>{reason}</li>)}
                </ul>
              </div>
            )}

            <div>
              <span className="text-[#808C91]">Outcome</span>
              <div className="mt-1 flex items-center gap-3">
                <AuditLabelBadge label={selected.outcome_label} />
                {selected.labeled_by && (
                  <span className="text-xs text-[#808C91]">
                    by {selected.labeled_by} on {new Date(selected.labeled_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-[#FDEAEA] text-[#D92D20] hover:bg-[#f9d5d5]"
                onClick={() => handleLabel('confirmed_fraud')}
                disabled={labelAuditLog.isPending}
              >
                Confirm Fraud
              </Button>
              <Button
                className="flex-1 bg-[#E8F8EE] text-[#1BA860] hover:bg-[#d3f0e0]"
                onClick={() => handleLabel('confirmed_legit')}
                disabled={labelAuditLog.isPending}
              >
                Confirm Legit
              </Button>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
};

export default FraudAuditLog;
