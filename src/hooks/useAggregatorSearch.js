import { useState, useMemo } from 'react';

export const useAggregatorSearch = (aggregators) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAggregators = useMemo(() => {
    if (!searchQuery) return aggregators;
    
    const query = searchQuery.toLowerCase();
    return aggregators.filter(aggregator => 
      aggregator.name.toLowerCase().includes(query) ||
      aggregator.email.toLowerCase().includes(query)
    );
  }, [aggregators, searchQuery]);

  return { searchQuery, setSearchQuery, filteredAggregators };
};