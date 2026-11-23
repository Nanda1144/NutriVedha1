import apiClient, { isMockEnabled } from './apiClient';
import { NotificationItem } from '../types';
import { MOCK_NOTIFICATIONS } from './mockData';

let localNotifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 200));
      return localNotifications;
    }
    const res = await apiClient.get<{ data: NotificationItem[] }>('/notifications');
    return res.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    if (isMockEnabled()) {
      localNotifications = localNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      return;
    }
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    if (isMockEnabled()) {
      localNotifications = localNotifications.map((n) => ({ ...n, isRead: true }));
      return;
    }
    await apiClient.patch('/notifications/read-all');
  },
};
