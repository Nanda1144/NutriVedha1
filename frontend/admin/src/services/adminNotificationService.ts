import { apiClient, USE_MOCK } from './apiClient';
import { AdminNotification } from '../types';
import { MOCK_ADMIN_NOTIFICATIONS, MOCK_AUDIT_LOGS } from './mockData';

export const adminNotificationService = {
  getNotifications: async (): Promise<AdminNotification[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 250));
      return [...MOCK_ADMIN_NOTIFICATIONS];
    }
    const res = await apiClient.get<AdminNotification[]>('/admin/notifications');
    return res.data;
  },

  broadcastNotification: async (data: {
    title: string;
    body: string;
    category: any;
    audience: any;
  }): Promise<AdminNotification> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 450));
      const newNotif: AdminNotification = {
        id: `notif_${Date.now()}`,
        title: data.title,
        body: data.body,
        category: data.category,
        audience: data.audience,
        targetCount: data.audience === 'ALL_USERS' ? 14820 : 1200,
        deliveredCount: data.audience === 'ALL_USERS' ? 14750 : 1195,
        readCount: 0,
        status: 'SENT',
        sentAt: new Date().toISOString(),
        createdBy: 'Dr. Anandamurthy Sharma',
      };
      MOCK_ADMIN_NOTIFICATIONS.unshift(newNotif);

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_01',
        adminName: 'Dr. Anandamurthy Sharma',
        adminEmail: 'admin@nutrivedha.com',
        action: 'NOTIFICATION_BROADCAST',
        resource: 'NOTIFICATION',
        resourceId: newNotif.id,
        timestamp: new Date().toISOString(),
        ipAddress: '103.21.124.89',
        userAgent: 'Chrome 131',
        status: 'SUCCESS',
        changesSummary: `Broadcasted system notification "${newNotif.title}" to target audience ${newNotif.audience}.`,
      });

      return newNotif;
    }

    const res = await apiClient.post<AdminNotification>('/admin/notifications/broadcast', data);
    return res.data;
  },
};
