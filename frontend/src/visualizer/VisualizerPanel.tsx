import { motion, AnimatePresence } from 'framer-motion';
import { useExecutionStore } from '../store/executionStore';
import { Layers, Box, ArrowRight } from 'lucide-react';

export default function VisualizerPanel() {
    const { traces, currentStepIndex } = useExecutionStore();
    const currentTrace = traces[currentStepIndex];

    if (!currentTrace) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                <div className="p-4 rounded-full bg-white/5 border border-white/5">
                    <Box size={32} className="opacity-50" />
                </div>
                <div className="text-center">
                    <p className="font-medium text-gray-500">No Execution Trace</p>
                    <p className="text-sm text-gray-700 mt-1">Run code to visualize memory</p>
                </div>
            </div>
        );
    }

    const stack = currentTrace.stack;
    const reversedStack = [...stack].reverse();

    return (
        <div className="h-full flex flex-col p-4 space-y-6 overflow-y-auto custom-scrollbar">

            {/* Execution Log Card */}
            <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                    <ArrowRight size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                    <p className="font-mono text-sm text-purple-200 leading-snug">
                        {currentTrace.explanation}
                    </p>
                </div>
            </div>

            <div>
                <div className="flex items-center space-x-2 mb-3 text-gray-400">
                    <Layers size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Call Stack ({stack.length})</span>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {reversedStack.map((frame, index) => (
                            <motion.div
                                key={`${frame.function}-${stack.length - 1 - index}`}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                layout
                                className={`
                    rounded-xl border shadow-lg overflow-hidden
                    ${index === 0
                                        ? 'bg-surfaceHighlight border-blue-500/30 shadow-blue-900/10'
                                        : 'bg-surface border-white/5 opacity-60'}
                `}
                            >
                                {/* Frame Header */}
                                <div className={`px-4 py-2 border-b flex justify-between items-center ${index === 0 ? 'bg-white/5 border-white/5' : 'border-transparent'}`}>
                                    <span className={`font-mono text-sm font-bold ${index === 0 ? 'text-blue-400' : 'text-gray-500'}`}>
                                        {frame.function}()
                                    </span>
                                    {index === 0 && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Active</span>}
                                </div>

                                {/* Locals */}
                                <div className="p-3 space-y-2">
                                    <AnimatePresence>
                                        {Object.entries(frame.locals).map(([name, value]) => (
                                            <motion.div
                                                key={name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-5 h-5 rounded bg-pink-500/20 flex items-center justify-center text-[10px] font-bold text-pink-400">
                                                        {typeof value === 'string' ? 'S' : typeof value === 'boolean' ? 'B' : 'I'}
                                                    </div>
                                                    <span className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">{name}</span>
                                                </div>
                                                <span className="font-mono text-sm font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                                    {JSON.stringify(value)}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {Object.keys(frame.locals).length === 0 && (
                                        <div className="text-center py-2">
                                            <span className="text-xs text-gray-600 italic">No local variables</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
