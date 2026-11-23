import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAuthStore } from '../store/useAuthStore';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }

    if (!formData.agreeToTerms) {
      setValidationError('Please accept the Terms of Service & Health Privacy Policy.');
      return;
    }

    try {
      await signup(formData);
      navigate('/dashboard');
    } catch {
      // Handled by store
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-dark via-forest to-teal text-white flex items-center justify-center mx-auto shadow-earth-md ring-1 ring-mint/30">
            <Leaf className="w-6 h-6 text-mint-light" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Join NutriVedha</h1>
          <p className="text-xs text-warm-brown">
            Start your precision Ayurvedic wellness journey with clinical AI guidance.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 bg-white">
          {(error || validationError) && (
            <div className="p-3 bg-state-error/10 border border-state-error/30 rounded-xl flex items-center gap-2.5 text-xs text-[#A9443D]">
              <AlertCircle className="w-4 h-4 shrink-0 text-state-error" />
              <span>{error || validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Nandakishore Verma"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Mobile Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Password (min 8 chars)"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-warm-brown">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-0.5 rounded border-soft-beige text-forest focus:ring-forest"
                />
                <span>
                  I accept the{' '}
                  <span className="text-forest font-semibold hover:underline">Terms of Service</span> and acknowledge that AI recommendations are for preventive wellness, not acute emergency care.
                </span>
              </label>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Patient Account
            </Button>
          </form>

          <div className="pt-4 border-t border-soft-beige text-center text-xs text-warm-brown">
            Already registered?{' '}
            <Link to="/login" className="text-forest font-semibold hover:underline">
              Sign in to your account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
