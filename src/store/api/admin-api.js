import { apiClient } from './client';

export const adminApi = {
  listAdmins: async (params) => {
    const { data } = await apiClient.get('/admin/users', { params });
    return data;
  },

  inviteAdmin: async (inviteData) => {
    const { data } = await apiClient.post('/admin/users/invite', inviteData);
    return data;
  },

  updateAdminStatus: async ({ adminId, status }) => {
    const { data } = await apiClient.patch(`/admin/users/${adminId}/status`, { status });
    return data;
  },

  resendAdminInvite: async (adminId) => {
    const { data } = await apiClient.post(`/admin/users/${adminId}/resend-invite`);
    return data;
  },
};
