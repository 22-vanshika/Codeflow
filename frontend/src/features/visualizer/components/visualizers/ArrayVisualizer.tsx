import { useState } from 'react';
import type { ArrayVisual } from '../../../../types';
import './visualizers.css';

type StepType = 'assignment' | 'condition' | 'loop_start' | 'loop_continue' | 'loop_end' | 'function_call' | 'return' | 'comparison';

interface ArrayVisualizerProps {
    visual: ArrayVisual;
    className?: string;
    stepType?: StepType;
    sortedUntil?: number;
}

const POINTER_COLOURS: Record<string, string> = {
    red:    '#f87171',
    blue:   '#60a5fa',
    green:  '#34d399',
    orange: '#fb923c',
    purple: '#a78bfa',
};

function getCellState(
    index: number,
    visual: ArrayVisual,
    stepType?: StepType,
): 'default' | 'traversing' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'found' | 'insertion' {
    const { highlightIndices = [], swapIndices, pointers } = visual;

    if (swapIndices && (swapIndices[0] === index || swapIndices[1] === index)) {
        return 'swapping';
    }

    const isHighlighted = highlightIndices.includes(index);
    const hasPointer    = pointers.some(p => p.index === index);
    const pointerForMe  = pointers.find(p => p.index === index);

    if (hasPointer && pointerForMe?.color === 'purple') return 'pivot';

    if (hasPointer && pointerForMe?.color === 'green' && stepType === 'assignment') return 'insertion';
    if (hasPointer && pointerForMe?.color === 'green') return 'found';

    if (isHighlighted && (stepType === 'comparison' || stepType === 'condition')) return 'comparing';
    if (isHighlighted && hasPointer) return 'traversing';
    if (isHighlighted) return 'traversing';

    return 'default';
}

