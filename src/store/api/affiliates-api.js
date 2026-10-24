import { apiClient } from './client';

export const affiliatesApi = {
  listAffiliates: async (params) => {
    const { data } = await apiClient.get('/admin/affiliates', { params });
    return data;
  },

  createAffiliate: async (payload) => {
    const { data } = await apiClient.post('/admin/affiliates', payload);
    return data;
  },

  getAffiliate: async (affiliateId) => {
    const { data } = await apiClient.get(`/admin/affiliates/${affiliateId}`);
    return data;
  },

  listReferrals: async ({ affiliateId, page = 1, limit = 20 }) => {
    const { data } = await apiClient.get(
      `/admin/affiliates/${affiliateId}/referrals`,
      { params: { page, limit } },
    );
    return data;
  },

  blockAffiliate: async ({ affiliateId, reason }) => {
    const { data } = await apiClient.post(
      `/admin/affiliates/${affiliateId}/block`,
      { reason },
    );
    return data;
  },

  unblockAffiliate: async (affiliateId) => {
    const { data } = await apiClient.post(
      `/admin/affiliates/${affiliateId}/unblock`,
    );
    return data;
  },
};
