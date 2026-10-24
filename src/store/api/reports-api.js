import { apiClient } from './client';

export const reportsApi = {
  getFinancialReport: async (params = {}) => {
    const { data } = await apiClient.get('/admin/reports/financial', { params });
    return data;
  },
};
