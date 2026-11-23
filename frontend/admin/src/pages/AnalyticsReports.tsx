import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Sparkles,
  Users,
  ShoppingBag,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { adminAnalyticsService, AnalyticsSummary } from '../services/adminAnalyticsService';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const AnalyticsReports: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const { addToast } = useAdminNotificationStore();

  const DOSHA_COLORS = ['#10B981', '#6366F1', '#34D399', '#0EA5E9', '#F59E0B'];

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await adminAnalyticsService.getAnalyticsSummary(timeRange);
        setSummary(data);
      } catch (e) {
        addToast('ERROR', 'Failed to retrieve analytics data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, [timeRange]);

  const handleExport = async (format: 'CSV' | 'PDF') => {
    setIsExporting(true);
    try {
      const url = await adminAnalyticsService.exportReport(format, 'Full_Enterprise_Telemetry');
      const a = document.createElement('a');
      a.href = url;
      a.download = `NutriVedha_Report_${Date.now()}.${format.toLowerCase()}`;
      a.click();
      addToast('SUCCESS', `Exported ${format} telemetry dataset.`);
    } catch (e) {
      addToast('ERROR', 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" text="Analyzing cross-service health data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Analytics & Telemetry Intelligence</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Holistic insights into patient engagement, dosha distributions, apothecary volume, and AI diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-sand bg-cream/40 p-1 text-xs">
            {['7d', '30d', '90d'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer uppercase ${
                  timeRange === r ? 'bg-forest text-ivory shadow-earth-sm' : 'text-charcoal'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => handleExport('CSV')}
            isLoading={isExporting}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white space-y-2">
          <span className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Daily Active Members</span>
          <p className="text-2xl font-bold text-charcoal">{summary.dailyActiveUsers.toLocaleString()}</p>
          <p className="text-[11px] text-warm-brown">MAU: {summary.monthlyActiveUsers.toLocaleString()} ({summary.retentionRatePct}% 30d retention)</p>
        </Card>

        <Card className="p-4 bg-white space-y-2">
          <span className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Apothecary Basket Size</span>
          <p className="text-2xl font-bold text-charcoal">₹{summary.avgOrderValue}</p>
          <p className="text-[11px] text-warm-brown">Average transaction value</p>
        </Card>

        <Card className="p-4 bg-white space-y-2">
          <span className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">AI Symptom Scans</span>
          <p className="text-2xl font-bold text-charcoal">{summary.totalAiScans.toLocaleString()}</p>
          <p className="text-[11px] text-warm-brown">Multimodal inference runs</p>
        </Card>

        <Card className="p-4 bg-white space-y-2">
          <span className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">AI Diagnostic Feedback</span>
          <p className="text-2xl font-bold text-[#047857]">{summary.aiDiagnosticAccuracyFeedbackPct}%</p>
          <p className="text-[11px] text-warm-brown">User wellness concordance rating</p>
        </Card>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dosha Population Distribution */}
        <Card className="p-5 bg-white space-y-4">
          <div>
            <h3 className="text-sm font-bold text-charcoal">Patient Dosha Constitutional Typing</h3>
            <p className="text-xs text-warm-brown">Prakriti demographic distribution across platform users</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.popularDoshaDistribution}
                  dataKey="count"
                  nameKey="dosha"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {summary.popularDoshaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DOSHA_COLORS[index % DOSHA_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Share */}
        <Card className="p-5 bg-white space-y-4">
          <div>
            <h3 className="text-sm font-bold text-charcoal">Herbal Category Sales Velocity</h3>
            <p className="text-xs text-warm-brown">Percentage share of total apothecary orders</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.categorySalesShare} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Bar dataKey="sharePct" fill="#10B981" radius={[0, 4, 4, 0]} name="Sales Share %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
