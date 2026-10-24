import { apiClient } from './client';

export const categoryApi = {
  getMetrics: async (category, params = {}) => {
    const { data } = await apiClient.get(`/admin/dashboard/${category}/metrics`, { params });
    return data;
  },

  getKycBreakdown: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/kyc/breakdown', { params });
    return data;
  },

  getSoftposBreakdown: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/softpos/breakdown', { params });
    return data;
  },

  getTransfersBreakdown: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/transfers/breakdown', { params });
    return data;
  },
};
