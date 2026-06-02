import HeroSection from '../features/home/components/HeroSection';
import FeaturesGrid from '../features/home/components/FeaturesGrid';
import DynamicBackground from '../components/DynamicBackground';
import VisualizationShowcase from '../features/home/components/VisualizationShowcase';
import LiveDemo from '../features/home/components/LiveDemo';
import HowItWorks from '../features/home/components/HowItWorks';
import PerformanceMetrics from '../features/home/components/PerformanceMetrics';
import Testimonials from '../features/home/components/Testimonials';
import SupportedTopics from '../features/home/components/SupportedTopics';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Mail } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen pt-[60px] flex flex-col bg-transparent relative selection:bg-primary/30 overflow-x-hidden">
      {/* Three.js dynamic canvas background */}
      <DynamicBackground />
      
      {/* 1. Hero Section */}
      <HeroSection />
      
      {/* Flowing Section Separator */}
      <div className="relative h-20 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </div>

      {/* 2. Visualization Showcase Section */}
      <VisualizationShowcase />

      {/* 3. Live Demo Playground */}
      <LiveDemo />

      {/* 4. Scroll-timeline How it Works */}
      <HowItWorks />

      {/* 5. Feature List */}
      <FeaturesGrid />

      {/* 6. Supported Topics grid */}
      <SupportedTopics />

      {/* 8. Counting performance stats */}
      <PerformanceMetrics />

      {/* 9. Testimonials marquee */}
      <Testimonials />

      {/* 10. Call to Action (CTA) Section */}
      <section className="py-24 px-6 relative overflow-hidden border-t border-border-subtle bg-black/10">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-text-secondary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles size={12} className="text-primary animate-pulse" />
            Get Started
          </motion.div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary mb-6 tracking-tight">
            Ready to See Algorithms Come Alive?
          </h2>
          
          <p className="text-text-secondary max-w-xl mx-auto text-base leading-relaxed mb-10">
            Create an account to track your progress through 200+ interview exercises, save code profiles, and unlock custom trace compile features.
          </p>

          {/* Signup and inputs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
            <div className="relative w-full">
              <Mail size={16} className="text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full pl-11 pr-4 py-3.5 bg-black/25 dark:bg-black/20 border border-border-subtle focus:border-primary rounded-full font-medium text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))}
              className="capsule-btn-primary group w-full sm:w-auto flex items-center justify-center gap-2"
              style={{
                boxShadow: '0 4px 20px var(--card-glow)'
              }}
            >
              Sign Up Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
