import { useMemo } from 'react';
import type { ArrayVisual, PointerVisual } from '../../../../types';
import './visualizers.css';

type StepType = 'assignment' | 'condition' | 'loop_start' | 'loop_continue' | 'loop_end' | 'function_call' | 'return' | 'comparison';

interface ArrayVisualizerProps {
    visual: ArrayVisual;
    className?: string;
    stepType?: StepType;
    /** Sorted boundary — indices [0..sortedUntil] are permanently green */
    sortedUntil?: number;
}

// Colour map for named pointer colours → CSS variable / value
const POINTER_COLOURS: Record<string, string> = {
    red:    '#f87171',
    blue:   '#60a5fa',
    green:  '#34d399',
    orange: '#fb923c',
    purple: '#a78bfa',
};

// Determines the visual state of each cell
function getCellState(
    index: number,
    visual: ArrayVisual,
    stepType?: StepType,
): 'default' | 'traversing' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'found' | 'insertion' {
    const { highlightIndices = [], swapIndices, pointers } = visual;

    // Swap takes priority
    if (swapIndices && (swapIndices[0] === index || swapIndices[1] === index)) {
        return 'swapping';
    }

    const isHighlighted = highlightIndices.includes(index);
    const hasPointer    = pointers.some(p => p.index === index);
    const pointerForMe  = pointers.find(p => p.index === index);

    // Purple pointer → pivot
    if (hasPointer && pointerForMe?.color === 'purple') return 'pivot';

    // Green pointer → insertion position / found result
    if (hasPointer && pointerForMe?.color === 'green' && stepType === 'assignment') return 'insertion';
    if (hasPointer && pointerForMe?.color === 'green') return 'found';

    // Highlighted indices during comparison step → comparing (yellow)
    if (isHighlighted && (stepType === 'comparison' || stepType === 'condition')) return 'comparing';

    // Highlighted with pointer → traversing (blue)
    if (isHighlighted && hasPointer) return 'traversing';

    // Any highlighted element → traversing
    if (isHighlighted) return 'traversing';

    return 'default';
}

export default function ArrayVisualizer({
    visual,
    className = '',
    stepType,
    sortedUntil,
}: ArrayVisualizerProps) {
    const { values, pointers, highlightIndices = [], swapIndices } = visual;

    /* Group pointers by index for stacking */
    const pointersByIndex = useMemo(() => {
        const map = new Map<number, PointerVisual[]>();
        for (const ptr of pointers) {
            const existing = map.get(ptr.index) ?? [];
            existing.push(ptr);
            map.set(ptr.index, existing);
        }
        return map;
    }, [pointers]);

    /* Responsive: shrink boxes when many elements */
    const count = values.length;
    const boxSize = count > 20 ? 38 : count > 14 ? 44 : 56;
    const fontSize = count > 20 ? 12 : count > 14 ? 14 : 17;
    const gap = count > 20 ? 3 : 4;
    const cellWidth = boxSize + gap;

    return (
        <div className={`array-visualizer ${className}`}>
            {/* Array name label */}
            <div className="av-label">
                <span className="av-label-text">{visual.target}</span>
                <span className="av-count-badge">{count} elements</span>
            </div>

            {/* Outer wrapper keeps pointers within a positioned context */}
            <div
                className="array-grid"
                style={{
                    gap: `${gap}px`,
                    paddingTop: '52px',   /* room for pointer labels */
                    paddingBottom: '24px',
                }}
            >
                {/* Pointer labels + arrows — absolutely positioned above cells */}
                {pointers.map((ptr, idx) => {
                    const colour = POINTER_COLOURS[ptr.color] ?? '#94a3b8';
                    return (
                        <div
                            key={`ptr-${ptr.name}-${idx}`}
                            className="av-pointer-container"
                            style={{
                                left: `${ptr.index * cellWidth + boxSize / 2}px`,
                                transition: 'left 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                            }}
                        >
                            <div className="av-pointer-label" style={{ background: colour, color: '#0b1120' }}>
                                {ptr.name}
                            </div>
                            <div className="av-pointer-arrow" style={{ borderTopColor: colour }} />
                        </div>
                    );
                })}

                {/* Cells */}
                {values.map((value, index) => {
                    const rawState = getCellState(index, visual, stepType);
                    const isSorted = sortedUntil !== undefined && index <= sortedUntil;
                    const state = isSorted ? 'sorted' : rawState;
                    const isSwap = state === 'swapping';
                    const isLeft = swapIndices?.[0] === index;
                    const swapDistX = swapIndices ? (swapIndices[1] - swapIndices[0]) * cellWidth : 0;

                    const windowRange = visual.windowRange;
                    const inWindow = windowRange && index >= windowRange[0] && index <= windowRange[1];
                    const isWindowFirst = windowRange && index === windowRange[0];
                    const isWindowLast = windowRange && index === windowRange[1];
                    const windowClass = inWindow 
                        ? `av-window-cell ${isWindowFirst ? 'av-window-cell-first' : ''} ${isWindowLast ? 'av-window-cell-last' : ''}`
                        : '';

                    return (
                        <div key={index} className="array-cell" style={{ width: `${boxSize}px` }}>
                            <div
                                className={`array-cell-value av-state-${state} ${isSwap ? (isLeft ? 'av-swap-left' : 'av-swap-right') : ''} ${windowClass}`}
                                data-array-name={visual.target}
                                data-cell-index={index}
                                style={{ 
                                    width: boxSize, 
                                    height: boxSize, 
                                    fontSize,
                                    ['--swap-dist-x' as any]: `${swapDistX}px`
                                }}
                                title={`[${index}] = ${value}`}
                            >
                                <span className="av-cell-text">{formatValue(value)}</span>
                            </div>
                            <span className="array-cell-index" style={{ fontSize: Math.max(10, fontSize - 5) }}>
                                {index}
                            </span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'string') return value.length > 4 ? value.slice(0, 3) + '…' : value;
    if (typeof value === 'boolean') return value ? 'T' : 'F';
    const n = Number(value);
    if (!isNaN(n) && Math.abs(n) >= 1000) return n > 0 ? `${Math.round(n/1000)}k` : String(n);
    return String(value);
}
