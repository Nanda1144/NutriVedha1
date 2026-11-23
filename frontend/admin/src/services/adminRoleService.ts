import { apiClient, USE_MOCK } from './apiClient';
import { AdminUser, RoleDefinition } from '../types';
import { MOCK_ADMIN_ACCOUNTS, MOCK_ROLES, MOCK_AUDIT_LOGS } from './mockData';

export const adminRoleService = {
  getAdministrators: async (): Promise<AdminUser[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 250));
      return [...MOCK_ADMIN_ACCOUNTS];
    }
    const res = await apiClient.get<AdminUser[]>('/admin/administrators');
    return res.data;
  },

  inviteAdministrator: async (data: { name: string; email: string; role: any }): Promise<AdminUser> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const newAdmin: AdminUser = {
        id: `adm_0${MOCK_ADMIN_ACCOUNTS.length + 1}`,
        name: data.name,
        email: data.email,
        role: data.role,
        permissions: data.role === 'SUPER_ADMIN' ? ['*'] : ['users:read'],
        lastLogin: 'Never',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      MOCK_ADMIN_ACCOUNTS.push(newAdmin);

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_01',
        adminName: 'Dr. Anandamurthy Sharma',
        adminEmail: 'admin@nutrivedha.com',
        action: 'ADMIN_INVITE',
        resource: 'ADMIN',
        resourceId: newAdmin.id,
        timestamp: new Date().toISOString(),
        ipAddress: '103.21.124.89',
        userAgent: 'Chrome 131',
        status: 'SUCCESS',
        changesSummary: `Invited new administrator ${newAdmin.name} with role ${newAdmin.role}.`,
      });

      return newAdmin;
    }
    const res = await apiClient.post<AdminUser>('/admin/administrators/invite', data);
    return res.data;
  },

  getRoles: async (): Promise<RoleDefinition[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...MOCK_ROLES];
    }
    const res = await apiClient.get<RoleDefinition[]>('/admin/roles');
    return res.data;
  },

  updateRolePermissions: async (roleId: string, permissions: string[]): Promise<RoleDefinition> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 350));
      const role = MOCK_ROLES.find((r) => r.id === roleId);
      if (!role) throw new Error('Role definition not found');
      role.permissions = permissions;

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_01',
        adminName: 'Dr. Anandamurthy Sharma',
        adminEmail: 'admin@nutrivedha.com',
        action: 'ROLE_PERMISSIONS_UPDATE',
        resource: 'ROLE',
        resourceId: roleId,
        timestamp: new Date().toISOString(),
        ipAddress: '103.21.124.89',
        userAgent: 'Chrome 131',
        status: 'SUCCESS',
        changesSummary: `Updated permission matrix for role ${role.displayName}. New permissions count: ${permissions.length}`,
      });

      return { ...role };
    }
    const res = await apiClient.put<RoleDefinition>(`/admin/roles/${roleId}/permissions`, { permissions });
    return res.data;
  },
};
