import { apiClient } from './client';

export const dashboardApi = {
  getMetrics: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/metrics', { params });
    return data;
  },

  getBalancesSummary: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/balances/summary', { params });
    return data;
  },
};
