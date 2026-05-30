import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
};

export default function HeroSection() {
    return (
        <section className="min-h-[90vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="z-10 max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center"
            >
                {/* Left Side: Content */}
                <div className="text-left">
                    <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
                        <Zap size={14} className="text-primary animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Next-Gen DSA Engine</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
                        Code Isn't Just Text, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-cyan to-accent-purple animate-gradient-x">
                            It's a Story.
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-text-muted mb-12 max-w-xl leading-relaxed">
                        Step into the execution flow. Watch your logic unfold with real-time stack traces, memory maps, and AI-driven explanations. 
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button
                            onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))}
                            className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center justify-center overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            <span className="relative flex items-center">
                                Start Visualizing <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        
                        <Link
                            to="/workspace"
                            className="group w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                        >
                            Try Demo Sandbox
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-12 flex items-center gap-6 text-text-muted">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-main bg-surface flex items-center justify-center overflow-hidden">
                                    <div className={`w-full h-full bg-gradient-to-br ${i % 2 === 0 ? 'from-primary/40 to-accent-cyan/40' : 'from-accent-purple/40 to-primary/40'}`} />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium">Joined by <span className="text-white font-bold">1,000+</span> developers</p>
                    </motion.div>
                </div>

                {/* Right Side: Decorative Mockup */}
                <motion.div 
                    variants={itemVariants}
                    className="relative hidden lg:block"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse-slow"></div>
                    <div className="relative glass-morphism rounded-3xl p-4 border border-white/10 shadow-2xl animate-float">
                        {/* Editor Mockup Header */}
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-[10px] text-text-muted font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                                <Code2 size={12} className="text-primary" />
                                solution.cpp
                            </div>
                        </div>
                        {/* Code Lines Mockup */}
                        <div className="space-y-3 p-4 font-mono text-sm">
                            <div className="flex gap-4">
                                <span className="text-white/20">01</span>
                                <span className="text-accent-purple">void</span> <span className="text-primary">dfs</span><span className="text-white/60">(node* root) {'{'}</span>
                            </div>
                            <div className="flex gap-4 pl-6 border-l-2 border-primary/30">
                                <span className="text-white/20">02</span>
                                <span className="text-accent-cyan">if</span> <span className="text-white/60">(!root)</span> <span className="text-accent-purple">return</span><span className="text-white/60">;</span>
                            </div>
                            <div className="flex gap-4 pl-6 bg-primary/10 -mx-4 px-4 py-1 border-l-2 border-primary border-y border-primary/20">
                                <span className="text-primary/60">03</span>
                                <span className="text-white">vis.push_back(root-&gt;val);</span>
                                <Sparkles size={14} className="text-primary ml-auto animate-pulse" />
                            </div>
                            <div className="flex gap-4 pl-6 border-l-2 border-primary/30">
                                <span className="text-white/20">04</span>
                                <span className="text-primary">dfs</span><span className="text-white/60">(root-&gt;left);</span>
                            </div>
                            <div className="flex gap-4 pl-6 border-l-2 border-primary/30">
                                <span className="text-white/20">05</span>
                                <span className="text-primary">dfs</span><span className="text-white/60">(root-&gt;right);</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-white/20">06</span>
                                <span className="text-white/60">{'}'}</span>
                            </div>
                        </div>

                        {/* Floating Status Card */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -bottom-6 -left-6 p-4 glass-morphism rounded-2xl border border-primary/30 shadow-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Zap size={20} className="text-green-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Trace Status</p>
                                    <p className="text-xs font-bold text-white">Execution Successful</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
