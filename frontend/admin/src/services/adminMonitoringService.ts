import { apiClient, USE_MOCK } from './apiClient';
import { MicroserviceStatus, DatabaseMetrics } from '../types';
import { MOCK_MICROSERVICES, MOCK_DATABASE_METRICS } from './mockData';

export const adminMonitoringService = {
  getMicroservices: async (): Promise<MicroserviceStatus[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...MOCK_MICROSERVICES];
    }
    const res = await apiClient.get<MicroserviceStatus[]>('/admin/monitoring/services');
    return res.data;
  },

  getDatabaseHealth: async (): Promise<DatabaseMetrics> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return { ...MOCK_DATABASE_METRICS };
    }
    const res = await apiClient.get<DatabaseMetrics>('/admin/monitoring/database');
    return res.data;
  },

  pingService: async (serviceId: string): Promise<{ success: boolean; latencyMs: number }> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const svc = MOCK_MICROSERVICES.find((s) => s.serviceId === serviceId);
      const latency = Math.floor(Math.random() * 20) + 10;
      if (svc) {
        svc.lastPing = 'Just now';
        svc.latencyMs = latency;
      }
      return { success: true, latencyMs: latency };
    }
    const res = await apiClient.post<{ success: boolean; latencyMs: number }>(`/admin/monitoring/ping/${serviceId}`);
    return res.data;
  },
};
