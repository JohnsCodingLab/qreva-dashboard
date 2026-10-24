import { apiClient } from './client';

export const contractsApi = {
  listContracts: async (params) => {
    const { data } = await apiClient.get('/admin/contracts', { params });
    return data;
  },

  createContract: async (contractData) => {
    const { data } = await apiClient.post('/admin/contracts', contractData);
    return data;
  },

  patchAllContracts: async (updates) => {
    const { data } = await apiClient.patch('/admin/contracts', updates);
    return data;
  },

  getContract: async (contractId) => {
    const { data } = await apiClient.get(`/admin/contracts/${contractId}`);
    return data;
  },

  patchContract: async ({ contractId, updates }) => {
    const { data } = await apiClient.patch(`/admin/contracts/${contractId}`, updates);
    return data;
  },

  getAggregatorCommissionSettings: async () => {
    const { data } = await apiClient.get('/admin/contracts/aggregator-commissions/settings');
    return data;
  },

  updateAggregatorCommissionSettings: async (payload) => {
    const { data } = await apiClient.patch('/admin/contracts/aggregator-commissions/settings', payload);
    return data;
  },

  getAggregatorCommissionSettingsForUser: async (ownerUserId) => {
    const { data } = await apiClient.get(`/admin/contracts/aggregator-commissions/users/${ownerUserId}`);
    return data;
  },

  updateAggregatorCommissionSettingsForUser: async ({ ownerUserId, payload }) => {
    const { data } = await apiClient.patch(`/admin/contracts/aggregator-commissions/users/${ownerUserId}`, payload);
    return data;
  },
};
