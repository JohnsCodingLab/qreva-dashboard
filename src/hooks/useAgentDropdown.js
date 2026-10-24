import { useState, useEffect } from 'react';

export const useAgentDropdown = () => {
  const [agentDropdown, setAgentDropdown] = useState({ 
    open: false, 
    row: null, 
    x: 0, 
    y: 0 
  });

  useEffect(() => {
    const handleClickOutside = () => {
      setAgentDropdown({ open: false, row: null, x: 0, y: 0 });
    };
    
    if (agentDropdown.open) {
      window.addEventListener('click', handleClickOutside);
    }
    
    return () => window.removeEventListener('click', handleClickOutside);
  }, [agentDropdown.open]);

  const openDropdown = (row, x, y) => {
    setAgentDropdown({ open: true, row, x, y });
  };

  const closeDropdown = () => {
    setAgentDropdown({ open: false, row: null, x: 0, y: 0 });
  };

  return { agentDropdown, openDropdown, closeDropdown };
};