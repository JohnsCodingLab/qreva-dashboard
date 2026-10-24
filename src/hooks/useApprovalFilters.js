import { useState, useMemo } from 'react';

export const useApprovalFilters = (approvals) => {
  const [activeTab, setActiveTab] = useState('Pending');

  const filteredApprovals = useMemo(() => {
    return approvals.filter(approval => approval.status === activeTab);
  }, [approvals, activeTab]);

  const tabCounts = useMemo(() => {
    return {
      Pending: approvals.filter(a => a.status === 'Pending').length,
      Approved: approvals.filter(a => a.status === 'Approved').length,
      Declined: approvals.filter(a => a.status === 'Declined').length
    };
  }, [approvals]);

  return {
    activeTab,
    setActiveTab,
    filteredApprovals,
    tabCounts
  };
};