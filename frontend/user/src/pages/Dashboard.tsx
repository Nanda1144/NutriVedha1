import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ScanEye,
  UtensilsCrossed,
  Stethoscope,
  Store,
  Dumbbell,
  FileText,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Calendar,
  Package,
  Activity
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuthStore } from '../store/useAuthStore';
import { MOCK_ORDERS } from '../services/mockData';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const recentOrder = MOCK_ORDERS[0];

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-hero rounded-2xl p-6 sm:p-8 text-ivory flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-earth-lg relative overflow-hidden border border-white/10">
        <div className="pointer-events-none absolute -top-16 -right-10 w-64 h-64 rounded-full bg-mint/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 w-60 h-60 rounded-full bg-teal-light/25 blur-3xl" />
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand/20 text-sand text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pitta-Vata Seasonal Care (Late Autumn)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
            Namaste, {user?.fullName?.split(' ')[0] || 'Seeker'}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
            Your Agni is moderately active today. Grounding spices and warm almond ghee are recommended for your morning circadian rhythm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link to="/scan">
            <Button variant="secondary" size="sm" leftIcon={<ScanEye className="w-4 h-4" />}>
              Quick Symptom Scan
            </Button>
          </Link>
          <Link to="/diet">
            <Button variant="outline" size="sm">
              Today's Meal Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Health Overview Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-warm-brown font-medium">
            <span>Constitutional Balance</span>
            <Activity className="w-4 h-4 text-forest" />
          </div>
          <p className="text-xl font-serif font-bold text-charcoal">94.2%</p>
          <div className="flex items-center gap-1.5">
            <Badge variant="pitta" size="sm">Pitta Calm</Badge>
            <span className="text-[10px] text-olive font-medium">+2.4% this week</span>
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-warm-brown font-medium">
            <span>Circadian Streak</span>
            <TrendingUp className="w-4 h-4 text-forest" />
          </div>
          <p className="text-xl font-serif font-bold text-charcoal">7 Days</p>
          <p className="text-[10px] text-warm-brown">Surya Namaskar & CCF Tea logged</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-warm-brown font-medium">
            <span>Upcoming Vaidya Call</span>
            <Calendar className="w-4 h-4 text-forest" />
          </div>
          <p className="text-sm font-semibold text-charcoal truncate">Tomorrow, 11:00 AM</p>
          <p className="text-[10px] text-warm-brown">Dr. Ananya Sharma (Video)</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-xs text-warm-brown font-medium">
            <span>Active Organic Order</span>
            <Package className="w-4 h-4 text-forest" />
          </div>
          <p className="text-sm font-semibold text-charcoal truncate">#NV-2026-88192</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-state-warning animate-pulse" />
            <span className="text-[10px] text-olive font-semibold">Out for Delivery</span>
          </div>
        </Card>
      </div>

      {/* Main Two-Column Dashboard Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Clinical & Daily Routine Actions (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Action Matrix */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal">Quick Wellness Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link to="/scan" className="earth-card p-3.5 text-center hover:border-forest hover:shadow-earth-md hover:-translate-y-0.5 transition-all space-y-2 bg-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest to-teal text-white mx-auto flex items-center justify-center shadow-earth-sm">
                  <ScanEye className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-charcoal">AI Symptom Scan</p>
              </Link>

              <Link to="/diet" className="earth-card p-3.5 text-center hover:border-forest hover:shadow-earth-md hover:-translate-y-0.5 transition-all space-y-2 bg-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-olive to-mint text-white mx-auto flex items-center justify-center shadow-earth-sm">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-charcoal">Diet Schedule</p>
              </Link>

              <Link to="/telemedicine" className="earth-card p-3.5 text-center hover:border-forest hover:shadow-earth-md hover:-translate-y-0.5 transition-all space-y-2 bg-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-teal-light text-white mx-auto flex items-center justify-center shadow-earth-sm">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-charcoal">Consult Vaidya</p>
              </Link>

              <Link to="/marketplace" className="earth-card p-3.5 text-center hover:border-forest hover:shadow-earth-md hover:-translate-y-0.5 transition-all space-y-2 bg-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sand to-[#C98E2E] text-forest mx-auto flex items-center justify-center shadow-earth-sm">
                  <Store className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-charcoal">Organic Store</p>
              </Link>
            </div>
          </div>

          {/* Today's Prescribed Meal Summary */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-soft-beige">
              <div>
                <h3 className="text-base font-serif font-semibold text-charcoal">Today's Ayurvedic Ahara Plan</h3>
                <p className="text-xs text-warm-brown">Pitta-Pacifying • Agni-Balanced</p>
              </div>
              <Link to="/diet">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Full Week
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-cream/40 rounded-xl space-y-1">
                <Badge variant="neutral" size="sm">Breakfast • 08:00 AM</Badge>
                <p className="text-xs font-semibold text-charcoal mt-1">Spiced Ragi Porridge</p>
                <p className="text-[11px] text-warm-brown">Soaked almonds, saffron, warm almond milk.</p>
              </div>

              <div className="p-3 bg-cream/40 rounded-xl space-y-1 border border-sand">
                <Badge variant="forest" size="sm">Lunch • 12:45 PM (Main)</Badge>
                <p className="text-xs font-semibold text-charcoal mt-1">Tridoshic Golden Kitchari</p>
                <p className="text-[11px] text-warm-brown">Yellow moong, aged basmati, cumin & ghee.</p>
              </div>

              <div className="p-3 bg-cream/40 rounded-xl space-y-1">
                <Badge variant="neutral" size="sm">Dinner • 07:15 PM</Badge>
                <p className="text-xs font-semibold text-charcoal mt-1">Lauki Cumin Soup</p>
                <p className="text-[11px] text-warm-brown">Light bottle gourd with fresh coriander.</p>
              </div>
            </div>
          </Card>

          {/* Recent Orders & Delivery Tracker Mini Card */}
          {recentOrder && (
            <Card className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-forest" />
                  <span className="text-xs font-semibold text-charcoal">Active Delivery Tracking</span>
                </div>
                <Link to={`/orders/${recentOrder.id}/track`} className="text-xs text-forest font-semibold hover:underline">
                  Full Timeline →
                </Link>
              </div>

              <div className="p-3.5 bg-cream/30 rounded-xl border border-soft-beige flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-charcoal">{recentOrder.items[0].productTitle}</p>
                  <p className="text-[11px] text-warm-brown">Order #{recentOrder.orderNumber} • ₹{recentOrder.finalAmountINR}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-forest" />
                  <span className="text-xs font-semibold text-forest">Out for Delivery</span>
                  <span className="text-[10px] text-warm-brown">(ETA: Today 6:30 PM)</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Encrypted Vault & Profile Completion (1 Col) */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <Card className="space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal">Profile Status</h3>
              <span className="text-xs font-bold text-gradient-brand">85% Complete</span>
            </div>
            <div className="w-full bg-soft-beige/60 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-forest via-teal to-mint h-full rounded-full w-[85%] shadow-glow-teal" />
            </div>
            <p className="text-xs text-warm-brown leading-relaxed">
              Add your pulse Prakriti assessment from a verified Vaidya to reach 100% precision.
            </p>
            <Link to="/profile">
              <Button variant="outline" size="sm" className="w-full">
                Edit Health Profile
              </Button>
            </Link>
          </Card>

          {/* Secure Medical Vault Snippet */}
          <Card className="space-y-3 bg-white">
            <div className="flex items-center justify-between pb-2 border-b border-soft-beige">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <h3 className="text-xs font-semibold text-charcoal">Medical Vault (AES-256)</h3>
              </div>
              <Link to="/reports" className="text-xs text-forest hover:underline font-medium">
                Vault
              </Link>
            </div>
            <p className="text-xs text-warm-brown">
              2 diagnostic records encrypted and secured with authenticated tamper verification.
            </p>
            <div className="p-2.5 bg-ivory rounded-xl border border-soft-beige text-xs space-y-1">
              <p className="font-semibold text-charcoal">Nadi Pariksha Chart</p>
              <p className="text-[10px] text-warm-brown">Verified by Dr. Ananya Sharma • Oct 2026</p>
            </div>
            <Link to="/reports">
              <Button size="sm" variant="ghost" className="w-full text-xs">
                Upload New Clinical Report
              </Button>
            </Link>
          </Card>

          {/* Seasonal Health Advisory */}
          <div className="earth-card p-4 bg-cream/40 space-y-2 border border-sand">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal">
              <Sparkles className="w-3.5 h-3.5 text-forest" />
              <span>Ayurvedic Ritucharya Tip</span>
            </div>
            <p className="text-xs text-warm-brown leading-relaxed">
              During early winter mornings, practice 5 minutes of gentle oil pulling (*Gandusha*) with cold-pressed sesame oil to strengthen teeth roots and pacify Vata dryness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
