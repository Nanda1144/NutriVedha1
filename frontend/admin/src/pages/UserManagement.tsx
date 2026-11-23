import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  ShieldAlert,
  Eye,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DataTable, Column } from '../components/common/DataTable';
import { Pagination } from '../components/common/Pagination';
import { adminUserService } from '../services/adminUserService';
import { ManagedUser, ManagedUserStatus } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doshaFilter, setDoshaFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [statusModalUser, setStatusModalUser] = useState<ManagedUser | null>(null);
  const [newStatus, setNewStatus] = useState<ManagedUserStatus>('ACTIVE');
  const [statusReason, setStatusReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [deletionModalUser, setDeletionModalUser] = useState<ManagedUser | null>(null);
  const [deletionNotes, setDeletionNotes] = useState('');

  const { addToast } = useAdminNotificationStore();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminUserService.getUsers({
        search,
        status: statusFilter,
        dosha: doshaFilter,
        page,
        limit: 10,
      });
      setUsers(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error(e);
      addToast('ERROR', 'Failed to fetch user directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter, doshaFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleStatusChangeSubmit = async () => {
    if (!statusModalUser) return;
    setIsUpdatingStatus(true);
    try {
      await adminUserService.updateUserStatus(
        statusModalUser.id,
        newStatus,
        statusReason || 'Administrative decision'
      );
      addToast('SUCCESS', `User status updated to ${newStatus}.`);
      setStatusModalUser(null);
      setStatusReason('');
      fetchUsers();
    } catch (e: any) {
      addToast('ERROR', e.message || 'Status update failed.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeletionReview = async (action: 'APPROVE' | 'REJECT') => {
    if (!deletionModalUser) return;
    try {
      await adminUserService.reviewDeletionRequest(
        deletionModalUser.id,
        action,
        deletionNotes || 'Review completed'
      );
      addToast(
        'SUCCESS',
        action === 'APPROVE'
          ? 'Approved statutory 30-day archival retention policy.'
          : 'Erasure request declined.'
      );
      setDeletionModalUser(null);
      setDeletionNotes('');
      fetchUsers();
    } catch (e: any) {
      addToast('ERROR', e.message || 'Deletion review failed.');
    }
  };

  const columns: Column<ManagedUser>[] = [
    {
      header: 'Member Identity',
      cell: (u) => (
        <div className="flex items-center gap-2.5">
          {u.avatarUrl ? (
            <img src={u.avatarUrl} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-sand/40" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-cream text-forest flex items-center justify-center font-bold text-xs border border-sand">
              {u.fullName.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-charcoal">{u.fullName}</p>
            <p className="text-[11px] text-warm-brown">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Mobile & Location',
      cell: (u) => (
        <div>
          <p className="text-charcoal font-medium">{u.mobile}</p>
          <p className="text-[11px] text-warm-brown">{u.city}, {u.state}</p>
        </div>
      ),
    },
    {
      header: 'Dosha Constitution',
      cell: (u) => (
        <Badge variant={u.dosha === 'Unassessed' ? 'neutral' : 'info'}>
          {u.dosha}
        </Badge>
      ),
    },
    {
      header: 'Account Status',
      cell: (u) => {
        const variants: Record<ManagedUserStatus, 'success' | 'danger' | 'warning' | 'neutral'> = {
          ACTIVE: 'success',
          INACTIVE: 'neutral',
          SUSPENDED: 'danger',
          PENDING_DELETION: 'warning',
        };
        return <Badge variant={variants[u.status]}>{u.status.replace('_', ' ')}</Badge>;
      },
    },
    {
      header: 'Registered',
      cell: (u) => (
        <span className="text-xs text-warm-brown">
          {new Date(u.registrationDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUser(u)}
            title="Preview User Record"
          >
            <Eye className="w-4 h-4 text-forest" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusModalUser(u);
              setNewStatus(u.status);
            }}
            title="Modify Status"
          >
            <ShieldAlert className="w-4 h-4 text-warm-brown" />
          </Button>

          {u.status === 'PENDING_DELETION' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletionModalUser(u)}
              title="Review Statutory Deletion"
            >
              <Trash2 className="w-4 h-4 text-state-error" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">User Identity Directory</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Manage authenticated wellness members, review constitutional statuses, and enforce retention governance.
          </p>
        </div>
        <div className="text-xs text-warm-brown">
          Total Directory Count: <strong className="text-charcoal">{total}</strong>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <Card className="p-4 bg-white">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by name, email, mobile or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Account Statuses' },
              { value: 'ACTIVE', label: 'Active Members' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'SUSPENDED', label: 'Suspended' },
              { value: 'PENDING_DELETION', label: 'Pending Deletion Review' },
            ]}
          />

          <Select
            value={doshaFilter}
            onChange={(e) => {
              setDoshaFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Dosha Types' },
              { value: 'Vata', label: 'Vata' },
              { value: 'Pitta', label: 'Pitta' },
              { value: 'Kapha', label: 'Kapha' },
              { value: 'Vata-Pitta', label: 'Vata-Pitta' },
              { value: 'Pitta-Kapha', label: 'Pitta-Kapha' },
              { value: 'Tridoshic', label: 'Tridoshic' },
              { value: 'Unassessed', label: 'Unassessed' },
            ]}
          />
        </form>
      </Card>

      {/* Users DataTable */}
      <div className="space-y-0">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          keyExtractor={(u) => u.id}
          emptyMessage="No wellness members matched the given search filters."
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
          pageSize={10}
        />
      </div>

      {/* View User Profile Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="Member Profile & Telemetry Preview"
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs text-charcoal">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-cream/30 border border-sand/40">
              {selectedUser.avatarUrl ? (
                <img src={selectedUser.avatarUrl} alt={selectedUser.fullName} className="w-14 h-14 rounded-full object-cover border-2 border-forest" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-forest text-ivory flex items-center justify-center font-bold text-lg">
                  {selectedUser.fullName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-forest">{selectedUser.fullName}</h4>
                <p className="text-warm-brown">{selectedUser.email} • {selectedUser.mobile}</p>
                <p className="text-warm-brown">{selectedUser.city}, {selectedUser.state}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-cream/40 border border-sand/40">
                <p className="text-[10px] uppercase font-bold text-warm-brown">Constitutional Dosha</p>
                <p className="font-bold text-forest text-sm mt-0.5">{selectedUser.dosha}</p>
              </div>
              <div className="p-3 rounded-lg bg-cream/40 border border-sand/40">
                <p className="text-[10px] uppercase font-bold text-warm-brown">AI Health Scans</p>
                <p className="font-bold text-forest text-sm mt-0.5">{selectedUser.healthScansCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-cream/40 border border-sand/40">
                <p className="text-[10px] uppercase font-bold text-warm-brown">Apothecary Orders</p>
                <p className="font-bold text-forest text-sm mt-0.5">{selectedUser.ordersCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-cream/40 border border-sand/40">
                <p className="text-[10px] uppercase font-bold text-warm-brown">Teleconsultations</p>
                <p className="font-bold text-forest text-sm mt-0.5">{selectedUser.appointmentsCount}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-sand/60 space-y-2">
              <h5 className="font-semibold text-charcoal">Account Governance Details</h5>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-warm-brown">
                <p>Registration: <strong className="text-charcoal">{new Date(selectedUser.registrationDate).toLocaleString()}</strong></p>
                <p>Last Active: <strong className="text-charcoal">{new Date(selectedUser.lastActive).toLocaleString()}</strong></p>
                <p>Status: <strong className="text-charcoal">{selectedUser.status}</strong></p>
                <p>User ID: <code className="bg-sand/30 px-1 py-0.5 rounded text-charcoal">{selectedUser.id}</code></p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedUser(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Change Status Modal */}
      {statusModalUser && (
        <Modal
          isOpen={!!statusModalUser}
          onClose={() => setStatusModalUser(null)}
          title={`Update Status: ${statusModalUser.fullName}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-warm-brown">
              Select the administrative state for this user account. All transitions are logged to the immutable audit database.
            </p>

            <Select
              label="New Account Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ManagedUserStatus)}
              options={[
                { value: 'ACTIVE', label: 'Active — Full access to all services' },
                { value: 'INACTIVE', label: 'Inactive — Voluntary dormancy' },
                { value: 'SUSPENDED', label: 'Suspended — Restricted due to policy violation' },
                { value: 'PENDING_DELETION', label: 'Pending Deletion — Data retention review' },
              ]}
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                Reason for Status Change (Audit Record)
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="e.g. Account reinstated after KYC verification or suspended per fraud flag."
                rows={3}
                className="w-full rounded-lg border border-sand/70 p-2.5 text-xs text-charcoal focus:border-forest focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setStatusModalUser(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleStatusChangeSubmit}
                isLoading={isUpdatingStatus}
              >
                Apply Status Change
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Statutory Deletion Review Modal */}
      {deletionModalUser && (
        <Modal
          isOpen={!!deletionModalUser}
          onClose={() => setDeletionModalUser(null)}
          title="Statutory Data Erasure Request Review"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-state-warning/10 border border-state-warning/30 text-[#B45309] space-y-1">
              <p className="font-semibold">Patient Privacy Rights Review</p>
              <p className="text-[11px] leading-relaxed">
                User requested deletion under personal data protection guidelines. Healthcare diagnostic logs must observe a statutory cooling retention period before cryptographic pseudonymization.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-cream/30 border border-sand/50">
              <p className="text-warm-brown font-semibold">User Claim:</p>
              <p className="text-charcoal italic mt-0.5">"{deletionModalUser.deletionReason || 'General account deletion request'}"</p>
              <p className="text-[10px] text-warm-brown mt-1">Requested on: {new Date(deletionModalUser.deletionRequestedAt || Date.now()).toLocaleDateString()}</p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                Compliance Review Notes
              </label>
              <textarea
                value={deletionNotes}
                onChange={(e) => setDeletionNotes(e.target.value)}
                placeholder="Document verification of outstanding apothecary orders or clinical liabilities..."
                rows={3}
                className="w-full rounded-lg border border-sand/70 p-2.5 text-xs text-charcoal focus:border-forest focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeletionReview('REJECT')}
              >
                Decline Erasure
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeletionReview('APPROVE')}
              >
                Approve & Archive Under Retention
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
