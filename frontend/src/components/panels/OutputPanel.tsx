import { Terminal, CheckCircle, AlertTriangle } from 'lucide-react';
import { useExecutionStore } from '../../store/executionStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function OutputPanel() {
    const { traces, currentStepIndex, isPlaying, traceOutput, traceSteps, runOutput } = useExecutionStore();

    // Trace/Visualize Output
    const currentTrace = traces[currentStepIndex];
    const hasTraceData = traceSteps && traceSteps.length > 0;
    const vizOutput = hasTraceData ? (traceOutput || "") : (currentTrace?.output || "");

    // Real Run Output (prioritized if exists)
    const showRunOutput = !!runOutput;

    // If output is generated via Run Code button
    if (showRunOutput && runOutput) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    className="absolute bottom-0 left-0 right-0 bg-bg-panel border-t border-border-subtle shadow-2xl z-50 flex flex-col max-h-[300px]"
                >
                    <div className="h-10 border-b border-border-subtle flex items-center justify-between px-4 bg-bg-main">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-accent-purple" />
                            <span className="font-bold text-text-primary text-xs uppercase tracking-wider">Compiler Output</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            {runOutput.code === 0 ? (
                                <span className="text-accent-green flex items-center gap-1"><CheckCircle size={12} /> Success</span>
                            ) : (
                                runOutput.stderr ? (
                                    <span className="text-accent-red flex items-center gap-1"><AlertTriangle size={12} /> Error (Exit Code: {runOutput.code})</span>
                                ) : (
                                    <span className="text-accent-orange flex items-center gap-1" title="Program calculation result used as exit code?"><AlertTriangle size={12} /> Fin (Code: {runOutput.code})</span>
                                )
                            )}
                        </div>
                    </div>
                    <div className="p-4 font-mono text-sm overflow-auto whitespace-pre-wrap h-full">
                        {runOutput.stdout && <div className="text-text-primary">{runOutput.stdout}</div>}
                        {runOutput.stderr && <div className="text-accent-red mt-2">{runOutput.stderr}</div>}
                        {runOutput.output && !runOutput.stdout && !runOutput.stderr && <div className="text-text-muted">{runOutput.output}</div>}
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Visualize Output Logic (Existing)
    const isFinished = hasTraceData
        ? (currentStepIndex === traceSteps.length - 1)
        : (currentStepIndex === traces.length - 1 && traces.length > 0 && !isPlaying);

    const displayOutput = vizOutput;

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
