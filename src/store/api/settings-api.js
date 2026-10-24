import { apiClient } from './client';

const throwIfApiError = (data) => {
  if (data?.statusCode >= 400) {
    const error = new Error(data.message || 'An error occurred');
    error.response = { data, status: data.statusCode };
    throw error;
  }

  return data;
};

export const settingsApi = {
  // ── Agency Categories ──────────────────────────────────────────────
  listAgencyCategories: async (params = {}) => {
    const { data } = await apiClient.get('/admin/settings/agency-categories', { params });
    return data;
  },

  getAgencyCategory: async (agencyCategoryId) => {
    const { data } = await apiClient.get(`/admin/settings/agency-categories/${agencyCategoryId}`);
    return data;
  },

  createAgencyCategory: async (categoryData) => {
    const { data } = await apiClient.post('/admin/settings/agency-categories', categoryData);
    return data;
  },

  updateAgencyCategory: async ({ agencyCategoryId, ...categoryData }) => {
    const { data } = await apiClient.patch(`/admin/settings/agency-categories/${agencyCategoryId}`, categoryData);
    return data;
  },

  // ── KYC Tiers ──────────────────────────────────────────────────────
  listTiers: async (params = {}) => {
    const { data } = await apiClient.get('/admin/settings/tiers', { params });
    return data;
  },

  getTier: async (tierId) => {
    const { data } = await apiClient.get(`/admin/settings/tiers/${tierId}`);
    return data;
  },

  createTier: async (tierData) => {
    const { data } = await apiClient.post('/admin/settings/tiers', tierData);
    return throwIfApiError(data);
  },

  updateTier: async ({ tierId, ...tierData }) => {
    const { data } = await apiClient.patch(`/admin/settings/tiers/${tierId}`, tierData);
    return data;
  },

  deleteTier: async (tierId) => {
    const { data } = await apiClient.delete(`/admin/settings/tiers/${tierId}`);
    return data;
  },

  // ── RBAC Roles & Permissions ───────────────────────────────────────
  listRoles: async (params = {}) => {
    const { data } = await apiClient.get('/admin/settings/rbac/roles', { params });
    return data;
  },

  getRole: async (rolePermissionId) => {
    const { data } = await apiClient.get(`/admin/settings/rbac/roles/${rolePermissionId}`);
    return data;
  },

  listPermissionGroups: async () => {
    const { data } = await apiClient.get('/admin/settings/rbac/permission-groups');
    return data;
  },

  createRole: async (roleData) => {
    const { data } = await apiClient.post('/admin/settings/rbac/roles', roleData);
    return data;
  },

  updateRole: async ({ rolePermissionId, ...roleData }) => {
    const { data } = await apiClient.patch(`/admin/settings/rbac/roles/${rolePermissionId}`, roleData);
    return data;
  },

  assignRole: async ({ userId, roleId }) => {
    const { data } = await apiClient.patch(`/admin/settings/rbac/users/${userId}/assign-role`, { roleId });
    return data;
  },

  deleteRole: async (rolePermissionId) => {
    const { data } = await apiClient.delete(`/admin/settings/rbac/roles/${rolePermissionId}`);
    return data;
  },

  // ── Commission Rules ───────────────────────────────────────────────
  listCommissions: async (params = {}) => {
    const { data } = await apiClient.get('/admin/settings/commissions', { params });
    return data;
  },

  getCommission: async (commissionRuleId) => {
    const { data } = await apiClient.get(`/admin/settings/commissions/${commissionRuleId}`);
    return data;
  },

  createCommission: async (commissionData) => {
    const { data } = await apiClient.post('/admin/settings/commissions', commissionData);
    return data;
  },

  updateCommission: async ({ commissionRuleId, ...commissionData }) => {
    const { data } = await apiClient.patch(`/admin/settings/commissions/${commissionRuleId}`, commissionData);
    return data;
  },

  duplicateCommission: async (commissionRuleId) => {
    const { data } = await apiClient.post(`/admin/settings/commissions/${commissionRuleId}/duplicate`);
    return data;
  },

  deleteCommission: async (commissionRuleId) => {
    const { data } = await apiClient.delete(`/admin/settings/commissions/${commissionRuleId}`);
    return data;
  },

  // ── Activity Logs ──────────────────────────────────────────────────
  listActivityLogs: async (params = {}) => {
    const { data } = await apiClient.get('/admin/settings/access-controls', { params });
    return data;
  },

  // ── Designated Accounts ────────────────────────────────────────────
  listDesignatedAccountUseCases: async () => {
    const { data } = await apiClient.get('/admin/settings/designated-accounts/use-cases');
    return throwIfApiError(data);
  },

  listDesignatedAccounts: async (params = {}) => {
    const { data } = await apiClient.get('/admin/settings/designated-accounts', { params });
    return throwIfApiError(data);
  },

  getDesignatedAccount: async (id) => {
    const { data } = await apiClient.get(`/admin/settings/designated-accounts/${id}`);
    return throwIfApiError(data);
  },

  createDesignatedAccount: async (payload) => {
    const { data } = await apiClient.post('/admin/settings/designated-accounts', payload);
    return throwIfApiError(data);
  },

  updateDesignatedAccount: async ({ id, ...payload }) => {
    const { data } = await apiClient.patch(`/admin/settings/designated-accounts/${id}`, payload);
    return throwIfApiError(data);
  },

  deleteDesignatedAccount: async (id) => {
    const { data } = await apiClient.delete(`/admin/settings/designated-accounts/${id}`);
    return throwIfApiError(data);
  },
};
