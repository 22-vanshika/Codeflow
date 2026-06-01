import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, Database, Users, Cookie, UserCheck, Baby, RefreshCw, Mail, Eye, Share2 } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

const sections = [
  {
    id: 'collect',
    icon: Eye,
    title: '1. Information We Collect',
    color: 'from-primary to-secondary',
    accentColor: 'text-primary',
    borderColor: 'border-primary/20',
    content: 'We collect information you provide directly to us when you create an account, use our services, or contact us for support. This includes:',
    bullets: [
      { label: 'Account Information', desc: 'Email address, display name, and profile photo (when signing in via GitHub OAuth).' },
      { label: 'Usage Data', desc: 'Pages you visit, features you use, problems you solve, and how long you spend in the visualizer.' },
      { label: 'Code Submissions', desc: 'C++ code you write or import in the workspace. This data is used only for execution and visualization and is not stored permanently unless you explicitly save it.' },
      { label: 'Progress Data', desc: "Which DSA problems you've marked as completed." },
    ],
  },
  {
    id: 'use',
    icon: Users,
    title: '2. How We Use Your Information',
    color: 'from-secondary to-accent-purple',
    accentColor: 'text-secondary',
    borderColor: 'border-secondary/20',
    content: 'We use the information we collect to:',
    bullets: [
      { label: '', desc: 'Provide, maintain, and improve our services.' },
      { label: '', desc: 'Personalize your experience (e.g., persisting your DSA progress).' },
      { label: '', desc: 'Send you technical notices and support messages.' },
      { label: '', desc: 'Monitor and analyze trends and usage.' },
      { label: '', desc: 'Detect and prevent fraud or abuse.' },
    ],
    extra: 'We do not sell your personal information to third parties.',
  },
  {
    id: 'storage',
    icon: Database,
    title: '3. Data Storage & Security',
    color: 'from-accent-cyan to-primary',
    accentColor: 'text-accent-cyan',
    borderColor: 'border-accent-cyan/20',
    content: 'Your data is stored in a MongoDB database hosted on MongoDB Atlas. We use Firebase Authentication to manage user identities securely. All data in transit is encrypted using HTTPS/TLS.',
    extra: 'We implement industry-standard security measures but cannot guarantee absolute security. You are responsible for keeping your account credentials confidential.',
  },
  {
    id: 'thirdparty',
    icon: Share2,
    title: '4. Third-Party Services',
    color: 'from-accent-purple to-accent-pink',
    accentColor: 'text-accent-purple',
    borderColor: 'border-accent-purple/20',
    content: 'We use the following third-party services:',
    bullets: [
      { label: 'Firebase (Google)', desc: 'Authentication and identity management.' },
      { label: 'GitHub OAuth', desc: 'Optional sign-in method. We request read access to your public repositories only when you use the GitHub import feature.' },
      { label: 'MongoDB Atlas', desc: 'Cloud database for storing user profiles, progress, and saved visualizations.' },
    ],
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: '5. Cookies',
    color: 'from-accent-orange to-accent-yellow',
    accentColor: 'text-accent-orange',
    borderColor: 'border-accent-orange/20',
    content: 'We use minimal cookies for session management and user preference storage (such as theme selection). We do not use cookies for advertising.',
  },
  {
    id: 'rights',
    icon: UserCheck,
    title: '6. Your Rights',
    color: 'from-accent-green to-accent-cyan',
    accentColor: 'text-accent-green',
    borderColor: 'border-accent-green/20',
    content: 'You have the right to:',
    bullets: [
      { label: '', desc: 'Access the personal data we hold about you.' },
      { label: '', desc: 'Request correction of inaccurate data.' },
      { label: '', desc: 'Request deletion of your account and associated data.' },
      { label: '', desc: 'Export your saved visualizations and progress.' },
    ],
    extra: 'To exercise any of these rights, contact us at codeflowvisualizer@gmail.com.',
  },
  {
    id: 'children',
    icon: Baby,
    title: "7. Children's Privacy",
    color: 'from-accent-pink to-accent-red',
    accentColor: 'text-accent-pink',
    borderColor: 'border-accent-pink/20',
    content: 'CodeFlow is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13.',
  },
  {
    id: 'changes',
    icon: RefreshCw,
    title: '8. Changes to This Policy',
    color: 'from-primary to-accent-cyan',
    accentColor: 'text-primary',
    borderColor: 'border-primary/20',
    content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our platform or sending an email to the address associated with your account.',
  },
  {
    id: 'contact',
    icon: Mail,
    title: '9. Contact Us',
    color: 'from-secondary to-primary',
    accentColor: 'text-secondary',
    borderColor: 'border-secondary/20',
    content: 'If you have questions about this Privacy Policy, please contact us at codeflowvisualizer@gmail.com or use the Contact page on our platform.',
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('collect');
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
            <Shield size={12} />
            Legal Document
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Privacy{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Policy
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
            Welcome to <strong className="text-white">CodeFlow</strong>. We take your privacy seriously. This Privacy Policy explains how we collect, use, share, and protect information about you when you use our services.
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
                    <div
                      className="p-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <Icon size={18} className={section.accentColor} />
                    </div>
                    <h2 className="text-lg font-black text-white">{section.title}</h2>
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed">{section.content}</p>

                  {section.bullets && (
                    <ul className="mt-4 space-y-3">
                      {section.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-3 text-sm">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.color} flex-shrink-0`} />
                          <span className="text-text-secondary">
                            {b.label && <strong className="text-text-primary font-bold">{b.label}: </strong>}
                            {b.desc}
                          </span>
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
