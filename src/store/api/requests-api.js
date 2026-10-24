import { apiClient } from './client';

export const requestsApi = {
  getRequests: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/requests', { params });
    return data;
  },

  getMetrics: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/requests/metrics', { params });
    return data;
  },

  approveRequest: async (id) => {
    const { data } = await apiClient.patch(`/admin/dashboard/requests/${id}/approve`);
    return data;
  },

  rejectRequest: async (id, reason) => {
    const { data } = await apiClient.patch(`/admin/dashboard/requests/${id}/reject`, { reason });
    return data;
  },
};
