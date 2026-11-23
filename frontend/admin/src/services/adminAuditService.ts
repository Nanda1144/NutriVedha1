import { apiClient, USE_MOCK } from './apiClient';
import { AuditLog, PaginatedResult } from '../types';
import { MOCK_AUDIT_LOGS } from './mockData';

export interface AuditFilterOptions {
  search?: string;
  action?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const adminAuditService = {
  getAuditLogs: async (filters: AuditFilterOptions = {}): Promise<PaginatedResult<AuditLog>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 250));
      let list = [...MOCK_AUDIT_LOGS];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (a) =>
            a.adminName.toLowerCase().includes(q) ||
            a.adminEmail.toLowerCase().includes(q) ||
            a.resource.toLowerCase().includes(q) ||
            a.changesSummary.toLowerCase().includes(q) ||
            a.ipAddress.toLowerCase().includes(q)
        );
      }

      if (filters.action && filters.action !== 'ALL') {
        list = list.filter((a) => a.action === filters.action);
      }

      if (filters.status && filters.status !== 'ALL') {
        list = list.filter((a) => a.status === filters.status);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const data = list.slice((page - 1) * limit, page * limit);

      return { data, total, page, pageSize: limit, totalPages };
    }

    const res = await apiClient.get<PaginatedResult<AuditLog>>('/admin/audit-logs', { params: filters });
    return res.data;
  },

  getAuditById: async (auditId: string): Promise<AuditLog> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 150));
      const log = MOCK_AUDIT_LOGS.find((a) => a.id === auditId);
      if (!log) throw new Error('Audit record not found');
      return { ...log };
    }
    const res = await apiClient.get<AuditLog>(`/admin/audit-logs/${auditId}`);
    return res.data;
  },
};
