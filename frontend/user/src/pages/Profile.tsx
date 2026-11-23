import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  MapPin,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Save
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { userService } from '../services/userService';
import { UserProfile, UserAddress, UserPreferences } from '../types';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'preferences' | 'security'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [p, a, pref] = await Promise.all([
      userService.getProfile(),
      userService.getAddresses(),
      userService.getPreferences(),
    ]);
    setProfile(p);
    setAddresses(a);
    setPreferences(pref);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const updated = await userService.updateProfile(profile);
      setProfile(updated);
      setStatusMessage('Health demographics updated successfully.');
    } catch {
      setStatusMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const added = await userService.addAddress(newAddress);
    setAddresses([...addresses, added]);
    setIsAddressModalOpen(false);
    setNewAddress({
      addressLine1: '',
      addressLine2: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '',
      country: 'India',
      isDefault: false,
    });
  };

  const handleDeleteAddress = async (id: string) => {
    await userService.deleteAddress(id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleExportData = async () => {
    const res = await userService.requestDataExport();
    alert(res.message);
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you certain you wish to request account deletion? All encrypted health records will be permanently purged after 14 days.')) {
      const res = await userService.requestAccountDeletion();
      alert(res.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Personal Health & Account Profile</h1>
        <p className="text-xs text-warm-brown mt-1">Manage your constitutional Prakriti profile, delivery addresses, and privacy settings.</p>
      </div>

      {statusMessage && (
        <div className="p-3 bg-state-success/10 border border-state-success/30 text-[#2F7A4D] rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-state-success" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-soft-beige gap-6 text-xs font-semibold">
        {[
          { key: 'profile', label: 'Health Profile' },
          { key: 'addresses', label: `Delivery Addresses (${addresses.length})` },
          { key: 'preferences', label: 'Diet & Notifications' },
          { key: 'security', label: 'Security & Data Rights' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as any); setStatusMessage(null); }}
            className={`pb-3 transition-colors ${
              activeTab === tab.key
                ? 'text-forest border-b-2 border-forest font-bold'
                : 'text-warm-brown hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Health Profile */}
      {activeTab === 'profile' && profile && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">Constitutional Demographics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                disabled
                value={user?.fullName || ''}
                helperText="Account identity name verified with email"
              />

              <Input
                label="Date of Birth"
                type="date"
                value={profile.dateOfBirth || ''}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
              />

              <Input
                label="Height (cm)"
                type="number"
                value={profile.heightCm || ''}
                onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
              />

              <Input
                label="Weight (kg)"
                type="number"
                value={profile.weightKg || ''}
                onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })}
              />

              <Select
                label="Primary Prakriti Dosha"
                value={profile.primaryDosha || 'Pitta'}
                onChange={(e) => setProfile({ ...profile, primaryDosha: e.target.value as any })}
                options={[
                  { value: 'Vata', label: 'Vata (Air & Space) - Lean, Active, Variable' },
                  { value: 'Pitta', label: 'Pitta (Fire & Water) - Focused, Warm, High Agni' },
                  { value: 'Kapha', label: 'Kapha (Earth & Water) - Calm, Strong, Steady' },
                ]}
              />

              <Select
                label="Blood Group"
                value={profile.bloodGroup || 'O+'}
                onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                options={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                ]}
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button type="submit" size="md" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                Save Profile Demographics
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* Tab 2: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-warm-brown">Saved delivery destinations for organic herbs and farm produce.</p>
            <Button size="sm" onClick={() => setIsAddressModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Add Address
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <Card key={a.id} className="p-4 space-y-2 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal">
                    <MapPin className="w-3.5 h-3.5 text-forest" />
                    <span>{a.city}, {a.state}</span>
                  </div>
                  {a.isDefault && (
                    <span className="px-2 py-0.5 rounded-full bg-cream text-[10px] text-forest font-bold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal/90">{a.addressLine1}</p>
                {a.addressLine2 && <p className="text-xs text-warm-brown">{a.addressLine2}</p>}
                <p className="text-[11px] text-warm-brown">{a.postalCode}, {a.country}</p>
                <div className="pt-2 border-t border-soft-beige flex justify-end">
                  <button
                    onClick={() => handleDeleteAddress(a.id)}
                    className="text-xs text-state-error hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Preferences */}
      {activeTab === 'preferences' && preferences && (
        <Card className="p-6 space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">Dietary & Notification Settings</h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-charcoal block">Dietary Lifestyle</label>
              <select
                value={preferences.dietaryPreference}
                onChange={(e) => setPreferences({ ...preferences, dietaryPreference: e.target.value as any })}
                className="w-full sm:w-80 rounded-xl border border-soft-beige p-2 text-xs bg-white"
              >
                <option value="Vegetarian">Vegetarian (Strict)</option>
                <option value="Vegan">Vegan (Plant-Based)</option>
                <option value="Sattvic">Sattvic (No Onion / Garlic)</option>
                <option value="Ayurvedic-Balanced">Ayurvedic-Balanced</option>
              </select>
            </div>

            <div className="space-y-3 pt-3 border-t border-soft-beige">
              <p className="font-semibold text-charcoal">Communication Channels</p>
              <label className="flex items-center gap-2 cursor-pointer text-warm-brown">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                  className="rounded border-soft-beige text-forest focus:ring-forest"
                />
                <span>Receive email order milestones & appointment confirmations</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-warm-brown">
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
                  className="rounded border-soft-beige text-forest focus:ring-forest"
                />
                <span>Daily Ritucharya Ayurvedic health alerts</span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Security & Rights */}
      {activeTab === 'security' && (
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">GDPR & Clinical Privacy</h3>
            <p className="text-xs text-warm-brown leading-relaxed">
              In accordance with health privacy principles, you possess full ownership of your records. You may export or purge your medical audit log at any moment.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm" onClick={handleExportData} leftIcon={<Download className="w-4 h-4" />}>
              Request Data Export Package
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount} leftIcon={<Trash2 className="w-4 h-4" />}>
              Request Account Deletion
            </Button>
          </div>
        </Card>
      )}

      {/* Add Address Modal */}
      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Add Delivery Address">
        <form onSubmit={handleAddAddress} className="space-y-3.5">
          <Input
            label="Address Line 1"
            required
            value={newAddress.addressLine1}
            onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
            placeholder="Flat, Door Number, Building"
          />
          <Input
            label="Address Line 2 (Optional)"
            value={newAddress.addressLine2}
            onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
            placeholder="Street, Landmark"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              required
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <Input
              label="Postal PIN Code"
              required
              value={newAddress.postalCode}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              placeholder="e.g. 560038"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddressModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
