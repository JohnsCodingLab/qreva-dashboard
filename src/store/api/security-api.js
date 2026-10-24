import { apiClient } from './client';

// Admin "Login Sessions" monitoring surface - every successful sign-in,
// customer app and admin/console both, with the user, location and device
// details captured at sign-in time. Proxied through the NestJS backend at
// /admin/security/* (see backend/src/admin/admin-security.controller.ts).
export const securityApi = {
  listLoginSessions: async (params = {}) => {
    const { data } = await apiClient.get('/admin/security/login-sessions', { params });
    return data;
  },
};

// Opt-in TOTP two-factor authentication for the logged-in admin's own
// account. Setup flow: beginSetup → get QR code → verifySetup with a live
// code to activate. Disable clears the secret immediately.
export const twoFactorApi = {
  getStatus: async () => {
    const { data } = await apiClient.get('/admin/2fa/status');
    return data;
  },
  beginSetup: async () => {
    const { data } = await apiClient.post('/admin/2fa/setup');
    return data;
  },
  verifySetup: async (code) => {
    const { data } = await apiClient.post('/admin/2fa/setup/verify', { code });
    return data;
  },
  disable: async () => {
    const { data } = await apiClient.post('/admin/2fa/disable');
    return data;
  },
};
