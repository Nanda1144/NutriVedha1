import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { UserSidebar } from '../components/navigation/UserSidebar';
import { UserHeader } from '../components/navigation/UserHeader';
import { BotMessageSquare, Sparkles } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';

export const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Sidebar */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <UserHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Health Assistant Quick Trigger */}
      <Link
        to="/ai-assistant"
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-br from-forest-dark via-forest to-teal text-white rounded-full shadow-earth-lg hover:shadow-glow-teal hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-mint/40"
        title="Open Vaidya AI Assistant"
      >
        <BotMessageSquare className="w-5 h-5 text-mint" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold">
          Ask Vaidya AI
        </span>
        <Sparkles className="w-3.5 h-3.5 text-mint" />
      </Link>
    </div>
  );
};
