import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Mail, Shield, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DataTable, Column } from '../components/common/DataTable';
import { adminRoleService } from '../services/adminRoleService';
import { AdminUser, AdminRole } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const AdministratorManagement: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('SYSTEM_OPERATOR');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useAdminNotificationStore();

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await adminRoleService.getAdministrators();
      setAdmins(data);
    } catch (e) {
      addToast('ERROR', 'Failed to retrieve administrator list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('ERROR', 'Name and corporate email are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await adminRoleService.inviteAdministrator({ name, email, role });
      addToast('SUCCESS', `Sent secure onboarding invitation to ${email}.`);
      setInviteModalOpen(false);
      setName('');
      setEmail('');
      fetchAdmins();
    } catch (e: any) {
      addToast('ERROR', e.message || 'Invitation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      header: 'Administrator',
      cell: (a) => (
        <div className="flex items-center gap-2.5">
          {a.avatarUrl ? (
            <img src={a.avatarUrl} alt={a.name} className="w-8 h-8 rounded-full object-cover border border-sand" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-forest text-ivory flex items-center justify-center font-bold text-xs">
              {a.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-charcoal">{a.name}</p>
            <p className="text-[11px] text-warm-brown">{a.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      cell: (a) => {
        const roleLabels: Record<AdminRole, string> = {
          SUPER_ADMIN: 'Super Administrator',
          SYSTEM_OPERATOR: 'System Operator',
          CONTENT_MANAGER: 'Content Manager',
          COMPLIANCE_OFFICER: 'Compliance Officer',
          SUPPORT_SPECIALIST: 'Support Specialist',
        };
        return (
          <Badge variant={a.role === 'SUPER_ADMIN' ? 'warning' : 'neutral'}>
            {roleLabels[a.role] || a.role}
          </Badge>
        );
      },
    },
    {
      header: 'Permissions Scope',
      cell: (a) => (
        <span className="text-xs font-mono text-warm-brown">
          {a.permissions.includes('*') ? 'All Capabilities (*)' : `${a.permissions.length} granular grants`}
        </span>
      ),
    },
    {
      header: 'Account Status',
      cell: (a) => (
        <Badge variant={a.status === 'ACTIVE' ? 'success' : 'danger'}>
          {a.status}
        </Badge>
      ),
    },
    {
      header: 'Last Authentication',
      cell: (a) => (
        <span className="text-xs text-warm-brown">
          {a.lastLogin === 'Never' ? 'Never' : new Date(a.lastLogin).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Administrator Accounts</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Internal governance accounts with elevated privileges, scoped by role-based access policies.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setInviteModalOpen(true)}
        >
          Invite Administrator
        </Button>
      </div>

      {/* Info Notice */}
      <Card className="p-4 bg-cream/30 border border-sand/60 text-xs text-warm-brown flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          NutriVedha strictly prevents self-registration into administrative tiers. All admin invitations require multi-factor onboarding and generate signed cryptographic event records in the immutable audit trail.
        </p>
      </Card>

      {/* Admins Table */}
      <DataTable
        columns={columns}
        data={admins}
        isLoading={isLoading}
        keyExtractor={(a) => a.id}
      />

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Enterprise Administrator"
        maxWidth="md"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dr. Suniti Joshi"
            required
          />

          <Input
            label="Corporate Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="suniti.joshi@nutrivedha.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Select
            label="Administrative Role"
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            options={[
              { value: 'SYSTEM_OPERATOR', label: 'System Operator — Day-to-day moderation & operations' },
              { value: 'CONTENT_MANAGER', label: 'Content Manager — Educational CMS & banners' },
              { value: 'COMPLIANCE_OFFICER', label: 'Compliance Officer — Audit logs & deletion requests' },
              { value: 'SUPER_ADMIN', label: 'Super Administrator — Unrestricted governance' },
            ]}
          />

          <div className="p-3 rounded-lg bg-cream/40 border border-sand/50 text-[11px] text-warm-brown leading-relaxed">
            An encrypted invitation with a single-use time-bound activation token (valid for 24h) will be dispatched to this corporate address.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
