import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Play, ChevronDown, ChevronUp, Command } from 'lucide-react';
import InputPanel from '../../visualizer/components/panels/InputPanel';
import OutputPanel from '../../visualizer/components/panels/OutputPanel';

interface SlidingConsoleProps {
    isOpen: boolean;
    onToggle: () => void;
    onRun: () => void;
}

export default function SlidingConsole({ isOpen, onToggle, onRun }: SlidingConsoleProps) {
    return (
        <div className="absolute inset-x-0 bottom-0 z-40 pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="pointer-events-auto h-[320px] bg-[#0d1117]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary">
                                    <Terminal size={16} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Console Output</h3>
                                    <p className="text-[10px] text-text-muted font-bold tracking-tight">Run your code to see results</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={onRun}
                                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-black transition-all shadow-lg shadow-primary/20"
                                >
                                    <Play size={12} fill="currentColor" />
                                    RUN CODE
                                </button>
                                <button 
                                    onClick={onToggle}
                                    className="p-2 text-text-muted hover:text-white rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <ChevronDown size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Input Column */}
                            <div className="w-1/3 border-r border-white/5 flex flex-col">
                                <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Standard Input</span>
                                    <Command size={12} className="text-text-muted" />
                                </div>
                                <div className="flex-1">
                                    <InputPanel />
                                </div>
                            </div>
                            {/* Output Column */}
                            <div className="flex-1 flex flex-col">
                                <div className="px-4 py-2 border-b border-white/5 bg-white/5">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Standard Output</span>
                                </div>
                                <div className="flex-1">
                                    <OutputPanel />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Tab (visible when closed) */}
            {!isOpen && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto"
                >
                    <button 
                        onClick={onToggle}
                        className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-bg-panel/80 backdrop-blur-md border border-white/10 text-white shadow-2xl hover:bg-bg-panel hover:border-primary/50 transition-all group"
                    >
                        <div className="w-2 h-2 rounded-full bg-primary group-hover:animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Open Console</span>
                        <ChevronUp size={16} className="text-text-muted group-hover:text-white transition-colors" />
                    </button>
                </motion.div>
            )}
        </div>
    );
}
