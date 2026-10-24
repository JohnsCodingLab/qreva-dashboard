import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import { Button } from '@/components/ui/button';
import { AUDIT_LOG_COLUMNS, AUDIT_LOG_ACTIONS } from '../auditLog/constants';
import { AuditActionBadge } from '@/components/fraud/AuditBadges';
import { useFraudReviewQueue, useLabelFraudAuditLog } from '@/store/features/fraud/useFraudAuditLog';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

// Review-queue rows are always final_action === "review" and outcome_label
// is always still null (that's what makes them queued work), so the
// Decision/Outcome columns from the shared audit-log column set are
// redundant here — trim them down to what the reviewer actually needs.
const REVIEW_QUEUE_COLUMNS = AUDIT_LOG_COLUMNS.filter((col) => col.field !== 'outcome_label');

const FraudReviewQueue = () => {
  const { data: entries = [], isLoading } = useFraudReviewQueue({ limit: 200 });
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
          handleSuccess('Decision labeled — removed from the queue');
          setSelected(null);
        },
        onError: (error) => handleError(error),
      },
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1E1E]">Review Queue</h1>
        <p className="text-[#808C91] mt-1">
          Decisions the fusion layer routed to manual review, oldest first — label each to close the loop
        </p>
      </div>

      <DataTable
        data={entries}
        columns={REVIEW_QUEUE_COLUMNS}
        title={`Pending Review (${entries.length})`}
        actions={actionsWithHandler}
        showSearch={true}
        showCheckbox={false}
        loading={isLoading}
      />

      <BaseModal isOpen={!!selected} onClose={() => setSelected(null)} title="Review Decision" maxWidth="max-w-lg">
        {selected && (
          <div className="space-y-4 text-left text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[#808C91]">Event type</span><p className="font-medium">{selected.event_type}</p></div>
              <div><span className="text-[#808C91]">User ID</span><p className="font-medium">{selected.user_id}</p></div>
              <div><span className="text-[#808C91]">Rule score</span><p className="font-medium">{selected.rule_score?.toFixed(1)}</p></div>
              <div><span className="text-[#808C91]">ML score</span><p className="font-medium">{selected.ml_score?.toFixed(1)}</p></div>
              <div><span className="text-[#808C91]">Final score</span><p className="font-medium">{selected.final_score?.toFixed(1)}</p></div>
              <div><span className="text-[#808C91]">Decision</span><div className="mt-0.5"><AuditActionBadge action={selected.final_action} /></div></div>
            </div>

            {selected.reasons?.length > 0 && (
              <div>
                <span className="text-[#808C91]">Reasons</span>
                <ul className="list-disc list-inside mt-1 text-[#505C61]">
                  {selected.reasons.map((reason, idx) => <li key={idx}>{reason}</li>)}
                </ul>
              </div>
            )}

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

export default FraudReviewQueue;
