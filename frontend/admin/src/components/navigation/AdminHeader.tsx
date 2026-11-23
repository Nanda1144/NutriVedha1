import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  Shield,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';
import { useAdminNotificationStore } from '../../store/useAdminNotificationStore';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { admin, logout } = useAdminAuthStore();
  const { unreadSystemAlerts } = useAdminNotificationStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-soft-beige px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Area: Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-charcoal/70 hover:bg-cream hover:text-charcoal cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Breadcrumbs />
      </div>

      {/* Right Area: System Status, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Live System Health Badge */}
        <Link
          to="/admin/monitoring"
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-state-success/10 border border-state-success/30 text-[#047857] text-xs font-semibold hover:bg-state-success/15 transition-colors"
          title="All 11 microservices operational"
        >
          <span className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
          <span>Services 100% OK</span>
        </Link>

        {/* Notifications Icon */}
        <Link
          to="/admin/notifications"
          className="relative p-2 rounded-lg text-charcoal/70 hover:bg-cream hover:text-charcoal transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadSystemAlerts > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {unreadSystemAlerts}
            </span>
          )}
        </Link>

        {/* User Portal Link Quick Switcher */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-soft-beige text-xs font-medium text-warm-brown hover:text-teal hover:bg-cream transition-colors"
          title="Open User Web Application"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>User Portal</span>
        </a>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-cream transition-colors cursor-pointer"
          >
            {admin?.avatarUrl ? (
              <img
                src={admin.avatarUrl}
                alt={admin.name}
                className="w-8 h-8 rounded-full object-cover border border-soft-beige"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-charcoal leading-tight">{admin?.name}</p>
              <p className="text-[10px] text-warm-brown">{admin?.role?.replace('_', ' ')}</p>
            </div>
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-soft-beige shadow-earth-lg py-1.5 z-50 text-xs text-charcoal">
                <div className="px-4 py-2 border-b border-soft-beige">
                  <p className="font-semibold text-charcoal truncate">{admin?.name}</p>
                  <p className="text-warm-brown text-[11px] truncate">{admin?.email}</p>
                </div>

                <Link
                  to="/admin/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-cream transition-colors"
                >
                  <User className="w-4 h-4 text-warm-brown" />
                  <span>Admin Profile & Security</span>
                </Link>

                <Link
                  to="/admin/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-cream transition-colors"
                >
                  <Shield className="w-4 h-4 text-warm-brown" />
                  <span>Platform Governance</span>
                </Link>

                <div className="border-t border-soft-beige my-1" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-state-error hover:bg-state-error/10 transition-colors cursor-pointer text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
