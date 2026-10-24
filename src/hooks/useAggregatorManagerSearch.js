import { useState, useMemo } from 'react';

export const useAggregatorManagerSearch = (managers) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredManagers = useMemo(() => {
    if (!searchQuery) return managers;
    
    const query = searchQuery.toLowerCase();
    return managers.filter(manager => 
      manager.name.toLowerCase().includes(query) ||
      manager.email.toLowerCase().includes(query)
    );
  }, [managers, searchQuery]);

  return { searchQuery, setSearchQuery, filteredManagers };
};