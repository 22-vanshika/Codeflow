import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Database, X, Zap } from 'lucide-react';

interface ComplexityInfoProps {
    isOpen: boolean;
    onClose: () => void;
    timeComplexity?: string;
    spaceComplexity?: string;
}

export default function ComplexityInfo({ isOpen, onClose, timeComplexity = 'O(N)', spaceComplexity = 'O(1)' }: ComplexityInfoProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-bg-main/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md glass-morphism border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 p-8"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <button 
                                onClick={onClose}
                                className="p-2 text-text-muted hover:text-white rounded-full hover:bg-white/5 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">Complexity Analysis</h3>
                                <p className="text-text-muted text-sm font-medium">Efficiency of your algorithm</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock size={18} className="text-primary" />
                                    <span className="text-xs font-black text-text-muted uppercase tracking-widest">Time Complexity</span>
                                </div>
                                <div className="text-2xl font-black text-white font-mono">{timeComplexity}</div>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-secondary/30 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <Database size={18} className="text-secondary" />
                                    <span className="text-xs font-black text-text-muted uppercase tracking-widest">Space Complexity</span>
                                </div>
                                <div className="text-2xl font-black text-white font-mono">{spaceComplexity}</div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold leading-relaxed">
                            💡 These values are estimates based on the standard optimal solution for this problem pattern.
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
