import { apiClient } from './client';

export const earningsApi = {
  getEarnings: async () => {
    const { data } = await apiClient.get('/admin/dashboard/earnings');
    return data;
  },

  getWithdrawals: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/withdrawals', { params });
    return data;
  },

  createWithdrawal: async (withdrawalData) => {
    const { data } = await apiClient.post('/admin/dashboard/withdrawals', withdrawalData);
    return data;
  },

  getBeneficiaries: async () => {
    const { data } = await apiClient.get('/admin/dashboard/beneficiaries');
    return data;
  },

  createBeneficiary: async (beneficiaryData) => {
    const { data } = await apiClient.post('/admin/dashboard/beneficiaries', beneficiaryData);
    return data;
  },

  deleteBeneficiary: async (id) => {
    const { data } = await apiClient.delete(`/admin/dashboard/beneficiaries/${id}`);
    return data;
  },

  getBanks: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/banks', { params });
    return data;
  },

  resolveAccount: async (accountData) => {
    const { data } = await apiClient.post('/admin/dashboard/banks/resolve', accountData);
    return data;
  },
};
