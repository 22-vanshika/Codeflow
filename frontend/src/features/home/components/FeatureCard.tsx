import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, desc, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="p-8 liquid-glass-card border border-white/5 shadow-lg relative group overflow-hidden bg-white/[0.02]"
    >
      {/* Dynamic hover corner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Floating Icon Box */}
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300 text-primary">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Slide-in bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary via-secondary to-accent-cyan w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}
