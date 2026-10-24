import React, { useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import { Button } from '@/components/ui/button';
import { RULE_COLUMNS, RULE_ACTIONS, EVENT_TYPE_OPTIONS } from './constants';
import {
  useFraudRules,
  useCreateFraudRule,
  useUpdateFraudRule,
  useDeactivateFraudRule,
} from '@/store/features/fraud/useFraudRules';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const emptyForm = {
  ruleDefinitionId: '',
  name: '',
  params: '{}',
  weight: 1,
  appliesToEventTypes: [],
  isHardOverride: false,
  overrideAction: '',
  active: true,
};

const FraudRules = () => {
  const { data: rules = [], isLoading } = useFraudRules();
  const createRule = useCreateFraudRule();
  const updateRule = useUpdateFraudRule();
  const deactivateRule = useDeactivateFraudRule();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [paramsError, setParamsError] = useState('');

  const openCreate = () => {
    setEditingRule(null);
    setForm(emptyForm);
    setParamsError('');
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingRule(row);
    setForm({
      ruleDefinitionId: row.rule_definition_id,
      name: row.name,
      params: JSON.stringify(row.params ?? {}, null, 2),
      weight: row.weight,
      appliesToEventTypes: row.applies_to_event_types || [],
      isHardOverride: row.is_hard_override,
      overrideAction: row.override_action || '',
      active: row.active,
    });
    setParamsError('');
    setModalOpen(true);
  };

  const toggleEventType = (eventType) => {
    setForm((prev) => ({
      ...prev,
      appliesToEventTypes: prev.appliesToEventTypes.includes(eventType)
        ? prev.appliesToEventTypes.filter((item) => item !== eventType)
        : [...prev.appliesToEventTypes, eventType],
    }));
  };

  const handleAction = (action, row) => {
    if (action.label === 'Edit Rule') {
      openEdit(row);
    } else if (action.label === 'Deactivate Rule') {
      deactivateRule.mutate(row.id, {
        onSuccess: () => handleSuccess('Rule deactivated'),
        onError: (error) => handleError(error),
      });
    }
  };

  const actionsWithHandler = RULE_ACTIONS.map((action) => ({
    ...action,
    onClick: (row) => handleAction(action, row),
  }));

  const handleSubmit = () => {
    let parsedParams;
    try {
      parsedParams = JSON.parse(form.params || '{}');
    } catch {
      setParamsError('Params must be valid JSON');
      return;
    }
    setParamsError('');

    if (editingRule) {
      updateRule.mutate(
        {
          ruleId: editingRule.id,
          name: form.name,
          params: parsedParams,
          weight: Number(form.weight),
          appliesToEventTypes: form.appliesToEventTypes,
          isHardOverride: form.isHardOverride,
          overrideAction: form.isHardOverride ? form.overrideAction || null : null,
          active: form.active,
        },
        {
          onSuccess: () => {
            handleSuccess('Rule updated successfully');
            setModalOpen(false);
          },
          onError: (error) => handleError(error),
        },
      );
    } else {
      createRule.mutate(
        {
          ruleDefinitionId: form.ruleDefinitionId,
          name: form.name,
          params: parsedParams,
          weight: Number(form.weight),
          appliesToEventTypes: form.appliesToEventTypes,
          isHardOverride: form.isHardOverride,
          overrideAction: form.isHardOverride ? form.overrideAction || null : null,
          active: form.active,
        },
        {
          onSuccess: () => {
            handleSuccess('Rule created successfully');
            setModalOpen(false);
          },
          onError: (error) => handleError(error),
        },
      );
    }
  };

  const isSaving = createRule.isPending || updateRule.isPending;

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Fraud Rules</h1>
          <p className="text-[#808C91] mt-1">
            Configure the rule-engine thresholds that feed the fraud decision score
          </p>
        </div>
        <Button className="bg-[#FF5B04] hover:bg-[#e65203] text-white" onClick={openCreate}>
          Add Rule
        </Button>
      </div>

      <DataTable
        data={rules}
        columns={RULE_COLUMNS}
        title="Rule Configs"
        actions={actionsWithHandler}
        showSearch={true}
        showCheckbox={false}
        loading={isLoading}
      />

      <BaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRule ? 'Edit Rule' : 'Add Rule'}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-left">
          {!editingRule && (
            <div>
              <label className="text-xs font-medium text-[#505C61]">Rule Definition ID</label>
              <input
                className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
                value={form.ruleDefinitionId}
                onChange={(e) => setForm({ ...form, ruleDefinitionId: e.target.value })}
                placeholder="UUID of the rule_definitions row"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[#505C61]">Name</label>
            <input
              className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#505C61]">Applies To Event Types</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {EVENT_TYPE_OPTIONS.map((eventType) => (
                <button
                  type="button"
                  key={eventType}
                  onClick={() => toggleEventType(eventType)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    form.appliesToEventTypes.includes(eventType)
                      ? 'bg-[#FFF5F2] border-[#FF5B04] text-[#FF5B04]'
                      : 'border-gray-300 text-[#808C91]'
                  }`}
                >
                  {eventType}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#505C61]">Weight</label>
              <input
                type="number"
                step="0.1"
                className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2 pb-2.5">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <label htmlFor="active" className="text-sm text-[#505C61]">Active</label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isHardOverride"
              checked={form.isHardOverride}
              onChange={(e) => setForm({ ...form, isHardOverride: e.target.checked })}
            />
            <label htmlFor="isHardOverride" className="text-sm text-[#505C61]">
              Hard override (bypasses score fusion, forces the action below)
            </label>
          </div>

          {form.isHardOverride && (
            <div>
              <label className="text-xs font-medium text-[#505C61]">Override Action</label>
              <select
                className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
                value={form.overrideAction}
                onChange={(e) => setForm({ ...form, overrideAction: e.target.value })}
              >
                <option value="">Select an action</option>
                <option value="allow">allow</option>
                <option value="monitor">monitor</option>
                <option value="verify">verify</option>
                <option value="review">review</option>
                <option value="block">block</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[#505C61]">
              Params (JSON — evaluator-specific thresholds)
            </label>
            <textarea
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
              value={form.params}
              onChange={(e) => setForm({ ...form, params: e.target.value })}
            />
            {paramsError && <p className="text-xs text-red-500 mt-1">{paramsError}</p>}
          </div>

          <Button
            className="w-full h-12 bg-[#FF5B04] hover:bg-[#e65203] text-white"
            onClick={handleSubmit}
            disabled={isSaving || !form.name || form.appliesToEventTypes.length === 0}
          >
            {editingRule ? 'Save Changes' : 'Create Rule'}
          </Button>
        </div>
      </BaseModal>
    </div>
  );
};

export default FraudRules;
