import { apiClient } from './client';

// Admin management/monitoring surface for the fraud-detection service,
// proxied through the NestJS backend at /admin/fraud/* (see
// backend/src/admin/admin-fraud.controller.ts). The dashboard never talks
// to the Python fraud service directly.
export const fraudApi = {
  // ── Rule configs ─────────────────────────────────────────────────────
  listRules: async () => {
    const { data } = await apiClient.get('/admin/fraud/rules');
    return data;
  },

  createRule: async (payload) => {
    const { data } = await apiClient.post('/admin/fraud/rules', payload);
    return data;
  },

  updateRule: async ({ ruleId, ...payload }) => {
    const { data } = await apiClient.patch(`/admin/fraud/rules/${ruleId}`, payload);
    return data;
  },

  deactivateRule: async (ruleId) => {
    const { data } = await apiClient.delete(`/admin/fraud/rules/${ruleId}`);
    return data;
  },

  // ── Score bands ──────────────────────────────────────────────────────
  listScoreBands: async () => {
    const { data } = await apiClient.get('/admin/fraud/score-bands');
    return data;
  },

  createScoreBand: async (payload) => {
    const { data } = await apiClient.post('/admin/fraud/score-bands', payload);
    return data;
  },

  // ── Decision audit trail / review queue ─────────────────────────────
  listAuditLog: async (params = {}) => {
    const { data } = await apiClient.get('/admin/fraud/audit-log', { params });
    return data;
  },

  listReviewQueue: async (params = {}) => {
    const { data } = await apiClient.get('/admin/fraud/review-queue', { params });
    return data;
  },

  labelAuditLog: async ({ auditLogId, outcomeLabel }) => {
    const { data } = await apiClient.patch(`/admin/fraud/audit-log/${auditLogId}/label`, {
      outcomeLabel,
    });
    return data;
  },

  // ── Blacklist ────────────────────────────────────────────────────────
  listBlacklist: async (params = {}) => {
    const { data } = await apiClient.get('/admin/fraud/blacklist', { params });
    return data;
  },

  createBlacklistEntry: async (payload) => {
    const { data } = await apiClient.post('/admin/fraud/blacklist', payload);
    return data;
  },

  updateBlacklistEntry: async ({ entryId, ...payload }) => {
    const { data } = await apiClient.patch(`/admin/fraud/blacklist/${entryId}`, payload);
    return data;
  },

  deactivateBlacklistEntry: async (entryId) => {
    const { data } = await apiClient.delete(`/admin/fraud/blacklist/${entryId}`);
    return data;
  },

  // ── Fraud ring clusters ─────────────────────────────────────────────
  listFraudRings: async (params = {}) => {
    const { data } = await apiClient.get('/admin/fraud/fraud-rings', { params });
    return data;
  },

  reviewFraudRing: async ({ clusterId, ...payload }) => {
    const { data } = await apiClient.patch(`/admin/fraud/fraud-rings/${clusterId}/review`, payload);
    return data;
  },
};
