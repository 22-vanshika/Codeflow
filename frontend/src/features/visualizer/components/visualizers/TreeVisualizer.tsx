import { useMemo } from 'react';
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
    const { nodes, currentNodeId, activeNodes = [], visitedNodes = [] } = visual;

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
        const TOP_PADDING = 50;

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

    return (
        <div className={`tree-visualizer relative overflow-auto custom-scrollbar flex justify-center items-center w-full h-full ${className}`}>
            <svg width={width} height={height} className="min-w-max min-h-max" style={{ overflow: 'visible' }}>
                <defs>
                    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Edges */}
                {edges.map((edge, i) => (
                    <line 
                        key={`edge-${i}`}
                        x1={edge.from.x} 
                        y1={edge.from.y} 
                        x2={edge.to.x} 
                        y2={edge.to.y} 
                        stroke="var(--color-border-subtle)" 
                        strokeWidth="2" 
                    />
                ))}

                {/* Nodes */}
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
                                y="-28"
                                textAnchor="middle" 
                                fill="var(--color-text-muted)"
                                fontSize="10"
                            >
                                {node.id.substring(0,3)}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
