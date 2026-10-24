import { apiClient } from './client';

export const partnerApiApi = {
  // Pricing. partnerId is optional: omitted returns the global defaults,
  // supplied returns those defaults alongside that partner's overrides.
  listPricing: async (params) => {
    const { data } = await apiClient.get('/admin/partner-api/pricing', { params });
    return data;
  },

  upsertPricing: async (payload) => {
    const { data } = await apiClient.post('/admin/partner-api/pricing', payload);
    return data;
  },

  deletePricingOverride: async ({ endpointCode, partnerId }) => {
    const { data } = await apiClient.delete(`/admin/partner-api/pricing/${endpointCode}/${partnerId}`);
    return data;
  },

  // Onboarding. The backend issues partnerId, key and secret; the secret comes
  // back once in this response and is not retrievable afterwards.



  // Admin's remaining levers over a partner: review their business, and block
  // them. Creating partners and holding their keys moved to the partner
  // console, the way every other API provider works.
  /* ---- service providers ----------------------------------------------
   * Contracted parties on the accounts, ledger and transfer endpoints. They
   * hold no identity scopes, so nothing here can grant NIN or BVN access.
   */

  listServiceProviders: async () => {
    const { data } = await apiClient.get('/admin/partner-api/service-providers');
    return data;
  },

  createServiceProvider: async (payload) => {
    const { data } = await apiClient.post('/admin/partner-api/service-providers', payload);
    return data;
  },

  // Issues or rotates. The secret comes back once and is never retrievable.
  generateServiceProviderCredentials: async (partnerId) => {
    const { data } = await apiClient.post(
      `/admin/partner-api/service-providers/${partnerId}/credentials`,
    );
    return data;
  },

  kybQueue: async (params) => {
    const { data } = await apiClient.get('/admin/partner-api/partners/kyb-queue', { params });
    return data;
  },

  approveKyb: async (partnerId) => {
    const { data } = await apiClient.post(`/admin/partner-api/partners/${partnerId}/kyb/approve`);
    return data;
  },

  rejectKyb: async ({ partnerId, reason }) => {
    const { data } = await apiClient.post(`/admin/partner-api/partners/${partnerId}/kyb/reject`, { reason });
    return data;
  },

  blockPartner: async ({ partnerId, reason }) => {
    const { data } = await apiClient.post(`/admin/partner-api/partners/${partnerId}/block`, { reason });
    return data;
  },

  unblockPartner: async (partnerId) => {
    const { data } = await apiClient.post(`/admin/partner-api/partners/${partnerId}/unblock`);
    return data;
  },

  // The partners module. listBilling returns every partner at once with no
  // search; these are the paged and single-partner reads it needs instead.
  listPartners: async (params) => {
    const { data } = await apiClient.get('/admin/partner-api/partners', { params });
    return data;
  },

  getPartner: async (partnerId) => {
    const { data } = await apiClient.get(`/admin/partner-api/partners/${partnerId}`);
    return data;
  },

  // Agents. They cannot self-register, so this invite is the only way one can
  // come to exist.
  listAgents: async (params) => {
    const { data } = await apiClient.get('/admin/partner-api/agents', { params });
    return data;
  },

  inviteAgent: async (payload) => {
    const { data } = await apiClient.post('/admin/partner-api/agents/invite', payload);
    return data;
  },

  listAgentInvites: async () => {
    const { data } = await apiClient.get('/admin/partner-api/agents/invites');
    return data;
  },

  revokeAgentInvite: async (token) => {
    const { data } = await apiClient.post(`/admin/partner-api/agents/invites/${token}/revoke`);
    return data;
  },

  blockAgent: async ({ agentId, reason }) => {
    const { data } = await apiClient.post(`/admin/partner-api/agents/${agentId}/block`, { reason });
    return data;
  },

  unblockAgent: async (agentId) => {
    const { data } = await apiClient.post(`/admin/partner-api/agents/${agentId}/unblock`);
    return data;
  },

  agentEarnings: async (agentId) => {
    const { data } = await apiClient.get(`/admin/partner-api/agents/${agentId}/earnings`);
    return data;
  },

  markEarningPaid: async (earningId) => {
    const { data } = await apiClient.post(`/admin/partner-api/agents/earnings/${earningId}/mark-paid`);
    return data;
  },

  listBilling: async () => {
    const { data } = await apiClient.get('/admin/partner-api/billing');
    return data;
  },

  upsertBilling: async (payload) => {
    const { data } = await apiClient.post('/admin/partner-api/billing', payload);
    return data;
  },

  getUsage: async (params) => {
    const { data } = await apiClient.get('/admin/partner-api/usage', { params });
    return data;
  },
};
