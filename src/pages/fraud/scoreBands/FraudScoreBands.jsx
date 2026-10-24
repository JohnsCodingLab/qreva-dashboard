import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import { Button } from '@/components/ui/button';
import { SCORE_BAND_COLUMNS } from './constants';
import { useFraudScoreBands, useCreateFraudScoreBand } from '@/store/features/fraud/useFraudScoreBands';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const emptyForm = { minScore: 0, maxScore: 100, action: 'monitor', active: true };

const FraudScoreBands = () => {
  const { data: bands = [], isLoading } = useFraudScoreBands();
  const createScoreBand = useCreateFraudScoreBand();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const sortedBands = [...bands].sort((a, b) => a.min_score - b.min_score);

  const handleSubmit = () => {
    createScoreBand.mutate(
      {
        minScore: Number(form.minScore),
        maxScore: Number(form.maxScore),
        action: form.action,
        active: form.active,
      },
      {
        onSuccess: () => {
          handleSuccess('Score band created successfully');
          setModalOpen(false);
          setForm(emptyForm);
        },
        onError: (error) => handleError(error),
      },
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Score Bands</h1>
          <p className="text-[#808C91] mt-1">
            The final fused score (0–100) maps to one of these bands to decide the outcome
          </p>
        </div>
        <Button className="bg-[#FF5B04] hover:bg-[#e65203] text-white" onClick={() => setModalOpen(true)}>
          Add Score Band
        </Button>
      </div>

      <DataTable
        data={sortedBands}
        columns={SCORE_BAND_COLUMNS}
        title="Score Bands"
        showSearch={false}
        showCheckbox={false}
        loading={isLoading}
      />

      <BaseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Score Band" maxWidth="max-w-md">
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#505C61]">Min Score</label>
              <input
                type="number"
                min={0}
                max={100}
                className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
                value={form.minScore}
                onChange={(e) => setForm({ ...form, minScore: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#505C61]">Max Score</label>
              <input
                type="number"
                min={0}
                max={100}
                className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
                value={form.maxScore}
                onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#505C61]">Action</label>
            <select
              className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
            >
              <option value="allow">allow</option>
              <option value="monitor">monitor</option>
              <option value="verify">verify</option>
              <option value="review">review</option>
              <option value="block">block</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bandActive"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <label htmlFor="bandActive" className="text-sm text-[#505C61]">Active</label>
          </div>

          <Button
            className="w-full h-12 bg-[#FF5B04] hover:bg-[#e65203] text-white"
            onClick={handleSubmit}
            disabled={createScoreBand.isPending}
          >
            Create Score Band
          </Button>
        </div>
      </BaseModal>
    </div>
  );
};

export default FraudScoreBands;
