import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ScanEye,
  UtensilsCrossed,
  Stethoscope,
  Store,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  Bot
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does NutriVedha integrate classical Ayurveda with modern AI?',
      a: 'NutriVedha uses advanced multimodal AI trained on validated Ayurvedic taxonomies and classical texts (Charaka & Sushruta Samhitas) alongside contemporary medical references. When you input symptoms or upload an image, our engine evaluates constitutional dosha imbalances (Prakriti/Vikriti) and provides safe, evidence-informed herbal and dietary guidance.',
    },
    {
      q: 'Are the health scan results actual medical diagnoses?',
      a: 'No. NutriVedha is an intelligent preventive health and wellness platform. Our AI assists in identifying dosha imbalances and non-acute signs, providing educational recommendations. For clinical diagnoses, users can seamlessly schedule a consultation with our verified Ayurvedic doctors.',
    },
    {
      q: 'How are my personal health reports secured?',
      a: 'All uploaded medical records and clinical scan histories are encrypted at rest using AES-256-GCM authenticated encryption. Your sensitive diagnostic data can only be decrypted with your verified session token.',
    },
    {
      q: 'Where do the organic herbs in the marketplace come from?',
      a: 'Every product is sourced directly from certified organic farmer collectives in regions renowned for medicinal botanical purity (e.g., Kolar, Wayanad, Meghalaya). Each batch is laboratory-tested for purity and heavy metals before dispatch.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-sand text-xs font-semibold text-forest">
              <Sparkles className="w-3.5 h-3.5 text-forest" />
              <span>5,000 Years of Wisdom × Modern HealthTech</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-charcoal leading-[1.15]">
              Precision Ayurvedic Intelligence for <span className="text-gradient-brand italic">Harmonious Health</span>.
            </h1>

            <p className="text-base sm:text-lg text-warm-brown max-w-2xl leading-relaxed">
              Discover your unique Prakriti dosha, analyze health symptoms with intelligent AI screening, receive budget-aware 7-day nutrition plans, and access verified organic herbs directly from sustainable cultivators.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/signup">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Free Assessment
                </Button>
              </Link>
              <Link to="/scan">
                <Button variant="outline" size="lg" leftIcon={<ScanEye className="w-5 h-5" />}>
                  Explore AI Health Scan
                </Button>
              </Link>
            </div>

            {/* Quick Proof Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-soft-beige">
              <div>
                <p className="text-2xl font-serif font-bold text-forest">100%</p>
                <p className="text-xs text-warm-brown">Certified Organic Herbs</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-forest">AES-256</p>
                <p className="text-xs text-warm-brown">Encrypted Medical Vault</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-forest">24/7</p>
                <p className="text-xs text-warm-brown">AI Health Intelligence</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative earth-card p-6 shadow-earth-lg border border-sand space-y-5 bg-white/95">
              <div className="flex items-center justify-between pb-3 border-b border-soft-beige">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-forest" />
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal">Constitutional Insight</span>
                </div>
                <span className="text-[11px] font-semibold text-olive bg-cream px-2.5 py-0.5 rounded-full">
                  Live Screening Demo
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-ivory rounded-xl border border-soft-beige flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-charcoal">Primary Prakriti</p>
                    <p className="text-sm font-serif font-bold text-forest">Pitta-Vata (Fire & Air)</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-state-warning/10 text-[#A9761F] rounded-lg border border-state-warning/30 font-semibold">
                    Digestive Agni: Balanced
                  </span>
                </div>

                <div className="p-3.5 bg-ivory rounded-xl border border-soft-beige space-y-2">
                  <p className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-forest" />
                    Recommended Morning Elixir
                  </p>
                  <p className="text-xs text-warm-brown leading-relaxed">
                    Warm almond milk with Lakadong turmeric, crushed green cardamom, and organic ashwagandha.
                  </p>
                </div>

                <div className="p-3.5 bg-ivory rounded-xl border border-soft-beige flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-forest text-ivory flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-sand" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-charcoal">Verified Ayurvedic Vaidya Consultation</p>
                    <p className="text-[11px] text-warm-brown">Available in 4 regional languages</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/login" className="block text-center text-xs font-semibold text-forest hover:underline">
                  Sign in to view your personalized health dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of NutriVedha */}
      <section className="bg-cream/40 py-16 border-y border-soft-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-forest">Integrated Ecosystem</h2>
            <h3 className="text-3xl font-serif font-bold text-charcoal">Comprehensive Health Architecture</h3>
            <p className="text-sm text-warm-brown">
              Every domain in NutriVedha connects naturally to deliver holistic wellness from diagnosis to recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="earth-card p-6 space-y-4 bg-white">
              <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                <ScanEye className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-semibold text-charcoal">AI Health & Symptom Scan</h4>
              <p className="text-xs text-warm-brown leading-relaxed">
                Upload symptom photos or describe wellness concerns. Our clinical AI model evaluates dosha characteristics with rule-based fail-safe logic.
              </p>
              <Link to="/scan" className="inline-flex items-center text-xs font-semibold text-forest hover:underline gap-1">
                Try symptom scan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="earth-card p-6 space-y-4 bg-white">
              <div className="w-12 h-12 rounded-xl bg-olive/15 flex items-center justify-center text-olive">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-semibold text-charcoal">7-Day Ayurvedic Diet Plans</h4>
              <p className="text-xs text-warm-brown leading-relaxed">
                Budget-conscious meal schedules tailored to seasonal changes (*Ritucharya*) and dosha balance, complete with auto-generated grocery lists.
              </p>
              <Link to="/diet" className="inline-flex items-center text-xs font-semibold text-forest hover:underline gap-1">
                Explore diet planner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="earth-card p-6 space-y-4 bg-white">
              <div className="w-12 h-12 rounded-xl bg-warm-brown/15 flex items-center justify-center text-warm-brown">
                <Store className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-semibold text-charcoal">Farm-to-Home Herb Marketplace</h4>
              <p className="text-xs text-warm-brown leading-relaxed">
                100% pure Ayurvedic botanicals and organic staples shipped directly from verified cultivators with transparent 5-step delivery tracking.
              </p>
              <Link to="/marketplace" className="inline-flex items-center text-xs font-semibold text-forest hover:underline gap-1">
                Browse marketplace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-forest">Simple Four-Step Workflow</h2>
          <h3 className="text-3xl font-serif font-bold text-charcoal">How NutriVedha Guides Your Health</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Discover Your Dosha',
              desc: 'Complete an initial constitutional self-assessment to identify your baseline Prakriti and current Vikriti imbalance.',
            },
            {
              step: '02',
              title: 'Screen Symptoms with AI',
              desc: 'Use multimodal symptom and photo scan to understand root bio-energy deviations without guesswork.',
            },
            {
              step: '03',
              title: 'Adopt Personalized Regimens',
              desc: 'Follow custom 7-day seasonal meals, circadian yoga flows, and target single herbs to soothe imbalances.',
            },
            {
              step: '04',
              title: 'Consult & Measure Progress',
              desc: 'Schedule consultations with verified Vaidyas and store encrypted lab reports safely in your personal vault.',
            },
          ].map((item) => (
            <div key={item.step} className="earth-card p-6 space-y-3 bg-white relative">
              <span className="text-3xl font-serif font-bold text-sand/60">{item.step}</span>
              <h4 className="text-base font-semibold text-charcoal">{item.title}</h4>
              <p className="text-xs text-warm-brown leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream/30 py-16 border-y border-soft-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Real Experiences from Our Community</h3>
            <p className="text-xs text-warm-brown">Patients, wellness seekers, and organic consumers sharing their recovery journeys.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Kavitha Ramachandran',
                role: 'Software Architect, Bengaluru',
                quote: 'The Pitta-pacifying diet plan completely eliminated my chronic afternoon acidity. Having recipes that use simple kitchen herbs is revolutionary.',
              },
              {
                name: 'Sunil Kulkarni',
                role: 'Yoga Instructor, Pune',
                quote: 'The authenticity of their Kolar Ashwagandha and Lakadong Turmeric is unmatched. It is rare to see an app that values purity over flashy gimmicks.',
              },
              {
                name: 'Dr. Shruti Hegde',
                role: 'B.A.M.S. Practitioner, Mysuru',
                quote: 'NutriVedha respects classical Ayurvedic diagnostic principles. The encrypted report vault gives my patients true data sovereignty.',
              },
            ].map((t, idx) => (
              <div key={idx} className="earth-card p-6 space-y-4 bg-white flex flex-col justify-between">
                <p className="text-xs text-charcoal/90 italic leading-relaxed">"{t.quote}"</p>
                <div className="pt-2 border-t border-soft-beige">
                  <p className="text-xs font-semibold text-forest">{t.name}</p>
                  <p className="text-[10px] text-warm-brown">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Frequently Asked Questions</h3>
          <p className="text-xs text-warm-brown">Everything you need to know about our technology and Ayurvedic standards.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="earth-card bg-white overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-charcoal hover:bg-cream/30 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-forest" /> : <ChevronDown className="w-4 h-4 text-warm-brown" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-warm-brown leading-relaxed border-t border-soft-beige/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-hero rounded-3xl p-8 sm:p-12 text-ivory text-center space-y-6 shadow-earth-lg relative overflow-hidden border border-white/10">
          <div className="pointer-events-none absolute -top-20 -left-10 w-64 h-64 rounded-full bg-mint/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 w-72 h-72 rounded-full bg-teal-light/25 blur-3xl" />
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-ivory">Begin Your Ayurvedic Wellness Path Today</h3>
            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
              Create your profile in 60 seconds. Unlock personalized diet intelligence, symptom screening, and farm-fresh Ayurvedic botanicals.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/signup">
                <Button variant="secondary" size="lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
