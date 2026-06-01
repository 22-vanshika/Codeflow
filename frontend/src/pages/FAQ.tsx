import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

const faqs = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What is CodeFlow?',
        a: 'CodeFlow is an interactive algorithm visualization platform that lets you write or paste C++ code and watch it execute step-by-step as an animated visual. It\'s designed for DSA learners who want to move beyond static pseudocode.',
      },
      {
        q: 'Do I need an account to use CodeFlow?',
        a: 'No! You can use the visualizer freely without an account. However, creating a free account lets you save your code, track your DSA problem progress, and access the full curated 180-problem sheet.',
      },
      {
        q: 'Is CodeFlow free?',
        a: 'Yes, CodeFlow is completely free. We may introduce optional premium features in the future, but the core visualizer and DSA sheet will always be free.',
      },
    ],
  },
  {
    category: 'Visualizer & Code Execution',
    items: [
      {
        q: 'Which programming languages are supported?',
        a: 'Currently CodeFlow supports C++. Support for Python, JavaScript, and Java is on our roadmap.',
      },
      {
        q: 'Why does my code take a while to execute?',
        a: 'Your C++ code is compiled and executed on a secure backend server. Compilation typically takes 1-3 seconds. If you\'re on a slow connection, it may take longer. Very complex algorithms with large inputs may also add processing time.',
      },
      {
        q: 'Is there an input limit?',
        a: 'For security and performance, execution is capped at 5 seconds and memory usage is limited to 256MB. Recursion depth is limited to 1000 levels.',
      },
      {
        q: 'Can I save my code?',
        a: 'Yes! If you\'re logged in, you can click the "Save" button in the workspace to persist your code and visualization state. Saved visualizations appear in your Dashboard.',
      },
    ],
  },
  {
    category: 'DSA Sheet',
    items: [
      {
        q: 'What is the Curated DSA Sheet?',
        a: 'The DSA Sheet is a hand-curated list of the most important DSA problems for software engineering interviews, organized by topic. Each problem links to LeetCode and optionally opens a pre-loaded workspace.',
      },
      {
        q: 'How do I mark a problem as complete?',
        a: 'Click the checkbox on any problem card. If you\'re logged in, your progress is automatically saved to the server. Otherwise, it\'s stored locally.',
      },
      {
        q: 'Can I filter problems by difficulty?',
        a: 'Yes. Use the Easy / Medium / Hard filter buttons in the DSA Sheet to narrow down problems by difficulty.',
      },
    ],
  },
  {
    category: 'Account & Data',
    items: [
      {
        q: 'How do I reset my password?',
        a: 'On the Sign In screen, click "Forgot Password?" and enter your email. You\'ll receive a password reset link within a few minutes.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Contact us at codeflowvisualizer@gmail.com with your account email and we\'ll delete all your data within 30 days.',
      },
      {
        q: 'Is my code private?',
        a: 'By default, your saved visualizations are private and visible only to you when logged in. We do not share your code with other users.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      layout 
      className={`liquid-glass-card border rounded-2xl overflow-hidden transition-all duration-300 relative ${
        isOpen ? 'border-primary/30 shadow-[0_0_25px_rgba(59,130,246,0.1)]' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 text-left transition-all duration-300 group ${
          isOpen ? 'bg-primary/5' : 'hover:bg-white/3'
        }`}
      >
        <span className={`font-bold transition-colors pr-4 ${isOpen ? 'text-white' : 'text-text-primary group-hover:text-white'}`}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-text-muted flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-primary' : 'group-hover:text-white'
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden bg-gradient-to-b from-primary/5 to-transparent"
          >
            <div className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-white/5 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = faqs
    .map(cat => ({
      ...cat,
      items: cat.items.filter(
        item =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(cat => {
      if (searchQuery) return cat.items.length > 0;
      if (activeCategory) return cat.category === activeCategory;
      return true;
    });

  return (
    <div className="min-h-screen pt-[80px] bg-transparent text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-3xl mx-auto px-6 py-10 sm:py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <HelpCircle size={12} />
            FAQ
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Questions
            </span>
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            Can't find what you're looking for?{' '}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>{' '}
            directly.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-4 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary placeholder:text-text-muted outline-none transition-all font-medium"
          />
        </div>

        {/* Category Filters */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                !activeCategory
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-white/5 border-border-subtle text-text-secondary hover:text-white hover:border-primary/30'
              }`}
            >
              All
            </button>
            {faqs.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category === activeCategory ? null : cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  activeCategory === cat.category
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-white/5 border-border-subtle text-text-secondary hover:text-white hover:border-primary/30'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Items */}
        <div className="space-y-6 sm:space-y-8">
          {filtered.map(cat => (
            <div key={cat.category}>
              <h2 className="text-xs font-black uppercase tracking-wider text-text-muted mb-4 ml-1">
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.items.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
          {filtered.every(c => c.items.length === 0) && (
            <div className="text-center py-16 text-text-muted">
              <HelpCircle size={40} className="mx-auto mb-4 opacity-40" />
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
