import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  ScanEye,
  FileText,
  UtensilsCrossed,
  BookOpen,
  Apple,
  Dumbbell,
  Stethoscope,
  BotMessageSquare,
  HandMetal,
  Store,
  ShoppingCart,
  PackageCheck,
  MapPin,
  Bookmark,
  Bell,
  Settings,
  Leaf,
  X
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useNotificationStore } from '../../store/useNotificationStore';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose }) => {
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const unreadNotifications = useNotificationStore((state) => state.unreadCount);

  const navigationSections = [
    {
      title: 'Core Wellness',
      links: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Health Profile', path: '/profile', icon: User },
        { label: 'Health Scan', path: '/scan', icon: ScanEye },
        { label: 'Medical Reports', path: '/reports', icon: FileText },
      ],
    },
    {
      title: 'Nutrition & Lifestyle',
      links: [
        { label: 'Diet Planner', path: '/diet', icon: UtensilsCrossed },
        { label: 'Recipe Generator', path: '/recipes', icon: BookOpen },
        { label: 'Food Intelligence', path: '/food-intel', icon: Apple },
        { label: 'Fitness & Yoga', path: '/fitness', icon: Dumbbell },
      ],
    },
    {
      title: 'Clinical & Assistance',
      links: [
        { label: 'Doctor Consultation', path: '/telemedicine', icon: Stethoscope },
        { label: 'AI Health Assistant', path: '/ai-assistant', icon: BotMessageSquare },
        { label: 'Sign Language AI', path: '/sign-ai', icon: HandMetal },
      ],
    },
    {
      title: 'Organic Commerce',
      links: [
        { label: 'Herb Marketplace', path: '/marketplace', icon: Store },
        { label: 'My Cart', path: '/cart', icon: ShoppingCart, badge: totalCartItems > 0 ? totalCartItems : undefined },
        { label: 'My Orders', path: '/orders', icon: PackageCheck },
        { label: 'Delivery Tracking', path: '/orders/ord_9921/track', icon: MapPin },
      ],
    },
    {
      title: 'Preferences & Storage',
      links: [
        { label: 'Saved Vault', path: '/saved', icon: Bookmark },
        { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications > 0 ? unreadNotifications : undefined },
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-forest/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gradient-to-b from-white via-[#FAFDF5] to-[#EFF6E6] border-r border-soft-beige flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-forest-dark via-forest to-teal">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white shadow-earth-sm ring-1 ring-white/20">
              <Leaf className="w-5 h-5 text-mint-light" />
            </div>
            <div>
              <span className="text-lg font-display font-bold text-white">NutriVedha</span>
              <span className="block text-[10px] uppercase tracking-widest text-mint-light font-semibold">User Portal</span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-warm-brown/90">
                {section.title}
              </p>
              {section.links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-forest to-teal text-white shadow-earth-md font-semibold'
                          : 'text-charcoal hover:bg-cream hover:text-forest'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && (
                      <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-mint text-forest font-bold">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom User Pill */}
        <div className="p-3 border-t border-soft-beige bg-gradient-to-t from-cream/70 to-transparent">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-soft-beige shadow-earth-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest to-teal text-white flex items-center justify-center text-xs font-bold font-display">
              PV
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-charcoal truncate">Pavan Verma</p>
              <p className="text-[11px] text-teal font-medium">Pitta-Vata Type</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
