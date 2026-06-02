import { motion, AnimatePresence } from 'framer-motion';
import type { StackQueueVisual } from '../../../../types';
import './visualizers.css';

interface StackQueueVisualizerProps {
    visual: StackQueueVisual;
    className?: string;
}

export default function StackQueueVisualizer({ visual, className = '' }: StackQueueVisualizerProps) {
    const { target, elements = [], pointers = [], activeIndices = [], type } = visual;
    const isStack = type === 'stack';

    return (
        <div className={`stack-queue-visualizer flex flex-col items-center justify-center w-full h-full relative ${className}`}>
            <div className="text-sm font-semibold text-accent-purple mb-4 font-mono tracking-widest uppercase pb-1.5 border-b border-white/5">
                {target} <span className="text-text-muted text-xs normal-case">({type})</span>
            </div>

            {/* Container mapping to Stack (cup) or Queue (pipe) */}
            <div 
                className={`relative flex ${isStack ? 'flex-col-reverse' : 'flex-row'} items-center gap-2 p-6 bg-slate-950/20 border-2`}
                style={{ 
                    minWidth: isStack ? '140px' : '360px', 
                    minHeight: isStack ? '320px' : '130px',
                    borderColor: 'rgba(51, 65, 85, 0.4)',
                    borderRadius: isStack ? '0 0 20px 20px' : '12px',
                    borderTopColor: isStack ? 'rgba(51, 65, 85, 0.15)' : 'rgba(51, 65, 85, 0.4)',
                    borderLeftColor: !isStack ? 'rgba(51, 65, 85, 0.15)' : 'rgba(51, 65, 85, 0.4)',
                    borderRightColor: !isStack ? 'rgba(51, 65, 85, 0.15)' : 'rgba(51, 65, 85, 0.4)',
                    boxShadow: 'inset 0 4px 30px rgba(0, 0, 0, 0.2)'
                }}
            >
                <AnimatePresence initial={false}>
                    {elements.length === 0 ? (
                        <motion.div 
                            key="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center text-text-muted italic text-xs font-mono select-none"
                        >
                            Empty {type}
                        </motion.div>
                    ) : (
                        elements.map((el, i) => {
                            const isActive = activeIndices.includes(i);
                            const isTop = isStack && i === elements.length - 1;
                            const isFront = !isStack && i === 0;
                            const isRear = !isStack && i === elements.length - 1;

                            // Animation coordinates for push (from top) and enqueue (from right)
                            const initialPos = isStack 
                                ? { y: -200, opacity: 0, scale: 0.9 } 
                                : { x: 120, opacity: 0 };
                            
                            const exitPos = isStack
                                ? { y: -120, opacity: 0, scale: 0.8 }
                                : { x: -120, opacity: 0 };

                            return (
                                <motion.div 
                                    key={`${el}-${i}`}
                                    initial={initialPos}
                                    animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                    exit={exitPos}
                                    transition={{ type: 'spring', stiffness: 140, damping: 15 }}
                                    layout
                                    className={`relative flex items-center justify-center rounded-xl border-2 font-mono font-black select-none shadow-md backdrop-blur-sm transition-colors duration-300
                                        ${isActive 
                                            ? 'border-accent-purple bg-accent-purple/10 text-accent-purple shadow-glow' 
                                            : 'border-white/10 bg-slate-900/60 text-[#cdd6f4]'
                                        }`}
                                    style={{
                                        width: isStack ? '100px' : '70px',
                                        height: isStack ? '42px' : '64px',
                                        flexShrink: 0
                                    }}
                                >
                                    <span>{String(el).substring(0, 5)}</span>

                                    {/* Position Indicators */}
                                    {pointers.length === 0 && (
                                        <div className={`absolute font-mono text-[8px] font-black text-orange-400 whitespace-nowrap tracking-wider uppercase
                                            ${isStack ? 'left-[110%]' : 'top-[110%]'}`}
                                        >
                                            {isStack && isTop && '← TOP'}
                                            {!isStack && isFront && '↑ FRONT'}
                                            {!isStack && isRear && i !== 0 && '↑ REAR'}
                                        </div>
                                    )}

                                    {/* Custom labels */}
                                    {pointers.filter(p => p.index === i).map((p) => (
                                        <div 
                                            key={p.name} 
                                            className={`absolute font-mono text-[8px] font-black whitespace-nowrap tracking-wider uppercase
                                                ${isStack ? 'right-[110%]' : 'bottom-[110%]'}`}
                                            style={{ color: p.color || 'var(--color-accent-orange)' }}
                                        >
                                            {p.name} {isStack ? '→' : '↓'}
                                        </div>
                                    ))}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

