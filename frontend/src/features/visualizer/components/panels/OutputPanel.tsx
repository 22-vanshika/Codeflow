import React, { useState } from 'react';
import { Terminal, CheckCircle, AlertTriangle, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useExecutionStore } from '../../../../store/executionStore';

const OutputPanel = React.memo(function OutputPanel() {
    const { traces, currentStepIndex, isPlaying, traceOutput, traceSteps, runOutput, reset } = useExecutionStore();
    const [collapsed, setCollapsed] = useState(false);

    // Trace/Visualize Output
    const currentTrace = traces[currentStepIndex];
    const hasTraceData = traceSteps && traceSteps.length > 0;
    const vizOutput = hasTraceData ? (traceOutput || "") : (currentTrace?.output || "");

    const showRunOutput = !!runOutput;

    const isFinished = hasTraceData
        ? (currentStepIndex === traceSteps.length - 1)
        : (currentStepIndex === traces.length - 1 && traces.length > 0 && !isPlaying);

    const displayOutput = vizOutput;
    const hasAnything = showRunOutput || displayOutput || isFinished;

    if (!hasAnything) return null;

    const isCompiler = showRunOutput && runOutput;
    const isSuccess = isCompiler ? runOutput!.code === 0 : isFinished;

    return (
        <div className={`flex flex-col border-t border-[#1e2d3d] bg-[#0d1117] transition-all duration-300 ${collapsed ? 'h-9' : 'h-[160px]'} shrink-0`}>
            {/* Header */}
            <div
                className="flex items-center justify-between px-3 h-9 cursor-pointer hover:bg-[#111827] transition-colors select-none shrink-0"
                onClick={() => setCollapsed(v => !v)}
            >
                <div className="flex items-center gap-2">
                    <Terminal size={13} className={isCompiler ? "text-purple-400" : "text-green-400"} />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#768390]">
                        {isCompiler ? "Compiler Output" : "Execution Output"}
                    </span>
                    {/* Status badge */}
                    {isCompiler ? (
                        isSuccess ? (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-900/30 border border-green-800/40 text-green-400 text-[10px] font-semibold">
                                <CheckCircle size={9} /> OK
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-900/30 border border-red-800/40 text-red-400 text-[10px] font-semibold">
                                <AlertTriangle size={9} /> ERR
                            </span>
                        )
                    ) : isFinished && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-900/30 border border-cyan-800/40 text-cyan-400 text-[10px] font-semibold">
                            <CheckCircle size={9} /> Done
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={e => { e.stopPropagation(); reset(); }}
                        className="p-0.5 hover:text-red-400 text-[#768390] transition-colors"
                        title="Clear output"
                    >
                        <X size={12} />
                    </button>
                    {collapsed
                        ? <ChevronUp size={13} className="text-[#768390]" />
                        : <ChevronDown size={13} className="text-[#768390]" />
                    }
                </div>
            </div>

            {/* Scrollable Content */}
            {!collapsed && (
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e2d3d] scrollbar-track-transparent font-mono text-sm p-3 min-h-0">
                    {isCompiler && runOutput ? (
                        <div className="space-y-2">
                            {runOutput.stdout && (
                                <pre className="text-[#c9d1d9] whitespace-pre-wrap break-words text-xs leading-relaxed">{runOutput.stdout}</pre>
                            )}
                            {runOutput.stderr && (
                                <pre className="text-red-400 whitespace-pre-wrap break-words text-xs leading-relaxed">{runOutput.stderr}</pre>
                            )}
                            {runOutput.output && !runOutput.stdout && !runOutput.stderr && (
                                <pre className="text-[#768390] whitespace-pre-wrap break-words text-xs">{runOutput.output}</pre>
                            )}
                            {!runOutput.stdout && !runOutput.stderr && !runOutput.output && (
                                <span className="italic text-[#768390] text-xs">No output produced.</span>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {displayOutput ? (
                                <pre className="text-[#c9d1d9] whitespace-pre-wrap break-words text-xs leading-relaxed">{displayOutput}</pre>
                            ) : (
                                <span className="italic text-[#768390] text-xs">No output generated.</span>
                            )}
                            {isFinished && (
                                <div className="pt-2 mt-2 border-t border-[#1e2d3d] text-cyan-400 text-[10px] font-semibold">
                                    ✓ Program finished successfully.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default OutputPanel;
