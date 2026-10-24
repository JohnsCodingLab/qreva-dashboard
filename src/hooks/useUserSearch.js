import { useState, useMemo } from 'react';

export const useUserSearch = (users) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.accountType.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return { searchQuery, setSearchQuery, filteredUsers };
};