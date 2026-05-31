import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { TreeVisual } from '../../../../types';
import './visualizers.css';

interface TreeVisualizerProps {
    visual: TreeVisual;
    className?: string;
}

interface Position {
    x: number;
    y: number;
}

export default function TreeVisualizer({ visual, className = '' }: TreeVisualizerProps) {
    const { nodes, currentNodeId, activeNodes = [], visitedNodes = [], pointers = [] } = visual;

    // Calculate layout for tree nodes
    const { positions, edges, width, height } = useMemo(() => {
        const layout = new Map<string, Position>();
        const edgeList: {from: Position, to: Position}[] = [];
        
        if (!nodes || nodes.length === 0) return { positions: layout, edges: edgeList, width: 600, height: 400 };

        // 1. Identify root (node with no parentId)
        const roots = nodes.filter(n => !n.parentId);
        const root = roots.length > 0 ? roots[0] : nodes[0];
        
        if (!root) return { positions: layout, edges: edgeList, width: 600, height: 400 };

        // 2. Build adjacency for children traversal
        const childrenMap = new Map<string, typeof nodes>();
        for (const node of nodes) {
            if (node.parentId) {
                const siblings = childrenMap.get(node.parentId) || [];
                siblings.push(node);
                childrenMap.set(node.parentId, siblings);
            }
        }

        // 3. Assign depths and compute width required per subtree
        let maxDepth = 0;
        const nodeDepth = new Map<string, number>();
        const traverseDepth = (n: any, depth: number) => {
            nodeDepth.set(n.id, depth);
            maxDepth = Math.max(maxDepth, depth);
            const children = childrenMap.get(n.id) || [];
            children.forEach(c => traverseDepth(c, depth + 1));
        };
        traverseDepth(root, 0);

        // 4. Assign positions (simple uniform spacing based on depth)
        const depthCount = new Map<number, number>();
        const depthProcessed = new Map<number, number>();

        // Count nodes per depth
        for (const depth of nodeDepth.values()) {
            depthCount.set(depth, (depthCount.get(depth) || 0) + 1);
        }

        const W = 800; // SVG Width
        const Y_SPACING = 80;
        const TOP_PADDING = 80; // Add extra padding for pointer badges

        for (const node of nodes) {
            const d = nodeDepth.get(node.id) || 0;
            const totalAtDepth = depthCount.get(d) || 1;
            const currentAtDepth = depthProcessed.get(d) || 0;
            
            // Distribute evenly across width W
            const sectionWidth = W / totalAtDepth;
            const x = (currentAtDepth * sectionWidth) + (sectionWidth / 2);
            const y = TOP_PADDING + (d * Y_SPACING);

            layout.set(node.id, { x, y });
            depthProcessed.set(d, currentAtDepth + 1);
        }

        // 5. Build edges
        for (const node of nodes) {
            if (node.parentId && layout.has(node.parentId) && layout.has(node.id)) {
                edgeList.push({
                    from: layout.get(node.parentId)!,
                    to: layout.get(node.id)!
                });
            }
        }

        return { 
            positions: layout, 
            edges: edgeList, 
            width: W, 
            height: TOP_PADDING + (maxDepth * Y_SPACING) + 100 
        };

    }, [nodes]);

    const activeSet = new Set(activeNodes);
    if (currentNodeId) activeSet.add(currentNodeId);
    const visitedSet = new Set(visitedNodes);

    // Calculate coordinates for each tree pointer globally for smooth spring animations
    const pointerPositions = useMemo(() => {
        const counts: Record<string, number> = {};
        return pointers.map(p => {
            const pos = positions.get(p.nodeId);
            if (!pos) return null;
            const count = counts[p.nodeId] || 0;
            counts[p.nodeId] = count + 1;
            
            return {
                ...p,
                x: pos.x,
                y: pos.y - 35 - count * 20,
                lineY: pos.y - 22
            };
        }).filter(Boolean) as any[];
    }, [pointers, positions]);

    return (
        <div className={`tree-visualizer relative overflow-auto custom-scrollbar flex justify-center items-center w-full h-full ${className}`}>
            <svg width={width} height={height} className="min-w-max min-h-max" style={{ overflow: 'visible' }}>
                <defs>
                    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <marker id="marker-arrow-tree" markerWidth="8" markerHeight="6" refX="24" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="var(--color-border-subtle)" />
                    </marker>
                </defs>

                {/* B. DRAW EDGES WITH ARROWS */}
                {edges.map((edge, i) => (
                    <line 
                        key={`edge-${i}`}
                        x1={edge.from.x} 
                        y1={edge.from.y} 
                        x2={edge.to.x} 
                        y2={edge.to.y} 
                        stroke="var(--color-border-subtle)" 
                        strokeWidth="2" 
                        markerEnd="url(#marker-arrow-tree)"
                    />
                ))}

                {/* C. DRAW TREE POINTERS WITH SPRING ANIMS */}
                {pointerPositions.map(p => {
                    return (
                        <g key={`ptr-group-${p.name}`}>
                            {/* Dotted pointer reference line - slides dynamically! */}
                            <motion.line 
                                key={`line-${p.name}`}
                                layout
                                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                                x1={p.x}
                                y1={p.lineY}
                                x2={p.x}
                                y2={p.y}
                                stroke="rgba(6, 182, 212, 0.4)"
                                strokeWidth="1"
                                strokeDasharray="2,2"
                            />

                            {/* Stacked pointer badge - slides smoothly! */}
                            <motion.g
                                key={`badge-${p.name}`}
                                layout
                                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                                transform={`translate(${p.x}, ${p.y})`}
                                className="font-mono"
                            >
                                <rect 
                                    x="-24"
                                    y="-8"
                                    width="48"
                                    height="16"
                                    rx="4"
                                    fill={`${p.color}15`}
                                    stroke={p.color}
                                    strokeWidth="1.2"
                                />
                                <text 
                                    x="0"
                                    y="4"
                                    textAnchor="middle"
                                    fill={p.color}
                                    fontSize="8"
                                    fontWeight="black"
                                >
                                    {p.name.toUpperCase()}
                                </text>
                            </motion.g>
                        </g>
                    );
                })}

                {/* D. DRAW NODES */}
                {nodes.map(node => {
                    const pos = positions.get(node.id);
                    if (!pos) return null;

                    const isActive = activeSet.has(node.id);
                    const isVisited = visitedSet.has(node.id) && !isActive;

                    let fillColor = 'var(--color-bg-panel)';
                    let strokeColor = 'var(--color-text-muted)';
                    let strokeWidth = "2";
                    let filter = '';

                    if (isActive) {
                        fillColor = 'var(--color-accent-cyan)';
                        strokeColor = 'var(--color-accent-primary)';
                        strokeWidth = "3";
                        filter = 'url(#glow-cyan)';
                    } else if (isVisited) {
                        fillColor = 'var(--color-bg-main)';
                        strokeColor = 'var(--color-accent-cyan)';
                        strokeWidth = "1";
                    }

                    return (
                        <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`} className="transition-all duration-300">
                            <circle 
                                r="22" 
                                fill={fillColor} 
                                stroke={strokeColor} 
                                strokeWidth={strokeWidth}
                                filter={filter}
                                className="transition-all duration-300"
                            />
                            <text 
                                textAnchor="middle" 
                                dy=".3em" 
                                fill={isActive ? '#0B1120' : 'var(--color-text-primary)'}
                                fontSize="14"
                                fontFamily="monospace"
                                fontWeight={isActive ? 'bold' : 'normal'}
                            >
                                {String(node.value).substring(0, 4)}
                            </text>
                            
                            {/* Optional small ID badge */}
                            <text 
                                y="34"
                                textAnchor="middle" 
                                fill="var(--color-text-muted)"
                                fontSize="9"
                            >
                                {node.id.startsWith('#') ? node.id : node.id.substring(0, 3)}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
