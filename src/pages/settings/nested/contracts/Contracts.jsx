import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useContracts, usePatchContract } from '@/store/features/contracts/useContracts';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const CONTRACT_TYPE = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
  RANGE: 'range',
};

const EMPTY_RANGE = {
  min: '',
  max: '',
  amountMode: CONTRACT_TYPE.FIXED,
  flatAmount: '',
  percentageAmount: '',
  minCap: '',
  maxCap: '',
};

const toNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const valueOrDash = (value, prefix = '') => {
  if (value === null || value === undefined || value === '') return '-';
  return `${prefix}${value}`;
};

const detectContractType = (entry) => {
  if (Array.isArray(entry?.range) && entry.range.length) {
    return CONTRACT_TYPE.RANGE;
  }

  const normalizedType = String(entry?.type || '').trim().toLowerCase();
  if (normalizedType.includes('percent')) {
    return CONTRACT_TYPE.PERCENTAGE;
  }
  if (normalizedType.includes('range')) {
    return CONTRACT_TYPE.RANGE;
  }
  if (normalizedType.includes('flat') || normalizedType.includes('fixed')) {
    return CONTRACT_TYPE.FIXED;
  }

  if (entry?.percentageAmount !== null && entry?.percentageAmount !== undefined) {
    return CONTRACT_TYPE.PERCENTAGE;
  }

  return CONTRACT_TYPE.FIXED;
};

const typeLabel = (type) => {
  if (type === CONTRACT_TYPE.PERCENTAGE) return 'percentage';
  if (type === CONTRACT_TYPE.RANGE) return 'range';
  return 'fixed';
};

const mapRangeToDraft = (rangeItem) => {
  const mode =
    rangeItem?.percentageAmount !== null && rangeItem?.percentageAmount !== undefined
      ? CONTRACT_TYPE.PERCENTAGE
      : CONTRACT_TYPE.FIXED;

  return {
    min: rangeItem?.min ?? '',
    max: rangeItem?.max ?? '',
    amountMode: mode,
    flatAmount: rangeItem?.flatAmount ?? '',
    percentageAmount: rangeItem?.percentageAmount ?? '',
    minCap: rangeItem?.minCap ?? '',
    maxCap: rangeItem?.maxCap ?? '',
  };
};

const buildRangeFromDraft = (rangeItemDraft) => {
  const built = {
    min: toNumberOrNull(rangeItemDraft.min),
    max: toNumberOrNull(rangeItemDraft.max),
    flatAmount: null,
    percentageAmount: null,
    minCap: toNumberOrNull(rangeItemDraft.minCap),
    maxCap: toNumberOrNull(rangeItemDraft.maxCap),
  };

  if (rangeItemDraft.amountMode === CONTRACT_TYPE.PERCENTAGE) {
    built.percentageAmount = toNumberOrNull(rangeItemDraft.percentageAmount);
  } else {
    built.flatAmount = toNumberOrNull(rangeItemDraft.flatAmount);
  }

  return built;
};

const getRangeSummary = (entry) => {
  if (!Array.isArray(entry?.range) || !entry.range.length) {
    return 'No ranges';
  }

  return entry.range
    .map((item) => {
      const min = item?.min ?? 0;
      const max = item?.max ?? '∞';
      const amount =
        item?.percentageAmount !== null && item?.percentageAmount !== undefined
          ? `${item.percentageAmount}%`
          : `₦${item?.flatAmount ?? 0}`;
      return `${min} - ${max}: ${amount}`;
    })
    .join(' | ');
};

