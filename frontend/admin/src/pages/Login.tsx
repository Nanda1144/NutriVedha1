import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@nutrivedha.com');
  const [password, setPassword] = useState('Admin@Nutri2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const { login, isLoading, error } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isSessionExpired = queryParams.get('session_expired') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError('Please enter both administrator email and password.');
      return;
    }

    try {
      await login({ email, password, rememberMe });
      navigate('/admin-control');
    } catch (err: any) {
      // handled by store
    }
  };

  const handleQuickLogin = (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('Admin@Nutri2026');
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-forest flex items-center justify-center text-ivory mx-auto shadow-earth-md mb-3">
          <Leaf className="w-7 h-7 text-sand" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-forest tracking-tight">
          NutriVedha Enterprise
        </h2>
        <p className="text-xs text-warm-brown mt-1">
          Precision Ayurvedic Intelligence & Integrated HealthTech Administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-sand/70 shadow-earth-lg space-y-6">
          <div className="border-b border-soft-beige pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-charcoal">Control Console Login</h3>
              <p className="text-xs text-warm-brown">Restricted to authorized administrative staff.</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-forest" />
          </div>

          {isSessionExpired && (
            <div className="p-3 rounded-lg bg-state-warning/10 border border-state-warning/30 text-[#B45309] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Your administrative session has expired. Please re-authenticate.</span>
            </div>
          )}

          {(error || localError) && (
            <div className="p-3 rounded-lg bg-state-error/10 border border-state-error/30 text-state-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error || localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nutrivedha.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-brown/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-sand/70 bg-white pl-9 pr-10 py-2 text-sm text-charcoal placeholder-charcoal/40 focus:border-forest focus:ring-1 focus:ring-forest focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-warm-brown/60 hover:text-charcoal cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-sand text-forest focus:ring-forest"
                />
                <span>Keep session active (8h)</span>
              </label>
              <span className="text-warm-brown hover:underline cursor-pointer">
                Trouble logging in?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In to Control Center
            </Button>
          </form>

          {/* Development Quick Role Switcher */}
          <div className="pt-4 border-t border-soft-beige">
            <p className="text-[11px] font-semibold text-charcoal/60 uppercase tracking-wider mb-2 text-center">
              Development Test Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@nutrivedha.com')}
                className="p-2 rounded-lg bg-cream/50 hover:bg-cream border border-sand/60 text-left text-charcoal transition-colors cursor-pointer"
              >
                <strong className="block text-[11px] text-forest">Super Admin</strong>
                <span className="text-[10px] text-warm-brown">admin@nutrivedha.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ops@nutrivedha.com')}
                className="p-2 rounded-lg bg-cream/50 hover:bg-cream border border-sand/60 text-left text-charcoal transition-colors cursor-pointer"
              >
                <strong className="block text-[11px] text-forest">System Ops</strong>
                <span className="text-[10px] text-warm-brown">ops@nutrivedha.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('content@nutrivedha.com')}
                className="p-2 rounded-lg bg-cream/50 hover:bg-cream border border-sand/60 text-left text-charcoal transition-colors cursor-pointer"
              >
                <strong className="block text-[11px] text-forest">Content Mgr</strong>
                <span className="text-[10px] text-warm-brown">content@nutrivedha.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('compliance@nutrivedha.com')}
                className="p-2 rounded-lg bg-cream/50 hover:bg-cream border border-sand/60 text-left text-charcoal transition-colors cursor-pointer"
              >
                <strong className="block text-[11px] text-forest">Compliance</strong>
                <span className="text-[10px] text-warm-brown">compliance@nutrivedha.com</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-warm-brown">
          <p>NutriVedha Enterprise Governance • HIPAA & ISO 27001 Compliant Architecture</p>
        </div>
      </div>
    </div>
  );
};
