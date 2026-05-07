import HeroSection from '../features/home/components/HeroSection';
import FeaturesGrid from '../features/home/components/FeaturesGrid';
import PopularVisualizations from '../features/home/components/PopularVisualizations';
import DynamicBackground from '../components/DynamicBackground';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <div className="min-h-screen pt-[56px] flex flex-col bg-bg-main relative selection:bg-primary/30">
            <DynamicBackground />
            
            <HeroSection />
            
            {/* Flowing Section Separator */}
            <div className="relative h-24 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                />
            </div>

            <FeaturesGrid />
            
            <PopularVisualizations />
            
            <footer className="py-12 px-6 text-center border-t border-white/5 bg-black/20 backdrop-blur-md">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary p-0.5">
                            <div className="w-full h-full bg-bg-main rounded-lg flex items-center justify-center font-bold text-white text-xs">CF</div>
                        </div>
                        <span className="text-white font-bold tracking-tight">CodeFlow</span>
                    </div>
                    <p className="text-text-muted text-sm italic">"Visualizing the future of code execution."</p>
                    <p className="text-text-muted text-xs">© 2026 CodeFlow. Standard DSA Visualizer.</p>
                </div>
            </footer>
        </div>
    );
}

