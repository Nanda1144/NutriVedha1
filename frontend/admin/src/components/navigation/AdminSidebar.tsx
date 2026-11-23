import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  FileEdit,
  Store,
  ShoppingBag,
  BellRing,
  BarChart3,
  ScrollText,
  Activity,
  Sliders,
  UserCheck,
  LogOut,
  Leaf,
  X
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { admin, logout, hasPermission } = useAdminAuthStore();

  const sections = [
    {
      title: 'Overview',
      items: [
        { label: 'Control Center', path: '/admin-control', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Identity & Access',
      items: [
        { label: 'Users Directory', path: '/admin/users', icon: Users, permission: 'users:read' },
        { label: 'Administrators', path: '/admin/administrators', icon: ShieldCheck, permission: 'roles:manage' },
        { label: 'Roles & Permissions', path: '/admin/roles', icon: KeyRound, permission: 'roles:manage' },
      ],
    },
    {
      title: 'Platform Control',
      items: [
        { label: 'Content CMS', path: '/admin/content', icon: FileEdit, permission: 'content:write' },
        { label: 'Herbal Catalog', path: '/admin/marketplace', icon: Store, permission: 'marketplace:manage' },
        { label: 'Orders & Dispatch', path: '/admin/orders', icon: ShoppingBag, permission: 'orders:manage' },
        { label: 'Broadcast Center', path: '/admin/notifications', icon: BellRing, permission: 'notifications:broadcast' },
      ],
    },
    {
      title: 'Insights & Compliance',
      items: [
        { label: 'Analytics & Telemetry', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Audit Trail', path: '/admin/audit-logs', icon: ScrollText, permission: 'audit:read' },
      ],
    },
    {
      title: 'System Infrastructure',
      items: [
        { label: 'Services Health', path: '/admin/monitoring', icon: Activity, permission: 'system:monitor' },
        { label: 'System Settings', path: '/admin/settings', icon: Sliders, permission: 'system:settings' },
      ],
    },
    {
      title: 'Admin Account',
      items: [
        { label: 'My Admin Profile', path: '/admin/profile', icon: UserCheck },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-forest/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-soft-beige flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-soft-beige">
          <NavLink to="/admin-control" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-forest flex items-center justify-center text-white shadow-earth-sm">
              <Leaf className="w-5 h-5 text-mint" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-forest block leading-none">
                NutriVedha
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-warm-brown block mt-0.5">
                Enterprise Admin
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-warm-brown hover:bg-cream hover:text-charcoal cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, idx) => {
            const visibleItems = section.items.filter(
              (item) => !item.permission || hasPermission(item.permission)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-warm-brown/80">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => onClose()}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-forest text-white shadow-earth-sm font-semibold'
                              : 'text-charcoal/80 hover:bg-cream hover:text-forest'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Admin Bar */}
        <div className="p-3 border-t border-soft-beige bg-ivory/60 space-y-2">
          {admin && (
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white border border-soft-beige">
              <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0">
                {admin.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-charcoal truncate">{admin.name}</p>
                <p className="text-[10px] text-warm-brown truncate">{admin.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-state-error hover:bg-state-error/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
