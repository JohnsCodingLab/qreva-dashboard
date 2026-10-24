import { useState, useMemo, useEffect, useRef } from 'react';
import DashboardStats from '@/components/base/DashboardStats';
import PageHeader from '@/components/common/PageHeader';
import RequestTabs from '@/components/request/RequestTabs';
import RequestsSearch from '@/components/request/RequestSearch';
import RequestsGrid from '@/components/request/RequestGrid';
import RequestDetailsModal from '@/components/request/RequestDetailsModal';
import { useRequestModals } from '@/hooks/useRequestModals';
import { useRequests, useRequestMetrics } from '@/store/features/requests/useRequests';
import { requestTabs } from './constants';

export default function Request() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const searchDebounceRef = useRef(null);

  const statusMap = { pending: 'Pending', accepted: 'Approved', declined: 'Rejected' };

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery]);

  const { data: requestsResponse, isLoading } = useRequests({
    status: statusMap[activeTab],
    search: debouncedSearch || undefined,
    type: typeFilter || undefined,
    from: fromFilter || undefined,
    to: toFilter || undefined,
    page: 1,
    limit: 50,
  });

  const { data: metricsResponse } = useRequestMetrics();

  const requests = requestsResponse?.data || [];
  const pendingCount = metricsResponse?.data?.pendingRequests || 0;

  const stats = useMemo(() => {
    if (!metricsResponse?.data) return [];
    const m = metricsResponse.data;
    return [
      { label: 'Total Requests', value: m.totalRequests?.toLocaleString() || '0', change: '+0%', subtext: 'in last 24 hours' },
      { label: 'Pending Requests', value: m.pendingRequests?.toLocaleString() || '0', change: '+0%', subtext: 'in last 24 hours' },
      { label: 'Approved Requests', value: m.approvedRequests?.toLocaleString() || '0', change: '+0%', subtext: 'in last 24 hours' },
      { label: 'Rejected Requests', value: m.rejectedRequests?.toLocaleString() || '0', change: '+0%', subtext: 'in last 24 hours' },
    ];
  }, [metricsResponse]);

  const {
    showDetailsModal,
    selectedRequest,
    openDetailsModal,
    closeDetailsModal
  } = useRequestModals();

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6 pb-16 min-h-full">
        <PageHeader
          title="Requests"
          subtitle="View all your earnings and withdraw earnings here"
          hidden={true}
        />

        <DashboardStats stats={stats} />

        <RequestTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={requestTabs}
          pendingCount={pendingCount}
        />

        <RequestsSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilter={({ type, from, to }) => {
            setTypeFilter(type);
            setFromFilter(from);
            setToFilter(to);
          }}
        />

        <RequestsGrid
          requests={requests}
          onViewDetails={openDetailsModal}
          loading={isLoading}
        />
      </div>

      <RequestDetailsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        request={selectedRequest}
      />
    </div>
  );
}
