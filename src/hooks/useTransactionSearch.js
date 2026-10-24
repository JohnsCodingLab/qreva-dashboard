import { useState, useMemo } from 'react';

export const useTransactionSearch = (transactions) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    
    const query = searchQuery.toLowerCase();
    return transactions.filter(transaction => 
      transaction.desc.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.type.toLowerCase().includes(query)
    );
  }, [transactions, searchQuery]);

  return { searchQuery, setSearchQuery, filteredTransactions };
};