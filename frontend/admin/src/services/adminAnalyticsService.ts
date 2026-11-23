import { apiClient, USE_MOCK } from './apiClient';
import {
  MOCK_REGISTRATION_TRENDS,
  MOCK_REVENUE_TRENDS
} from './mockData';

export interface AnalyticsSummary {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  retentionRatePct: number;
  avgOrderValue: number;
  totalAiScans: number;
  aiDiagnosticAccuracyFeedbackPct: number;
  popularDoshaDistribution: { dosha: string; count: number; percentage: number }[];
  categorySalesShare: { category: string; sharePct: number }[];
}

export const adminAnalyticsService = {
  getAnalyticsSummary: async (timeRange: string = '7d'): Promise<AnalyticsSummary> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 350));
      return {
        dailyActiveUsers: 3410,
        monthlyActiveUsers: 14820,
        retentionRatePct: 76.4,
        avgOrderValue: 741,
        totalAiScans: 8940,
        aiDiagnosticAccuracyFeedbackPct: 94.2,
        popularDoshaDistribution: [
          { dosha: 'Vata-Pitta', count: 4890, percentage: 33 },
          { dosha: 'Pitta-Kapha', count: 4150, percentage: 28 },
          { dosha: 'Vata', count: 2660, percentage: 18 },
          { dosha: 'Kapha', count: 1780, percentage: 12 },
          { dosha: 'Tridoshic', count: 1340, percentage: 9 },
        ],
        categorySalesShare: [
          { category: 'Herbal Supplements', sharePct: 45 },
          { category: 'Ayurvedic Foods & Ghee', sharePct: 30 },
          { category: 'Organic Farm Crops', sharePct: 15 },
          { category: 'Wellness Infusions & Oils', sharePct: 10 },
        ],
      };
    }

    const res = await apiClient.get<AnalyticsSummary>('/admin/analytics/summary', { params: { range: timeRange } });
    return res.data;
  },

  exportReport: async (format: 'CSV' | 'PDF', reportType: string): Promise<string> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      return `data:text/csv;charset=utf-8,Timestamp,Metric,Value\n${new Date().toISOString()},${reportType},ExportedSuccessfully`;
    }

    const res = await apiClient.get<Blob>(`/admin/analytics/export`, {
      params: { format, type: reportType },
      responseType: 'blob',
    });
    return URL.createObjectURL(res.data);
  },
};
