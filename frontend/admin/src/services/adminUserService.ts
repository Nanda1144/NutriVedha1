import { apiClient, USE_MOCK } from './apiClient';
import { ManagedUser, ManagedUserStatus, PaginatedResult } from '../types';
import { MOCK_MANAGED_USERS, MOCK_AUDIT_LOGS } from './mockData';

export interface UserFilterOptions {
  search?: string;
  status?: string;
  dosha?: string;
  page?: number;
  limit?: number;
}

export const adminUserService = {
  getUsers: async (filters: UserFilterOptions = {}): Promise<PaginatedResult<ManagedUser>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 350));
      let filtered = [...MOCK_MANAGED_USERS];

      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.fullName.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.mobile.toLowerCase().includes(query) ||
            u.city.toLowerCase().includes(query)
        );
      }

      if (filters.status && filters.status !== 'ALL') {
        filtered = filtered.filter((u) => u.status === filters.status);
      }

      if (filters.dosha && filters.dosha !== 'ALL') {
        filtered = filtered.filter((u) => u.dosha === filters.dosha);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const data = filtered.slice((page - 1) * limit, page * limit);

      return { data, total, page, pageSize: limit, totalPages };
    }

    const res = await apiClient.get<PaginatedResult<ManagedUser>>('/admin/users', { params: filters });
    return res.data;
  },

  getUserById: async (userId: string): Promise<ManagedUser> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const user = MOCK_MANAGED_USERS.find((u) => u.id === userId);
      if (!user) throw new Error('User record not found');
      return { ...user };
    }
    const res = await apiClient.get<ManagedUser>(`/admin/users/${userId}`);
    return res.data;
  },

  updateUserStatus: async (
    userId: string,
    status: ManagedUserStatus,
    reason: string
  ): Promise<ManagedUser> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const user = MOCK_MANAGED_USERS.find((u) => u.id === userId);
      if (!user) throw new Error('User record not found');
      
      const prev = user.status;
      user.status = status;

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_01',
        adminName: 'Dr. Anandamurthy Sharma',
        adminEmail: 'admin@nutrivedha.com',
        action: 'USER_STATUS_CHANGE',
        resource: 'USER',
        resourceId: userId,
        timestamp: new Date().toISOString(),
        ipAddress: '103.21.124.89',
        userAgent: 'Chrome 131 / macOS',
        status: 'SUCCESS',
        changesSummary: `Changed status of ${user.fullName} from ${prev} to ${status}. Reason: ${reason}`,
      });

      return { ...user };
    }

    const res = await apiClient.patch<ManagedUser>(`/admin/users/${userId}/status`, { status, reason });
    return res.data;
  },

  reviewDeletionRequest: async (
    userId: string,
    action: 'APPROVE' | 'REJECT',
    notes: string
  ): Promise<void> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const user = MOCK_MANAGED_USERS.find((u) => u.id === userId);
      if (user) {
        if (action === 'APPROVE') {
          user.status = 'SUSPENDED'; // Archived under retention policy
        } else {
          user.status = 'ACTIVE';
          user.deletionReason = undefined;
          user.deletionRequestedAt = undefined;
        }

        MOCK_AUDIT_LOGS.unshift({
          id: `aud_${Date.now()}`,
          adminId: 'adm_04',
          adminName: 'Kavita Nair',
          adminEmail: 'compliance@nutrivedha.com',
          action: 'USER_DELETION_REVIEW',
          resource: 'USER',
          resourceId: userId,
          timestamp: new Date().toISOString(),
          ipAddress: '157.34.19.12',
          userAgent: 'Safari / iOS',
          status: 'SUCCESS',
          changesSummary: `${action === 'APPROVE' ? 'Approved retention archival' : 'Rejected erasure request'} for user ${user.fullName}. Notes: ${notes}`,
        });
      }
      return;
    }

    await apiClient.post(`/admin/users/${userId}/deletion-review`, { action, notes });
  },
};
