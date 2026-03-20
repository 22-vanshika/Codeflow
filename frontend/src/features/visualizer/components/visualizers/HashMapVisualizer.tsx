import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HashMapVisual } from '../../../../types';
import './visualizers.css';

interface HashMapVisualizerProps {
    visual: HashMapVisual;
    className?: string; // Add className to props
}

const HashMapVisualizer = memo(({ visual, className = '' }: HashMapVisualizerProps) => {
    const { target, entries, activeKeys = [] } = visual;

    return (
        <div className={`flex flex-col items-center justify-center w-full h-full p-4 overflow-auto custom-scrollbar ${className}`}>
            <h3 className="text-sm font-semibold text-accent-purple uppercase tracking-widest mb-4">
                {target} <span className="text-text-muted text-xs normal-case">(Hash Map)</span>
            </h3>

            {entries.length === 0 ? (
                <div className="flex items-center justify-center h-24 border border-dashed border-border-subtle rounded-xl w-64 text-text-muted text-sm italic">
                    {target} is empty
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
                    <AnimatePresence>
                        {entries.map(({ key, value }) => {
                            const isActive = activeKeys.includes(key);

                            return (
                                <motion.div
                                    key={String(key)}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    className={`
                                        flex items-stretch overflow-hidden rounded-xl border transition-all duration-300 shadow-sm
                                        ${isActive
                                            ? 'border-accent-cyan bg-bg-panel shadow-glow ring-1 ring-accent-cyan/50 z-10'
                                            : 'border-border-subtle bg-bg-main hover:border-border-active'
                                        }
                                    `}
                                >
                                    {/* Key Section */}
                                    <div className={`
                                        flex items-center justify-center px-4 py-2 font-mono text-sm font-bold min-w-[60px] border-r
                                        ${isActive
                                            ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30'
                                            : 'bg-bg-panel text-text-primary border-border-subtle'
                                        }
                                    `}>
                                        {formatValue(key)}
                                    </div>

                                    {/* Value Section */}
                                    <div className="flex items-center justify-center px-4 py-2 font-mono text-sm flex-1 text-accent-orange font-semibold">
                                        {formatValue(value)}
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
