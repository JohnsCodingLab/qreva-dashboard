import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../../api/transactions-api';

/**
 * Hook to fetch all transactions with filters, search and pagination
 */
export const useTransactions = (params = {}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const response = await transactionsApi.listTransactions(params);
      
      const rawData = response?.data || [];
      const pagination = response?.pagination || {};
      
      const formattedData = (Array.isArray(rawData) ? rawData : []).map(item => {
        const dateObj = item.createdAt ? new Date(item.createdAt) : null;
        const formattedDate = dateObj 
          ? dateObj.toLocaleString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            }) + ' | ' + dateObj.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          : item.date || 'N/A';

        return {
          ...item,
          id: item.id || item._id, // Ensure id exists for DataGrid
          title: item.title || item.narration || item.typeCategory || item.type || 'Transaction',
          acc: item.acc || item.senderPhone || item.accountNumber || '',
          sessionId: item.sessionId || item.transactionId || null,
          reference: item.reference || item.externalReferenceId || null,
          accountType: item.accountTypeBadge || item.accountType || item.userType || null,
          category: item.category || item.typeCategory || item.type || 'N/A',
          typeLabel: item.typeCategory || item.type || 'N/A',
          type: item.type || item.typeCategory || 'N/A',
          status: item.status || 'Pending',
          amount: item.amount || 0,
          qreva_fee: item.qreva_fee ?? item.commission ?? null,
          date: formattedDate,
          // Fallbacks for display
          desc: item.desc || `${item.typeCategory || item.type} Transaction`,
        };
      });

      return {
        data: formattedData,
        pagination
      };
    },
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Terminal IDs that actually appear in transactions the current admin can see,
 * for the SoftPOS terminal filter. Cached longer than the tables themselves -
 * the set of terminals changes far more slowly than the transactions on them.
 */
export const useTransactionTerminals = (options = {}) => {
  return useQuery({
    queryKey: ['transaction-terminals'],
    queryFn: async () => {
      const response = await transactionsApi.listTerminals();
      return Array.isArray(response?.data) ? response.data : [];
    },
    staleTime: 15 * 60 * 1000,
    enabled: options.enabled ?? true,
  });
};
