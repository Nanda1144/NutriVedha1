import { create } from 'zustand';
import { AdminUser } from '../types';
import { adminAuthService, LoginCredentials } from '../services/adminAuthService';

interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  verifySession: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  admin: adminAuthService.getCurrentAdmin(),
  token: localStorage.getItem('nv_admin_token'),
  isAuthenticated: !!localStorage.getItem('nv_admin_token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAuthService.login(credentials);
      set({
        admin: response.admin,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Authentication failed. Please verify admin credentials.',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await adminAuthService.logout();
    set({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  verifySession: async () => {
    try {
      const admin = await adminAuthService.verifySession();
      set({ admin, isAuthenticated: true });
    } catch {
      set({ admin: null, token: null, isAuthenticated: false });
    }
  },

  hasPermission: (permission: string) => {
    const admin = get().admin;
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN' || admin.permissions.includes('*')) return true;
    return admin.permissions.includes(permission);
  },

  clearError: () => set({ error: null }),
}));
