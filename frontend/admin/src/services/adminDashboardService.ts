import { apiClient, USE_MOCK } from './apiClient';
import {
  DashboardOverview,
  RegistrationTrendPoint,
  RevenueTrendPoint,
  AdminOrder,
  AuditLog,
  MicroserviceStatus
} from '../types';
import {
  MOCK_DASHBOARD_OVERVIEW,
  MOCK_REGISTRATION_TRENDS,
  MOCK_REVENUE_TRENDS,
  MOCK_ORDERS,
  MOCK_AUDIT_LOGS,
  MOCK_MICROSERVICES
} from './mockData';

export const adminDashboardService = {
  getOverviewMetrics: async (): Promise<DashboardOverview> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return { ...MOCK_DASHBOARD_OVERVIEW };
    }
    const res = await apiClient.get<DashboardOverview>('/admin/dashboard/metrics');
    return res.data;
  },

  getRegistrationTrends: async (days: number = 7): Promise<RegistrationTrendPoint[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return [...MOCK_REGISTRATION_TRENDS];
    }
    const res = await apiClient.get<RegistrationTrendPoint[]>(`/admin/dashboard/registration-trends?days=${days}`);
    return res.data;
  },

  getRevenueTrends: async (days: number = 7): Promise<RevenueTrendPoint[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return [...MOCK_REVENUE_TRENDS];
    }
    const res = await apiClient.get<RevenueTrendPoint[]>(`/admin/dashboard/revenue-trends?days=${days}`);
    return res.data;
  },

  getRecentOrders: async (limit: number = 5): Promise<AdminOrder[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_ORDERS.slice(0, limit);
    }
    const res = await apiClient.get<AdminOrder[]>(`/admin/orders?limit=${limit}`);
    return res.data;
  },

  getRecentAuditEvents: async (limit: number = 5): Promise<AuditLog[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_AUDIT_LOGS.slice(0, limit);
    }
    const res = await apiClient.get<AuditLog[]>(`/admin/audit-logs?limit=${limit}`);
    return res.data;
  },

  getServicesHealthSummary: async (): Promise<MicroserviceStatus[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...MOCK_MICROSERVICES];
    }
    const res = await apiClient.get<MicroserviceStatus[]>('/admin/monitoring/services');
    return res.data;
  },
};
