import { apiClient, USE_MOCK } from './apiClient';
import { SystemSettings } from '../types';
import { MOCK_SYSTEM_SETTINGS, MOCK_AUDIT_LOGS } from './mockData';

export const adminSettingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return { ...MOCK_SYSTEM_SETTINGS };
    }
    const res = await apiClient.get<SystemSettings>('/admin/settings');
    return res.data;
  },

  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      Object.assign(MOCK_SYSTEM_SETTINGS, settings);

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_01',
        adminName: 'Dr. Anandamurthy Sharma',
        adminEmail: 'admin@nutrivedha.com',
        action: 'SECURITY_POLICY_UPDATE',
        resource: 'SETTINGS',
        timestamp: new Date().toISOString(),
        ipAddress: '103.21.124.89',
        userAgent: 'Chrome 131',
        status: 'SUCCESS',
        changesSummary: 'Updated platform operational settings and security parameters.',
      });

      return { ...MOCK_SYSTEM_SETTINGS };
    }

    const res = await apiClient.put<SystemSettings>('/admin/settings', settings);
    return res.data;
  },

  toggleMaintenanceMode: async (enabled: boolean, message?: string): Promise<boolean> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 350));
      MOCK_SYSTEM_SETTINGS.maintenanceMode = enabled;
      if (message) MOCK_SYSTEM_SETTINGS.maintenanceMessage = message;

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_01',
        adminName: 'Dr. Anandamurthy Sharma',
        adminEmail: 'admin@nutrivedha.com',
        action: 'MAINTENANCE_TOGGLE',
        resource: 'GATEWAY',
        timestamp: new Date().toISOString(),
        ipAddress: '103.21.124.89',
        userAgent: 'Chrome 131',
        status: enabled ? 'WARNING' : 'SUCCESS',
        changesSummary: `Toggled platform maintenance mode: ${enabled ? 'ENABLED' : 'DISABLED'}`,
      });

      return enabled;
    }

    const res = await apiClient.post<{ maintenanceMode: boolean }>('/admin/settings/maintenance', { enabled, message });
    return res.data.maintenanceMode;
  },
};
