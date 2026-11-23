import React from 'react';
import { Leaf, ShieldCheck, Heart, Sparkles, Sprout, BrainCircuit } from 'lucide-react';
import { Card } from '../components/common/Card';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest">Philosophy & Purpose</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">About NutriVedha</h1>
        <p className="text-sm text-warm-brown max-w-2xl mx-auto leading-relaxed">
          Unifying traditional Ayurvedic diagnostic wisdom with modern clinical machine intelligence, verifiable organic agriculture, and zero-compromise patient data sovereignty.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
            <Leaf className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-serif font-semibold text-charcoal">Our Core Mission</h2>
          <p className="text-xs text-warm-brown leading-relaxed">
            To make authentic, customized, preventive Ayurvedic healthcare universally accessible, evidence-informed, and transparent. We replace superficial wellness trends with personalized constitutional biology rooted in the Tridosha framework.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-olive/15 flex items-center justify-center text-olive">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-serif font-semibold text-charcoal">Our Vision</h2>
          <p className="text-xs text-warm-brown leading-relaxed">
            An integrated digital health paradigm where patients manage their health records securely, practitioners collaborate transparently, and organic farmers receive dignified direct compensation for pure medicinal herbs.
          </p>
        </Card>
      </div>

      {/* Ayurvedic Philosophy Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-charcoal text-center">Ayurvedic Tenets in Modern Code</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="earth-card p-5 space-y-2.5 bg-white">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Tridosha Balance</span>
            <h3 className="text-sm font-semibold text-charcoal">Vata, Pitta, and Kapha</h3>
            <p className="text-xs text-warm-brown leading-relaxed">
              Every human constitution is a unique balance of movement (Vata), metabolism (Pitta), and structure (Kapha). Health is the harmonious equilibrium of these biological forces.
            </p>
          </div>

          <div className="earth-card p-5 space-y-2.5 bg-white">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Ahara as Aushadha</span>
            <h3 className="text-sm font-semibold text-charcoal">Food as Sacred Medicine</h3>
            <p className="text-xs text-warm-brown leading-relaxed">
              When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need. Our algorithms prioritize whole, seasonal, non-inflammatory foods over synthetic isolates.
            </p>
          </div>

          <div className="earth-card p-5 space-y-2.5 bg-white">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Dinacharya</span>
            <h3 className="text-sm font-semibold text-charcoal">Circadian Bio-Rhythms</h3>
            <p className="text-xs text-warm-brown leading-relaxed">
              Aligning meal times, breathwork, and physical movement with the sun's trajectory and cellular circadian clocks maximizes vitality (Ojas) and prevents metabolic sludge (Ama).
            </p>
          </div>
        </div>
      </section>

      {/* Technology & Social Impact */}
      <section className="earth-card p-8 bg-cream/30 space-y-6">
        <h2 className="text-xl font-serif font-bold text-charcoal">Technology & Ethical Commitments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-warm-brown leading-relaxed">
          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-charcoal mb-0.5">Zero Compromise on Patient Security</p>
              Your health reports are encrypted at rest with AES-256-GCM authenticated cipher. We never sell or share patient demographic records with third-party advertisers.
            </div>
          </div>
          <div className="flex gap-3">
            <Sprout className="w-5 h-5 text-forest shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-charcoal mb-0.5">Empowering Organic Cultivators</p>
              We bypass exploitative middlemen, connecting certified organic herb farmers directly with consumers, ensuring fair-trade prices and verifiable botanical origin.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
