import { apiClient } from './client';

export const transactionsApi = {
  listTransactions: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/transactions/all', { params });
    return data;
  },

  listTerminals: async () => {
    const { data } = await apiClient.get('/admin/dashboard/transactions/terminals');
    return data;
  },
};
