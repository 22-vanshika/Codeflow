import { useExecutionStore } from '../../../store/executionStore';
import { 
    Clock, Database, Zap, BookOpen, GitCompare, 
    Layers, CornerDownRight, Play, CheckCircle, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComplexityTab() {
    const { 
        code,
        analysis, 
        currentStepIndex, 
        traceSteps, 
        traces,
        traceMode
    } = useExecutionStore();

    const stepsArray = traceMode ? traceSteps : traces;
    const currentStep = stepsArray[currentStepIndex];

    const getLineContent = (step: any) => {
        if (!step) return "";
        if (step && 'lineContent' in step && typeof step.lineContent === 'string') {
            return step.lineContent;
        }
        const lines = code.split('\n');
        const lineIdx = step.line - 1;
        return (lineIdx >= 0 && lineIdx < lines.length) ? lines[lineIdx] : "";
    };

    const currentLineContent = currentStep ? getLineContent(currentStep) : "";

    if (!analysis) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-text-muted space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 animate-pulse">
                    <Zap size={32} className="text-primary" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">No Complexity Data Available</h4>
                    <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                        Generate an execution trace or run simulation to analyze complexity.
                    </p>
                </div>
            </div>
        );
    }

    // Helper to extract current operation cost during execution steps
    const getLiveOperation = (lineContent: string) => {
        const trimmed = lineContent.trim();
        if (!trimmed) return null;

        if (/\bfor\s*\(|\bwhile\s*\(/.test(trimmed)) {
            return {
                name: "Loop Iteration / Condition Check",
                cost: "O(1) per check",
                desc: "Checking loop condition and moving to the next iteration."
            };
        }
        if (/\.push_back\b|\.pop_back\b/.test(trimmed)) {
            return {
                name: "Vector Push/Pop Operation",
                cost: "O(1) amortized",
                desc: "Inserting or deleting at the end of a contiguous array block."
            };
        }
        if (/\bpush\b|\bpop\b|\btop\b/.test(trimmed)) {
            return {
                name: "Stack/Queue Operation",
                cost: "O(1)",
                desc: "Standard constant-time container access (LIFO/FIFO)."
            };
        }
        if (/\binsert\b|\berase\b/.test(trimmed)) {
            if (/\b(unordered_map|unordered_set)\b/.test(trimmed) || /mp|set/i.test(trimmed)) {
                return {
                    name: "HashMap Insert/Erase",
                    cost: "O(1) average, O(N) worst",
                    desc: "Adding or removing from a bucket-based hash structure."
                };
            }
            return {
                name: "Balanced BST Insert/Erase",
                cost: "O(log N)",
                desc: "Adding or removing elements from a Red-Black self-balancing tree."
            };
        }
        if (/\.find\b|\[.*\]/.test(trimmed)) {
            if (/mp|set/i.test(trimmed)) {
                return {
                    name: "Map lookup",
                    cost: "O(1) average / O(log N)",
                    desc: "Searching key in HashMap or Balanced tree."
                };
            }
            return {
                name: "Array Index Access",
                cost: "O(1)",
                desc: "Accessing element at memory address offset directly."
            };
        }
        if (/\bswap\b/.test(trimmed)) {
            return {
                name: "Swap Elements",
                cost: "O(1)",
                desc: "Exchanging memory values of two variables."
            };
        }
        if (/\b(int|double|float|char|auto)\b\s+\w+\s*=/.test(trimmed)) {
            return {
                name: "Variable Initialization",
                cost: "O(1)",
                desc: "Allocating and assigning local variable."
            };
        }
        if (/\b(cout|cin)\b/.test(trimmed)) {
            return {
                name: "I/O Operation",
                cost: "O(1) / O(L)",
                desc: "Reading/writing to system buffer stream."
            };
        }
        if (/\b(return)\b/.test(trimmed)) {
            return {
                name: "Function Return / Stack Pop",
                cost: "O(1)",
                desc: "Exiting function scope, pop stack frame, and return value."
            };
        }

        return {
            name: "Primitive Statement",
            cost: "O(1)",
            desc: "Basic constant-time execution step."
        };
    };

    const liveOp = currentStep ? getLiveOperation(currentLineContent) : null;

    return (
        <div className="h-full flex flex-col bg-bg-main overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {/* 1. FINAL COMPLEXITY CARD */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full" />
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Time Complexity</span>
                    </div>
                    <div className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                        {analysis.timeComplexity}
                    </div>
                    <p className="text-[10px] text-text-muted mt-2 font-medium">Worst-case runtime bounds</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-secondary/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-2xl rounded-full" />
                    <div className="flex items-center gap-2 mb-2">
                        <Database size={16} className="text-secondary animate-pulse" />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Space Complexity</span>
                    </div>
                    <div className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                        {analysis.spaceComplexity}
                    </div>
                    <p className="text-[10px] text-text-muted mt-2 font-medium">Memory footprint bounds</p>
                </div>
            </div>

            {/* 2. DYNAMIC LIVE COMPLEXITY TRACKER */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden shrink-0">
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/20 text-[8px] font-black text-primary uppercase tracking-widest animate-pulse">
                    Live Tracking
                </div>
                <div className="flex items-center gap-2 text-primary mb-3">
                    <Play size={14} className="fill-current" />
                    <h4 className="text-[10px] font-black uppercase tracking-wider">Active Execution Line</h4>
                </div>
                {currentStep ? (
                    <div className="space-y-3 font-mono">
                        <div className="p-3 bg-bg-main/60 rounded-xl border border-white/5 text-xs text-white overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-3">
                            <span className="text-text-muted text-[10px] font-bold select-none border-r border-white/10 pr-2">Line {currentStep.line}</span>
                            <span className="text-accent-cyan font-bold">{currentLineContent}</span>
                        </div>
                        {liveOp && (
                            <div className="grid grid-cols-2 gap-4 text-xs font-sans mt-2">
                                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="text-[9px] font-bold text-text-muted uppercase mb-1">Active Operation</div>
                                    <div className="font-bold text-white text-[11px]">{liveOp.name}</div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="text-[9px] font-bold text-text-muted uppercase mb-1">Step Complexity</div>
                                    <div className="font-bold text-accent-cyan text-[11px] font-mono">{liveOp.cost}</div>
                                </div>
                            </div>
                        )}
                        <div className="text-[9px] text-text-muted leading-relaxed font-sans px-1">
                            {liveOp?.desc}
                        </div>
                    </div>
                ) : (
                    <div className="text-[11px] text-text-muted font-bold text-center py-2 flex flex-col items-center gap-2">
                        <HelpCircle size={18} className="opacity-40" />
                        AWAITING STEP-BY-STEP PLAYBACK
                    </div>
                )}
            </div>

            {/* 3. COMPLEXITY BREAKDOWN */}
            {analysis.timeBreakdown && analysis.timeBreakdown.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-text-muted px-1">
                        <Layers size={14} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Complexity Breakdown</h4>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        {analysis.timeBreakdown.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1 text-xs border-b border-white/5 last:border-0 last:pb-0">
                                <span className="text-text-secondary font-medium flex items-center gap-1.5">
                                    <CornerDownRight size={10} className="text-text-muted" />
                                    {item.operation}
                                </span>
                                <span className="font-bold text-white font-mono bg-white/5 px-2 py-0.5 rounded text-[10px]">{item.complexity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. SPACE BREAKDOWN */}
            {analysis.spaceBreakdown && analysis.spaceBreakdown.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-text-muted px-1">
                        <Database size={14} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Space Allocation Breakdown</h4>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        {analysis.spaceBreakdown.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1 text-xs border-b border-white/5 last:border-0 last:pb-0">
                                <span className="text-text-secondary font-medium flex items-center gap-1.5">
                                    <CornerDownRight size={10} className="text-text-muted" />
                                    {item.structure}
                                </span>
                                <span className="font-bold text-white font-mono bg-white/5 px-2 py-0.5 rounded text-[10px]">{item.complexity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 5. COMPLEXITY EXPLANATION */}
            {analysis.stepExplanations && analysis.stepExplanations.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-text-muted px-1">
                        <BookOpen size={14} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Derivation Explanation</h4>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                        {analysis.stepExplanations.map((step, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary shrink-0 mt-0.5">
                                    {idx + 1}
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 6. AUTOMATIC PATTERN DETECTIONS & VISUAL TREES */}
            {analysis.detections && analysis.detections.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-text-muted px-1">
                        <Zap size={14} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Automatic Pattern Detections</h4>
                    </div>
                    <div className="space-y-4">
                        {analysis.detections.map((d, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden group hover:border-accent-cyan/30 transition-all duration-300">
                                <div className="absolute top-0 right-0 p-3">
                                    <span className="px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase tracking-tighter bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/20">
                                        {d.complexity}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                                    <h5 className="text-xs font-bold text-white">{d.title}</h5>
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                    {d.explanation}
                                </p>
                                <pre className="p-2.5 bg-bg-main/60 border border-white/5 rounded-lg text-[10px] font-mono text-accent-cyan/80 overflow-x-auto whitespace-pre">
                                    <code>{d.codeSnippet}</code>
                                </pre>

                                {/* Visual Tree representations */}
                                {d.visualTree && d.visualTree.length > 0 && (
                                    <div className="mt-2.5 pt-2.5 border-t border-white/5 space-y-1">
                                        <div className="text-[9px] font-black text-text-muted uppercase tracking-wider mb-1.5">Visual Derivation</div>
                                        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                                            {d.visualTree.map((node, nIdx) => (
                                                <div key={nIdx} className="flex items-center gap-2">
                                                    {node === "↓" || node === "×" || node === "=" || node === "+" || node === "↩" ? (
                                                        <span className="text-primary font-black">{node}</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-white/5 border border-white/5 rounded text-white font-bold">{node}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 7. LEARNING MODE COMPARISONS */}
            {analysis.learningMode && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-text-muted px-1">
                        <GitCompare size={14} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Complexity Learning Mode</h4>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/10">
                                <div className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1">Brute Force</div>
                                <div className="font-mono font-bold text-white text-sm mb-1">
                                    Time: {analysis.learningMode.bruteForce.time}
                                </div>
                                <div className="font-mono text-[10px] text-text-muted">
                                    Space: {analysis.learningMode.bruteForce.space}
                                </div>
                                {analysis.learningMode.bruteForce.explanation && (
                                    <div className="text-[9px] text-text-muted mt-2 font-medium">
                                        {analysis.learningMode.bruteForce.explanation}
                                    </div>
                                )}
                            </div>

                            <div className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/10">
                                <div className="text-[9px] font-bold text-green-400 uppercase tracking-widest mb-1">Optimized</div>
                                <div className="font-mono font-bold text-white text-sm mb-1">
                                    Time: {analysis.learningMode.optimized.time}
                                </div>
                                <div className="font-mono text-[10px] text-text-muted">
                                    Space: {analysis.learningMode.optimized.space}
                                </div>
                                {analysis.learningMode.optimized.explanation && (
                                    <div className="text-[9px] text-text-muted mt-2 font-medium">
                                        {analysis.learningMode.optimized.explanation}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Improvement tag */}
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-semibold">
                            <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Complexity Shift</span>
                            <span className="text-accent-cyan font-bold font-mono tracking-tight bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/20">
                                {analysis.learningMode.improvement}
                            </span>
                        </div>

                        <div className="text-xs text-text-secondary leading-relaxed font-medium">
                            <span className="font-bold text-white block mb-1">Why this optimization works:</span>
                            {analysis.learningMode.optimizationReason}
                        </div>
                    </div>
                </div>
            )}

            {/* 8. SUMMARY AT END */}
            {currentStepIndex === stepsArray.length - 1 && stepsArray.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-accent-green/5 border border-accent-green/20 space-y-3 shrink-0"
                >
                    <div className="flex items-center gap-2 text-accent-green">
                        <CheckCircle size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-wider">Execution Summary</h4>
                    </div>
                    <div className="text-xs space-y-2">
                        <p className="text-text-secondary font-medium leading-relaxed">
                            Program completed successfully! 
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                            <div>
                                <span className="block text-text-muted uppercase font-bold text-[8px]">Derived Complexity</span>
                                <span className="font-mono text-white font-bold">{analysis.timeComplexity} / {analysis.spaceComplexity}</span>
                            </div>
                            <div>
                                <span className="block text-text-muted uppercase font-bold text-[8px]">Steps Run</span>
                                <span className="text-white font-bold">{stepsArray.length} execution steps</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
