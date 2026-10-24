import { useState, useMemo } from 'react';

export const useAgentSearch = (agents) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents;
    
    const query = searchQuery.toLowerCase();
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  return { searchQuery, setSearchQuery, filteredAgents };
};