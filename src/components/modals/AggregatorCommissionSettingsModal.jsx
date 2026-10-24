import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

const LEVELS = ['STARTER', 'BRONZE', 'SILVER', 'GOLD'];
const OWNER_LABELS = {
  aggregator: 'Aggregator',
  aggregator_manager: 'Aggregator Manager',
};

const toNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return parsed;
};

const isLevelShape = (settings) =>
  Array.isArray(settings) &&
  settings.some((item) => item?.transactionLevel || Array.isArray(item?.rules));

const normalizeFlatRules = (settings = []) =>
  (settings || []).map((rule) => ({
    ...rule,
    aggregatorPercent: toNumber(rule.aggregatorPercent),
    aggregatorManagerPercent: toNumber(rule.aggregatorManagerPercent),
  }));

const normalizeLevels = (settings = []) =>
  (settings || []).map((level) => ({
    ownerType: level.ownerType,
    transactionLevel: level.transactionLevel,
    rules: (level.rules || []).map((rule) => ({
      ...rule,
      percent: toNumber(rule.percent),
    })),
  }));

const buildOwnerMatrix = (levels = [], ownerType) => {
  const ownerLevels = (levels || []).filter((level) => level.ownerType === ownerType);
  const rowMap = new Map();

  ownerLevels.forEach((level) => {
    (level.rules || []).forEach((rule) => {
      const key = `${rule.code}:${rule.sourceType}`;
      if (!rowMap.has(key)) {
        rowMap.set(key, {
          code: rule.code,
          name: rule.name || rule.code,
          sourceType: rule.sourceType,
          percents: {
            STARTER: 0,
            BRONZE: 0,
            SILVER: 0,
            GOLD: 0,
          },
        });
      }

      rowMap.get(key).percents[level.transactionLevel] = toNumber(rule.percent);
    });
  });

  return Array.from(rowMap.values()).sort((a, b) => {
    if ((a.sourceType || '') !== (b.sourceType || '')) {
      return String(a.sourceType || '').localeCompare(String(b.sourceType || ''));
    }
    return String(a.code || '').localeCompare(String(b.code || ''));
  });
};

