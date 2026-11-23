import apiClient, { isMockEnabled } from './apiClient';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types';
import { MOCK_USER } from './mockData';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 600));
      // Validation simulation
      if (credentials.password && credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
      const token = 'mock_jwt_usr_token_' + Date.now();
      localStorage.setItem('nv_user_token', token);
      localStorage.setItem('nv_user_data', JSON.stringify(MOCK_USER));
      return { user: MOCK_USER, token };
    }

    const res = await apiClient.post<{ data: AuthResponse }>('/auth/login', credentials);
    const authData = res.data.data;
    localStorage.setItem('nv_user_token', authData.token);
    localStorage.setItem('nv_user_data', JSON.stringify(authData.user));
    return authData;
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 700));
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      const newUser: User = {
        ...MOCK_USER,
        id: 'usr_' + Date.now(),
        email: credentials.email,
        fullName: credentials.fullName,
        phone: credentials.phone,
        createdAt: new Date().toISOString(),
      };
      const token = 'mock_jwt_usr_token_' + Date.now();
      localStorage.setItem('nv_user_token', token);
      localStorage.setItem('nv_user_data', JSON.stringify(newUser));
      return { user: newUser, token };
    }

    const res = await apiClient.post<{ data: AuthResponse }>('/auth/register', credentials);
    return res.data.data;
  },

  async logout(): Promise<void> {
    try {
      if (!isMockEnabled()) {
        await apiClient.post('/auth/logout');
      }
    } finally {
      localStorage.removeItem('nv_user_token');
      localStorage.removeItem('nv_user_data');
    }
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('nv_user_data');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};
