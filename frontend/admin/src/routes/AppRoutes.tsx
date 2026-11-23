import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminPrivateRoute } from './AdminPrivateRoute';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Pages
const Login = lazy(() => import('../pages/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const UserManagement = lazy(() => import('../pages/UserManagement').then((m) => ({ default: m.UserManagement })));
const AdministratorManagement = lazy(() => import('../pages/AdministratorManagement').then((m) => ({ default: m.AdministratorManagement })));
const RolesPermissions = lazy(() => import('../pages/RolesPermissions').then((m) => ({ default: m.RolesPermissions })));
const ContentManagement = lazy(() => import('../pages/ContentManagement').then((m) => ({ default: m.ContentManagement })));
const MarketplaceAdmin = lazy(() => import('../pages/MarketplaceAdmin').then((m) => ({ default: m.MarketplaceAdmin })));
const OrderManagement = lazy(() => import('../pages/OrderManagement').then((m) => ({ default: m.OrderManagement })));
const NotificationManagement = lazy(() => import('../pages/NotificationManagement').then((m) => ({ default: m.NotificationManagement })));
const AnalyticsReports = lazy(() => import('../pages/AnalyticsReports').then((m) => ({ default: m.AnalyticsReports })));
const AuditLogs = lazy(() => import('../pages/AuditLogs').then((m) => ({ default: m.AuditLogs })));
const SystemMonitoring = lazy(() => import('../pages/SystemMonitoring').then((m) => ({ default: m.SystemMonitoring })));
const SystemSettings = lazy(() => import('../pages/SystemSettings').then((m) => ({ default: m.SystemSettings })));
const AdminProfile = lazy(() => import('../pages/AdminProfile').then((m) => ({ default: m.AdminProfile })));
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })));

const RouteLoading: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading enterprise governance console..." />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {/* Unauthenticated Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Console Routes */}
        <Route
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          {/* Main Control Center */}
          <Route path="/" element={<Navigate to="/admin-control" replace />} />
          <Route path="/admin-control" element={<Dashboard />} />

          {/* User Administration */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/administrators" element={<AdministratorManagement />} />
          <Route path="/admin/roles" element={<RolesPermissions />} />

          {/* Platform Management */}
          <Route path="/admin/content" element={<ContentManagement />} />
          <Route path="/admin/marketplace" element={<MarketplaceAdmin />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/notifications" element={<NotificationManagement />} />

          {/* Insights & Compliance */}
          <Route path="/admin/analytics" element={<AnalyticsReports />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />

          {/* Infrastructure & Governance */}
          <Route path="/admin/monitoring" element={<SystemMonitoring />} />
          <Route path="/admin/settings" element={<SystemSettings />} />

          {/* Admin Profile */}
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* Global Fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
