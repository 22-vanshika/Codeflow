import { Cpu, Layers, Zap, Sparkles } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { motion } from 'framer-motion';

export default function FeaturesGrid() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-text-muted text-sm font-medium mb-6"
                    >
                        <Sparkles size={14} className="text-primary" />
                        Powerful Features
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Built for Clarity</h2>
                    <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
                        Experience a new way of understanding complex algorithms with our high-fidelity visualization suite.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        delay={0.1}
                        icon={<Cpu size={28} />}
                        title="Intelligent Execution"
                        desc="Advanced parsing engine that translates your C++ logic into high-fidelity visual snapshots."
                    />
                    <FeatureCard
                        delay={0.2}
                        icon={<Layers size={28} />}
                        title="Memory Mapping"
                        desc="Real-time tracking of stack frames, heap allocations, and pointer relationships."
                    />
                    <FeatureCard
                        delay={0.3}
                        icon={<Zap size={28} />}
                        title="AI Explanations"
                        desc="Context-aware insights that explain 'why' a line of code is executing, not just 'what'."
                    />
                </div>
            </div>
        </section>
    );
}