const ContractEntryEditModal = ({ isOpen, onClose, entry, onSave, disabled, title }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!entry) {
      setForm(null);
      return;
    }

    const contractType = detectContractType(entry);
    setForm({
      typeMode: contractType,
      flatAmount: entry.flatAmount ?? '',
      percentageAmount: entry.percentageAmount ?? '',
      minCap: entry.minCap ?? '',
      maxCap: entry.maxCap ?? '',
      ranges: Array.isArray(entry.range) && entry.range.length ? entry.range.map(mapRangeToDraft) : [
        { ...EMPTY_RANGE },
      ],
    });
  }, [entry, isOpen]);

  if (!isOpen || !entry || !form) {
    return null;
  }

  const updateFormField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateRangeField = (index, field, value) => {
    setForm((previous) => {
      const ranges = [...previous.ranges];
      ranges[index] = { ...ranges[index], [field]: value };
      return { ...previous, ranges };
    });
  };

  const addRange = () => {
    setForm((previous) => ({
      ...previous,
      ranges: [...previous.ranges, { ...EMPTY_RANGE }],
    }));
  };

  const removeRange = (index) => {
    setForm((previous) => {
      const ranges = previous.ranges.filter((_, idx) => idx !== index);
      return {
        ...previous,
        ranges: ranges.length ? ranges : [{ ...EMPTY_RANGE }],
      };
    });
  };

  const handleSubmit = () => {
    const updated = {
      ...entry,
      type: typeLabel(form.typeMode),
      flatAmount: null,
      percentageAmount: null,
      range: [],
      minCap: toNumberOrNull(form.minCap),
      maxCap: toNumberOrNull(form.maxCap),
    };

    if (form.typeMode === CONTRACT_TYPE.FIXED) {
      updated.flatAmount = toNumberOrNull(form.flatAmount);
    } else if (form.typeMode === CONTRACT_TYPE.PERCENTAGE) {
      updated.percentageAmount = toNumberOrNull(form.percentageAmount);
    } else {
      updated.range = form.ranges
        .map(buildRangeFromDraft)
        .filter((item) => item.min !== null || item.max !== null || item.flatAmount !== null || item.percentageAmount !== null);
    }

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-[#E8EBED] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#1E1E1E]">{title}</h2>
            <p className="mt-1 text-sm text-[#808C91]">{entry.name || entry.code}</p>
          </div>
          <button onClick={onClose} className="text-[#084059] hover:text-[#1E1E1E]">✕</button>
        </div>

        <div className="max-h-[70vh] overflow-auto px-6 py-5">
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-[#808C91]">Type</label>
              <select
                value={form.typeMode}
                onChange={(event) => updateFormField('typeMode', event.target.value)}
                className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                disabled={disabled}
              >
                <option value={CONTRACT_TYPE.FIXED}>Fixed</option>
                <option value={CONTRACT_TYPE.PERCENTAGE}>Percentage</option>
                <option value={CONTRACT_TYPE.RANGE}>Range</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#808C91]">Min Cap</label>
              <input
                type="number"
                value={form.minCap}
                onChange={(event) => updateFormField('minCap', event.target.value)}
                className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                disabled={disabled}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#808C91]">Max Cap</label>
              <input
                type="number"
                value={form.maxCap}
                onChange={(event) => updateFormField('maxCap', event.target.value)}
                className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                disabled={disabled}
              />
            </div>
          </div>

          {form.typeMode === CONTRACT_TYPE.FIXED && (
            <div>
              <label className="mb-1 block text-xs text-[#808C91]">Fixed Amount</label>
              <input
                type="number"
                value={form.flatAmount}
                onChange={(event) => updateFormField('flatAmount', event.target.value)}
                className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm md:w-64"
                disabled={disabled}
              />
            </div>
          )}

          {form.typeMode === CONTRACT_TYPE.PERCENTAGE && (
            <div>
              <label className="mb-1 block text-xs text-[#808C91]">Percentage Amount (%)</label>
              <input
                type="number"
                step="0.0001"
                value={form.percentageAmount}
                onChange={(event) => updateFormField('percentageAmount', event.target.value)}
                className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm md:w-64"
                disabled={disabled}
              />
            </div>
          )}

          {form.typeMode === CONTRACT_TYPE.RANGE && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1E1E1E]">Range Definitions</h3>
                <button
                  onClick={addRange}
                  disabled={disabled}
                  className="rounded-md border border-[#FF5B04] px-3 py-1 text-xs font-semibold text-[#FF5B04] hover:bg-[#FFF5F2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add Range
                </button>
              </div>
              <div className="space-y-3">
                {form.ranges.map((range, index) => (
                  <div key={`range-${index}`} className="rounded-lg border border-[#E8EBED] bg-[#FAFCFD] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#505C61]">Range #{index + 1}</p>
                      <button
                        onClick={() => removeRange(index)}
                        disabled={disabled}
                        className="text-xs text-[#D92D20] hover:text-[#B42318] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs text-[#808C91]">Min</label>
                        <input
                          type="number"
                          value={range.min}
                          onChange={(event) => updateRangeField(index, 'min', event.target.value)}
                          className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                          disabled={disabled}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-[#808C91]">Max</label>
                        <input
                          type="number"
                          value={range.max}
                          onChange={(event) => updateRangeField(index, 'max', event.target.value)}
                          className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                          disabled={disabled}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-[#808C91]">Amount Type</label>
                        <select
                          value={range.amountMode}
                          onChange={(event) => updateRangeField(index, 'amountMode', event.target.value)}
                          className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                          disabled={disabled}
                        >
                          <option value={CONTRACT_TYPE.FIXED}>Fixed</option>
                          <option value={CONTRACT_TYPE.PERCENTAGE}>Percentage</option>
                        </select>
                      </div>

                      {range.amountMode === CONTRACT_TYPE.PERCENTAGE ? (
                        <div>
                          <label className="mb-1 block text-xs text-[#808C91]">Percentage Amount (%)</label>
                          <input
                            type="number"
                            step="0.0001"
                            value={range.percentageAmount}
                            onChange={(event) => updateRangeField(index, 'percentageAmount', event.target.value)}
                            className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                            disabled={disabled}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="mb-1 block text-xs text-[#808C91]">Fixed Amount</label>
                          <input
                            type="number"
                            value={range.flatAmount}
                            onChange={(event) => updateRangeField(index, 'flatAmount', event.target.value)}
                            className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                            disabled={disabled}
                          />
                        </div>
                      )}

                      <div>
                        <label className="mb-1 block text-xs text-[#808C91]">Range Min Cap</label>
                        <input
                          type="number"
                          value={range.minCap}
                          onChange={(event) => updateRangeField(index, 'minCap', event.target.value)}
                          className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                          disabled={disabled}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-[#808C91]">Range Max Cap</label>
                        <input
                          type="number"
                          value={range.maxCap}
                          onChange={(event) => updateRangeField(index, 'maxCap', event.target.value)}
                          className="h-10 w-full rounded-md border border-[#D7DEE3] px-3 text-sm"
                          disabled={disabled}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#E8EBED] px-6 py-4">
          <button
            onClick={onClose}
            className="h-10 rounded-md border border-[#D7DEE3] px-4 text-sm font-medium text-[#505C61] hover:bg-[#F8FAFB]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="h-10 rounded-md bg-[#FF5B04] px-5 text-sm font-semibold text-white hover:bg-[#E54F03] disabled:cursor-not-allowed disabled:bg-[#F4A57E]"
          >
            Save Field
          </button>
        </div>
      </div>
    </div>
  );
};

const ContractRowsTable = ({ title, rows, onEdit, editable }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8EBED] bg-white">
      <div className="border-b border-[#E8EBED] px-5 py-4">
        <h3 className="text-lg font-semibold text-[#1E1E1E]">{title}</h3>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full divide-y divide-[#E8EBED]">
          <thead className="bg-[#F8FAFB]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Code</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Configured Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Range Details</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F4F6] bg-white">
            {rows.map((row, index) => {
              const type = detectContractType(row);
              const configuredValue =
                type === CONTRACT_TYPE.PERCENTAGE
                  ? valueOrDash(row.percentageAmount, '') + (row.percentageAmount !== null && row.percentageAmount !== undefined ? '%' : '')
                  : type === CONTRACT_TYPE.FIXED
                    ? valueOrDash(row.flatAmount, '₦')
                    : '-';

              return (
                <tr key={`${row.code || row.name || title}-${index}`}>
                  <td className="px-4 py-3 text-sm font-medium text-[#1E1E1E]">{row.code || '-'}</td>
                  <td className="px-4 py-3 text-sm text-[#1E1E1E]">{row.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#F2F4F7] px-2 py-1 text-xs font-medium text-[#344054]">{typeLabel(type)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1E1E1E]">{configuredValue}</td>
                  <td className="max-w-[460px] px-4 py-3 text-xs text-[#505C61]">{type === CONTRACT_TYPE.RANGE ? getRangeSummary(row) : 'Not range-based'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onEdit(index)}
                      disabled={!editable}
                      className="rounded-md border border-[#FF5B04] px-3 py-1 text-xs font-semibold text-[#FF5B04] hover:bg-[#FFF5F2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#808C91]">
                  No entries available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Contracts = () => {
  const { user } = useAuth();
  const { data: contractsResponse, isLoading } = useContracts();
  const patchContract = usePatchContract();
  const contracts = useMemo(() => contractsResponse?.data || [], [contractsResponse]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [draft, setDraft] = useState({ charges: [], commissions: [] });
  const [editingState, setEditingState] = useState({
    isOpen: false,
    section: null,
    index: null,
  });

  const isSuperAdmin = user?.role === 'SuperAdmin';

  useEffect(() => {
    if (!contracts.length) {
      setSelectedContractId('');
      setDraft({ charges: [], commissions: [] });
      return;
    }

    setSelectedContractId((previous) => {
      if (previous && contracts.some((item) => item._id === previous)) {
        return previous;
      }
      return contracts[0]._id;
    });
  }, [contracts]);

  const selectedContract = useMemo(
    () => contracts.find((item) => item._id === selectedContractId) || null,
    [contracts, selectedContractId],
  );

  useEffect(() => {
    if (!selectedContract) {
      setDraft({ charges: [], commissions: [] });
      return;
    }

    setDraft({
      charges: (selectedContract.charges || []).map((item) => ({ ...item })),
      commissions: (selectedContract.commissions || []).map((item) => ({ ...item })),
    });
  }, [selectedContract]);

  const openEditModal = (section, index) => {
    setEditingState({
      isOpen: true,
      section,
      index,
    });
  };

  const closeEditModal = () => {
    setEditingState({ isOpen: false, section: null, index: null });
  };

  const editingEntry =
    editingState.isOpen && editingState.section !== null && editingState.index !== null
      ? draft?.[editingState.section]?.[editingState.index] || null
      : null;

  const updateEntryInDraft = (updatedEntry) => {
    if (editingState.section === null || editingState.index === null) {
      return;
    }

    setDraft((previous) => {
      const rows = [...(previous[editingState.section] || [])];
      rows[editingState.index] = updatedEntry;
      return {
        ...previous,
        [editingState.section]: rows,
      };
    });

    closeEditModal();
  };

  const handleSaveContract = () => {
    if (!selectedContract?._id) {
      return;
    }

    patchContract.mutate(
      {
        contractId: selectedContract._id,
        updates: {
          charges: draft.charges,
          commissions: draft.commissions,
        },
      },
      {
        onSuccess: (response) => {
          handleSuccess(response?.message || 'Contract updated successfully');
        },
        onError: (error) => {
          handleError(error, 'Unable to update contract');
        },
      },
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Contract Management</h1>
          <p className="mt-1 text-[#808C91]">
            View and update each charge/commission rule. Supports fixed, percentage and multi-range structures.
          </p>
        </div>
        <button
          onClick={handleSaveContract}
          disabled={!isSuperAdmin || !selectedContract || patchContract.isPending}
          className="h-12 rounded-lg bg-[#FF5B04] px-8 text-sm font-semibold text-white hover:bg-[#E54F03] disabled:cursor-not-allowed disabled:bg-[#F4A57E]"
        >
          {patchContract.isPending ? 'Saving...' : 'Save Contract Changes'}
        </button>
      </div>

      {!isSuperAdmin && (
        <div className="mb-4 rounded-lg border border-[#FFE6DE] bg-[#FFF5F2] px-4 py-3 text-sm text-[#B54708]">
          You can view contracts, but only Super Admin can update them.
        </div>
      )}

      <div className="mb-6 rounded-xl border border-[#E8EBED] bg-white p-4">
        <label className="mb-2 block text-sm font-medium text-[#505C61]">Select Contract</label>
        <select
          value={selectedContractId}
          onChange={(event) => setSelectedContractId(event.target.value)}
          className="h-11 w-full rounded-lg border border-[#D7DEE3] px-3 text-sm"
        >
          {contracts.map((contract) => (
            <option key={contract._id} value={contract._id}>
              {contract.name} {contract.isDefault ? '(Default)' : ''}
            </option>
          ))}
        </select>
        {selectedContract && (
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-[#808C91] md:grid-cols-4">
            <p>Currency: <span className="text-[#1E1E1E] font-medium">{selectedContract.currency || '-'}</span></p>
            <p>Country: <span className="text-[#1E1E1E] font-medium">{selectedContract.country || '-'}</span></p>
            <p>Entity: <span className="text-[#1E1E1E] font-medium">{selectedContract.entityType || '-'}</span></p>
            <p>Scope: <span className="text-[#1E1E1E] font-medium">{selectedContract.client ? 'Client-specific' : 'Global'}</span></p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-[#E8EBED] bg-white px-5 py-8 text-sm text-[#808C91]">Loading contracts...</div>
      ) : !selectedContract ? (
        <div className="rounded-xl border border-[#E8EBED] bg-white px-5 py-8 text-sm text-[#808C91]">No contracts available.</div>
      ) : (
        <div className="space-y-6">
          <ContractRowsTable
            title="Charges"
            rows={draft.charges}
            editable={isSuperAdmin}
            onEdit={(index) => openEditModal('charges', index)}
          />
          <ContractRowsTable
            title="Commissions"
            rows={draft.commissions}
            editable={isSuperAdmin}
            onEdit={(index) => openEditModal('commissions', index)}
          />
        </div>
      )}

      <ContractEntryEditModal
        isOpen={editingState.isOpen}
        onClose={closeEditModal}
        entry={editingEntry}
        disabled={!isSuperAdmin}
        title={editingState.section === 'charges' ? 'Edit Charge Field' : 'Edit Commission Field'}
        onSave={updateEntryInDraft}
      />
    </div>
  );
};

export default Contracts;

