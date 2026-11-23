import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Bell, Lock, Save, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Settings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Account & Security Settings</h1>
        <p className="text-xs text-warm-brown mt-0.5">Manage session preferences, communication frequencies, and clinical privacy parameters.</p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-state-success/10 border border-state-success/30 text-[#2F7A4D] rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-state-success" />
          <span>Security & preference settings saved.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Preferences */}
        <Card className="p-6 space-y-4 bg-white">
          <div className="flex items-center gap-2 pb-2 border-b border-soft-beige">
            <Bell className="w-4 h-4 text-forest" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Notification Preferences</h3>
          </div>

          <div className="space-y-3 text-xs text-charcoal">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Order Delivery & Logistics Updates (SMS & Email)</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-soft-beige text-forest focus:ring-forest"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>Daily Ayurvedic Circadian & Ritucharya Tips</span>
              <input
                type="checkbox"
                checked={pushAlerts}
                onChange={(e) => setPushAlerts(e.target.checked)}
                className="rounded border-soft-beige text-forest focus:ring-forest"
              />
            </label>
          </div>
        </Card>

        {/* Security & Password */}
        <Card className="p-6 space-y-4 bg-white">
          <div className="flex items-center gap-2 pb-2 border-b border-soft-beige">
            <Lock className="w-4 h-4 text-forest" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Password & Authentication</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center justify-between cursor-pointer text-xs text-charcoal">
              <div>
                <span className="font-semibold block">Enable Two-Factor Authentication (OTP on Login)</span>
                <span className="text-warm-brown text-[11px]">Dispatches a 6-digit cryptographic verification code to your verified mobile number.</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="rounded border-soft-beige text-forest focus:ring-forest"
              />
            </label>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="md" leftIcon={<Save className="w-4 h-4" />}>
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
