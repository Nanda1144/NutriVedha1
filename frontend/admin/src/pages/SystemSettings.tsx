import React, { useState, useEffect } from 'react';
import { Sliders, ShieldAlert, Lock, CheckSquare, Square, Save, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { adminSettingsService } from '../services/adminSettingsService';
import { SystemSettings as ISystemSettings } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<ISystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Maintenance Toggle confirmation modal
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [pendingMaintenanceState, setPendingMaintenanceState] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  const { addToast } = useAdminNotificationStore();

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminSettingsService.getSettings();
      setSettings(data);
      setMaintenanceMessage(data.maintenanceMessage);
    } catch (e) {
      addToast('ERROR', 'Failed to retrieve system settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      await adminSettingsService.updateSettings(settings);
      addToast('SUCCESS', 'Platform settings committed to configuration repository.');
    } catch (e) {
      addToast('ERROR', 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatureFlag = (key: keyof ISystemSettings['featureFlags']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      featureFlags: {
        ...settings.featureFlags,
        [key]: !settings.featureFlags[key],
      },
    });
  };

  const handleMaintenanceConfirm = async () => {
    try {
      await adminSettingsService.toggleMaintenanceMode(pendingMaintenanceState, maintenanceMessage);
      if (settings) {
        setSettings({ ...settings, maintenanceMode: pendingMaintenanceState, maintenanceMessage });
      }
      addToast(
        pendingMaintenanceState ? 'WARNING' : 'SUCCESS',
        `Platform maintenance mode ${pendingMaintenanceState ? 'ACTIVATED' : 'DEACTIVATED'}.`
      );
      setMaintenanceModalOpen(false);
    } catch (e) {
      addToast('ERROR', 'Failed to toggle maintenance state.');
    }
  };

  if (isLoading || !settings) {
    return <div className="py-20 text-center text-xs text-warm-brown">Loading platform settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">System Settings & Governance</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Configure application identity, global security thresholds, maintenance gates, and feature flags.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Save className="w-4 h-4" />}
          onClick={handleSaveGeneral}
          isLoading={isSaving}
        >
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Application Identity */}
        <Card className="p-5 bg-white space-y-4">
          <h3 className="text-sm font-bold text-charcoal">Platform Identity & Contact</h3>
          <div className="space-y-3 text-xs">
            <Input
              label="Application Name"
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
            />
            <Input
              label="Statutory Clinical Support Email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
            <Input
              label="Emergency Support Hotline"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
            />
          </div>
        </Card>

        {/* Security Policies */}
        <Card className="p-5 bg-white space-y-4">
          <h3 className="text-sm font-bold text-charcoal">Security & Session Policies</h3>
          <div className="space-y-3 text-xs">
            <Input
              label="Admin Session Inactivity Timeout (Minutes)"
              type="number"
              value={settings.sessionTimeoutMinutes}
              onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
            />
            <Input
              label="Max Failed Logins Before IP Lockout"
              type="number"
              value={settings.maxFailedLogins}
              onChange={(e) => setSettings({ ...settings, maxFailedLogins: Number(e.target.value) })}
            />
            <div className="pt-2 flex items-center justify-between border-t border-soft-beige">
              <div>
                <p className="font-semibold text-charcoal">Enforce Admin MFA Policy</p>
                <p className="text-[11px] text-warm-brown">Requires hardware/TOTP passkeys for privileged operators</p>
              </div>
              <Badge variant={settings.mfaRequiredForAdmins ? 'success' : 'warning'}>
                {settings.mfaRequiredForAdmins ? 'Enforced' : 'Optional'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Feature Flags Checklist */}
        <Card className="p-5 bg-white space-y-4">
          <h3 className="text-sm font-bold text-charcoal">Dynamic Feature Flags (User App)</h3>
          <div className="space-y-2.5 text-xs">
            {[
              { key: 'aiScanEnabled', label: 'AI Disease & Symptom Multimodal Scanning' },
              { key: 'telemedicineBookingEnabled', label: 'Doctor Teleconsultation Discovery & Booking' },
              { key: 'farmMarketplaceEnabled', label: 'Certified Organic Farm-to-Home Marketplace' },
              { key: 'signLanguageAssistEnabled', label: 'Indian Sign Language (ISL) Video Health Assist' },
              { key: 'liveChatSupportEnabled', label: 'Vaidya AI Real-time Ayurvedic Assistant' },
            ].map(({ key, label }) => {
              const isEnabled = settings.featureFlags[key as keyof typeof settings.featureFlags];
              return (
                <div
                  key={key}
                  onClick={() => handleToggleFeatureFlag(key as any)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    isEnabled ? 'bg-cream/40 border-forest/40' : 'bg-white border-sand/40 opacity-60'
                  }`}
                >
                  <span className="font-medium text-charcoal">{label}</span>
                  {isEnabled ? (
                    <CheckSquare className="w-4 h-4 text-forest" />
                  ) : (
                    <Square className="w-4 h-4 text-warm-brown/40" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Maintenance Mode Emergency Controls */}
        <Card className="p-5 bg-white space-y-4 border-state-warning/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-state-warning" />
              <span>Platform Maintenance Gate</span>
            </h3>
            <Badge variant={settings.maintenanceMode ? 'danger' : 'success'}>
              {settings.maintenanceMode ? 'ACTIVE MAINTENANCE' : 'SYSTEM OPERATIONAL'}
            </Badge>
          </div>

          <p className="text-xs text-warm-brown leading-relaxed">
            When maintenance mode is activated, all public User Frontend endpoints are gated with a maintenance holding page. Administrator accounts retain authenticated console bypass.
          </p>

          <Button
            variant={settings.maintenanceMode ? 'primary' : 'danger'}
            size="sm"
            onClick={() => {
              setPendingMaintenanceState(!settings.maintenanceMode);
              setMaintenanceModalOpen(true);
            }}
          >
            {settings.maintenanceMode ? 'Deactivate Maintenance Mode' : 'Activate Maintenance Holding Page'}
          </Button>
        </Card>
      </div>

      {/* Maintenance Confirmation Modal */}
      {maintenanceModalOpen && (
        <Modal
          isOpen={maintenanceModalOpen}
          onClose={() => setMaintenanceModalOpen(false)}
          title={pendingMaintenanceState ? 'Confirm Platform Maintenance Activation' : 'Restore Public Platform Services'}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-lg bg-state-warning/10 border border-state-warning/30 text-[#B45309] space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <span>Impact Assessment</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                {pendingMaintenanceState
                  ? 'Activating maintenance mode will immediately suspend patient access to online consultations, scan processing, and order placements.'
                  : 'Deactivating maintenance mode will re-open all public web application routes and reverse proxy routing.'}
              </p>
            </div>

            {pendingMaintenanceState && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                  Holding Notice Message to Patients
                </label>
                <textarea
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-sand/70 p-2 text-xs text-charcoal focus:border-forest focus:outline-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setMaintenanceModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={pendingMaintenanceState ? 'danger' : 'primary'}
                size="sm"
                onClick={handleMaintenanceConfirm}
              >
                Confirm State Transition
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
