import { motion } from 'framer-motion';
import { CheckCircle, Rocket, Zap, Globe, BookOpen } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

type Status = 'completed' | 'in-progress' | 'planned' | 'considering';

interface RoadmapItem {
  title: string;
  description: string;
  status: Status;
  eta?: string;
  icon: typeof Rocket;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  completed: { label: 'Shipped', color: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/20' },
  'in-progress': { label: 'In Progress', color: 'text-accent-orange', bg: 'bg-accent-orange/10 border-accent-orange/20' },
  planned: { label: 'Planned', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  considering: { label: 'Considering', color: 'text-text-muted', bg: 'bg-white/5 border-border-subtle' },
};

const items: RoadmapItem[] = [
  {
    title: 'C++ Execution Engine',
    description: 'Secure backend execution of C++ code with step-by-step trace generation.',
    status: 'completed',
    icon: Zap,
  },
  {
    title: 'DSA 200 Problem Sheet',
    description: 'Curated list of 200 essential interview problems organized by topic with progress tracking.',
    status: 'completed',
    icon: BookOpen,
  },
  {
    title: 'Algorithm Visualizers',
    description: 'Visual rendering for arrays, trees, graphs, linked lists, stacks, and queues.',
    status: 'completed',
    icon: Rocket,
  },
  {
    title: 'User Authentication & Profiles',
    description: 'Firebase-based auth with GitHub OAuth, progress persistence, and saved visualizations.',
    status: 'completed',
    icon: CheckCircle,
  },
  {
    title: 'GitHub Code Import',
    description: 'Import C++ files directly from your GitHub repositories into the workspace.',
    status: 'completed',
    icon: Globe,
  },
  {
    title: 'Complexity Annotation',
    description: 'Automatically annotate time and space complexity in best/average/worst case for each step.',
    status: 'completed',
    icon: Globe,
  },
  {
    title: 'Python Support',
    description: 'Extend the execution engine to handle Python algorithms with identical visualization quality.',
    status: 'in-progress',
    eta: 'Q3 2026',
    icon: Zap,
  },
  {
    title: 'Collaborative Whiteboarding',
    description: 'Real-time multiplayer visualization sessions — share your screen with a link.',
    status: 'planned',
    eta: 'Q4 2026',
    icon: Globe,
  },
  {
    title: 'JavaScript / TypeScript Support',
    description: 'Run JS/TS algorithms through the visualizer with the same step-trace quality.',
    status: 'planned',
    eta: 'Q4 2026',
    icon: Zap,
  },
  {
    title: 'Custom Problem Builder',
    description: 'Create and share your own DSA problems with the CodeFlow community.',
    status: 'planned',
    eta: 'Q1 2027',
    icon: BookOpen,
  },
  {
    title: 'AI Code Explainer',
    description: 'An integrated AI assistant that narrates what the algorithm is doing at each step.',
    status: 'considering',
    icon: Rocket,
  },
  {
    title: 'Mobile App',
    description: 'Native iOS and Android apps for practicing DSA problems on the go.',
    status: 'considering',
    icon: Globe,
  },
];

export default function Roadmap() {
  const grouped = {
    completed: items.filter(i => i.status === 'completed'),
    'in-progress': items.filter(i => i.status === 'in-progress'),
    planned: items.filter(i => i.status === 'planned'),
    considering: items.filter(i => i.status === 'considering'),
  };

  return (
    <div className="min-h-screen pt-[80px] bg-transparent text-text-primary relative overflow-x-hidden">
      <DynamicBackground />

      <div className="max-w-4xl mx-auto px-6 py-10 sm:py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Rocket size={12} />
            Product Roadmap
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            What We're{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Building Next
            </span>
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            Our public roadmap — transparent, community-driven, and constantly evolving.
          </p>
        </motion.div>

        {/* Status Legend */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([key, val]) => (
            <div
              key={key}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold ${val.bg} ${val.color}`}
            >
              <div className={`w-2 h-2 rounded-full ${key === 'completed' ? 'bg-accent-green' : key === 'in-progress' ? 'bg-accent-orange' : key === 'planned' ? 'bg-primary' : 'bg-text-muted'}`} />
              {val.label}
            </div>
          ))}
        </div>

        {/* Sections */}
        {(Object.entries(grouped) as [Status, RoadmapItem[]][]).map(([status, groupItems]) => (
          <div key={status} className="mb-14">
            <div className={`flex items-center gap-3 mb-6`}>
              <div className={`h-px flex-1 ${STATUS_CONFIG[status].bg} border rounded`} />
              <span className={`text-xs font-black uppercase tracking-widest ${STATUS_CONFIG[status].color}`}>
                {STATUS_CONFIG[status].label}
              </span>
              <div className={`h-px flex-1 ${STATUS_CONFIG[status].bg} border rounded`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="liquid-glass-card p-6 flex gap-4 items-start"
                >
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${STATUS_CONFIG[status].bg}`}>
                    <item.icon size={18} className={STATUS_CONFIG[status].color} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-white font-bold text-sm">{item.title}</h3>
                      {item.eta && (
                        <span className="text-[10px] font-black bg-white/5 border border-border-subtle text-text-muted px-2 py-0.5 rounded">
                          {item.eta}
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-xs leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center liquid-glass-card p-6 sm:p-10"
        >
          <h2 className="text-2xl font-black mb-4">Have a Feature Request?</h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto text-sm">
            We prioritize based on community demand. Share your idea and vote on others'.
          </p>
          <a href="/contact" className="capsule-btn-primary inline-flex items-center gap-2">
            <Rocket size={16} />
            Submit Request
          </a>
        </motion.div>
      </div>
    </div>
  );
}
