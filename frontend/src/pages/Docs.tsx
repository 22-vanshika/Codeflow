import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code2, Cpu, Zap, Play, Terminal, ArrowRight, ExternalLink } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'quickstart',
    icon: Zap,
    title: 'Quick Start',
    content: (
      <div className="space-y-4">
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
            <div key={p.name} className="p-4 bg-surface/50 rounded-xl border border-border-subtle">
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
        <div className="grid grid-cols-2 gap-3">
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
            <div key={ds} className="flex items-center gap-2 p-3 bg-surface/30 rounded-lg border border-border-subtle">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <span className="text-text-secondary text-sm">{ds}</span>
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
          <div key={s.keys} className="flex items-center justify-between p-3 bg-surface/30 rounded-lg border border-border-subtle">
            <span className="text-text-secondary text-sm">{s.action}</span>
            <code className="text-xs font-mono bg-white/5 border border-border-subtle px-2 py-1 rounded text-primary">
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
        <ul className="space-y-2 text-text-secondary text-sm">
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Browse problems by category using the left sidebar.</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Filter by difficulty: Easy, Medium, or Hard.</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Use the search bar to find problems by name.</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Click the checkbox to mark problems as solved.</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Click "Visualize" to open the problem directly in the workspace with starter code.</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Each category shows a circular progress ring showing your completion percentage.</li>
        </ul>
        <Link
          to="/sheet"
          className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold text-sm"
        >
          Open DSA Sheet <ArrowRight size={14} />
        </Link>
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
          CodeFlow has a public REST API available at <code className="text-primary font-mono">http://localhost:5000/api</code> (self-hosted). Below are the key endpoints:
        </p>
        <div className="space-y-3">
          {[
            { method: 'POST', route: '/users/sync', desc: 'Sync user profile after Firebase auth.' },
            { method: 'GET', route: '/users/progress', desc: 'Fetch the authenticated user\'s DSA progress.' },
            { method: 'POST', route: '/users/progress', desc: 'Update DSA problem completion status.' },
            { method: 'GET', route: '/visualizations', desc: 'List all saved visualizations for the user.' },
            { method: 'POST', route: '/visualizations', desc: 'Create a new saved visualization.' },
            { method: 'PUT', route: '/visualizations/:id', desc: 'Update a saved visualization.' },
            { method: 'DELETE', route: '/visualizations/:id', desc: 'Delete a saved visualization.' },
          ].map(ep => (
            <div key={ep.route} className="flex items-start gap-3 p-3 bg-surface/30 rounded-lg border border-border-subtle">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${ep.method === 'GET' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : ep.method === 'POST' ? 'bg-primary/10 text-primary border border-primary/20' : ep.method === 'PUT' ? 'bg-accent-orange/10 text-accent-orange border border-accent-orange/20' : 'bg-accent-red/10 text-accent-red border border-accent-red/20'}`}>
                {ep.method}
              </span>
              <div>
                <code className="text-sm font-mono text-text-primary">{ep.route}</code>
                <p className="text-text-muted text-xs mt-0.5">{ep.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-muted text-xs">All endpoints except sync require a Firebase Bearer token.</p>
      </div>
    ),
  },
];

export default function Docs() {
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

  return (
    <div className="min-h-screen pt-[80px] bg-bg-main text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10 flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:flex flex-col gap-1 w-52 flex-shrink-0 sticky top-28 h-fit">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-3">On This Page</p>
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5"
            >
              <s.icon size={14} className="text-primary flex-shrink-0" />
              {s.title}
            </a>
          ))}
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors"
            >
              <ExternalLink size={12} />
              Edit on GitHub
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
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
                className="liquid-glass-card p-8"
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
