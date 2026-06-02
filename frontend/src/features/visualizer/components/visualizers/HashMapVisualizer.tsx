import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HashMapVisual } from '../../../../types';
import { useExecutionStore } from '../../../../store/executionStore';
import './visualizers.css';

interface HashMapVisualizerProps {
    visual: HashMapVisual;
    className?: string;
    compact?: boolean;
}

const renderCellContent = (p: any) => {
    if (p && typeof p === 'object' && 'first' in p && 'second' in p) {
        return (
            <div className="flex border border-white/5 rounded-md overflow-hidden bg-slate-950 font-mono text-[11px] shadow-sm">
                <div className="px-1.5 py-0.5 bg-slate-900 text-slate-300 border-r border-white/5">{formatValue(p.first)}</div>
                <div className="px-1.5 py-0.5 text-orange-400 font-semibold">{formatValue(p.second)}</div>
            </div>
        );
    }
    return <span>{formatValue(p)}</span>;
};

const HashMapVisualizer = memo(({ visual, className = '', compact = false }: HashMapVisualizerProps) => {
    const { target, entries, activeKeys = [] } = visual;

    const { currentStepIndex, traceSteps, traces } = useExecutionStore();
    const stepsArray = traceSteps.length > 0 ? traceSteps : traces;
    const currentTraceStep = stepsArray[currentStepIndex] as any;

    const isScopeVars = target === 'Scope Variables';
    const isPair = target.toLowerCase().includes('pair');

    // 1. Render Scope Variables as Premium Visual Cards
    if (isScopeVars) {
        return (
            <div className={`flex flex-col items-center justify-center w-full ${compact ? 'p-1' : 'p-4'} ${className}`}>
                {!compact && (
                    <h3 className="text-xs font-black text-accent-purple uppercase tracking-[0.2em] mb-4">
                        Active Variables
                    </h3>
                )}
                <div className={`flex flex-wrap items-center justify-center max-w-4xl ${compact ? 'gap-3' : 'gap-6'}`}>
                    <AnimatePresence>
                        {entries.map(({ key, value }) => {
                            const isHighlighted = activeKeys.includes(key);
                            return (
                                <motion.div
                                    key={String(key)}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex flex-col items-center"
                                >
                                    <span className={`font-black text-[#768390] uppercase tracking-[0.2em] font-mono ${
                                        compact ? 'text-[8px] mb-1' : 'text-[10px] mb-2'
                                    }`}>
                                        {String(key)}
                                    </span>
                                    <div 
                                        className={`rounded-xl border flex flex-col items-center justify-center font-mono font-black relative overflow-hidden transition-all duration-300 shadow-md
                                            ${compact ? 'w-12 h-12 text-xs' : 'w-14 h-14 text-sm'}
                                            ${isHighlighted
                                                ? 'border-accent-cyan bg-slate-900 text-accent-cyan shadow-glow ring-1 ring-accent-cyan/30'
                                                : 'border-white/10 bg-slate-950/80 text-[#cdd6f4] hover:border-white/20'
                                            }
                                        `}
                                        data-var-name={String(key)}
                                    >
                                        <span>{formatValue(value)}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // 2. Render Pair as Split Card
    if (isPair) {
        const pairName = target.replace(' (pair)', '');
        const firstEntry = entries.find(e => e.key === 'first')?.value;
        const secondEntry = entries.find(e => e.key === 'second')?.value;
        
        return (
            <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
                <span className="text-xs font-black text-accent-purple uppercase tracking-[0.2em] mb-3">
                    Pair: {pairName}
                </span>
                <div className="flex border border-white/10 rounded-2xl overflow-hidden bg-slate-950/80 shadow-md hover:border-accent-cyan/40 hover:shadow-glow transition-all duration-300">
                    <div 
                        className="w-14 h-14 flex flex-col items-center justify-center border-r border-white/10 relative"
                        data-var-name={`${pairName}.first`}
                    >
                        <span className="text-[7px] font-black text-[#768390] uppercase absolute top-1 font-mono">first</span>
                        <span className="font-mono text-xs font-bold text-accent-cyan mt-1.5">{formatValue(firstEntry)}</span>
                    </div>
                    <div 
                        className="w-14 h-14 flex flex-col items-center justify-center relative"
                        data-var-name={`${pairName}.second`}
                    >
                        <span className="text-[7px] font-black text-[#768390] uppercase absolute top-1 font-mono">second</span>
                        <span className="font-mono text-xs font-bold text-accent-orange mt-1.5">{formatValue(secondEntry)}</span>
                    </div>
                </div>
            </div>
        );
    }

    const isSet = target.toLowerCase().includes('set');

    return (
        <div className={`flex flex-col items-center justify-center w-full h-full ${compact ? 'p-2' : 'p-4'} overflow-auto custom-scrollbar ${className}`}>
            <h3 className={`${compact ? 'text-[10px] mb-2' : 'text-xs mb-4'} font-black text-accent-purple uppercase tracking-widest`}>
                {target.replace(' (Set)', '')} <span className="text-text-muted text-[10px] normal-case">({isSet ? 'Set' : 'Hash Map'})</span>
            </h3>

            {entries.length === 0 ? (
                <div className={`flex items-center justify-center border border-dashed border-border-subtle rounded-xl w-64 text-text-muted italic ${
                    compact ? 'h-14 text-xs w-full' : 'h-20 text-sm'
                }`}>
                    {target.replace(' (Set)', '')} is empty
                </div>
            ) : (
                <div className={isSet 
                    ? "flex flex-wrap justify-center gap-4 max-w-4xl" 
                    : (compact ? "grid grid-cols-1 gap-2.5 w-full max-w-md" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl")
                }>
                    <AnimatePresence>
                        {entries.map(({ key, value }) => {
                            const isActive = activeKeys.includes(key);

                            const isOpTarget = currentTraceStep?.dataStructureOp &&
                                (currentTraceStep.dataStructureOp.target === target || 
                                 target.toLowerCase().startsWith(currentTraceStep.dataStructureOp.target.toLowerCase()));
                            
                            const isOpKey = currentTraceStep?.dataStructureOp?.value !== undefined &&
                                (typeof currentTraceStep.dataStructureOp.value === 'object' && 'key' in currentTraceStep.dataStructureOp.value
                                    ? currentTraceStep.dataStructureOp.value.key === key
                                    : currentTraceStep.dataStructureOp.value === key);
                            
                            const isOpRejected = isOpTarget && isOpKey && currentTraceStep?.dataStructureOp?.isRejected;
                            const rejectClass = isOpRejected ? 'av-duplicate-rejected' : '';

                            // 3A. Render Set Bucket
                            if (isSet) {
                                return (
                                    <motion.div
                                        key={String(key)}
                                        layout
                                        initial={{ opacity: 0, scale: 0.7 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.2 } }}
                                        className={`relative flex items-center justify-center rounded-full border-2 shadow-md font-mono text-xs font-black transition-all duration-300 w-14 h-14 ${rejectClass} ${
                                            isActive
                                                ? 'border-accent-cyan bg-slate-900 text-accent-cyan shadow-glow scale-105'
                                                : 'border-white/10 bg-slate-900/60 text-[#cdd6f4] hover:border-white/20'
                                        }`}
                                    >
                                        {isOpRejected && (
                                            <div className="absolute -top-4 bg-red-500 text-slate-950 text-[7px] font-black px-1 py-0.5 rounded shadow tracking-widest uppercase animate-bounce whitespace-nowrap z-30">
                                                Already Exists
                                            </div>
                                        )}
                                        <span>{formatValue(key)}</span>
                                    </motion.div>
                                );
                            }

                            // 3B. Render Map Key-Value Mapping Cards
                            return (
                                <motion.div
                                    key={String(key)}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    className={`relative flex items-center gap-2 p-2 rounded-2xl border transition-all duration-300 shadow-md ${rejectClass} ${
                                        isActive
                                            ? 'border-accent-cyan bg-slate-900/40 shadow-glow ring-1 ring-accent-cyan/20 z-10'
                                            : 'border-white/5 bg-slate-950/40 hover:border-white/10'
                                    }`}
                                >
                                    {/* Key block */}
                                    <div className={`flex items-center justify-center font-mono font-black rounded-xl border flex-1 py-2 px-3 text-xs ${
                                        isActive ? 'bg-slate-900 border-accent-cyan text-accent-cyan' : 'bg-slate-950 border-white/5 text-[#cdd6f4]'
                                    }`}>
                                        {renderCellContent(key)}
                                    </div>
                                    
                                    {/* Mapping arrow */}
                                    <span className={`text-[10px] font-bold ${isActive ? 'text-accent-cyan animate-pulse' : 'text-slate-600'}`}>→</span>

                                    {/* Value block */}
                                    <div className="flex items-center justify-center font-mono font-semibold rounded-xl border border-white/5 bg-slate-950 text-orange-400 flex-1 py-2 px-3 text-xs">
                                        {renderCellContent(value)}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
});

HashMapVisualizer.displayName = 'HashMapVisualizer';
export default HashMapVisualizer;

function formatValue(val: any): string {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'string') return `"${val}"`;
    if (Array.isArray(val)) return `[${val.join(', ')}]`;
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
}

