import { BookOpen, Activity, Cpu, Layers, Zap, Landmark, Sparkles } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { motion } from 'framer-motion';

export default function FeaturesGrid() {
  return (
    <section className="py-24 relative overflow-hidden bg-black/5">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-text-secondary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles size={12} className="text-primary" />
            Core Capabilities
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary mb-6 tracking-tight">
            Engineered for Deep Learning
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Everything you need to debug your mental models of algorithms, memory changes, and stack frames.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            delay={0.05}
            icon={<BookOpen size={24} />}
            title="200+ DSA Problems"
            desc="Explore curated problem categories spanning lists, queues, arrays, trees, graphs, sorting, and dynamic programming."
          />
          <FeatureCard
            delay={0.1}
            icon={<Activity size={24} />}
            title="Execution Trace"
            desc="Step line-by-line through your solution. See variable updates, memory mutations, and stack frame updates instantly."
          />
          <FeatureCard
            delay={0.15}
            icon={<Cpu size={24} />}
            title="Complexity Analysis"
            desc="Automated space and time complexity metrics evaluate how your algorithm scales dynamically based on size."
          />
          <FeatureCard
            delay={0.2}
            icon={<Layers size={24} />}
            title="Multiple Data Structures"
            desc="Custom vector buffers, linked nodes, queue pipes, recursive trees, and visual graphs adjust automatically to fit."
          />
          <FeatureCard
            delay={0.25}
            icon={<Zap size={24} />}
            title="Interactive Learning"
            desc="Control execution playback, speed multipliers, starter configuration inputs, and trace state details easily."
          />
          <FeatureCard
            delay={0.3}
            icon={<Landmark size={24} />}
            title="Step-by-Step Logic"
            desc="Examine function recursion lines and watch parameters push onto and pop off the interactive trace stack frames."
          />
        </div>
      </div>
    </section>
  );
}
