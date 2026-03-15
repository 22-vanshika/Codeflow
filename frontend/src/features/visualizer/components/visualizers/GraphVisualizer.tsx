import { useMemo } from 'react';
import type { GraphVisual } from '../../../../types';
import './visualizers.css';

interface GraphVisualizerProps {
    visual: GraphVisual;
    className?: string;
}

interface Position {
    x: number;
    y: number;
}

export default function GraphVisualizer({ visual, className = '' }: GraphVisualizerProps) {
    const { nodes = [], edges = [], activeNodes = [], visitedNodes = [], activeEdges = [], adjacencyList } = visual;

    // Calculate circular layout for graph nodes
    const { positions, width, height } = useMemo(() => {
        const layout = new Map<string, Position>();
        if (!nodes || nodes.length === 0) return { positions: layout, width: 600, height: 400 };

        const W = 600;
        const H = 400;
        const centerX = W / 2;
        const centerY = H / 2;
        const radius = Math.min(W, H) / 2 - 60; // 60px padding

        const angleStep = (2 * Math.PI) / nodes.length;

        nodes.forEach((node, i) => {
            const angle = i * angleStep - Math.PI / 2; // Start from top
            layout.set(node.id, {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        });

        return { positions: layout, width: W, height: H };
    }, [nodes]);

    const activeNodeSet = new Set(activeNodes);
    const visitedNodeSet = new Set(visitedNodes);

    const isEdgeActive = (from: string, to: string) => {
        return activeEdges?.some(e => 
            (e.from === from && e.to === to) || 
            (!edges.find(x => x.from===from && x.to===to)?.directed && e.from === to && e.to === from)
        );
    };

    return (
        <div className={`graph-visualizer flex flex-col items-center justify-center w-full h-full ${className}`}>
            <div className="relative">
                <svg width={width} height={height} className="overflow-visible">
                    <defs>
                        <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-border-subtle)" />
                        </marker>
                        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-accent-red)" />
                        </marker>
                    </defs>

                    {/* Edges */}
                    {edges.map((edge, i) => {
                        const fromPos = positions.get(edge.from);
                        const toPos = positions.get(edge.to);
                        if (!fromPos || !toPos) return null;

                        const active = isEdgeActive(edge.from, edge.to);
                        const strokeColor = active ? 'var(--color-accent-red)' : 'var(--color-border-subtle)';
                        const strokeWidth = active ? "3" : "2";
                        const markerEnd = edge.directed ? (active ? "url(#arrowhead-active)" : "url(#arrowhead)") : undefined;

                        return (
                            <g key={`edge-${i}`} className="transition-all duration-300">
                                <line 
                                    x1={fromPos.x} 
                                    y1={fromPos.y} 
                                    x2={toPos.x} 
                                    y2={toPos.y} 
                                    stroke={strokeColor} 
                                    strokeWidth={strokeWidth} 
                                    markerEnd={markerEnd}
                                />
                                {edge.weight !== undefined && (
                                    <text 
                                        x={(fromPos.x + toPos.x) / 2} 
                                        y={(fromPos.y + toPos.y) / 2 - 8}
                                        fill={active ? 'var(--color-accent-red)' : 'var(--color-text-muted)'}
                                        fontSize="12"
                                        textAnchor="middle"
                                        className="font-mono bg-bg-main"
                                    >
                                        {edge.weight}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map(node => {
                        const pos = positions.get(node.id);
                        if (!pos) return null;

                        const isActive = activeNodeSet.has(node.id);
                        const isVisited = visitedNodeSet.has(node.id) && !isActive;

                        let fillColor = 'var(--color-bg-panel)';
                        let strokeColor = 'var(--color-text-muted)';
                        let strokeWidth = "2";
                        let filter = '';

                        if (isActive) {
                            fillColor = 'var(--color-accent-red)';
                            strokeColor = '#ffb3b3';
                            strokeWidth = "3";
                            filter = 'url(#glow-red)';
                        } else if (isVisited) {
                            fillColor = 'var(--color-bg-main)';
                            strokeColor = 'var(--color-accent-red)';
                            strokeWidth = "2";
                            fillColor = 'rgba(239, 68, 68, 0.1)';
                        }

                        return (
                            <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`} className="transition-all duration-300">
                                <circle 
                                    r="22" 
                                    fill={fillColor} 
                                    stroke={strokeColor} 
                                    strokeWidth={strokeWidth}
                                    filter={filter}
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
                                
                                <text 
                                    y="35"
                                    textAnchor="middle" 
                                    fill="var(--color-text-muted)"
                                    fontSize="11"
                                    className="font-semibold"
                                >
                                    {node.label || node.id}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
            
            {/* Optional Adjacency List Panel */}
            {adjacencyList && Object.keys(adjacencyList).length > 0 && (
                <div className="absolute top-4 right-4 bg-bg-panel/90 backdrop-blur-md border border-border-subtle rounded-xl p-4 shadow-xl text-xs font-mono max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="text-accent-red font-bold mb-2 pb-1 border-b border-border-subtle tracking-wider">ADJACENCY LIST</div>
                    {Object.entries(adjacencyList).map(([key, list]) => (
                        <div key={key} className="flex gap-2 mb-1">
                            <span className="text-text-primary w-6 text-right">{key}:</span>
                            <span className="text-text-muted">[ {list.join(', ')} ]</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
