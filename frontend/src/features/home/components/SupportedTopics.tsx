import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Topic {
  name: string;
  color: string;
  svg: React.ReactNode;
}

const topics: Topic[] = [
  {
    name: "Arrays",
    color: "group-hover:border-primary/30 group-hover:text-primary",
    svg: (
      <svg className="w-10 h-10 text-primary" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="14" width="11" height="12" rx="2" />
        <rect x="14" y="14" width="11" height="12" rx="2" fill="currentColor" fillOpacity="0.1" />
        <rect x="26" y="14" width="11" height="12" rx="2" />
      </svg>
    )
  },
  {
    name: "Strings",
    color: "group-hover:border-accent-cyan/30 group-hover:text-accent-cyan",
    svg: (
      <svg className="w-10 h-10 text-accent-cyan" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="20" r="4" />
        <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.1" />
        <circle cx="32" cy="20" r="4" />
        <line x1="12" y1="20" x2="16" y2="20" strokeDasharray="2,2" />
        <line x1="24" y1="20" x2="28" y2="20" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    name: "Matrix",
    color: "group-hover:border-accent-purple/30 group-hover:text-accent-purple",
    svg: (
      <svg className="w-10 h-10 text-accent-purple" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="32" height="32" rx="4" />
        <line x1="4" y1="16" x2="36" y2="16" />
        <line x1="4" y1="28" x2="36" y2="28" />
        <line x1="16" y1="4" x2="16" y2="36" />
        <line x1="28" y1="4" x2="28" y2="36" />
      </svg>
    )
  },
  {
    name: "Linked Lists",
    color: "group-hover:border-accent-green/30 group-hover:text-accent-green",
    svg: (
      <svg className="w-10 h-10 text-accent-green" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="13" width="10" height="14" rx="2" />
        <rect x="23" y="13" width="10" height="14" rx="2" />
        <path d="M 13 20 L 22 20 M 18 16 L 22 20 L 18 24" />
        <circle cx="30" cy="20" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "Stack",
    color: "group-hover:border-accent-red/30 group-hover:text-accent-red",
    svg: (
      <svg className="w-10 h-10 text-accent-red" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M 10 8 L 10 32 L 30 32 L 30 8" />
        <rect x="13" y="24" width="14" height="5" rx="1" fill="currentColor" fillOpacity="0.1" />
        <rect x="13" y="16" width="14" height="5" rx="1" />
      </svg>
    )
  },
  {
    name: "Queue",
    color: "group-hover:border-accent-orange/30 group-hover:text-accent-orange",
    svg: (
      <svg className="w-10 h-10 text-accent-orange" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="12" x2="36" y2="12" />
        <line x1="4" y1="28" x2="36" y2="28" />
        <circle cx="12" cy="20" r="5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="26" cy="20" r="5" />
      </svg>
    )
  },
  {
    name: "Trees",
    color: "group-hover:border-primary/30 group-hover:text-primary",
    svg: (
      <svg className="w-10 h-10 text-primary" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="20" cy="8" r="4" />
        <circle cx="10" cy="24" r="4" />
        <circle cx="30" cy="24" r="4" />
        <line x1="17" y1="11" x2="13" y2="21" />
        <line x1="23" y1="11" x2="27" y2="21" />
      </svg>
    )
  },
  {
    name: "Graphs",
    color: "group-hover:border-accent-purple/30 group-hover:text-accent-purple",
    svg: (
      <svg className="w-10 h-10 text-accent-purple" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="20" cy="8" r="4" />
        <circle cx="8" cy="28" r="4" />
        <circle cx="32" cy="28" r="4" />
        <line x1="17" y1="10" x2="11" y2="26" />
        <line x1="23" y1="10" x2="29" y2="26" />
        <line x1="12" y1="28" x2="28" y2="28" />
      </svg>
    )
  },
  {
    name: "Trie",
    color: "group-hover:border-accent-cyan/30 group-hover:text-accent-cyan",
    svg: (
      <svg className="w-10 h-10 text-accent-cyan" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <circle cx="28" cy="18" r="3" />
        <circle cx="6" cy="32" r="3" />
        <line x1="18" y1="8" x2="14" y2="16" />
        <line x1="22" y1="8" x2="26" y2="16" />
        <line x1="10" y1="20" x2="8" y2="30" />
      </svg>
    )
  },
  {
    name: "Dynamic Programming",
    color: "group-hover:border-accent-orange/30 group-hover:text-accent-orange",
    svg: (
      <svg className="w-10 h-10 text-accent-orange" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="10" width="30" height="20" rx="3" />
        <line x1="15" y1="10" x2="15" y2="30" />
        <line x1="25" y1="10" x2="25" y2="30" />
        <line x1="5" y1="20" x2="35" y2="20" />
        <path d="M 8 15 Q 15 25 22 15 M 19 18 L 22 15 L 20 12" strokeWidth="1.5" />
      </svg>
    )
  }
];

export default function SupportedTopics() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-black/5">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-text-secondary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles size={12} className="text-primary animate-pulse" />
            Vast Library
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary mb-6 tracking-tight">
            Supported Topics
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            From basic linear arrays to advanced multi-dimensional dynamic programming models, CodeFlow covers the complete DSA curriculum.
          </p>
        </div>

        {/* Visual Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {topics.map((topic, idx) => (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, y: -120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: ((idx * 3) % 10) * 0.06, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-[28px_8px_28px_8px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-md ${topic.color}`}
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {topic.svg}
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-text-secondary group-hover:text-text-primary transition-colors">
                {topic.name}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
