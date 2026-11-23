import { create } from 'zustand';
import { User, LoginCredentials, SignupCredentials } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  token: localStorage.getItem('nv_user_token'),
  isAuthenticated: !!localStorage.getItem('nv_user_token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Login failed. Please check your credentials.',
        isLoading: false,
      });
      throw err;
    }
  },

  signup: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(credentials);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Registration failed.',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  updateUser: (updated) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updated };
      localStorage.setItem('nv_user_data', JSON.stringify(newUser));
      return { user: newUser };
    });
  },

  clearError: () => set({ error: null }),
}));
