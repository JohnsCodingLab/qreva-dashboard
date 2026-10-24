import { apiClient } from './client';

export const approvalsApi = {
  // ── Account Approvals ──────────────────────────────────────────────
  listAccountApprovals: async (params = {}) => {
    const { data } = await apiClient.get('/admin/approvals/accounts', { params });
    return data;
  },

  getAccountApprovalDetails: async (userId) => {
    const { data } = await apiClient.get(`/admin/approvals/accounts/${userId}`);
    return data;
  },

  approveAccount: async (userId) => {
    const { data } = await apiClient.post(`/admin/approvals/accounts/${userId}/approve`);
    if (data?.statusCode && (data.statusCode < 200 || data.statusCode >= 300)) {
      const err = new Error(data?.message || 'Failed to approve account');
      err.response = { data };
      throw err;
    }
    return data;
  },

  declineAccount: async ({ userId, reason }) => {
    const { data } = await apiClient.post(`/admin/approvals/accounts/${userId}/decline`, { reason });
    if (data?.statusCode && (data.statusCode < 200 || data.statusCode >= 300)) {
      const err = new Error(data?.message || 'Failed to decline account');
      err.response = { data };
      throw err;
    }
    return data;
  },

  // ── Business Account Approvals (Tier 4) ──────────────────────────────
  listBusinessAccountApprovals: async (params = {}) => {
    const { data } = await apiClient.get('/admin/approvals/business-accounts', { params });
    return data;
  },

  getBusinessAccountApprovalDetails: async (userId) => {
    const { data } = await apiClient.get(`/admin/approvals/business-accounts/${userId}`);
    return data;
  },

  approveBusinessAccount: async (userId) => {
    const { data } = await apiClient.post(`/admin/approvals/business-accounts/${userId}/approve`);
    if (data?.statusCode && (data.statusCode < 200 || data.statusCode >= 300)) {
      const err = new Error(data?.message || 'Failed to approve Business Account');
      err.response = { data };
      throw err;
    }
    return data;
  },

  declineBusinessAccount: async ({ userId, reason }) => {
    const { data } = await apiClient.post(`/admin/approvals/business-accounts/${userId}/decline`, { reason });
    if (data?.statusCode && (data.statusCode < 200 || data.statusCode >= 300)) {
      const err = new Error(data?.message || 'Failed to decline Business Account');
      err.response = { data };
      throw err;
    }
    return data;
  },

  // ── Disputed Transactions ──────────────────────────────────────────
  listDisputes: async (params = {}) => {
    const { data } = await apiClient.get('/admin/approvals/disputes', { params });
    return data;
  },

  getDisputeDetails: async (id) => {
    const { data } = await apiClient.get(`/admin/approvals/disputes/${id}`);
    return data;
  },

  refundDispute: async (id) => {
    const { data } = await apiClient.post(`/admin/approvals/disputes/${id}/refund`);
    return data;
  },

  declineDispute: async ({ id, reason }) => {
    const { data } = await apiClient.post(`/admin/approvals/disputes/${id}/decline`, { reason });
    return data;
  },
};
