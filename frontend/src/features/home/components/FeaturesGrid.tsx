import { Cpu, Layers, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';

const CodeIcon = () => <Cpu size={24} />;
const LayersIcon = () => <Layers size={24} />;
const EyeIcon = () => <Zap size={24} />;

export default function FeaturesGrid() {
    return (
        <section className="py-20 bg-surface/30 border-t border-white/5">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<CodeIcon />}
                        title="Write Code"
                        desc="Use our Monaco-powered editor with full TypeScript/C++ syntax highlighting."
                    />
                    <FeatureCard
                        icon={<LayersIcon />}
                        title="Execute Dry-Run"
                        desc="Our engine parses your code into an AST and executes it step-by-step securely."
                    />
                    <FeatureCard
                        icon={<EyeIcon />}
                        title="Visualize State"
                        desc="Watch the stack grow, variables change, and memory update in real-time."
                    />
                </div>
            </div>
        </section>
    );
}
