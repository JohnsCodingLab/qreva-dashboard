import { apiClient } from './client';

// Admin review surface for VerificationAttempt records - every facial
// verification attempt (registration, login step-up, and the
// transaction-verification preview), each with its 3 saved captures, for
// an admin to review if something looks wrong. Proxied through the NestJS
// backend at /admin/verification-attempts/* (see
// backend/src/verification-attempts/admin-verification-attempts.controller.ts).
export const verificationApi = {
  listAttempts: async (params = {}) => {
    const { data } = await apiClient.get('/admin/verification-attempts', { params });
    return data;
  },

  getAttempt: async (id) => {
    const { data } = await apiClient.get(`/admin/verification-attempts/${id}`);
    return data;
  },
};
