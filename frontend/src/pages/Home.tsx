import { Link } from 'react-router-dom';
import { ArrowRight, Play, Cpu, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <div className="min-h-screen pt-[56px] flex flex-col bg-background selection:bg-primary/30">

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="z-10 max-w-4xl"
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-medium text-text-primary">Engine Online v1.0</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                        See Your Code <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Come to Life</span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                        Don't just run your code—watch it execute. Visualize variables, memory, and stack frames in real-time. Perfect for debugging and learning algorithms.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            to="/visualizer"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-primary rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-gray-900"
                        >
                            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-g from-transparent via-transparent to-gray-700"></span>
                            <span className="relative flex items-center">
                                Start Visualizing <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
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

            {/* Footer */}
            <footer className="py-8 text-center text-text-muted text-sm border-t border-white/5 bg-background">
                <p>© 2024 CodeFlow. Built with React & TypeScript.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-colors shadow-lg hover:shadow-primary/5 group">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">{title}</h3>
            <p className="text-text-muted leading-relaxed">{desc}</p>
        </div>
    );
}

const CodeIcon = () => <Cpu size={24} />;
const LayersIcon = () => <Layers size={24} />;
const EyeIcon = () => <Zap size={24} />;
