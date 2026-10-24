import { apiClient } from './client';

export const promotionsApi = {
  listPromotions: async () => {
    const { data } = await apiClient.get('/admin/promotions');
    return data;
  },

  createPromotion: async (payload) => {
    const { data } = await apiClient.post('/admin/promotions', payload);
    return data;
  },

  updatePromotion: async ({ id, updates }) => {
    const { data } = await apiClient.put(`/admin/promotions/${id}`, updates);
    return data;
  },

  deletePromotion: async (id) => {
    const { data } = await apiClient.delete(`/admin/promotions/${id}`);
    return data;
  },

  // Multipart, so the JSON content type the shared client sets has to be
  // dropped — axios fills in the boundary itself when it is absent.
  uploadImage: async (file) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await apiClient.post('/admin/promotions/image', form, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },
};
