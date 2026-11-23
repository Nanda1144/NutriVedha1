import React, { useState, useEffect } from 'react';
import { BellRing, Send, Users, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DataTable, Column } from '../components/common/DataTable';
import { adminNotificationService } from '../services/adminNotificationService';
import { AdminNotification } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const NotificationManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [composeModalOpen, setComposeModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<'WELLNESS' | 'SYSTEM' | 'ORDER' | 'PROMOTION'>('WELLNESS');
  const [audience, setAudience] = useState<'ALL_USERS' | 'SELECTED_USERS'>('ALL_USERS');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const { addToast } = useAdminNotificationStore();

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await adminNotificationService.getNotifications();
      setNotifications(data);
    } catch (e) {
      addToast('ERROR', 'Failed to retrieve notification records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      addToast('ERROR', 'Title and message body are required.');
      return;
    }
    setIsBroadcasting(true);
    try {
      await adminNotificationService.broadcastNotification({
        title,
        body,
        category,
        audience,
      });
      addToast('SUCCESS', `Broadcast dispatched to ${audience === 'ALL_USERS' ? 'all 14,820 members' : 'selected users'}.`);
      setComposeModalOpen(false);
      setTitle('');
      setBody('');
      fetchNotifications();
    } catch (e: any) {
      addToast('ERROR', e.message || 'Broadcast failed.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const columns: Column<AdminNotification>[] = [
    {
      header: 'Broadcast Title & Body',
      cell: (n) => (
        <div className="space-y-0.5 max-w-md">
          <p className="font-semibold text-charcoal">{n.title}</p>
          <p className="text-[11px] text-warm-brown line-clamp-1">{n.body}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (n) => (
        <Badge variant={n.category === 'SYSTEM' ? 'warning' : 'info'}>
          {n.category}
        </Badge>
      ),
    },
    {
      header: 'Target Audience',
      cell: (n) => (
        <span className="text-xs text-charcoal font-medium">
          {n.audience.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Delivery Metrics',
      cell: (n) => (
        <div className="text-xs">
          <p className="text-charcoal font-semibold">{n.deliveredCount.toLocaleString()} / {n.targetCount.toLocaleString()}</p>
          <p className="text-[10px] text-warm-brown">{n.readCount.toLocaleString()} read</p>
        </div>
      ),
    },
    {
      header: 'Dispatched By & When',
      cell: (n) => (
        <div className="text-xs">
          <p className="text-charcoal">{n.createdBy}</p>
          <p className="text-[10px] text-warm-brown">{n.sentAt ? new Date(n.sentAt).toLocaleString() : 'Draft'}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Broadcast & Notification Center</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Dispatch seasonal Ritucharya advice, clinical reminders, and urgent maintenance alerts to mobile & web users.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Send className="w-4 h-4" />}
          onClick={() => setComposeModalOpen(true)}
        >
          Compose Broadcast
        </Button>
      </div>

      {/* Broadcast History Table */}
      <DataTable
        columns={columns}
        data={notifications}
        isLoading={isLoading}
        keyExtractor={(n) => n.id}
      />

      {/* Compose Modal */}
      <Modal
        isOpen={composeModalOpen}
        onClose={() => setComposeModalOpen(false)}
        title="Compose System Broadcast"
        maxWidth="md"
      >
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <Input
            label="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Seasonal Ritucharya: Hemanta Transition"
            maxLength={80}
            required
          />

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                Notification Message
              </label>
              <span className="text-[10px] text-warm-brown">{body.length} / 250 chars</span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write concise and clear wellness or platform information..."
              rows={4}
              maxLength={250}
              className="w-full rounded-lg border border-sand/70 p-2 text-xs text-charcoal focus:border-forest focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: 'WELLNESS', label: 'Ayurvedic Wellness' },
                { value: 'SYSTEM', label: 'System Service Alert' },
                { value: 'ORDER', label: 'Apothecary Commerce' },
                { value: 'PROMOTION', label: 'Harvest Promotion' },
              ]}
            />

            <Select
              label="Target Audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value as any)}
              options={[
                { value: 'ALL_USERS', label: 'All Registered Members (14.8k)' },
                { value: 'SELECTED_USERS', label: 'Incomplete Dosha Profiles' },
              ]}
            />
          </div>

          <div className="p-3 rounded-lg bg-cream/40 border border-sand/50 text-[11px] text-warm-brown leading-relaxed">
            Broadcast will be dispatched via Web Push & Notification Service. Changes are non-reversible once broadcasted.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setComposeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isBroadcasting}>
              Confirm & Dispatch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
