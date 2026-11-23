import React, { useState } from 'react';
import { Bell, CheckCircle2, ShieldCheck, Calendar, PackageCheck, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useNotificationStore } from '../store/useNotificationStore';
import { NotificationItem } from '../types';

export const Notifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Order', 'Appointment', 'Health Alert'];

  const filtered = notifications.filter(
    (n) => selectedCategory === 'All' || n.category === selectedCategory
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Notifications & Alerts</h1>
          <p className="text-xs text-warm-brown mt-0.5">Stay updated on your organic deliveries, doctor consultations, and seasonal Ritucharya tips.</p>
        </div>

        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={() => markAllAsRead()} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 pb-1 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === c ? 'bg-forest text-ivory' : 'bg-cream text-charcoal hover:bg-soft-beige'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-warm-brown text-xs">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                item.isRead ? 'bg-white opacity-85' : 'bg-cream/40 border-forest/30'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={item.category === 'Order' ? 'forest' : item.category === 'Appointment' ? 'pitta' : 'sand'} size="sm">
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-warm-brown">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-charcoal">{item.title}</h3>
                <p className="text-xs text-warm-brown leading-relaxed">{item.message}</p>
              </div>

              {!item.isRead && (
                <button
                  onClick={() => markAsRead(item.id)}
                  className="text-xs text-forest font-semibold hover:underline shrink-0"
                >
                  Mark read
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
