import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAuthStore } from '../store/useAuthStore';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('pavan.verma@ayurai.health');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({
        identifier,
        password: useOtp ? undefined : password,
        otp: useOtp ? '881920' : undefined,
        rememberMe,
      });
      navigate('/dashboard');
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-dark via-forest to-teal text-white flex items-center justify-center mx-auto shadow-earth-md ring-1 ring-mint/30">
            <Leaf className="w-6 h-6 text-mint-light" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Sign In to NutriVedha</h1>
          <p className="text-xs text-warm-brown">
            Access your personalized Ayurvedic health dashboard & encrypted records.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 bg-white">
          {error && (
            <div className="p-3 bg-state-error/10 border border-state-error/30 rounded-xl flex items-center gap-2.5 text-xs text-[#A9443D]">
              <AlertCircle className="w-4 h-4 shrink-0 text-state-error" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex border-b border-soft-beige pb-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setUseOtp(false); clearError(); }}
              className={`flex-1 pb-1 text-center transition-colors ${!useOtp ? 'text-forest border-b-2 border-forest' : 'text-warm-brown hover:text-charcoal'}`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setUseOtp(true); clearError(); }}
              className={`flex-1 pb-1 text-center transition-colors ${useOtp ? 'text-forest border-b-2 border-forest' : 'text-warm-brown hover:text-charcoal'}`}
            >
              Mobile OTP Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={useOtp ? 'Mobile Number' : 'Email or Mobile'}
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={useOtp ? '+91 98765 43210' : 'name@example.com'}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            {!useOtp ? (
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">Verification OTP</label>
                  <button
                    type="button"
                    onClick={() => setOtpSent(true)}
                    className="text-xs text-forest hover:underline font-semibold"
                  >
                    {otpSent ? 'Resend OTP' : 'Send Code'}
                  </button>
                </div>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP (e.g. 881920)"
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-charcoal">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-soft-beige text-forest focus:ring-forest"
                />
                <span>Remember session</span>
              </label>

              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset verification link has been dispatched to your email.'); }} className="text-forest hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Initialize Session
            </Button>
          </form>

          <div className="pt-4 border-t border-soft-beige text-center text-xs text-warm-brown">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-forest font-semibold hover:underline">
              Create free patient account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
