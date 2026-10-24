import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import { Button } from '@/components/ui/button';
import { RING_COLUMNS, RING_ACTIONS } from './constants';
import { useFraudRings, useReviewFraudRing } from '@/store/features/fraud/useFraudRings';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const FraudRings = () => {
  const [unreviewedOnly, setUnreviewedOnly] = useState(true);
  const { data: clusters = [], isLoading } = useFraudRings({ unreviewedOnly, limit: 200 });
  const reviewRing = useReviewFraudRing();
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');

  const actionsWithHandler = RING_ACTIONS.map((action) => ({
    ...action,
    onClick: (row) => {
      setSelected(row);
      setNotes('');
    },
  }));

  const handleReview = () => {
    reviewRing.mutate(
      { clusterId: selected.id, reviewNotes: notes || undefined },
      {
        onSuccess: () => {
          handleSuccess('Cluster marked as reviewed');
          setSelected(null);
        },
        onError: (error) => handleError(error),
      },
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Fraud Ring Clusters</h1>
          <p className="text-[#808C91] mt-1">
            Devices, accounts or beneficiaries linked by the identity graph — large is not automatically bad;
            a human reviews each cluster
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#505C61]">
          <input type="checkbox" checked={unreviewedOnly} onChange={(e) => setUnreviewedOnly(e.target.checked)} />
          Unreviewed only
        </label>
      </div>

      <DataTable
        data={clusters}
        columns={RING_COLUMNS}
        title="Fraud Ring Clusters"
        actions={actionsWithHandler}
        showSearch={true}
        showCheckbox={false}
        loading={isLoading}
      />

      <BaseModal isOpen={!!selected} onClose={() => setSelected(null)} title="Review Cluster" maxWidth="max-w-lg">
        {selected && (
          <div className="space-y-4 text-left text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[#808C91]">Root ID</span><p className="font-medium">{selected.root_id}</p></div>
              <div><span className="text-[#808C91]">Cluster type</span><p className="font-medium">{selected.cluster_type}</p></div>
              <div><span className="text-[#808C91]">Size</span><p className="font-medium">{selected.size} members</p></div>
              <div><span className="text-[#808C91]">First detected</span><p className="font-medium">{new Date(selected.first_detected_at).toLocaleDateString()}</p></div>
            </div>

            <div>
              <span className="text-[#808C91]">Member IDs</span>
              <div className="mt-1 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 text-xs text-[#505C61] font-mono">
                {(selected.member_ids || []).join(', ')}
              </div>
            </div>

            {selected.reviewed ? (
              <div className="rounded-lg bg-[#E8F8EE] p-3 text-[#1BA860] text-sm">
                Reviewed by {selected.reviewed_by} on {new Date(selected.reviewed_at).toLocaleDateString()}
                {selected.review_notes && <p className="mt-1 text-[#505C61]">{selected.review_notes}</p>}
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-[#505C61]">Review Notes (optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Legitimate household sharing a device — no action taken"
                  />
                </div>
                <Button
                  className="w-full h-12 bg-[#FF5B04] hover:bg-[#e65203] text-white"
                  onClick={handleReview}
                  disabled={reviewRing.isPending}
                >
                  Mark As Reviewed
                </Button>
              </>
            )}
          </div>
        )}
      </BaseModal>
    </div>
  );
};

export default FraudRings;
