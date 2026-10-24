import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import { Button } from '@/components/ui/button';
import { BLACKLIST_COLUMNS, BLACKLIST_ACTIONS, LIST_TYPE_OPTIONS } from './constants';
import {
  useFraudBlacklist,
  useCreateFraudBlacklistEntry,
  useUpdateFraudBlacklistEntry,
  useDeactivateFraudBlacklistEntry,
} from '@/store/features/fraud/useFraudBlacklist';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const emptyForm = { value: '', listType: 'accounts', reason: '' };

const FraudBlacklist = () => {
  const [activeOnly, setActiveOnly] = useState(true);
  const { data: entries = [], isLoading } = useFraudBlacklist({ activeOnly, limit: 200 });
  const createEntry = useCreateFraudBlacklistEntry();
  const updateEntry = useUpdateFraudBlacklistEntry();
  const deactivateEntry = useDeactivateFraudBlacklistEntry();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingEntry(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingEntry(row);
    setForm({ value: row.value, listType: row.list_type, reason: row.reason || '' });
    setModalOpen(true);
  };

  const handleAction = (action, row) => {
    if (action.label === 'Edit Entry') {
      openEdit(row);
    } else if (action.label === 'Remove Entry') {
      deactivateEntry.mutate(row.id, {
        onSuccess: () => handleSuccess('Blacklist entry removed'),
        onError: (error) => handleError(error),
      });
    }
  };

  const actionsWithHandler = BLACKLIST_ACTIONS.map((action) => ({
    ...action,
    onClick: (row) => handleAction(action, row),
  }));

  const handleSubmit = () => {
    if (editingEntry) {
      updateEntry.mutate(
        { entryId: editingEntry.id, reason: form.reason },
        {
          onSuccess: () => {
            handleSuccess('Blacklist entry updated');
            setModalOpen(false);
          },
          onError: (error) => handleError(error),
        },
      );
    } else {
      createEntry.mutate(
        { value: form.value, listType: form.listType, reason: form.reason || undefined },
        {
          onSuccess: () => {
            handleSuccess('Blacklist entry added — takes effect on the next sync (hourly)');
            setModalOpen(false);
          },
          onError: (error) => handleError(error),
        },
      );
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Blacklist</h1>
          <p className="text-[#808C91] mt-1">
            Accounts, devices, IPs, phone numbers, BVNs, NINs and emails blocked from every fraud assessment
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#505C61]">
            <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />
            Active only
          </label>
          <Button className="bg-[#FF5B04] hover:bg-[#e65203] text-white" onClick={openCreate}>
            Add Entry
          </Button>
        </div>
      </div>

      <DataTable
        data={entries}
        columns={BLACKLIST_COLUMNS}
        title="Blacklist Entries"
        actions={actionsWithHandler}
        showSearch={true}
        showCheckbox={false}
        loading={isLoading}
      />

      <BaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEntry ? 'Edit Blacklist Entry' : 'Add Blacklist Entry'}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-medium text-[#505C61]">Value</label>
            <input
              className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04] disabled:bg-gray-50"
              value={form.value}
              disabled={!!editingEntry}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="Account number, device ID, IP address, phone number, BVN, NIN, or email"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#505C61]">List Type</label>
            <select
              className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04] disabled:bg-gray-50"
              value={form.listType}
              disabled={!!editingEntry}
              onChange={(e) => setForm({ ...form, listType: e.target.value })}
            >
              {LIST_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#505C61]">Reason</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>

          <Button
            className="w-full h-12 bg-[#FF5B04] hover:bg-[#e65203] text-white"
            onClick={handleSubmit}
            disabled={(createEntry.isPending || updateEntry.isPending) || !form.value}
          >
            {editingEntry ? 'Save Changes' : 'Add To Blacklist'}
          </Button>
        </div>
      </BaseModal>
    </div>
  );
};

export default FraudBlacklist;
