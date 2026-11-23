import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap: Record<string, string> = {
    admin: 'Admin',
    'admin-control': 'Control Center',
    users: 'User Management',
    administrators: 'Administrators',
    roles: 'Roles & Permissions',
    content: 'Content CMS',
    marketplace: 'Marketplace Catalog',
    orders: 'Order Management',
    notifications: 'Broadcast Center',
    analytics: 'Analytics & Telemetry',
    'audit-logs': 'Audit Logs',
    monitoring: 'System Monitoring',
    settings: 'System Settings',
    profile: 'Admin Profile',
  };

  return (
    <nav className="flex items-center text-xs text-warm-brown" aria-label="Breadcrumb">
      <Link to="/admin-control" className="hover:text-teal flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Overview</span>
      </Link>

      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[segment] || segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-sage" />
            {isLast ? (
              <span className="font-semibold text-charcoal capitalize">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-teal capitalize transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
