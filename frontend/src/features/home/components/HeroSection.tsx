import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
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
    );
}
