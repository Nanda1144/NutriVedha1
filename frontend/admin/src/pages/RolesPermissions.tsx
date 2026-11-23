import React, { useState, useEffect } from 'react';
import { KeyRound, Shield, Layers, CheckSquare, Square, Info } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { adminRoleService } from '../services/adminRoleService';
import { RoleDefinition } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'FUTURE'>('SYSTEM');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useAdminNotificationStore();

  const ALL_CAPABILITIES = [
    { code: 'users:read', label: 'Inspect Patient & Member Directories' },
    { code: 'users:write', label: 'Update Account Status & Verify KYC' },
    { code: 'users:delete_review', label: 'Review Statutory Data Erasure Claims' },
    { code: 'roles:manage', label: 'Manage Admin Accounts & Permissions Matrix' },
    { code: 'content:write', label: 'Author & Publish Educational Content and FAQs' },
    { code: 'marketplace:manage', label: 'Configure Herbal Apothecary & Stock' },
    { code: 'orders:manage', label: 'Process Logistics, Carriers & Milestones' },
    { code: 'notifications:broadcast', label: 'Dispatch Global System & Seasonal Alerts' },
    { code: 'audit:read', label: 'Inspect Immutable Administrative Telemetry' },
    { code: 'system:monitor', label: 'Diagnose 11 Decoupled Microservice Latency' },
    { code: 'system:settings', label: 'Toggle Maintenance Mode & Security Flags' },
  ];

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const data = await adminRoleService.getRoles();
      setRoles(data);
      if (data.length > 0) {
        setSelectedRole(data[0]);
      }
    } catch (e) {
      addToast('ERROR', 'Failed to load roles matrix.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleToggleCapability = (code: string) => {
    if (!selectedRole || selectedRole.name === 'SUPER_ADMIN' || selectedRole.isFutureRole) return;

    const current = [...selectedRole.permissions];
    const exists = current.includes(code);
    const updated = exists ? current.filter((p) => p !== code) : [...current, code];

    setSelectedRole({
      ...selectedRole,
      permissions: updated,
    });
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    try {
      await adminRoleService.updateRolePermissions(selectedRole.id, selectedRole.permissions);
      addToast('SUCCESS', `Permissions saved for role: ${selectedRole.displayName}.`);
      fetchRoles();
    } catch (e: any) {
      addToast('ERROR', e.message || 'Failed to update permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const systemRoles = roles.filter((r) => !r.isFutureRole);
  const futureRoles = roles.filter((r) => r.isFutureRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Roles & Permissions Matrix</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Role-Based Access Control (RBAC) governance and future professional module integration boundaries.
          </p>
        </div>
        <div className="flex rounded-lg border border-sand bg-cream/40 p-1 text-xs">
          <button
            onClick={() => {
              setActiveTab('SYSTEM');
              if (systemRoles.length > 0) setSelectedRole(systemRoles[0]);
            }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'SYSTEM' ? 'bg-forest text-ivory shadow-earth-sm' : 'text-charcoal'
            }`}
          >
            System Roles (Current)
          </button>
          <button
            onClick={() => {
              setActiveTab('FUTURE');
              if (futureRoles.length > 0) setSelectedRole(futureRoles[0]);
            }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'FUTURE' ? 'bg-forest text-ivory shadow-earth-sm' : 'text-charcoal'
            }`}
          >
            Future Roles (Phase 2+)
          </button>
        </div>
      </div>

      {activeTab === 'FUTURE' && (
        <Card className="p-4 bg-cream/30 border border-sand/70 text-xs text-warm-brown flex items-start gap-3">
          <Info className="w-5 h-5 text-forest shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-charcoal font-semibold">Architectural Boundary Preservation:</strong>
            <p className="leading-relaxed">
              These role definitions (Doctor, Trainer, Farmer, Delivery) establish compatibility with the future professional portals. In Phase 1, their database relations and permission schemas are preserved without exposing their business portals.
            </p>
          </div>
        </Card>
      )}

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 px-1">
            {activeTab === 'SYSTEM' ? 'Active Administrative Roles' : 'Future Module Entities'}
          </h3>

          {(activeTab === 'SYSTEM' ? systemRoles : futureRoles).map((role) => (
            <Card
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`p-4 transition-all cursor-pointer border ${
                selectedRole?.id === role.id
                  ? 'border-forest bg-forest/5 shadow-earth-sm'
                  : 'hover:border-sand bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-forest">{role.displayName}</span>
                <Badge variant={role.isFutureRole ? 'info' : role.name === 'SUPER_ADMIN' ? 'warning' : 'neutral'}>
                  {role.isFutureRole ? 'Phase 2' : `${role.userCount} Admin`}
                </Badge>
              </div>
              <p className="text-xs text-warm-brown leading-relaxed">{role.description}</p>
            </Card>
          ))}
        </div>

        {/* Permissions Configuration Pane */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <Card className="p-6 bg-white space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-soft-beige">
                <div>
                  <h3 className="text-base font-bold text-forest">{selectedRole.displayName}</h3>
                  <p className="text-xs text-warm-brown font-mono mt-0.5">Role Identifier: {selectedRole.name}</p>
                </div>
                {!selectedRole.isFutureRole && selectedRole.name !== 'SUPER_ADMIN' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveRolePermissions}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                )}
              </div>

              {selectedRole.name === 'SUPER_ADMIN' ? (
                <div className="p-4 rounded-xl bg-state-warning/10 border border-state-warning/30 text-[#B45309] text-xs">
                  <p className="font-semibold">Unrestricted Administrative Privilege</p>
                  <p className="text-[11px] mt-1">
                    The Super Administrator role inherently bypasses capability gates and possesses full write/delete authority across all microservice domains.
                  </p>
                </div>
              ) : selectedRole.isFutureRole ? (
                <div className="p-4 rounded-xl bg-teal/10 border border-teal/25 text-teal text-xs space-y-2">
                  <p className="font-semibold">Future Module Role Boundary</p>
                  <p className="text-[11px] leading-relaxed">
                    This role is mapped to future professional portal endpoints:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedRole.permissions.map((p) => (
                      <span key={p} className="px-2 py-1 rounded bg-white text-teal border border-teal/30 font-mono text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                    Assigned Permission Codes
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ALL_CAPABILITIES.map((cap) => {
                      const isGranted = selectedRole.permissions.includes(cap.code);
                      return (
                        <div
                          key={cap.code}
                          onClick={() => handleToggleCapability(cap.code)}
                          className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 cursor-pointer transition-colors ${
                            isGranted
                              ? 'bg-cream/40 border-forest/40 text-forest font-medium'
                              : 'bg-white border-sand/40 text-charcoal/60 hover:bg-cream/10'
                          }`}
                        >
                          <span className="mt-0.5">
                            {isGranted ? (
                              <CheckSquare className="w-4 h-4 text-forest" />
                            ) : (
                              <Square className="w-4 h-4 text-warm-brown/40" />
                            )}
                          </span>
                          <div>
                            <p className="leading-snug">{cap.label}</p>
                            <code className="text-[10px] text-warm-brown font-mono mt-0.5 block">{cap.code}</code>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-12 text-center text-xs text-warm-brown">
              Select a role from the left pane to view or customize assigned permission gates.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
