import { useState, useMemo } from 'react';

export const useRequestFilters = (requests) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesTab = request.status === activeTab;
      const matchesSearch = searchQuery
        ? request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.sentBy.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  const pendingCount = useMemo(
    () => requests.filter(r => r.status === 'pending').length,
    [requests]
  );

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredRequests,
    pendingCount
  };
};