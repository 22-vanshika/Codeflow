import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Shield, Lock, AlertTriangle, Gavel, UserCheck, RefreshCw, Globe, Mail } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    title: '1. Acceptance of Terms',
    color: 'from-primary to-secondary',
    accentColor: 'text-primary',
    borderColor: 'border-primary/20',
    content: `By accessing or using CodeFlow ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. We reserve the right to update these Terms at any time.`,
  },
  {
    id: 'use',
    icon: Shield,
    title: '2. Use of the Service',
    color: 'from-secondary to-accent-purple',
    accentColor: 'text-secondary',
    borderColor: 'border-secondary/20',
    content: `You agree to use CodeFlow only for lawful purposes. Prohibited activities include:`,
    bullets: [
      'Attempting to gain unauthorized access to our systems or other users\' accounts.',
      'Using the Service to distribute malware, harmful code, or exploit payloads.',
      'Reverse-engineering or decompiling the CodeFlow platform.',
      'Automated scraping or harvesting of data from the platform.',
      'Using the Service in a manner that violates applicable laws or regulations.',
    ],
  },
  {
    id: 'accounts',
    icon: UserCheck,
    title: '3. Accounts',
    color: 'from-accent-cyan to-primary',
    accentColor: 'text-accent-cyan',
    borderColor: 'border-accent-cyan/20',
    content: `To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account. Notify us immediately at codeflowvisualizer@gmail.com of any unauthorized account use.`,
  },
  {
    id: 'ip',
    icon: Lock,
    title: '4. Intellectual Property',
    color: 'from-accent-purple to-accent-pink',
    accentColor: 'text-accent-purple',
    borderColor: 'border-accent-purple/20',
    content: `The CodeFlow name, logo, platform design, and codebase are the intellectual property of CodeFlow and its contributors. You are granted a limited, non-exclusive, non-transferable license to use the Service for personal, educational purposes.`,
    extra: 'User-submitted code remains the property of the user. By submitting code to CodeFlow, you grant us a limited license to execute and visualize it for the purpose of providing the Service.',
  },
  {
    id: 'disclaimer',
    icon: AlertTriangle,
    title: '5. Disclaimer of Warranties',
    color: 'from-accent-orange to-accent-yellow',
    accentColor: 'text-accent-orange',
    borderColor: 'border-accent-orange/20',
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.`,
  },
  {
    id: 'liability',
    icon: Gavel,
    title: '6. Limitation of Liability',
    color: 'from-accent-red to-accent-orange',
    accentColor: 'text-accent-red',
    borderColor: 'border-accent-red/20',
    content: `TO THE FULLEST EXTENT PERMITTED BY LAW, CODEFLOW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.`,
  },
  {
    id: 'termination',
    icon: RefreshCw,
    title: '7. Termination',
    color: 'from-primary to-accent-cyan',
    accentColor: 'text-primary',
    borderColor: 'border-primary/20',
    content: `We reserve the right to suspend or terminate your access to the Service at any time, for any reason, including violation of these Terms, without notice.`,
  },
  {
    id: 'governing',
    icon: Globe,
    title: '8. Governing Law',
    color: 'from-accent-green to-accent-cyan',
    accentColor: 'text-accent-green',
    borderColor: 'border-accent-green/20',
    content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict-of-law principles.`,
  },
  {
    id: 'contact',
    icon: Mail,
    title: '9. Contact',
    color: 'from-secondary to-primary',
    accentColor: 'text-secondary',
    borderColor: 'border-secondary/20',
    content: `Questions about these Terms should be sent to codeflowvisualizer@gmail.com.`,
  },
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      sectionRefs.current[s.id] = el;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(s.id); },
        { rootMargin: '-20% 0% -60% 0%', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen pt-[80px] bg-transparent text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <FileText size={12} />
            Legal Document
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Terms of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Service
            </span>
          </h1>
          <p className="text-text-muted text-sm">
            Last updated: <span className="text-text-secondary font-bold">June 1, 2026</span>
          </p>
        </motion.div>

        {/* Intro Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass-card p-6 mb-10 border border-primary/10 flex items-start gap-4"
        >
          <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl flex-shrink-0 mt-0.5">
            <Shield size={18} className="text-primary" />
          </div>
          <p className="text-text-secondary leading-relaxed text-sm">
            These Terms of Service govern your use of the <strong className="text-white">CodeFlow</strong> platform. Please read them carefully. By using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>
        </motion.div>

        <div className="flex gap-10">
          {/* Sticky Sidebar TOC */}
          <aside className="hidden lg:flex flex-col gap-1 w-56 flex-shrink-0 sticky top-28 h-fit">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">
              Contents
            </p>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`flex items-center gap-2 text-xs py-2 px-3 rounded-xl text-left transition-all font-medium group ${
                  activeSection === s.id
                    ? 'bg-primary/10 border border-primary/20 text-primary'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <ChevronRight
                  size={12}
                  className={`flex-shrink-0 transition-transform ${activeSection === s.id ? 'text-primary' : 'opacity-0 group-hover:opacity-100'}`}
                />
                <span className="leading-snug">{s.title}</span>
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-8">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`liquid-glass-card p-8 border ${section.borderColor} hover:shadow-xl transition-all duration-300 scroll-mt-32`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${section.color} bg-opacity-10`} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Icon size={18} className={section.accentColor} />
                    </div>
                    <h2 className="text-lg font-black text-white">{section.title}</h2>
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed">
                    {section.content}
                  </p>

                  {section.bullets && (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2.5 text-sm text-text-secondary">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.color} flex-shrink-0`} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.extra && (
                    <p className="mt-4 text-text-secondary text-sm leading-relaxed pt-4 border-t border-white/5">
                      {section.extra}
                    </p>
                  )}
                </motion.section>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}
