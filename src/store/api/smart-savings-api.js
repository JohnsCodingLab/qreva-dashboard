import { apiClient } from './client';

/**
 * Qreva Smart Savings — the Empowerment Foundation's passbook scheme.
 *
 * The dashboard's side of the scheme that the savings PWA serves: observing the
 * register, setting the commercial terms, approving payouts, and planning who
 * gets credit against the pool actually on the ground.
 *
 * Every route here is admin-scoped. The member and marketer surfaces live under
 * /savings/* and are reached only by the PWA.
 */
export const smartSavingsApi = {
  // ── Overview ────────────────────────────────────────────────────
  getOverview: async () => {
    const { data } = await apiClient.get('/admin/smart-savings/overview');
    return data;
  },

  getQueueCounts: async () => {
    const { data } = await apiClient.get('/admin/smart-savings/queue-counts');
    return data;
  },

  getPool: async () => {
    const { data } = await apiClient.get('/admin/smart-savings/pool');
    return data;
  },

  // ── Configuration ───────────────────────────────────────────────
  getConfig: async () => {
    const { data } = await apiClient.get('/admin/smart-savings/config');
    return data;
  },

  updateConfig: async (payload) => {
    const { data } = await apiClient.patch('/admin/smart-savings/config', payload);
    return data;
  },

  // ── Members ─────────────────────────────────────────────────────
  listMembers: async (params) => {
    const { data } = await apiClient.get('/admin/smart-savings/members', { params });
    return data;
  },

  getMember: async (memberId) => {
    const { data } = await apiClient.get(`/admin/smart-savings/members/${memberId}`);
    return data;
  },

  getMemberEligibility: async (memberId) => {
    const { data } = await apiClient.get(
      `/admin/smart-savings/members/${memberId}/eligibility`,
    );
    return data;
  },

  assignMarketer: async ({ memberId, marketerId }) => {
    const { data } = await apiClient.patch(
      `/admin/smart-savings/members/${memberId}/marketer`,
      { marketerId },
    );
    return data;
  },

  suspendMember: async ({ memberId, reason }) => {
    const { data } = await apiClient.patch(
      `/admin/smart-savings/members/${memberId}/suspend`,
      { reason },
    );
    return data;
  },

  reinstateMember: async (memberId) => {
    const { data } = await apiClient.patch(
      `/admin/smart-savings/members/${memberId}/reinstate`,
    );
    return data;
  },

  // ── Entries ─────────────────────────────────────────────────────
  listContributions: async (params) => {
    const { data } = await apiClient.get('/admin/smart-savings/contributions', { params });
    return data;
  },

  reverseContribution: async ({ contributionId, reason }) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/contributions/${contributionId}/reverse`,
      { reason },
    );
    return data;
  },

  // ── Marketers ───────────────────────────────────────────────────
  listMarketers: async (params) => {
    const { data } = await apiClient.get('/admin/smart-savings/marketers', { params });
    return data;
  },

  getMarketer: async (marketerId) => {
    const { data } = await apiClient.get(`/admin/smart-savings/marketers/${marketerId}`);
    return data;
  },

  /** Takes a list: a field team is onboarded in one sitting, not one at a time. */
  inviteMarketers: async (invites) => {
    const { data } = await apiClient.post('/admin/smart-savings/marketers/invite', {
      invites,
    });
    return data;
  },

  listInvites: async (params) => {
    const { data } = await apiClient.get('/admin/smart-savings/marketers/invites/list', {
      params,
    });
    return data;
  },

  resendInvite: async (inviteId) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/marketers/invites/${inviteId}/resend`,
    );
    return data;
  },

  revokeInvite: async (inviteId) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/marketers/invites/${inviteId}/revoke`,
    );
    return data;
  },

  updateMarketer: async ({ marketerId, ...payload }) => {
    const { data } = await apiClient.patch(
      `/admin/smart-savings/marketers/${marketerId}`,
      payload,
    );
    return data;
  },

  blockMarketer: async ({ marketerId, reason }) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/marketers/${marketerId}/block`,
      { reason },
    );
    return data;
  },

  unblockMarketer: async (marketerId) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/marketers/${marketerId}/unblock`,
    );
    return data;
  },

  // ── Withdrawals ─────────────────────────────────────────────────
  listWithdrawals: async (params) => {
    const { data } = await apiClient.get('/admin/smart-savings/withdrawals', { params });
    return data;
  },

  approveWithdrawal: async ({ withdrawalId, note }) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/withdrawals/${withdrawalId}/approve`,
      { note },
    );
    return data;
  },

  rejectWithdrawal: async ({ withdrawalId, reason }) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/withdrawals/${withdrawalId}/reject`,
      { reason },
    );
    return data;
  },

  markWithdrawalPaid: async ({ withdrawalId, payoutReference, payoutChannel }) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/withdrawals/${withdrawalId}/paid`,
      { payoutReference, payoutChannel },
    );
    return data;
  },

  // ── Loan planner ────────────────────────────────────────────────
  getPlanner: async (params) => {
    const { data } = await apiClient.get('/admin/smart-savings/planner', { params });
    return data;
  },

  generateSuggestions: async (limit) => {
    const { data } = await apiClient.post(
      '/admin/smart-savings/planner/suggestions',
      undefined,
      { params: { limit } },
    );
    return data;
  },

  listOffers: async (params) => {
    const { data } = await apiClient.get('/admin/smart-savings/offers', { params });
    return data;
  },

  createOffer: async (payload) => {
    const { data } = await apiClient.post('/admin/smart-savings/offers', payload);
    return data;
  },

  releaseOffer: async (offerId) => {
    const { data } = await apiClient.post(`/admin/smart-savings/offers/${offerId}/release`);
    return data;
  },

  markOfferDisbursed: async (offerId) => {
    const { data } = await apiClient.post(`/admin/smart-savings/offers/${offerId}/disbursed`);
    return data;
  },

  withdrawOffer: async ({ offerId, reason }) => {
    const { data } = await apiClient.post(
      `/admin/smart-savings/offers/${offerId}/withdraw`,
      { reason },
    );
    return data;
  },

  // ── Broadcasts ──────────────────────────────────────────────────
  listBroadcasts: async () => {
    const { data } = await apiClient.get('/admin/smart-savings/broadcasts');
    return data;
  },

  sendBroadcast: async (payload) => {
    const { data } = await apiClient.post('/admin/smart-savings/broadcasts', payload);
    return data;
  },

  removeBroadcast: async (notificationId) => {
    const { data } = await apiClient.delete(
      `/admin/smart-savings/broadcasts/${notificationId}`,
    );
    return data;
  },

  // ── Export ──────────────────────────────────────────────────────
  exportMembers: async () => {
    const { data } = await apiClient.get('/admin/smart-savings/export/members');
    return data;
  },

  exportContributions: async (params) => {
    const { data } = await apiClient.get('/admin/smart-savings/export/contributions', {
      params,
    });
    return data;
  },
};
