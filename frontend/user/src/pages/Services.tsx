import React from 'react';
import { Link } from 'react-router-dom';
import {
  ScanEye,
  UtensilsCrossed,
  BookOpen,
  Apple,
  Dumbbell,
  Stethoscope,
  BotMessageSquare,
  HandMetal,
  Store,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const Services: React.FC = () => {
  const servicesList = [
    {
      title: 'AI Health & Disease Scan',
      icon: ScanEye,
      route: '/scan',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Multimodal symptom and dermatological photo screening with constitutional dosha analysis and rule-based fail-safe logic.',
    },
    {
      title: '7-Day Ayurvedic Diet Planner',
      icon: UtensilsCrossed,
      route: '/diet',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Customized seasonal meal schedules broken down by breakfast, lunch, and dinner, complete with auto-generated grocery lists.',
    },
    {
      title: 'Ayurvedic Recipe Generator',
      icon: BookOpen,
      route: '/recipes',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Pantry-based recipe discovery with dosha affinity indicators, step-by-step cooking directions, and therapeutic benefits.',
    },
    {
      title: 'Food & Botanical Intelligence',
      icon: Apple,
      route: '/food-intel',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Deep nutritional and Ayurvedic encyclopedia profiling Rasa (taste), Virya (potency), and Vipaka (post-digestive effect).',
    },
    {
      title: 'Circadian Fitness & Yoga',
      icon: Dumbbell,
      route: '/fitness',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Guided yoga asanas and movement regimens calibrated to balance specific bio-energetic doshas without strain.',
    },
    {
      title: 'Doctor Discovery & Telemedicine',
      icon: Stethoscope,
      route: '/telemedicine',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Browse verified Ayurvedic physicians and Vaidyas, inspect clinical credentials, and book video or clinic consultation slots.',
    },
    {
      title: 'Farm-to-Home Herb Marketplace',
      icon: Store,
      route: '/marketplace',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Certified organic single herbs, medicinal A2 bilona ghee, and wellness rasayanas with 5-step milestone tracking.',
    },
    {
      title: 'AES-256 Encrypted Medical Vault',
      icon: FileText,
      route: '/reports',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Cryptographically protected personal health records vault with tamper-evident authenticated tags and instant downloads.',
    },
    {
      title: 'Vaidya AI Health Assistant',
      icon: BotMessageSquare,
      route: '/ai-assistant',
      status: 'Live & Operational',
      badgeVariant: 'success' as const,
      desc: 'Conversational assistant providing instant answers on Ayurvedic herbs, digestive agni balancing, and seasonal routines.',
    },
    {
      title: 'Sign Language AI Assistance',
      icon: HandMetal,
      route: '/sign-ai',
      status: 'Simulated Demo',
      badgeVariant: 'warning' as const,
      desc: 'Accessible camera feed translation converting visual health gestures to synthesized speech and text for deaf patients.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest">Integrated Offerings</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">User Healthcare Services</h1>
        <p className="text-sm text-warm-brown max-w-2xl mx-auto">
          Explore our complete suite of precision Ayurvedic intelligence and HealthTech modules designed for your daily wellbeing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((svc) => {
          const Icon = svc.icon;
          return (
            <Card key={svc.title} hoverable className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-forest">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={svc.badgeVariant}>{svc.status}</Badge>
                </div>
                <h3 className="text-base font-semibold text-charcoal">{svc.title}</h3>
                <p className="text-xs text-warm-brown leading-relaxed">{svc.desc}</p>
              </div>

              <div className="pt-3 border-t border-soft-beige">
                <Link
                  to={svc.route}
                  className="inline-flex items-center text-xs font-semibold text-forest hover:underline gap-1.5"
                >
                  Access Service <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
