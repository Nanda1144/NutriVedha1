import apiClient, { isMockEnabled } from './apiClient';
import { UserProfile, UserAddress, UserPreferences } from '../types';
import { MOCK_USER_PROFILE, MOCK_ADDRESSES, MOCK_PREFERENCES } from './mockData';

let localProfile = { ...MOCK_USER_PROFILE };
let localAddresses = [...MOCK_ADDRESSES];
let localPreferences = { ...MOCK_PREFERENCES };

export const userService = {
  async getProfile(): Promise<UserProfile> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 300));
      return localProfile;
    }
    const res = await apiClient.get<{ data: UserProfile }>('/users/profile');
    return res.data.data;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 400));
      localProfile = { ...localProfile, ...updates, updatedAt: new Date().toISOString() };
      return localProfile;
    }
    const res = await apiClient.put<{ data: UserProfile }>('/users/profile', updates);
    return res.data.data;
  },

  async getAddresses(): Promise<UserAddress[]> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 200));
      return localAddresses;
    }
    const res = await apiClient.get<{ data: UserAddress[] }>('/users/addresses');
    return res.data.data;
  },

  async addAddress(address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>): Promise<UserAddress> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 300));
      const newAddr: UserAddress = {
        ...address,
        id: 'addr_' + Date.now(),
        userId: localProfile.userId,
        createdAt: new Date().toISOString(),
      };
      if (newAddr.isDefault) {
        localAddresses = localAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      localAddresses.push(newAddr);
      return newAddr;
    }
    const res = await apiClient.post<{ data: UserAddress }>('/users/addresses', address);
    return res.data.data;
  },

  async deleteAddress(id: string): Promise<void> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 300));
      localAddresses = localAddresses.filter((a) => a.id !== id);
      return;
    }
    await apiClient.delete(`/users/addresses/${id}`);
  },

  async getPreferences(): Promise<UserPreferences> {
    if (isMockEnabled()) {
      return localPreferences;
    }
    const res = await apiClient.get<{ data: UserPreferences }>('/users/preferences');
    return res.data.data;
  },

  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    if (isMockEnabled()) {
      localPreferences = { ...localPreferences, ...updates, updatedAt: new Date().toISOString() };
      return localPreferences;
    }
    const res = await apiClient.put<{ data: UserPreferences }>('/users/preferences', updates);
    return res.data.data;
  },

  async requestDataExport(): Promise<{ message: string }> {
    await new Promise((r) => setTimeout(r, 500));
    return { message: 'Your personal data export package has been compiled and dispatched to your email.' };
  },

  async requestAccountDeletion(): Promise<{ message: string }> {
    await new Promise((r) => setTimeout(r, 600));
    return { message: 'Account deletion initiated with 14-day recovery grace period.' };
  },
};
