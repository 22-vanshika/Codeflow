import { useMemo } from 'react';
import type { ArrayVisual, PointerVisual } from '../../types';
import './visualizers.css';

interface ArrayVisualizerProps {
    visual: ArrayVisual;
    className?: string;
}

export default function ArrayVisualizer({ visual, className = '' }: ArrayVisualizerProps) {
    const { values, pointers, highlightIndices = [], swapIndices } = visual;

    // Calculate pointer positions for animation
    const pointersByIndex = useMemo(() => {
        const map = new Map<number, PointerVisual[]>();
        for (const pointer of pointers) {
            const existing = map.get(pointer.index) || [];
            existing.push(pointer);
            map.set(pointer.index, existing);
        }
        return map;
    }, [pointers]);

    // Cell width for positioning (48px + 4px gap)
    const cellWidth = 52;

    return (
        <div className={`array-visualizer ${className}`}>
            {/* Array name label */}
            <div className="text-center mb-2">
                <span className="text-sm font-mono text-accent-cyan opacity-70">
                    {visual.target}
                </span>
            </div>

            {/* Array grid with pointers */}
            <div className="array-grid relative">
                {/* Floating pointers - animate to their positions */}
                {pointers.map((pointer, idx) => (
                    <div
                        key={`pointer-${pointer.name}-${idx}`}
                        className="pointer-container"
                        style={{
                            left: `${24 + pointer.index * cellWidth}px`,
                            top: '-45px'
                        }}
                    >
                        <div className={`pointer-label ${pointer.color}`}>
                            {pointer.name}
                        </div>
                        <div className={`pointer-arrow ${pointer.color}`} />
                    </div>
                ))}

                {/* Array cells */}
                {values.map((value, index) => {
                    const isHighlighted = highlightIndices.includes(index);
                    const isSwapLeft = swapIndices && swapIndices[0] === index;
                    const isSwapRight = swapIndices && swapIndices[1] === index;
                    const hasPointer = pointersByIndex.has(index);

                    return (
                        <div key={index} className="array-cell">
                            <div
                                className={`array-cell-value 
                                    ${isHighlighted ? 'highlighted' : ''} 
                                    ${isSwapLeft ? 'swap-left' : ''} 
                                    ${isSwapRight ? 'swap-right' : ''}
                                    ${hasPointer ? 'ring-2 ring-offset-2 ring-offset-[#1e1e2e]' : ''}
                                `}
                                style={{
                                    borderColor: hasPointer
                                        ? `var(--pointer-${pointersByIndex.get(index)?.[0].color || 'orange'})`
                                        : undefined
                                }}
                            >
                                {formatValue(value)}
                            </div>
                            <span className="array-cell-index">{index}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function formatValue(value: any): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'string') return value.length > 3 ? value.slice(0, 3) + '…' : value;
    return String(value);
}
