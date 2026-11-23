import { create } from 'zustand';

export interface ToastAlert {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
  message: string;
  timestamp: number;
}

interface AdminNotificationState {
  toasts: ToastAlert[];
  unreadSystemAlerts: number;
  addToast: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', message: string) => void;
  removeToast: (id: string) => void;
  setUnreadSystemAlerts: (count: number) => void;
}

export const useAdminNotificationStore = create<AdminNotificationState>((set) => ({
  toasts: [],
  unreadSystemAlerts: 3,

  addToast: (type, message) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, timestamp: Date.now() }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setUnreadSystemAlerts: (count) => set({ unreadSystemAlerts: count }),
}));
