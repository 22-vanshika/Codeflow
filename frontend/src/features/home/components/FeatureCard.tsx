import { motion } from 'framer-motion';

export default function FeatureCard({ icon, title, desc, delay = 0 }: { icon: any, title: string, desc: string, delay?: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl glass-morphism relative group overflow-hidden"
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 text-primary">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-text-muted leading-relaxed group-hover:text-text-primary transition-colors">{desc}</p>
            </div>
            
            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-500" />
        </motion.div>
    );
}
