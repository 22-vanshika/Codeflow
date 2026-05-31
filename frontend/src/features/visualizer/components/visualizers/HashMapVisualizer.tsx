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
            <div className="flex border border-border-subtle rounded-md overflow-hidden bg-bg-panel/85 font-mono text-xs shadow-sm">
                <div className="px-2 py-1 bg-bg-main text-text-primary border-r border-border-subtle">{formatValue(p.first)}</div>
                <div className="px-2 py-1 text-accent-orange font-semibold">{formatValue(p.second)}</div>
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

    // 1. Render C++ Scope Variables as Premium Visual Cards
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
                                    {/* Variable Name Label */}
                                    <span className={`font-black text-text-muted uppercase tracking-[0.2em] font-mono ${
                                        compact ? 'text-[8px] mb-1' : 'text-[10px] mb-2'
                                    }`}>
                                        {String(key)}
                                    </span>
                                    {/* variable Visual Card */}
                                    <div 
                                        className={`rounded-xl border flex flex-col items-center justify-center font-mono font-black relative overflow-hidden transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.3)]
                                            ${compact ? 'w-12 h-12 text-sm' : 'w-16 h-16 text-base'}
                                            ${isHighlighted
                                                ? 'border-accent-cyan bg-bg-panel text-accent-cyan shadow-glow ring-1 ring-accent-cyan/30'
                                                : 'border-white/10 bg-[#0B1120]/80 text-[#cdd6f4] hover:border-white/20'
                                            }
                                        `}
                                        data-var-name={String(key)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
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

    // 2. Render C++ std::pair as Split x/y Card
    if (isPair) {
        const pairName = target.replace(' (pair)', '');
        const firstEntry = entries.find(e => e.key === 'first')?.value;
        const secondEntry = entries.find(e => e.key === 'second')?.value;
        
        return (
            <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
                <span className="text-xs font-black text-accent-purple uppercase tracking-[0.2em] mb-3">
                    Pair: {pairName}
                </span>
                {/* Pair Split Container */}
                <div className="flex border border-white/10 rounded-2xl overflow-hidden bg-[#0B1120]/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.3)] hover:border-accent-cyan/40 hover:shadow-glow transition-all duration-300">
                    {/* First compartment */}
                    <div 
                        className="w-16 h-16 flex flex-col items-center justify-center border-r border-white/10 relative"
                        data-var-name={`${pairName}.first`}
                    >
                        <span className="text-[8px] font-black text-[#768390] uppercase absolute top-1 font-mono">first</span>
                        <span className="font-mono text-sm font-bold text-accent-cyan mt-1.5">{formatValue(firstEntry)}</span>
                    </div>
                    {/* Second compartment */}
                    <div 
                        className="w-16 h-16 flex flex-col items-center justify-center relative"
                        data-var-name={`${pairName}.second`}
                    >
                        <span className="text-[8px] font-black text-[#768390] uppercase absolute top-1 font-mono">second</span>
                        <span className="font-mono text-sm font-bold text-accent-orange mt-1.5">{formatValue(secondEntry)}</span>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Render Standard Hash Map / Set
    return (
        <div className={`flex flex-col items-center justify-center w-full h-full ${compact ? 'p-2' : 'p-4'} overflow-auto custom-scrollbar ${className}`}>
            <h3 className={`${compact ? 'text-xs mb-2' : 'text-sm mb-4'} font-semibold text-accent-purple uppercase tracking-widest`}>
                {target.replace(' (Set)', '')} <span className="text-text-muted text-xs normal-case">({target.toLowerCase().includes('set') ? 'Set' : 'Hash Map'})</span>
            </h3>

            {entries.length === 0 ? (
                <div className={`flex items-center justify-center border border-dashed border-border-subtle rounded-xl w-64 text-text-muted italic ${
                    compact ? 'h-16 text-xs w-full' : 'h-24 text-sm'
                }`}>
                    {target.replace(' (Set)', '')} is empty
                </div>
            ) : (
                <div className={compact ? "grid grid-cols-2 gap-2 w-full max-w-md" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl"}>
                    <AnimatePresence>
                        {entries.map(({ key, value }) => {
                            const isActive = activeKeys.includes(key);
                            const isSet = target.toLowerCase().includes('set');

                            const isOpTarget = currentTraceStep?.dataStructureOp &&
                                (currentTraceStep.dataStructureOp.target === target || 
                                 target.toLowerCase().startsWith(currentTraceStep.dataStructureOp.target.toLowerCase()));
                            
                            const isOpKey = currentTraceStep?.dataStructureOp?.value !== undefined &&
                                (typeof currentTraceStep.dataStructureOp.value === 'object' && 'key' in currentTraceStep.dataStructureOp.value
                                    ? currentTraceStep.dataStructureOp.value.key === key
                                    : currentTraceStep.dataStructureOp.value === key);
                            
                            const isOpRejected = isOpTarget && isOpKey && currentTraceStep?.dataStructureOp?.isRejected;
                            const rejectClass = isOpRejected ? 'av-duplicate-rejected' : '';

                            return (
                                <motion.div
                                    key={String(key)}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    className={`
                                        flex items-stretch overflow-hidden rounded-xl border transition-all duration-300 shadow-sm ${rejectClass}
                                        ${isActive
                                            ? 'border-accent-cyan bg-bg-panel shadow-glow ring-1 ring-accent-cyan/50 z-10'
                                            : 'border-border-subtle bg-bg-main hover:border-border-active'
                                        }
                                    `}
                                >
                                    {/* Key Section */}
                                    <div className={`
                                        flex items-center justify-center font-mono font-bold flex-1
                                        ${compact ? 'px-2.5 py-1.5 text-xs min-w-[40px]' : 'px-4 py-2 text-sm min-w-[60px]'}
                                        ${isActive
                                            ? 'bg-accent-cyan/20 text-accent-cyan'
                                            : 'bg-bg-panel text-text-primary'
                                        }
                                        ${!isSet ? 'border-r border-border-subtle' : ''}
                                    `}>
                                        {renderCellContent(key)}
                                    </div>

                                    {/* Value Section */}
                                    {!isSet && (
                                        <div className={`flex items-center justify-center font-mono text-accent-orange font-semibold flex-1 ${
                                            compact ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                                        }`}>
                                            {renderCellContent(value)}
                                        </div>
                                    )}
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