export default function ArrayVisualizer({
    visual,
    className = '',
    stepType,
    sortedUntil,
}: ArrayVisualizerProps) {
    const { values, pointers, swapIndices } = visual;
    const count = values.length;

    // Auto-detect view mode (default to bars if numeric and looks like sorting)
    const isStringRepresentation = values.every(v => typeof v === 'string' && v.length <= 1) || visual.target.toLowerCase().includes('str') || (visual.type as any) === 'string';
    const isNumeric = !isStringRepresentation && values.every(v => typeof v === 'number' || (typeof v === 'string' && !isNaN(Number(v))));
    const defaultMode = (isNumeric && (visual.target.toLowerCase().includes('arr') || visual.target.toLowerCase().includes('sort') || count > 10)) ? 'bars' : 'blocks';
    const [viewMode, setViewMode] = useState<'blocks' | 'bars'>(defaultMode);

    // Detect Binary Search pointers
    const leftPtr = pointers.find(p => p.name.toLowerCase() === 'left' || p.name === 'L' || p.name === 'l');
    const rightPtr = pointers.find(p => p.name.toLowerCase() === 'right' || p.name === 'R' || p.name === 'r');
    const midPtr = pointers.find(p => p.name.toLowerCase() === 'mid' || p.name === 'M' || p.name === 'm');
    const isBinarySearch = !!(leftPtr || rightPtr || midPtr);
    const leftIdx = leftPtr ? leftPtr.index : 0;
    const rightIdx = rightPtr ? rightPtr.index : count - 1;

    // Height calculations for Bars mode
    const numericValues = values.map(v => Number(v) || 0);
    const maxVal = Math.max(...numericValues, 1);
    const minVal = Math.min(...numericValues, 0);
    const valRange = maxVal - minVal || 1;

    const boxSize = count > 20 ? 32 : count > 14 ? 38 : 48;
    const fontSize = count > 20 ? 11 : count > 14 ? 13 : 15;
    const gap = isStringRepresentation ? 1 : (count > 20 ? 2 : 4);
    const cellWidth = boxSize + gap;

    // Draw active comparison path in comparison step
    const comparedIndices = visual.highlightIndices || [];
    const isComparingStep = (stepType === 'comparison' || stepType === 'condition') && comparedIndices.length === 2;

    return (
        <div className={`array-visualizer relative ${className} w-full`}>
            {/* Elegant Header with controls */}
            <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-white/5">
                <div className="av-label flex items-center gap-3">
                    <span className="av-label-text font-mono text-cyan-400 font-bold uppercase tracking-widest text-xs">
                        {visual.target}
                    </span>
                    <span className="av-count-badge text-[10px] bg-slate-900 border border-white/5 rounded-full px-2 py-0.5 text-[#768390]">
                        {count} {isStringRepresentation ? 'characters' : 'elements'}
                    </span>
                </div>
                {isNumeric && (
                    <div className="flex items-center bg-[#090d16]/80 border border-white/5 rounded-lg p-0.5 text-[9px] font-bold">
                        <button
                            onClick={() => setViewMode('blocks')}
                            className={`px-2.5 py-1 rounded-md transition-all uppercase tracking-widest ${
                                viewMode === 'blocks' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Blocks
                        </button>
                        <button
                            onClick={() => setViewMode('bars')}
                            className={`px-2.5 py-1 rounded-md transition-all uppercase tracking-widest ${
                                viewMode === 'bars' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Bars
                        </button>
                    </div>
                )}
            </div>

            <div className="relative flex justify-center w-full min-h-[220px]">
                {/* SVG Connections & Indicators Layer (Layer 3) */}
                {isComparingStep && (
                    <svg className="absolute inset-0 pointer-events-none w-full h-full z-20" style={{ overflow: 'visible' }}>
                        <defs>
                            <marker id="compare-arrow-left" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
                                <polygon points="6 0, 0 3, 6 6" fill="#3b82f6" />
                            </marker>
                            <marker id="compare-arrow-right" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                                <polygon points="0 0, 6 3, 0 6" fill="#3b82f6" />
                            </marker>
                        </defs>
                        {(() => {
                            const idxA = comparedIndices[0];
                            const idxB = comparedIndices[1];
                            const xA = idxA * cellWidth + boxSize / 2;
                            const xB = idxB * cellWidth + boxSize / 2;
                            const startX = Math.min(xA, xB);
                            const endX = Math.max(xA, xB);
                            
                            const startY = viewMode === 'bars' ? 80 : 52;
                            const arcHeight = Math.min(32, (endX - startX) * 0.22);
                            const path = `M ${startX} ${startY} Q ${(startX + endX) / 2} ${startY - arcHeight} ${endX} ${startY}`;
                            
                            return (
                                <path
                                    d={path}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeDasharray="4,3"
                                    className="animate-pulse"
                                    markerStart="url(#compare-arrow-left)"
                                    markerEnd="url(#compare-arrow-right)"
                                />
                            );
                        })()}
                    </svg>
                )}

                {/* Grid Wrapper */}
                <div
                    className="array-grid relative flex"
                    style={{
                        gap: `${gap}px`,
                        paddingTop: '52px',
                        paddingBottom: '24px',
                    }}
                >
                    {/* Stacked pointer badges */}
                    {pointers.map((ptr, idx) => {
                        const colour = POINTER_COLOURS[ptr.color] ?? '#94a3b8';
                        return (
                            <div
                                key={`ptr-${ptr.name}-${idx}`}
                                className="av-pointer-container absolute"
                                style={{
                                    left: `${ptr.index * cellWidth + boxSize / 2}px`,
                                    top: '4px',
                                    transform: 'translateX(-50%)',
                                    transition: 'left 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                                }}
                            >
                                <div className="av-pointer-label" style={{ background: colour, color: '#0b1120' }}>
                                    {ptr.name}
                                </div>
                                <div className="av-pointer-arrow" style={{ borderTopColor: colour }} />
                            </div>
                        );
                    })}

                    {/* Cells / Bars */}
                    {values.map((value, index) => {
                        const rawState = getCellState(index, visual, stepType);
                        const isSorted = sortedUntil !== undefined && index <= sortedUntil;
                        const state = isSorted ? 'sorted' : rawState;
                        const isSwap = state === 'swapping';
                        const isLeft = swapIndices?.[0] === index;
                        const swapDistX = swapIndices ? (swapIndices[1] - swapIndices[0]) * cellWidth : 0;

                        // Binary Search class
                        let bsClass = '';
                        if (isBinarySearch) {
                            const inSearchRange = index >= leftIdx && index <= rightIdx;
                            const isMid = midPtr && midPtr.index === index;
                            if (!inSearchRange) {
                                bsClass = 'av-bs-discarded';
                            } else if (isMid) {
                                bsClass = 'av-bs-mid';
                            } else {
                                bsClass = 'av-bs-active';
                            }
                        }

                        // Sliding window range
                        const windowRange = visual.windowRange;
                        const inWindow = windowRange && index >= windowRange[0] && index <= windowRange[1];
                        const isWindowFirst = windowRange && index === windowRange[0];
                        const isWindowLast = windowRange && index === windowRange[1];
                        const windowClass = inWindow 
                            ? `av-window-cell ${isWindowFirst ? 'av-window-cell-first' : ''} ${isWindowLast ? 'av-window-cell-last' : ''}`
                            : '';

                        const valueStr = formatValue(value);

                        if (viewMode === 'bars') {
                            const valNum = Number(value) || 0;
                            const heightPercent = Math.max(12, Math.min(100, ((valNum - minVal) / valRange) * 100));

                            return (
                                <div 
                                    key={index} 
                                    className={`array-cell flex flex-col items-center justify-end ${bsClass}`} 
                                    style={{ width: `${boxSize}px`, height: '140px' }}
                                >
                                    <div
                                        className={`array-cell-value av-state-${state} ${isSwap ? (isLeft ? 'av-swap-left' : 'av-swap-right') : ''} ${windowClass} w-full flex items-center justify-center relative overflow-hidden`}
                                        data-array-name={visual.target}
                                        data-cell-index={index}
                                        style={{ 
                                            height: `${heightPercent}%`,
                                            borderRadius: '6px 6px 0 0',
                                            fontSize: fontSize - 2,
                                            borderBottom: 'none',
                                            ['--swap-dist-x' as any]: `${swapDistX}px`
                                        }}
                                        title={`[${index}] = ${value}`}
                                    >
                                        <span className="text-[10px] font-bold text-white tracking-tighter truncate leading-none">
                                            {valueStr}
                                        </span>
                                    </div>
                                    <span className="array-cell-index text-[9px] text-[#475569] mt-1">
                                        {index}
                                    </span>
                                </div>
                            );
                        }

                        // Blocks Mode (Default)
                        return (
                            <div key={index} className={`array-cell ${bsClass}`} style={{ width: `${boxSize}px` }}>
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
                                    <span className="av-cell-text font-black">{valueStr}</span>
                                </div>
                                <span className="array-cell-index" style={{ fontSize: Math.max(9, fontSize - 5) }}>
                                    {index}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'string') return value.length > 3 ? value.slice(0, 2) + '…' : value;
    if (typeof value === 'boolean') return value ? 'T' : 'F';
    const n = Number(value);
    if (!isNaN(n) && Math.abs(n) >= 1000) return n > 0 ? `${Math.round(n/1000)}k` : String(n);
    return String(value);
}

