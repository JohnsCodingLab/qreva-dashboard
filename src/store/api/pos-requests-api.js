import { apiClient } from './client';

/**
 * POS terminal requests.
 *
 * Approving is what assigns the hardware — a merchant asking for a terminal
 * no longer takes one from the pool, so a paid request sits at
 * AwaitingApproval until someone here clears it.
 *
 * Declining does not return the money. That is a separate call, deliberately,
 * so a misclick cannot move funds. A declined request is not finished until
 * it has also been refunded.
 */
export const posRequestsApi = {
  getRequests: async (params = {}) => {
    const { data } = await apiClient.get('/admin/pos-requests', { params });
    return data;
  },

  getMetrics: async (params = {}) => {
    const { data } = await apiClient.get('/admin/pos-requests/metrics', { params });
    return data;
  },

  getRequest: async (id) => {
    const { data } = await apiClient.get(`/admin/pos-requests/${id}`);
    return data;
  },

  approveRequest: async ({ id, notes }) => {
    const { data } = await apiClient.post(`/admin/pos-requests/${id}/approve`, {
      reason: notes,
    });
    return data;
  },

  declineRequest: async ({ id, reason }) => {
    const { data } = await apiClient.post(`/admin/pos-requests/${id}/decline`, {
      reason,
    });
    return data;
  },

  refundRequest: async ({ id, reason }) => {
    const { data } = await apiClient.post(`/admin/pos-requests/${id}/refund`, {
      reason,
    });
    return data;
  },
};
