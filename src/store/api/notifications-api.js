import { apiClient } from './client';

export const notificationsApi = {
  getNotifications: async (params = {}) => {
    const { data } = await apiClient.get('/admin/notifications', { params });
    return data;
  },

  markAsRead: async (notificationId) => {
    const { data } = await apiClient.patch(`/admin/notifications/${notificationId}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.patch('/admin/notifications/read-all');
    return data;
  },
};
