import { useMemo } from 'react';
import './visualizers.css';

interface PriorityQueueVisualizerProps {
    visual: {
        type: 'priority_queue';
        target: string;
        elements: any[];
        activeIndices?: number[];
        isMinHeap?: boolean;
    };
    className?: string;
}

export default function PriorityQueueVisualizer({ visual, className = '' }: PriorityQueueVisualizerProps) {
    const { target, elements = [], activeIndices = [], isMinHeap = false } = visual;

    // Build binary tree positions for elements
    const { positions, edges, width, height } = useMemo(() => {
        const layout = new Map<number, { x: number, y: number }>();
        const edgeList: { from: { x: number, y: number }, to: { x: number, y: number } }[] = [];

        if (elements.length === 0) return { positions: layout, edges: edgeList, width: 400, height: 100 };

        const W = 500;
        const Y_SPACING = 60;
        const TOP_PADDING = 30;

        // Count depths of heap
        const getDepth = (idx: number): number => Math.floor(Math.log2(idx + 1));
        const maxIndex = elements.length - 1;
        const maxDepth = getDepth(maxIndex);

        // Position nodes using binary layout
        for (let i = 0; i < elements.length; i++) {
            const depth = getDepth(i);
            const numNodesAtDepth = Math.pow(2, depth);
            const indexInDepth = i - (numNodesAtDepth - 1);
            
            // Distribute evenly across width W
            const sectionWidth = W / numNodesAtDepth;
            const x = (indexInDepth * sectionWidth) + (sectionWidth / 2);
            const y = TOP_PADDING + (depth * Y_SPACING);

            layout.set(i, { x, y });

            // Add edge to parent
            if (i > 0) {
                const parentIdx = Math.floor((i - 1) / 2);
                const parentPos = layout.get(parentIdx);
                if (parentPos) {
                    edgeList.push({
                        from: parentPos,
                        to: { x, y }
                    });
                }
            }
        }

        return {
            positions: layout,
            edges: edgeList,
            width: W,
            height: TOP_PADDING + (maxDepth * Y_SPACING) + 60
        };
    }, [elements]);

    return (
        <div className={`priority-queue-visualizer flex flex-col items-center p-4 w-full ${className}`}>
            <div className="av-label mb-2">
                <span className="av-label-text">{target}</span>
                <span className="av-count-badge">
                    {isMinHeap ? 'min-heap' : 'max-heap'} · {elements.length} items
                </span>
            </div>

            {/* Heap Tree Visualization */}
            {elements.length > 0 ? (
                <div className="relative flex flex-col items-center w-full min-h-0 overflow-auto bg-bg-panel/20 border border-border-subtle rounded-xl p-4 mb-4">
                    <svg width={width} height={height} className="max-w-full" style={{ overflow: 'visible' }}>
                        {/* Edges */}
                        {edges.map((edge, i) => (
                            <line
                                key={`heap-edge-${i}`}
                                x1={edge.from.x}
                                y1={edge.from.y}
                                x2={edge.to.x}
                                y2={edge.to.y}
                                stroke="var(--color-border-subtle)"
                                strokeWidth="2"
                            />
                        ))}

                        {/* Nodes */}
                        {elements.map((val, idx) => {
                            const pos = positions.get(idx);
                            if (!pos) return null;

                            const isActive = activeIndices.includes(idx);
                            const fill = isActive ? 'var(--color-accent-cyan)' : 'var(--color-bg-main)';
                            const stroke = isActive ? 'var(--color-accent-primary)' : 'var(--color-border-active)';

                            return (
                                <g key={`heap-node-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                                    <circle
                                        r="18"
                                        fill={fill}
                                        stroke={stroke}
                                        strokeWidth={isActive ? 3 : 2}
                                        className="transition-all duration-300"
                                    />
                                    <text
                                        textAnchor="middle"
                                        dy=".3em"
                                        fill={isActive ? '#0B1120' : 'var(--color-text-primary)'}
                                        fontSize="12"
                                        fontFamily="monospace"
                                        fontWeight={isActive ? 'bold' : 'normal'}
                                    >
                                        {typeof val === 'object' && val !== null && 'first' in val ? String(val.first) : String(val).substring(0, 4)}
                                    </text>
                                    <text
                                        y="-24"
                                        textAnchor="middle"
                                        fill="var(--color-text-muted)"
                                        fontSize="9"
                                    >
                                        [{idx}]
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            ) : (
                <div className="flex items-center justify-center h-24 border border-dashed border-border-subtle rounded-xl w-64 text-text-muted text-sm italic mb-4">
                    Priority Queue is empty
                </div>
            )}

            {/* Flat Array Representation */}
            {elements.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center justify-center p-2 border border-border-subtle rounded-lg bg-bg-panel/40 max-w-full overflow-x-auto">
                    {elements.map((val, idx) => {
                        const isActive = activeIndices.includes(idx);
                        return (
                            <div
                                key={`flat-cell-${idx}`}
                                className={`
                                    w-12 h-12 flex flex-col items-center justify-center font-mono rounded-md border transition-all duration-300
                                    ${isActive 
                                        ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan font-bold shadow' 
                                        : 'border-border-subtle bg-bg-main text-text-primary'
                                    }
                                `}
                            >
                                <span className="text-xs">
                                    {typeof val === 'object' && val !== null && 'first' in val ? `(${val.first},${val.second})` : String(val)}
                                </span>
                                <span className="text-[8px] text-text-muted mt-1">[{idx}]</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
