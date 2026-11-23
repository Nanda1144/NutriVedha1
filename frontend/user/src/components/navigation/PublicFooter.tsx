import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Sparkles } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-forest-dark via-forest to-teal text-ivory pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-mint">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-xl font-display font-bold text-white">NutriVedha</span>
            </div>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Precision Ayurvedic intelligence bridging ancient constitutional diagnosis with modern artificial intelligence, encrypted clinical health vaults, and organic farm-to-home herb supply chains.
            </p>
            <div className="flex items-center gap-2 text-xs text-mint font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>AES-256 Encrypted Records</span>
            </div>
          </div>

          {/* Clinical & AI Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Ayurvedic AI Services</h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li><Link to="/scan" className="hover:text-mint transition-colors">AI Disease & Symptom Scan</Link></li>
              <li><Link to="/diet" className="hover:text-mint transition-colors">7-Day Dosha Diet Planner</Link></li>
              <li><Link to="/recipes" className="hover:text-mint transition-colors">Ayurvedic Recipe Generator</Link></li>
              <li><Link to="/food-intel" className="hover:text-mint transition-colors">Food & Herb Intelligence</Link></li>
              <li><Link to="/reports" className="hover:text-mint transition-colors">Encrypted Medical Vault</Link></li>
            </ul>
          </div>

          {/* Wellness & Commerce */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Wellness Ecosystem</h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li><Link to="/telemedicine" className="hover:text-mint transition-colors">Find Verified Ayurvedic Doctors</Link></li>
              <li><Link to="/marketplace" className="hover:text-mint transition-colors">Organic Herb Marketplace</Link></li>
              <li><Link to="/fitness" className="hover:text-mint transition-colors">Circadian Yoga & Fitness</Link></li>
              <li><Link to="/sign-ai" className="hover:text-mint transition-colors">Sign Language Health Assist</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-mint transition-colors">Vaidya AI Assistant</Link></li>
            </ul>
          </div>

          {/* Important Disclaimers & Ethics */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Medical Notice</h4>
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-[11px] text-ivory/70 leading-relaxed">
              <p className="font-semibold text-white mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-mint" />
                Preventive Health Platform
              </p>
              NutriVedha provides personalized health intelligence for preventive wellness. It is not an automated medical diagnostic tool. In case of acute or emergency conditions, always seek in-person professional medical evaluation.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/60 gap-3">
          <p>© {new Date().getFullYear()} NutriVedha Systems. All rights reserved. Precision in every grain.</p>
          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-mint">Philosophy</Link>
            <Link to="/developers" className="hover:text-mint">Developers</Link>
            <Link to="/contact" className="hover:text-mint">Privacy & Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
