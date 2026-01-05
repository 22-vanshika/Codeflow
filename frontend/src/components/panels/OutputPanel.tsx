
import { Terminal, X } from 'lucide-react';
import { useExecutionStore } from '../../store/executionStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function OutputPanel() {
    const { traces, currentStepIndex, isPlaying, traceMode, traceOutput, traceSteps } = useExecutionStore();

    // Get output from current step or last available
    const currentTrace = traces[currentStepIndex];

    // Determine output source: if we have trace steps (Trace mode), use traceOutput. Otherwise use legacy traces.
    const hasTraceData = traceSteps && traceSteps.length > 0;

    // Determine output content
    const displayOutput = hasTraceData ? traceOutput : (currentTrace?.output || "");

    // Determine finished state
    const isFinished = hasTraceData
        ? (currentStepIndex === traceSteps.length - 1)
        : (currentStepIndex === traces.length - 1 && traces.length > 0 && !isPlaying);

    // Show if there is output AND (it's finished OR user wants to see it - for now just finished or if output exists)
    // Let's make it always visible at bottom but expanded if finished? 
    // Or just a floating button that expands?
    // Requirement: "Slide up from bottom ONLY after complete execution"

    if (!displayOutput && !isFinished) return null;

    return (
        <AnimatePresence>
            {(isFinished || displayOutput) && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="absolute bottom-0 left-0 right-0 bg-bg-panel border-t border-border-subtle shadow-2xl z-50 flex flex-col max-h-[300px]"
                >
                    <div className="h-10 border-b border-border-subtle flex items-center justify-between px-4 bg-bg-main">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-accent-green" />
                            <span className="font-bold text-text-primary text-xs uppercase tracking-wider">Execution Output</span>
                        </div>
                        {/* Close/Hide button could go here */}
                    </div>
                    <div className="p-4 font-mono text-sm text-text-muted overflow-auto whitespace-pre-wrap">
                        {displayOutput ? displayOutput : <span className="italic opacity-50">No output generated.</span>}
                        {isFinished && (
                            <div className="mt-4 pt-4 border-t border-border-subtle/50 text-accent-cyan text-xs">
                                Program finished successfully.
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
