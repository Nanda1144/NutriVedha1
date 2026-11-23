import React from 'react';
import { Github, Linkedin, Mail, Code2, ShieldAlert } from 'lucide-react';
import { Card } from '../components/common/Card';

export const Developers: React.FC = () => {
  const team = [
    {
      name: 'Nandakishore Verma',
      role: 'Principal Software Architect & Lead Engineer',
      bio: 'Architected the decoupled microservices monorepo, API Gateway proxying, PostgreSQL relational schema, and AES-256-GCM clinical encryption layer.',
      tags: ['System Architecture', 'Microservices', 'PostgreSQL 16', 'React 19'],
      github: 'https://github.com/Nanda1144',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Pavan Kumar',
      role: 'Senior Full-Stack & Clinical AI Specialist',
      bio: 'Engineered the multimodal Gemini AI diagnostic pipelines, Ayurvedic rule-based fallbacks, and real-time farmer supply chain integrations.',
      tags: ['Clinical AI', 'Node.js 22', 'TypeScript', 'Healthcare UX'],
      github: 'https://github.com/Nanda1144',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Dr. Ananya Sharma (Advisory)',
      role: 'Chief Medical & Ayurvedic Officer',
      bio: 'B.A.M.S., M.D. Gold Medalist guiding classical constitutional diagnostic taxonomy, herb safety profiles, and dosha assessment matrices.',
      tags: ['Ayurvedic Medicine', 'Nadi Pariksha', 'Clinical Protocols'],
      github: '',
      linkedin: 'https://linkedin.com',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest">Core Engineering Team</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">Minds Behind NutriVedha</h1>
        <p className="text-sm text-warm-brown max-w-2xl mx-auto">
          Built with precision by software architects, medical practitioners, and agricultural advocates passionate about evidence-based natural health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map((m) => (
          <Card key={m.name} className="flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest text-ivory flex items-center justify-center font-serif text-lg font-bold">
                {m.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-semibold text-charcoal">{m.name}</h3>
                <p className="text-xs text-olive font-medium">{m.role}</p>
              </div>
              <p className="text-xs text-warm-brown leading-relaxed">{m.bio}</p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {m.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-cream text-[10px] text-forest font-medium border border-soft-beige">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-soft-beige flex items-center gap-3 text-warm-brown">
              {m.github && (
                <a href={m.github} target="_blank" rel="noreferrer" className="hover:text-forest transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noreferrer" className="hover:text-forest transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              <a href="mailto:contact@nutrivedha.example" className="hover:text-forest transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
