import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  IndianRupee,
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { adminDashboardService } from '../services/adminDashboardService';
import {
  DashboardOverview,
  RegistrationTrendPoint,
  RevenueTrendPoint,
  AdminOrder,
  AuditLog
} from '../types';

export const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [regTrends, setRegTrends] = useState<RegistrationTrendPoint[]>([]);
  const [revTrends, setRevTrends] = useState<RevenueTrendPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [recentAudit, setRecentAudit] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ov, reg, rev, ord, aud] = await Promise.all([
          adminDashboardService.getOverviewMetrics(),
          adminDashboardService.getRegistrationTrends(7),
          adminDashboardService.getRevenueTrends(7),
          adminDashboardService.getRecentOrders(5),
          adminDashboardService.getRecentAuditEvents(5),
        ]);
        setOverview(ov);
        setRegTrends(reg);
        setRevTrends(rev);
        setRecentOrders(ord);
        setRecentAudit(aud);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading || !overview) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" text="Aggregating enterprise telemetry..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Registered Members',
      value: overview.totalUsers.toLocaleString(),
      subtext: `+${overview.newRegistrationsToday} today (${overview.userGrowthPct}% this month)`,
      icon: Users,
      color: 'forest',
    },
    {
      title: 'Total Herbal Orders',
      value: overview.totalOrders.toLocaleString(),
      subtext: `${overview.pendingOrders} pending dispatch`,
      icon: ShoppingBag,
      color: 'olive',
    },
    {
      title: 'Gross Platform Volume',
      value: `₹${(overview.totalRevenue / 100000).toFixed(2)} Lakh`,
      subtext: `+${overview.revenueGrowthPct}% vs prior cycle`,
      icon: IndianRupee,
      color: 'warm-brown',
    },
    {
      title: 'Microservices Uptime',
      value: `${overview.systemHealthScore}%`,
      subtext: `${overview.activeServicesCount}/${overview.totalServicesCount} services healthy`,
      icon: Activity,
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">System Control Center</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Real-time platform telemetry across Ayurvedic clinical AI, user registries, and herbal commerce.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">All Systems Nominal</Badge>
          <span className="text-xs text-warm-brown flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Refreshed: Live</span>
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="p-2 rounded-lg bg-cream/70 text-forest">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal tracking-tight">{card.value}</p>
                <p className="text-[11px] text-warm-brown mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-state-success" />
                  <span>{card.subtext}</span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Trend */}
        <Card className="p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal">Member Registrations (7 Days)</h3>
              <p className="text-xs text-warm-brown">Daily new patient sign-ups vs active sessions</p>
            </div>
            <Link to="/admin/analytics" className="text-xs text-forest font-semibold hover:underline flex items-center gap-1">
              <span>View Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={regTrends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Area type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Registrations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Commerce Volume */}
        <Card className="p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal">Daily Commerce Revenue (₹)</h3>
              <p className="text-xs text-warm-brown">Gross herbal apothecary sales volume</p>
            </div>
            <Link to="/admin/orders" className="text-xs text-forest font-semibold hover:underline flex items-center gap-1">
              <span>Orders List</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Lower Operational Split: Recent Orders & Audit Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal">Latest Herbal Orders</h3>
            <Link to="/admin/orders" className="text-xs text-forest font-semibold hover:underline flex items-center gap-1">
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-soft-beige">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-charcoal">{order.orderNumber}</p>
                  <p className="text-warm-brown">{order.customerName} • {order.items.length} items</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-charcoal">₹{order.totalAmount}</p>
                  <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'SHIPPED' ? 'info' : 'warning'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Audit Trail */}
        <Card className="p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal">Recent Administrative Audit Events</h3>
            <Link to="/admin/audit-logs" className="text-xs text-forest font-semibold hover:underline flex items-center gap-1">
              <span>Full Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-soft-beige">
            {recentAudit.map((log) => (
              <div key={log.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-forest">{log.adminName}</span>
                  <span className="text-[10px] text-warm-brown">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-charcoal/90">{log.changesSummary}</p>
                <p className="text-[10px] text-warm-brown font-mono">{log.action} • {log.ipAddress}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
