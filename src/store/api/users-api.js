import { apiClient } from './client';

export const usersApi = {
  getUsers: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/users/all', { params });
    return data;
  },

  getUserMetrics: async (params = {}) => {
    const { data } = await apiClient.get('/admin/dashboard/users', { params });
    return data;
  },

  getUserById: async (userId, userType = 'users') => {
    const { data } = await apiClient.get(`/admin/dashboard/${userType}/${userId}`);
    return data;
  },

  getUserTransactions: async (userId, userType = 'users', params = {}) => {
    const { data } = await apiClient.get(`/admin/dashboard/${userType}/${userId}/transactions`, { params });
    return data;
  },

  suspendUser: async (userId) => {
    const { data } = await apiClient.patch(`/admin/dashboard/users/${userId}/suspend`);
    return data;
  },

  activateUser: async (userId) => {
    const { data } = await apiClient.patch(`/admin/dashboard/users/${userId}/activate`);
    return data;
  },

  retryUserAccountCreation: async (userId, userType = 'users') => {
    const { data } = await apiClient.patch(`/admin/dashboard/${userType}/${userId}/retry-account-creation`);
    return data;
  },

  debitUserAccount: async (userId, userType = 'users', payload) => {
    const { data } = await apiClient.post(`/admin/dashboard/${userType}/${userId}/debit`, payload);
    return data;
  },

  updateUserProfile: async (userId, userType = 'users', payload) => {
    const { data } = await apiClient.patch(`/admin/dashboard/${userType}/${userId}/profile`, payload);
    return data;
  },

  updateUserTransactionLevel: async (userId, payload) => {
    const { data } = await apiClient.patch(`/admin/dashboard/users/${userId}/transaction-level`, payload);
    return data;
  },

  inviteAggregator: async (payload) => {
    const { data } = await apiClient.post('/admin/aggregators/invite', payload);
    return data;
  },

  resolveAggregatorInvitee: async ({ email, inviteType }) => {
    const { data } = await apiClient.get('/admin/aggregators/invitee', {
      params: { email, inviteType },
    });
    return data;
  },

  getAggregatorReferralLink: async () => {
    const { data } = await apiClient.get('/admin/aggregators/referral-link');
    return data;
  },

  getAggregatorNetwork: async (ownerUserId, params = {}) => {
    const { data } = await apiClient.get(`/admin/aggregators/${ownerUserId}/network`, { params });
    return data;
  },

  resolveAggregatorNetworkCandidate: async (ownerUserId, email) => {
    const { data } = await apiClient.get(`/admin/aggregators/${ownerUserId}/network/resolve`, {
      params: { email },
    });
    return data;
  },

  assignAggregatorNetworkMember: async (ownerUserId, payload) => {
    const { data } = await apiClient.post(`/admin/aggregators/${ownerUserId}/network`, payload);
    return data;
  },

  removeAggregatorNetworkMember: async (ownerUserId, memberUserId) => {
    const { data } = await apiClient.delete(`/admin/aggregators/${ownerUserId}/network/${memberUserId}`);
    return data;
  },
};
