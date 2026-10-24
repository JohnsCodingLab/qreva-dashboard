import { apiClient } from './client';

// Admin CRUD for the "Users Under Investigation" watchlist - proxied
// through the NestJS backend at /admin/investigations (see
// backend/src/investigations/admin-investigations.controller.ts).
// Distinct from the fraud blacklist: this flags a specific user's own
// activity for closer admin review without blocking anything - the user
// is never told. See that controller's doc comment for the full picture.
export const investigationsApi = {
  list: async (params = {}) => {
    const { data } = await apiClient.get('/admin/investigations', { params });
    return data;
  },

  add: async (payload) => {
    const { data } = await apiClient.post('/admin/investigations', payload);
    return data;
  },

  remove: async (id) => {
    const { data } = await apiClient.delete(`/admin/investigations/${id}`);
    return data;
  },
};
