import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code2, Cpu, Zap, Play, Terminal, ArrowRight, Check, Copy, ChevronRight } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';
import { Link } from 'react-router-dom';

function CopyableCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-[#0f141c]/60 border border-white/5 group hover:border-primary/30 transition-all duration-300">
      <code className="text-xs font-mono text-primary font-bold truncate select-all">{code}</code>
      <button
        type="button"
        onClick={handleCopy}
        className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-all shrink-0 active:scale-95"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check size={13} className="text-accent-green" />
        ) : (
          <Copy size={13} className="group-hover:text-text-secondary transition-colors" />
        )}
      </button>
    </div>
  );
}

const sections = [
  {
    id: 'quickstart',
    icon: Zap,
    title: 'Quick Start',
    content: (
      <div className="space-y-6">
        <p className="text-text-secondary text-sm leading-relaxed">
          Get started with CodeFlow in under 2 minutes. No installation required.
        </p>
        <ol className="space-y-4">
          {[
            { step: '1', title: 'Open the Workspace', desc: 'Navigate to the Visualizer from the homepage or click "Start Visualizing".' },
            { step: '2', title: 'Write or Paste Code', desc: 'Enter your C++ algorithm in the code editor on the left panel. You can use the built-in starter templates as a starting point.' },
            { step: '3', title: 'Click Run', desc: 'Hit the ▶ Run button. Your code is compiled and executed on the server, generating a step-by-step trace.' },
            { step: '4', title: 'Step Through', desc: 'Use the playback controls at the bottom of the visualizer to step forward, backward, or auto-play the visualization.' },
          ].map(item => (
            <li key={item.step} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-sm">
                {item.step}
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Terminal block */}
        <div className="pt-2">
          <div className="rounded-xl border border-white/5 bg-[#0f141c]/60 p-4 font-mono text-xs text-text-secondary">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-red/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-yellow/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-green/60" />
              </div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Terminal</span>
            </div>
            <p className="text-text-muted mb-2"># Clone and run the repository locally</p>
            <CopyableCode code="git clone https://github.com/anshikaasati/codeflow.git" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'workspace',
    icon: Code2,
    title: 'Workspace Layout',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary text-sm leading-relaxed">
          The CodeFlow workspace is divided into three main panels:
        </p>
        <div className="space-y-3">
          {[
            { name: 'Problem Panel (Left)', desc: 'Shows the problem description, examples, constraints, and starter code. You can toggle the DSA Sheet drawer from here.' },
            { name: 'Code Editor (Center)', desc: 'A Monaco-based editor with C++ syntax highlighting, autocomplete, and keyboard shortcuts. You can also import code from GitHub.' },
            { name: 'Visualizer (Right)', desc: 'Renders the animated visualization of your algorithm. Use the floating playback controls to navigate through steps.' },
          ].map(p => (
            <div key={p.name} className="p-4 bg-surface/50 rounded-xl border border-border-subtle hover:border-primary/10 transition-colors">
              <p className="text-white font-bold text-sm mb-1">{p.name}</p>
              <p className="text-text-secondary text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'supported',
    icon: Cpu,
    title: 'Supported Data Structures',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary text-sm leading-relaxed">
          CodeFlow automatically detects and renders the following data structures:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Arrays & Vectors',
            'Linked Lists',
            'Binary Trees',
            'Binary Search Trees',
            'Graphs (BFS/DFS)',
            'Stacks & Queues',
            'Hash Maps',
            'Sorting Algorithms',
          ].map(ds => (
            <div key={ds} className="flex items-center gap-2.5 p-3.5 bg-surface/30 rounded-xl border border-border-subtle hover:border-primary/15 transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-text-secondary text-sm font-semibold">{ds}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'keyboard',
    icon: Terminal,
    title: 'Keyboard Shortcuts',
    content: (
      <div className="space-y-3">
        {[
          { keys: 'Ctrl + Enter', action: 'Run / Execute code' },
          { keys: 'Ctrl + S', action: 'Save visualization' },
          { keys: '→ / Space', action: 'Next step' },
          { keys: '←', action: 'Previous step' },
          { keys: 'P', action: 'Play / Pause auto-step' },
          { keys: 'R', action: 'Reset to first step' },
          { keys: 'Ctrl + Z', action: 'Undo last edit' },
          { keys: 'Ctrl + /', action: 'Toggle line comment' },
        ].map(s => (
          <div key={s.keys} className="flex items-center justify-between p-3.5 bg-surface/30 rounded-xl border border-border-subtle hover:border-white/5 transition-all">
            <span className="text-text-secondary text-sm font-medium">{s.action}</span>
            <code className="text-xs font-mono bg-white/5 border border-border-subtle px-2.5 py-1 rounded-lg text-primary font-black">
              {s.keys}
            </code>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'dsa-sheet',
    icon: BookOpen,
    title: 'DSA Sheet Guide',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary text-sm leading-relaxed">
          The CodeFlow DSA Sheet contains 180 carefully curated problems organized by topic:
        </p>
        <ul className="space-y-3 text-text-secondary text-sm">
          <li className="flex items-start gap-2.5"><span className="text-primary mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" /> <span>Browse problems by category using the left sidebar.</span></li>
          <li className="flex items-start gap-2.5"><span className="text-primary mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" /> <span>Filter by difficulty: Easy, Medium, or Hard.</span></li>
          <li className="flex items-start gap-2.5"><span className="text-primary mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" /> <span>Use the search bar to find problems by name.</span></li>
          <li className="flex items-start gap-2.5"><span className="text-primary mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" /> <span>Click the checkbox to mark problems as solved.</span></li>
          <li className="flex items-start gap-2.5"><span className="text-primary mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" /> <span>Click "Visualize" to open the problem directly in the workspace with starter code.</span></li>
          <li className="flex items-start gap-2.5"><span className="text-primary mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" /> <span>Each category shows a circular progress ring showing your completion percentage.</span></li>
        </ul>
        <div className="pt-2">
          <Link
            to="/sheet"
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-black text-sm"
          >
            Open DSA Sheet <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 'api',
    icon: Play,
    title: 'Backend API Reference',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary text-sm leading-relaxed">
          CodeFlow has a public REST API available at <code className="text-primary font-mono bg-primary/5 px-2 py-0.5 rounded border border-primary/20">http://localhost:5000/api</code> (self-hosted). Below are the key endpoints:
        </p>
        <div className="space-y-3">
          {[
            { method: 'POST', route: '/users/sync', desc: 'Sync user profile after Firebase auth.' },
            { method: 'GET', route: '/users/progress', desc: 'Fetch the authenticated user\'s DSA progress.' },
            { method: 'POST', route: '/users/progress', desc: 'Update DSA problem completion status.' },
            { method: 'GET', route: '/visualizations/user', desc: 'List all saved visualizations for the authenticated user.' },
            { method: 'POST', route: '/visualizations/save', desc: 'Create a new saved visualization.' },
            { method: 'GET', route: '/visualizations/:id', desc: 'Fetch a specific visualization by its unique ID.' },
            { method: 'PUT', route: '/visualizations/:id', desc: 'Update an existing visualization by ID.' },
            { method: 'DELETE', route: '/visualizations/:id', desc: 'Delete an existing visualization by ID.' },
            { method: 'POST', route: '/visualizations/:id/duplicate', desc: 'Duplicate an existing visualization.' },
          ].map(ep => (
            <div key={ep.route} className="flex items-start gap-3.5 p-3.5 bg-surface/30 rounded-xl border border-border-subtle hover:border-white/5 transition-all">
              <span className={`text-[10px] font-black px-2 py-1.5 rounded-lg flex-shrink-0 mt-0.5 min-w-[54px] text-center ${ep.method === 'GET' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : ep.method === 'POST' ? 'bg-primary/10 text-primary border border-primary/20' : ep.method === 'PUT' ? 'bg-accent-orange/10 text-accent-orange border border-accent-orange/20' : 'bg-accent-red/10 text-accent-red border border-accent-red/20'}`}>
                {ep.method}
              </span>
              <div className="flex-1 min-w-0">
                <CopyableCode code={ep.route} />
                <p className="text-text-muted text-xs mt-1.5 pl-1">{ep.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-muted text-xs pl-1">All endpoints except sync require a Firebase Bearer token.</p>
      </div>
    ),
  },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState('quickstart');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${API_URL}/api/docs`);
      } catch (err) {
        console.error('Failed to fetch docs from API:', err);
      }
    };
    fetchDocs();
  }, []);

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

      <div className="max-w-6xl mx-auto px-6 py-10 sm:py-16 relative z-10 flex gap-6 lg:gap-10">
        {/* Sidebar TOC */}
        <aside className="hidden lg:flex flex-col gap-1.5 w-56 flex-shrink-0 sticky top-28 h-fit">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 pl-3">
            On This Page
          </p>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`flex items-center gap-2 text-xs py-2 px-3 rounded-xl text-left transition-all font-medium group ${
                activeSection === s.id
                  ? 'bg-primary/10 border border-primary/20 text-primary'
                  : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
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
        <main className="flex-1 min-w-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <BookOpen size={12} />
              Documentation
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4">
              CodeFlow{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Documentation
              </span>
            </h1>
            <p className="text-text-secondary leading-relaxed">
              Everything you need to know to get the most out of CodeFlow's algorithm visualization platform.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="liquid-glass-card p-5 sm:p-8 scroll-mt-32 border border-white/5 hover:border-white/10 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl">
                    <section.icon size={20} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-black text-white">{section.title}</h2>
                </div>
                {section.content}
              </motion.section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
