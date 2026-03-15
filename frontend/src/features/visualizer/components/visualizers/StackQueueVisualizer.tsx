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
        <div className={`stack-queue-visualizer flex flex-col items-center justify-center w-full h-full ${className}`}>
            <div className="text-lg font-bold text-accent-purple mb-6 font-mono tracking-widest uppercase">
                {target} ({type})
            </div>

            <div className={`relative flex ${isStack ? 'flex-col-reverse' : 'flex-row'} items-center gap-2 p-6 rounded-xl border-2 border-border-subtle bg-bg-panel/50`}
                 style={{ 
                     minWidth: isStack ? '120px' : '300px', 
                     minHeight: isStack ? '300px' : '120px',
                     borderTopColor: isStack ? 'transparent' : 'var(--color-border-subtle)',
                     borderRightColor: !isStack ? 'transparent' : 'var(--color-border-subtle)',
                     borderLeftColor: !isStack ? 'transparent' : 'var(--color-border-subtle)'
                 }}>
                 
                 {elements.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center text-text-muted italic opacity-50">
                         Empty
                     </div>
                 )}

                {elements.map((el, i) => {
                    const isActive = activeIndices.includes(i);
                    const isTop = isStack && i === elements.length - 1;
                    const isFront = !isStack && i === 0;
                    const isRear = !isStack && i === elements.length - 1;

                    return (
                        <div key={i} className="relative flex items-center justify-center transition-all duration-300 transform"
                             style={{
                                 width: isStack ? '100px' : '80px',
                                 height: isStack ? '40px' : '80px',
                                 backgroundColor: isActive ? 'var(--color-accent-purple)' : 'var(--color-bg-main)',
                                 border: `2px solid ${isActive ? 'var(--color-accent-purple)' : 'var(--color-border-active)'}`,
                                 borderRadius: '8px',
                                 color: isActive ? '#0B1120' : 'var(--color-text-primary)'
                             }}>
                            
                            <span className={`font-mono font-bold ${isActive ? 'text-bg-main' : 'text-text-primary'}`}>
                                {String(el).substring(0, 6)}
                            </span>

                            {/* Default Labeling for Top/Front/Rear if not overridden by pointers */}
                            {pointers.length === 0 && (
                                <div className={`absolute font-mono text-[10px] font-bold text-accent-orange whitespace-nowrap
                                    ${isStack ? 'left-[110%]' : 'top-[110%]'}`
                                }>
                                    {isStack && isTop && '← TOP'}
                                    {!isStack && isFront && '↑ FRONT'}
                                    {!isStack && isRear && i !== 0 && '↑ REAR'}
                                </div>
                            )}

                            {/* Explicit Pointers from backend/AI */}
                            {pointers.filter(p => p.index === i).map((p) => (
                                <div key={p.name} 
                                     className={`absolute font-mono text-[10px] font-bold whitespace-nowrap
                                        ${isStack ? 'right-[110%]' : 'bottom-[110%]'}`
                                     }
                                     style={{ color: p.color || 'var(--color-accent-orange)' }}
                                     >
                                    {p.name} {isStack ? '→' : '↓'}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
