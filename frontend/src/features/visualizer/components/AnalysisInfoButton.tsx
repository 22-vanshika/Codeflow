import { useState } from 'react';
import { Brain, X, Activity, GitGraph, FileText } from 'lucide-react';
import { useExecutionStore } from '../../../store/executionStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function AnalysisInfoButton() {
    const { analysis, traceMode } = useExecutionStore();
    const [isOpen, setIsOpen] = useState(false);

    // Button is now always visible
    // if (!analysis) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md transition-all ${isOpen
                    ? 'bg-accent-purple/20 text-accent-purple ring-1 ring-accent-purple/50'
                    : 'hover:bg-white/5 text-text-muted hover:text-accent-purple'
                    }`}
                title="AI Analysis & Complexity"
            >
                <Brain size={18} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Popover */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-80 bg-bg-panel border border-border-subtle rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                                    <h3 className="font-bold text-text-primary flex items-center gap-2 text-sm">
                                        <Brain size={16} className="text-accent-purple" />
                                        Code Analysis
                                    </h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-text-muted hover:text-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">

                                    {/* Pattern */}
                                    <div className="bg-bg-main/50 rounded-lg p-3 border border-border-subtle/50">
                                        <div className="text-xs font-semibold text-accent-cyan uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <GitGraph size={12} /> Pattern
                                        </div>
                                        <p className="text-sm text-text-primary font-medium">
                                            {analysis?.pattern || <span className="text-text-muted italic">Not available</span>}
                                        </p>
                                    </div>

                                    {/* Complexity */}
                                    <div className="bg-bg-main/50 rounded-lg p-3 border border-border-subtle/50">
                                        <div className="text-xs font-semibold text-accent-green uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <Activity size={12} /> Complexity
                                        </div>
                                        <p className="text-sm text-text-primary font-medium">
                                            {analysis?.complexity || <span className="text-text-muted italic">Not available</span>}
                                        </p>
                                    </div>

                                    {/* Overview */}
                                    <div className="text-sm text-text-muted leading-relaxed">
                                        <div className="text-xs font-semibold text-text-muted/80 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <FileText size={12} /> Overview
                                        </div>
                                        <p className="italic opacity-90 text-xs">
                                            {analysis?.overview || "Run code execution to generate AI analysis."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
