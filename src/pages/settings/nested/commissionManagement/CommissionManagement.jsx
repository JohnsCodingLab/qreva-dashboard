import { useMemo, useState } from 'react';
import AggregatorCommissionSettingsModal from '@/components/modals/AggregatorCommissionSettingsModal';
import {
  useAggregatorCommissionSettings,
  useUpdateAggregatorCommissionSettings,
} from '@/store/features/contracts/useContracts';

const LEVELS = ['STARTER', 'BRONZE', 'SILVER', 'GOLD'];
const OWNER_TABS = [
  { key: 'aggregator', label: 'Aggregator' },
  { key: 'aggregator_manager', label: 'Aggregator Manager' },
];

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

      rowMap.get(key).percents[level.transactionLevel] = Number(rule.percent || 0);
    });
  });

  return Array.from(rowMap.values()).sort((a, b) => {
    if ((a.sourceType || '') !== (b.sourceType || '')) {
      return String(a.sourceType || '').localeCompare(String(b.sourceType || ''));
    }
    return String(a.code || '').localeCompare(String(b.code || ''));
  });
};

const CommissionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOwnerTab, setActiveOwnerTab] = useState('aggregator');
  const { data: settingsResponse, isLoading, refetch } = useAggregatorCommissionSettings();
  const updateSettings = useUpdateAggregatorCommissionSettings();

  const levels = useMemo(() => settingsResponse?.data?.levels || [], [settingsResponse]);
  const rows = useMemo(() => buildOwnerMatrix(levels, activeOwnerTab), [levels, activeOwnerTab]);

  return (
    <div className="mx-auto max-w-[1600px] p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Commission Management</h1>
          <p className="mt-1 text-[#808C91]">
            Configure global commission share for Aggregator and Aggregator Manager across all services.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-12 rounded-lg bg-[#FF5B04] px-8 text-sm font-semibold text-white hover:bg-[#E54F03]"
        >
          Update Global Settings
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E8EBED] bg-white">
        <div className="border-b border-[#E8EBED] px-5 py-4">
          <h2 className="text-lg font-semibold text-[#1E1E1E]">Global Rules</h2>
        </div>

        <div className="border-b border-[#E8EBED] px-5 py-4">
          <div className="flex items-center gap-2">
            {OWNER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveOwnerTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeOwnerTab === tab.key
                    ? 'bg-[#FF5B04] text-white'
                    : 'bg-[#F2F5F7] text-[#505C61] hover:bg-[#E8EBED]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          {isLoading ? (
            <div className="px-5 py-8 text-sm text-[#808C91]">Loading commission rules...</div>
          ) : rows.length === 0 ? (
            <div className="px-5 py-8 text-sm text-[#808C91]">No contract-based commission rules found.</div>
          ) : (
            <table className="min-w-full divide-y divide-[#E8EBED]">
              <thead className="bg-[#F8FAFB]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#808C91]">
                    Source
                  </th>
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
                {rows.map((row) => (
                  <tr key={`${activeOwnerTab}:${row.code}:${row.sourceType}`}>
                    <td className="px-4 py-3 text-sm font-medium text-[#1E1E1E]">{row.code}</td>
                    <td className="px-4 py-3 text-sm text-[#1E1E1E]">{row.name || row.code}</td>
                    <td className="px-4 py-3 text-sm capitalize text-[#505C61]">{row.sourceType}</td>
                    {LEVELS.map((level) => (
                      <td key={level} className="px-4 py-3 text-sm text-[#1E1E1E]">
                        {Number(row.percents[level] || 0)}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AggregatorCommissionSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        settings={levels}
        isLoading={isLoading}
        isSaving={updateSettings.isPending}
        title="Global Aggregator Commission Settings"
        subtitle="Update aggregator and aggregator manager commission for each service and transaction level in one place."
        onSave={(payload) => {
          updateSettings.mutate(payload, {
            onSuccess: () => {
              setIsModalOpen(false);
              refetch();
            },
          });
        }}
      />
    </div>
  );
};

export default CommissionManagement;

