import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import ComplexityTab from './ComplexityTab';

interface ComplexityInfoProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ComplexityInfo({ isOpen, onClose }: ComplexityInfoProps) {
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
                        className="relative w-full max-w-3xl h-[85vh] glass-morphism border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col bg-bg-main/90"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.02] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/10">
                                    <Zap size={20} className="animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Complexity Analysis</h3>
                                    <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">Algorithmic Efficiency Metrics</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 text-text-muted hover:text-white rounded-full hover:bg-white/5 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 min-h-0">
                            <ComplexityTab />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
