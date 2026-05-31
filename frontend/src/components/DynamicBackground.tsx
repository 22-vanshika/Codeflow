import { motion } from 'framer-motion';

export default function DynamicBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base Background */}
            <div className="absolute inset-0 bg-bg-main" />

            {/* Glowing Blobs */}
            <motion.div 
                animate={{ 
                    x: [0, 100, 0], 
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] mix-blend-screen"
            />
            <motion.div 
                animate={{ 
                    x: [0, -80, 0], 
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] -right-[5%] w-[40%] h-[60%] bg-accent-purple/10 rounded-full blur-[100px] mix-blend-screen"
            />
            <motion.div 
                animate={{ 
                    x: [0, 50, 0], 
                    y: [0, -100, 0],
                    scale: [1, 1.3, 1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-accent-cyan/10 rounded-full blur-[110px] mix-blend-screen"
            />

            {/* Subtle Grid */}
            <div 
                className="absolute inset-0 opacity-[0.03]" 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} 
            />

            {/* Floating Particles/Nodes (Simulated) */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ 
                            x: Math.random() * 100 + "%", 
                            y: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.5
                        }}
                        animate={{ 
                            y: [null, "-20px", "0px"],
                            opacity: [null, 0.8, 0.3]
                        }}
                        transition={{ 
                            duration: 5 + Math.random() * 5, 
                            repeat: Infinity, 
                            delay: Math.random() * 5 
                        }}
                        className="absolute w-1 h-1 bg-primary rounded-full"
                    />
                ))}
            </div>
        </div>
    );
}
