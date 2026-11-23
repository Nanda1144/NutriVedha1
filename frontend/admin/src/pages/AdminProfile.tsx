import React, { useState, useEffect } from 'react';
import { UserCheck, Key, Shield, Smartphone, Laptop, Trash2, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { adminAuthService } from '../services/adminAuthService';
import { AdminSession } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const AdminProfile: React.FC = () => {
  const { admin } = useAdminAuthStore();
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const { addToast } = useAdminNotificationStore();

  const loadSessions = async () => {
    try {
      const data = await adminAuthService.getActiveSessions();
      setSessions(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('ERROR', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      addToast('ERROR', 'Password must be at least 8 characters long.');
      return;
    }
    setIsChangingPass(true);
    try {
      await adminAuthService.changePassword(currentPassword, newPassword);
      addToast('SUCCESS', 'Administrative password updated. Please store it securely.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      addToast('ERROR', e.message || 'Password update failed.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await adminAuthService.revokeSession(sessionId);
      addToast('SUCCESS', 'Session token revoked.');
      loadSessions();
    } catch (e) {
      addToast('ERROR', 'Failed to revoke session.');
    }
  };

  if (!admin) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-soft-beige">
        <h1 className="font-serif text-2xl font-bold text-forest">My Administrator Profile</h1>
        <p className="text-xs text-warm-brown mt-0.5">
          Manage your personal credentials, view active multi-device sessions, and inspect your role assignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <Card className="p-6 bg-white space-y-4">
          <div className="text-center space-y-3">
            {admin.avatarUrl ? (
              <img src={admin.avatarUrl} alt={admin.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-forest shadow-earth-sm" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-forest text-ivory text-2xl font-bold flex items-center justify-center mx-auto shadow-earth-sm">
                {admin.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-base text-charcoal">{admin.name}</h3>
              <p className="text-xs text-warm-brown">{admin.email}</p>
            </div>
            <Badge variant="warning">{admin.role.replace('_', ' ')}</Badge>
          </div>

          <div className="pt-4 border-t border-soft-beige space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-warm-brown">Operator ID:</span>
              <code className="text-charcoal bg-sand/30 px-1 rounded">{admin.id}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-brown">Account Status:</span>
              <span className="text-state-success font-semibold">{admin.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-brown">Permissions Scope:</span>
              <span className="font-mono text-forest">{admin.permissions.includes('*') ? 'Unrestricted (*)' : `${admin.permissions.length} Grants`}</span>
            </div>
          </div>
        </Card>

        {/* Right Columns: Password & Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change Password */}
          <Card className="p-5 bg-white space-y-4">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Key className="w-4 h-4 text-forest" />
              <span>Change Access Password</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="New Secure Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="primary" size="sm" type="submit" isLoading={isChangingPass}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Active Sessions */}
          <Card className="p-5 bg-white space-y-4">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Laptop className="w-4 h-4 text-forest" />
              <span>Active Multi-Device Sessions</span>
            </h3>

            <div className="divide-y divide-soft-beige">
              {sessions.map((sess) => (
                <div key={sess.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-charcoal flex items-center gap-2">
                      <span>{sess.userAgent}</span>
                      {sess.isCurrent && <Badge variant="success" size="sm">Current Device</Badge>}
                    </p>
                    <p className="text-[11px] text-warm-brown font-mono">{sess.ipAddress} • {sess.location}</p>
                    <p className="text-[10px] text-warm-brown">Active: {sess.lastActive}</p>
                  </div>

                  {!sess.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(sess.id)}
                      title="Revoke Session Token"
                    >
                      <Trash2 className="w-4 h-4 text-state-error" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