const AggregatorCommissionSettingsModal = ({
  isOpen,
  onClose,
  settings,
  isLoading,
  onSave,
  isSaving,
  title = 'Aggregator Commission Settings',
  subtitle = 'Configure percentage split from contract charges/commissions for uplines.',
  saveLabel = 'Save Settings',
  ownerType,
}) => {
  const [rules, setRules] = useState([]);
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState('');
  const [activeOwnerTab, setActiveOwnerTab] = useState(ownerType || 'aggregator');

  const levelMode = useMemo(() => isLevelShape(settings), [settings]);

  useEffect(() => {
    setActiveOwnerTab(ownerType || 'aggregator');
  }, [ownerType, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setRules([]);
      setLevels([]);
      setError('');
      return;
    }

    if (levelMode) {
      setLevels(normalizeLevels(settings));
      setRules([]);
    } else {
      setRules(normalizeFlatRules(settings));
      setLevels([]);
    }
    setError('');
  }, [isOpen, settings, levelMode]);

  const sortedRules = useMemo(() => {
    return [...rules].sort((a, b) => {
      if ((a.sourceType || '') === (b.sourceType || '')) {
        return String(a.code || '').localeCompare(String(b.code || ''));
      }
      return String(a.sourceType || '').localeCompare(String(b.sourceType || ''));
    });
  }, [rules]);

  const ownerTabs = useMemo(() => {
    if (ownerType) {
      return [ownerType];
    }
    const discovered = Array.from(new Set((levels || []).map((level) => level.ownerType))).filter(Boolean);
    return discovered.length > 0 ? discovered : ['aggregator', 'aggregator_manager'];
  }, [levels, ownerType]);

  const matrixRows = useMemo(() => buildOwnerMatrix(levels, activeOwnerTab), [levels, activeOwnerTab]);

  const showEmptyState = levelMode ? matrixRows.length === 0 : sortedRules.length === 0;

  if (!isOpen) return null;

  const updateRule = (key, field, value) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (`${rule.code}:${rule.sourceType}` !== key) return rule;
        return {
          ...rule,
          [field]: value,
        };
      }),
    );
  };

  const updateLevelRule = (ownerTypeValue, transactionLevel, code, sourceType, value) => {
    setLevels((prev) =>
      prev.map((level) => {
        if (level.ownerType !== ownerTypeValue || level.transactionLevel !== transactionLevel) {
          return level;
        }
        return {
          ...level,
          rules: (level.rules || []).map((rule) => {
            if (rule.code !== code || rule.sourceType !== sourceType) {
              return rule;
            }
            return {
              ...rule,
              percent: value,
            };
          }),
        };
      }),
    );
  };

  const handleSave = () => {
    if (levelMode) {
      const normalizedLevels = (levels || []).map((level) => ({
        ownerType: level.ownerType,
        transactionLevel: level.transactionLevel,
        rules: (level.rules || []).map((rule) => ({
          code: rule.code,
          sourceType: rule.sourceType,
          percent: toNumber(rule.percent),
        })),
      }));

      for (const level of normalizedLevels) {
        for (const rule of level.rules) {
          if (rule.percent < 0 || rule.percent > 100) {
            setError(
              `${OWNER_LABELS[level.ownerType] || level.ownerType} ${level.transactionLevel} percent for ${rule.code} must be between 0 and 100.`,
            );
            return;
          }
        }
      }

      setError('');
      onSave({ levels: normalizedLevels });
      return;
    }

    const isOwnerAggregator = ownerType === 'aggregator';
    const isOwnerAggregatorManager = ownerType === 'aggregator_manager';
    const showAggregatorColumn = !ownerType || isOwnerAggregator;
    const showAggregatorManagerColumn = !ownerType || isOwnerAggregatorManager;

    const normalizedRules = rules.map((rule) => ({
      code: rule.code,
      sourceType: rule.sourceType,
      aggregatorPercent: showAggregatorColumn ? toNumber(rule.aggregatorPercent) : 0,
      aggregatorManagerPercent: showAggregatorManagerColumn ? toNumber(rule.aggregatorManagerPercent) : 0,
    }));

    for (const rule of normalizedRules) {
      if (showAggregatorColumn && (rule.aggregatorPercent < 0 || rule.aggregatorPercent > 100)) {
        setError(`Aggregator % for ${rule.code} must be between 0 and 100.`);
        return;
      }
      if (
        showAggregatorManagerColumn &&
        (rule.aggregatorManagerPercent < 0 || rule.aggregatorManagerPercent > 100)
      ) {
        setError(`Aggregator Manager % for ${rule.code} must be between 0 and 100.`);
        return;
      }
      if (
        showAggregatorColumn &&
        showAggregatorManagerColumn &&
        rule.aggregatorPercent + rule.aggregatorManagerPercent > 100
      ) {
        setError(`Combined % for ${rule.code} (${rule.sourceType}) cannot exceed 100.`);
        return;
      }
    }

    setError('');
    onSave({ rules: normalizedRules });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-7xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-[#E8EBED] px-6 py-4">
          <div>
            <h2 className="text-xl font-urbanist font-bold text-[#1E1E1E]">{title}</h2>
            <p className="text-sm font-general text-[#808C91]">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-[#808C91] hover:text-[#1E1E1E]">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto px-6 py-4">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-[#808C91]">Loading settings...</div>
          ) : showEmptyState ? (
            <div className="py-10 text-center text-sm text-[#808C91]">No contract entries available yet.</div>
          ) : levelMode ? (
            <>
              {ownerTabs.length > 1 ? (
                <div className="mb-4 flex items-center gap-2">
                  {ownerTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveOwnerTab(tab)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeOwnerTab === tab
                          ? 'bg-[#FF5B04] text-white'
                          : 'bg-[#F2F5F7] text-[#505C61] hover:bg-[#E8EBED]'
                      }`}
                    >
                      {OWNER_LABELS[tab] || tab}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="overflow-x-auto rounded-xl border border-[#E8EBED]">
                <table className="min-w-full divide-y divide-[#E8EBED]">
                  <thead className="bg-[#F8FAFB]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Source</th>
                      {LEVELS.map((level) => (
                        <th
                          key={level}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]"
                        >
                          {level}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F4F6] bg-white">
                    {matrixRows.map((row) => (
                      <tr key={`${activeOwnerTab}:${row.code}:${row.sourceType}`}>
                        <td className="px-4 py-3 text-sm font-medium text-[#1E1E1E]">{row.code}</td>
                        <td className="px-4 py-3 text-sm text-[#1E1E1E]">{row.name || row.code}</td>
                        <td className="px-4 py-3 text-sm capitalize text-[#505C61]">{row.sourceType}</td>
                        {LEVELS.map((level) => (
                          <td key={level} className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={row.percents[level] ?? 0}
                              onChange={(e) =>
                                updateLevelRule(activeOwnerTab, level, row.code, row.sourceType, e.target.value)
                              }
                              className="w-24 rounded-lg border border-[#D9D9D9] px-3 py-2 text-sm focus:border-[#FF5B04] focus:outline-none"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E8EBED]">
              <table className="min-w-full divide-y divide-[#E8EBED]">
                <thead className="bg-[#F8FAFB]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Scope</th>
                    {ownerType !== 'aggregator_manager' ? (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Aggregator %</th>
                    ) : null}
                    {ownerType !== 'aggregator' ? (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">Agg. Manager %</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F4F6] bg-white">
                  {sortedRules.map((rule) => {
                    const key = `${rule.code}:${rule.sourceType}`;
                    return (
                      <tr key={key}>
                        <td className="px-4 py-3 text-sm font-medium text-[#1E1E1E]">{rule.code}</td>
                        <td className="px-4 py-3 text-sm text-[#1E1E1E]">{rule.name || rule.code}</td>
                        <td className="px-4 py-3 text-sm capitalize text-[#505C61]">{rule.sourceType}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              rule.source === 'override'
                                ? 'bg-[#E9F9EF] text-[#1B7D3C]'
                                : 'bg-[#F2F5F7] text-[#505C61]'
                            }`}
                          >
                            {rule.source === 'override' ? 'Personal Override' : 'Global'}
                          </span>
                        </td>
                        {ownerType !== 'aggregator_manager' ? (
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={rule.aggregatorPercent}
                              onChange={(e) => updateRule(key, 'aggregatorPercent', e.target.value)}
                              className="w-28 rounded-lg border border-[#D9D9D9] px-3 py-2 text-sm focus:border-[#FF5B04] focus:outline-none"
                            />
                          </td>
                        ) : null}
                        {ownerType !== 'aggregator' ? (
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={rule.aggregatorManagerPercent}
                              onChange={(e) => updateRule(key, 'aggregatorManagerPercent', e.target.value)}
                              className="w-28 rounded-lg border border-[#D9D9D9] px-3 py-2 text-sm focus:border-[#FF5B04] focus:outline-none"
                            />
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {error ? <p className="mt-3 text-sm text-qreva-orange">{error}</p> : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#E8EBED] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#D9D9D9] px-4 py-2 text-sm font-medium text-[#505C61] hover:bg-[#F8FAFB]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="rounded-lg bg-[#FF5B04] px-5 py-2 text-sm font-semibold text-white hover:bg-[#E54F03] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AggregatorCommissionSettingsModal;
