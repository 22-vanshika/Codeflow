import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import './visualizers.css';

interface LinkedListVisual {
    type: 'linked_list';
    target: string;
    nodes: { id: string; value: any; next?: string | null; prev?: string | null }[];
    pointers: { name: string; nodeId: string; color: string }[];
    hasCycle?: boolean;
    cycleStartId?: string;
}

interface LinkedListVisualizerProps {
    visual: LinkedListVisual;
    compact?: boolean;
    className?: string;
}

const LinkedListVisualizer = memo(({ visual, compact = false, className = '' }: LinkedListVisualizerProps) => {
    const { nodes = [], pointers = [], target } = visual;

    // 1. Arrange nodes in sequential order by following 'next' pointers
    const orderedNodes = useMemo(() => {
        if (nodes.length === 0) return [];
        
        // Find candidate starting nodes (nodes that are not pointed to by any next pointer)
        const childIds = new Set(nodes.map(n => n.next).filter(Boolean));
        let startNode = nodes.find(n => !childIds.has(n.id)) || nodes[0];
        
        const ordered: typeof nodes = [];
        const visited = new Set<string>();
        let curr = startNode;
        
        while (curr && !visited.has(curr.id)) {
            visited.add(curr.id);
            ordered.push(curr);
            const nextId = curr.next;
            if (nextId) {
                const nextNode = nodes.find(n => n.id === nextId);
                if (nextNode) {
                    curr = nextNode;
                    continue;
                }
            }
            break;
        }

        // Add any orphaned nodes that were not reached (just in case)
        for (const n of nodes) {
            if (!visited.has(n.id)) {
                ordered.push(n);
            }
        }
        
        return ordered;
    }, [nodes]);

    // 2. Automatically detect Doubly Linked List status
    const isDoubly = useMemo(() => {
        return nodes.some(n => n.prev !== null && n.prev !== undefined);
    }, [nodes]);

    // 3. Layout geometry configuration
    const geometry = useMemo(() => {
        const nodeWidth = 100;
        const nodeHeight = 50;
        const hSpacing = compact ? 150 : 180;
        const startX = compact ? 80 : 120;
        const centerY = 140;

        const positions: Record<string, { x: number; y: number }> = {};
        orderedNodes.forEach((node, idx) => {
            positions[node.id] = {
                x: startX + idx * hSpacing,
                y: centerY
            };
        });

        const svgWidth = Math.max(800, startX + orderedNodes.length * hSpacing + 100);
        const svgHeight = 260;

        return { positions, nodeWidth, nodeHeight, centerY, svgWidth, svgHeight };
    }, [orderedNodes, compact]);

    const { positions, nodeWidth, nodeHeight, centerY, svgWidth, svgHeight } = geometry;

    // 4. Calculate coordinates for each pointer globally for smooth framer-motion transitions
    const pointerPositions = useMemo(() => {
        const counts: Record<string, number> = {};
        return pointers.map(p => {
            const pos = positions[p.nodeId];
            if (!pos) return null;
            const count = counts[p.nodeId] || 0;
            counts[p.nodeId] = count + 1;
            
            const badgeX = pos.x + nodeWidth / 2;
            const badgeY = centerY - 50 - count * 26;
            
            return {
                ...p,
                x: badgeX,
                y: badgeY,
                lineY: centerY - 25
            };
        }).filter(Boolean) as any[];
    }, [pointers, positions, nodeWidth, centerY]);

    if (nodes.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center w-full p-6 ${className}`}>
                <h3 className="text-xs font-black text-accent-purple uppercase tracking-[0.2em] mb-4">
                    List: {target}
                </h3>
                <div className="flex items-center justify-center h-20 border border-dashed border-border-subtle rounded-xl w-64 text-text-muted text-sm italic">
                    List is empty
                </div>
            </div>
        );
    }

    return (
        <div className={`linked-list-visualizer flex flex-col items-center justify-center w-full overflow-x-auto custom-scrollbar py-2 ${className}`}>
            <h3 className="text-xs font-black text-accent-cyan uppercase tracking-[0.2em] mb-4 self-start pl-2">
                List: {target} {isDoubly ? '(Doubly)' : '(Singly)'}
            </h3>

            <div className="relative w-full overflow-x-auto custom-scrollbar min-h-[260px] flex justify-start">
                <svg width={svgWidth} height={svgHeight} className="overflow-visible select-none flex-none">
                    <defs>
                        {/* Markers for Arrows */}
                        <marker id="marker-arrow-right" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="var(--color-border-active)" />
                        </marker>
                        <marker id="marker-arrow-left" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
                            <polygon points="8 0, 0 3, 8 6" fill="#a855f7" />
                        </marker>
                        <marker id="marker-arrow-cycle" markerWidth="8" markerHeight="6" refX="4" refY="0" orient="auto">
                            <polygon points="0 6, 4 0, 8 6" fill="#f43f5e" />
                        </marker>
                        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* A. DRAW LINKS / CONNECTIONS */}
                    {orderedNodes.map((node, idx) => {
                        const fromPos = positions[node.id];
                        if (!fromPos) return null;

                        const isLast = idx === orderedNodes.length - 1;

                        // 1. Cycle Connection
                        const nextId = node.next;
                        const isCycleBack = nextId && positions[nextId] && positions[nextId].x < fromPos.x;

                        if (isCycleBack && nextId) {
                            const toPos = positions[nextId];
                            const startX = fromPos.x + nodeWidth / 2;
                            const endX = toPos.x + nodeWidth / 2;
                            const startY = fromPos.y + nodeHeight / 2;
                            const endY = toPos.y + nodeHeight / 2;
                            
                            // Beautiful curved Bezier path curving downwards
                            const curveY = startY + 65;
                            const pathData = `M ${startX} ${startY} C ${startX} ${curveY}, ${endX} ${curveY}, ${endX} ${endY + 12}`;
                            
                            return (
                                <g key={`cycle-${node.id}`} className="transition-all duration-500">
                                    <path 
                                        d={pathData} 
                                        fill="none" 
                                        stroke="#f43f5e" 
                                        strokeWidth="2.5" 
                                        strokeDasharray="4,4"
                                        markerEnd="url(#marker-arrow-cycle)"
                                    />
                                    <text 
                                        x={(startX + endX) / 2} 
                                        y={curveY - 8} 
                                        fill="#f43f5e" 
                                        fontSize="9" 
                                        fontWeight="black" 
                                        fontFamily="monospace"
                                        textAnchor="middle"
                                        className="uppercase tracking-widest bg-slate-950 px-1 py-0.5 rounded"
                                    >
                                        cycle
                                    </text>
                                </g>
                            );
                        }

                        // 2. Normal Forward/Backward Connections
                        if (nextId && positions[nextId] && !isCycleBack) {
                            const toPos = positions[nextId];
                            
                            if (isDoubly) {
                                // Doubly Linked List: Dual opposing arrows
                                const startX = fromPos.x + nodeWidth;
                                const endX = toPos.x;
                                
                                return (
                                    <g key={`link-${node.id}`} className="transition-all duration-300">
                                        {/* Forward Next arrow */}
                                        <line 
                                            x1={startX} 
                                            y1={centerY - 6} 
                                            x2={endX} 
                                            y2={centerY - 6} 
                                            stroke="var(--color-border-active)" 
                                            strokeWidth="2" 
                                            markerEnd="url(#marker-arrow-right)" 
                                        />
                                        {/* Backward Prev arrow */}
                                        <line 
                                            x1={endX} 
                                            y1={centerY + 6} 
                                            x2={startX} 
                                            y2={centerY + 6} 
                                            stroke="#a855f7" 
                                            strokeWidth="2" 
                                            markerEnd="url(#marker-arrow-left)" 
                                        />
                                    </g>
                                );
                            } else {
                                // Singly Linked List: Simple single straight arrow
                                const startX = fromPos.x + nodeWidth;
                                const endX = toPos.x;
                                return (
                                    <line 
                                        key={`link-${node.id}`}
                                        x1={startX} 
                                        y1={centerY} 
                                        x2={endX} 
                                        y2={centerY} 
                                        stroke="var(--color-border-active)" 
                                        strokeWidth="2" 
                                        markerEnd="url(#marker-arrow-right)" 
                                        className="transition-all duration-300"
                                    />
                                );
                            }
                        }

                        // 3. NULL Termination Visuals
                        if (isLast && !isCycleBack) {
                            const startX = fromPos.x + nodeWidth;
                            const nullX = startX + 50;

                            return (
                                <g key={`null-${node.id}`} className="transition-all duration-300 font-mono">
                                    <line 
                                        x1={startX} 
                                        y1={centerY} 
                                        x2={nullX} 
                                        y2={centerY} 
                                        stroke="var(--color-border-subtle)" 
                                        strokeWidth="2" 
                                        markerEnd="url(#marker-arrow-right)" 
                                    />
                                    <text 
                                        x={nullX + 8} 
                                        y={centerY + 5} 
                                        fill="var(--color-text-muted)" 
                                        fontSize="12" 
                                        fontWeight="bold"
                                    >
                                        NULL
                                    </text>
                                </g>
                            );
                        }

                        return null;
                    })}

                    {/* B. DRAW DOUBLE PREV NULL FOR THE FIRST NODE */}
                    {isDoubly && orderedNodes.length > 0 && (
                        <g className="transition-all duration-300 font-mono">
                            <line 
                                x1={positions[orderedNodes[0].id].x} 
                                y1={centerY} 
                                x2={positions[orderedNodes[0].id].x - 50} 
                                y2={centerY} 
                                stroke="#a855f7" 
                                strokeWidth="2" 
                                markerEnd="url(#marker-arrow-left)" 
                            />
                            <text 
                                x={positions[orderedNodes[0].id].x - 90} 
                                y={centerY + 5} 
                                fill="#a855f7" 
                                fontSize="12" 
                                fontWeight="bold"
                            >
                                NULL
                            </text>
                        </g>
                    )}

                    {/* C. DRAW FIRST-CLASS POINTER ARROWS & LABELS WITH SPRING SLIDE ANIMATION */}
                    {pointerPositions.map(p => {
                        return (
                            <g key={`ptr-group-${p.name}`}>
                                {/* Vertical dotted pointer reference line - slides dynamically! */}
                                <motion.line 
                                    key={`line-${p.name}`}
                                    layout
                                    transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                                    x1={p.x}
                                    y1={p.lineY}
                                    x2={p.x}
                                    y2={p.y + 10}
                                    stroke="rgba(6, 182, 212, 0.4)"
                                    strokeWidth="1.5"
                                    strokeDasharray="2,2"
                                />

                                {/* Pointer badge container - slides smoothly through coordinates! */}
                                <motion.g
                                    key={`badge-${p.name}`}
                                    layout
                                    transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                                    transform={`translate(${p.x}, ${p.y})`}
                                    className="font-mono"
                                >
                                    {/* Pointer badge background block */}
                                    <rect 
                                        x={-32}
                                        y={-10}
                                        width="64"
                                        height="20"
                                        rx="6"
                                        fill={`${p.color}15`}
                                        stroke={p.color}
                                        strokeWidth="1.5"
                                        className="shadow-md"
                                    />
                                    <text 
                                        x={0}
                                        y={4}
                                        textAnchor="middle"
                                        fill={p.color}
                                        fontSize="10"
                                        fontWeight="black"
                                    >
                                        {p.name.toUpperCase()}
                                    </text>
                                </motion.g>
                            </g>
                        );
                    })}

                    {/* D. DRAW NODE CAPSULES WITH SPRING LAYOUT TRANSITION */}
                    {orderedNodes.map(node => {
                        const pos = positions[node.id];
                        if (!pos) return null;

                        const isDummy = pointers.some(p => p.nodeId === node.id && p.name.toLowerCase() === 'dummy');
                        const isMainActive = pointers.some(p => p.nodeId === node.id && ['curr', 'slow', 'fast'].includes(p.name.toLowerCase()));

                        let boxBorder = 'border-white/10';
                        let boxGlow = '';
                        if (isMainActive) {
                            boxBorder = 'border-accent-cyan ring-1 ring-accent-cyan/30';
                            boxGlow = 'glow-cyan-filter';
                        } else if (isDummy) {
                            boxBorder = 'border-slate-500';
                        }

                        return (
                            <motion.g 
                                key={node.id} 
                                layout
                                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                                transform={`translate(${pos.x}, ${pos.y - nodeHeight / 2})`}
                            >
                                <foreignObject width={nodeWidth} height={nodeHeight} className="overflow-visible">
                                    <div 
                                        className={`w-full h-full flex rounded-xl border overflow-hidden font-mono text-sm shadow-xl backdrop-blur-md transition-all duration-300
                                            ${boxBorder} 
                                            ${boxGlow}
                                            ${isMainActive ? 'bg-slate-900/90 text-accent-cyan' : 'bg-slate-950/80 text-text-primary'}
                                            ${isDummy ? 'opacity-85 scale-95 border-dashed' : ''}
                                        `}
                                    >
                                        {/* 1. Left Compartment: value */}
                                        <div className="flex-1 flex items-center justify-center font-black border-r border-white/5 relative">
                                            {isDummy && (
                                                <span className="absolute top-1 left-2 text-[6px] font-black text-slate-500 uppercase tracking-wider">DUMMY</span>
                                            )}
                                            <span>{node.value}</span>
                                        </div>

                                        {/* 2. Right Compartment: next anchor */}
                                        <div className="w-8 flex items-center justify-center text-[10px] text-text-muted bg-white/5 font-bold">
                                            •
                                        </div>
                                    </div>
                                </foreignObject>

                                {/* Optional Address Tag */}
                                <text 
                                    y={nodeHeight + 14} 
                                    x={nodeWidth / 2} 
                                    textAnchor="middle" 
                                    fill="var(--color-text-muted)" 
                                    fontSize="8"
                                >
                                    {node.id}
                                </text>
                            </motion.g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
});

LinkedListVisualizer.displayName = 'LinkedListVisualizer';
export default LinkedListVisualizer;
