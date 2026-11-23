import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/navigation/AdminSidebar';
import { AdminHeader } from '../components/navigation/AdminHeader';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, removeToast } = useAdminNotificationStore();

  const toastIcons = {
    SUCCESS: <CheckCircle2 className="w-4 h-4 text-state-success" />,
    WARNING: <AlertTriangle className="w-4 h-4 text-state-warning" />,
    INFO: <Info className="w-4 h-4 text-teal" />,
    ERROR: <XCircle className="w-4 h-4 text-state-error" />,
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Admin Collapsible Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Pane */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Enterprise Toast Notifications Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white border border-soft-beige rounded-xl p-3.5 shadow-earth-lg flex items-start gap-3 transition-all transform translate-y-0"
          >
            <span className="shrink-0 mt-0.5">{toastIcons[toast.type]}</span>
            <p className="flex-1 text-xs text-charcoal font-medium leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded text-warm-brown hover:text-charcoal cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
