import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ShoppingCart,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useNotificationStore } from '../../store/useNotificationStore';

interface UserHeaderProps {
  onToggleSidebar: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ onToggleSidebar }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-gradient-to-r from-white/95 via-[#FAFDF6]/95 to-[#EFF6E7]/95 backdrop-blur-md border-b border-soft-beige shadow-earth-sm px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-charcoal hover:bg-cream lg:hidden"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-brown" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search herbs, recipes, doctors, foods..."
            className="w-full bg-ivory rounded-xl border border-soft-beige pl-10 pr-4 py-2 text-sm text-charcoal placeholder-warm-brown/80 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/25 transition-colors"
          />
        </form>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Cart Button */}
        <Link
          to="/cart"
          className="relative p-2.5 rounded-xl bg-white border border-soft-beige text-charcoal hover:bg-cream hover:border-sage transition-colors shadow-earth-sm"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-4 h-4 text-forest" />
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-forest to-teal text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-earth-sm">
              {totalCartItems}
            </span>
          )}
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            className="relative p-2.5 rounded-xl bg-white border border-soft-beige text-charcoal hover:bg-cream hover:border-sage transition-colors shadow-earth-sm"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-forest" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-state-warning rounded-full" />
            )}
          </button>

          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-soft-beige shadow-earth-lg p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-soft-beige">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-charcoal">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-cream text-[10px] text-forest font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-xs text-teal hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-soft-beige/60 max-h-72 overflow-y-auto my-2">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                      n.isRead ? 'opacity-70 hover:bg-cream/50' : 'bg-cream/60 hover:bg-cream'
                    }`}
                  >
                    <p className="text-xs font-semibold text-charcoal">{n.title}</p>
                    <p className="text-xs text-warm-brown line-clamp-2 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/notifications"
                onClick={() => setNotificationDropdownOpen(false)}
                className="block text-center text-xs font-medium text-teal hover:underline pt-2 border-t border-soft-beige"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-white border border-soft-beige hover:bg-cream hover:border-sage transition-colors shadow-earth-sm"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-forest to-teal text-white text-xs font-display font-bold flex items-center justify-center">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-charcoal max-w-[100px] truncate">
              {user?.fullName?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-warm-brown" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-soft-beige shadow-earth-lg p-2 z-50">
              <div className="px-3 py-2 border-b border-soft-beige mb-1">
                <p className="text-sm font-semibold text-charcoal">{user?.fullName}</p>
                <p className="text-[11px] text-warm-brown truncate">{user?.email}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-teal font-medium">
                  <ShieldCheck className="w-3 h-3 text-teal" />
                  <span>Authenticated Patient</span>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-charcoal hover:bg-cream transition-colors"
              >
                <UserIcon className="w-4 h-4 text-warm-brown" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-charcoal hover:bg-cream transition-colors"
              >
                <Settings className="w-4 h-4 text-warm-brown" />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-state-error hover:bg-state-error/10 transition-colors mt-1 border-t border-soft-beige"
              >
                <LogOut className="w-4 h-4 text-state-error" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
