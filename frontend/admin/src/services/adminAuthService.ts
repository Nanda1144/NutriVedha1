import { apiClient, USE_MOCK } from './apiClient';
import { AdminUser, AdminSession } from '../types';
import { MOCK_ADMIN_ACCOUNTS, MOCK_ADMIN_SESSIONS, MOCK_AUDIT_LOGS } from './mockData';

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AdminAuthResponse {
  token: string;
  admin: AdminUser;
}

export const adminAuthService = {
  login: async (credentials: LoginCredentials): Promise<AdminAuthResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      const found = MOCK_ADMIN_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === credentials.email.toLowerCase()
      );
      if (!found) {
        throw new Error('Invalid enterprise credentials. Please check your admin email or contact super-admin.');
      }
      if (found.status === 'SUSPENDED') {
        throw new Error('This administrator account has been suspended by governance policy.');
      }

      const token = `nv_admin_jwt_${found.id}_${Date.now()}`;
      localStorage.setItem('nv_admin_token', token);
      localStorage.setItem('nv_admin_data', JSON.stringify(found));
      return { token, admin: found };
    }

    const res = await apiClient.post<AdminAuthResponse>('/admin/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('nv_admin_token', res.data.token);
      localStorage.setItem('nv_admin_data', JSON.stringify(res.data.admin));
    }
    return res.data;
  },

  getCurrentAdmin: (): AdminUser | null => {
    const raw = localStorage.getItem('nv_admin_data');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  verifySession: async (): Promise<AdminUser> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const current = adminAuthService.getCurrentAdmin();
      if (!current) throw new Error('No active admin session found');
      return current;
    }
    const res = await apiClient.get<AdminUser>('/admin/auth/me');
    return res.data;
  },

  logout: async (): Promise<void> => {
    if (!USE_MOCK) {
      try {
        await apiClient.post('/admin/auth/logout');
      } catch (e) {
        console.error('Logout error', e);
      }
    }
    localStorage.removeItem('nv_admin_token');
    localStorage.removeItem('nv_admin_data');
  },

  getActiveSessions: async (): Promise<AdminSession[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return [...MOCK_ADMIN_SESSIONS];
    }
    const res = await apiClient.get<AdminSession[]>('/admin/auth/sessions');
    return res.data;
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const idx = MOCK_ADMIN_SESSIONS.findIndex((s) => s.id === sessionId);
      if (idx !== -1) {
        MOCK_ADMIN_SESSIONS.splice(idx, 1);
      }
      return;
    }
    await apiClient.delete(`/admin/auth/sessions/${sessionId}`);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_01',
        adminName: 'Dr. Anandamurthy Sharma',
        adminEmail: 'admin@nutrivedha.com',
        action: 'ADMIN_PASSWORD_CHANGE',
        resource: 'AUTH',
        timestamp: new Date().toISOString(),
        ipAddress: '103.21.124.89',
        userAgent: 'Chrome 131',
        status: 'SUCCESS',
        changesSummary: 'Administrator changed their personal access credentials.',
      });
      return;
    }
    await apiClient.post('/admin/auth/change-password', { currentPassword, newPassword });
  },
};
