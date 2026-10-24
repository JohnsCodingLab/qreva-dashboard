import { apiClient } from './client';

export const authApi = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/admin/auth/login', credentials);
    return data;
  },

  changePassword: async (passwordData) => {
    const { data } = await apiClient.patch('/admin/auth/change-password', passwordData);
    return data;
  },

  forgotPassword: async (payload) => {
    const { data } = await apiClient.post('/admin/auth/forgot-password', payload);
    return data;
  },

  resetPassword: async (payload) => {
    const { data } = await apiClient.post('/admin/auth/reset-password', payload);
    return data;
  },

  sendOtp: async () => {
    const { data } = await apiClient.post('/admin/auth/send-otp');
    return data;
  },

  verifyOtp: async (otpData) => {
    const { data } = await apiClient.post('/admin/auth/verify-otp', otpData);
    return data;
  },

  changePin: async (pinData) => {
    const { data } = await apiClient.patch('/admin/auth/change-pin', pinData);
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post('/admin/auth/logout');
    return data;
  },

  // Brute-force lockout escalation (login-lockout.util.ts on the backend):
  // confirms the ownership OTP a login attempt returns once too many wrong
  // passwords have been entered, for either an admin or a portal
  // (aggregator/aggregator_manager) account - the same endpoint handles
  // both, resolving account type from the OTP record itself.
  verifyLoginOwnership: async (payload) => {
    const { data } = await apiClient.post('/admin/auth/login/lockout/verify-ownership', payload);
    return data;
  },

  resendLoginOwnership: async (payload) => {
    const { data } = await apiClient.post('/admin/auth/login/lockout/verify-ownership/resend', payload);
    return data;
  },
};