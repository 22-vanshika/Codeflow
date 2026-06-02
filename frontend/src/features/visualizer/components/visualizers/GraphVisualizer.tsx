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
        <div className={`graph-visualizer flex flex-col items-center justify-center w-full h-full relative ${className}`}>
            <div className="relative">
                <svg width={width} height={height} className="overflow-visible select-none">
                    <defs>
                        <filter id="glow-red-graph" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="24" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="var(--color-border-subtle)" />
                        </marker>
                        <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="24" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="var(--color-accent-red)" />
                        </marker>
                    </defs>

                    {/* Edges */}
                    {edges.map((edge, i) => {
                        const fromPos = positions.get(edge.from);
                        const toPos = positions.get(edge.to);
                        if (!fromPos || !toPos) return null;

                        const active = isEdgeActive(edge.from, edge.to);
                        const strokeColor = active ? 'var(--color-accent-red)' : 'var(--color-border-subtle)';
                        const strokeWidth = active ? "3" : "1.5";
                        const markerEnd = edge.directed ? (active ? "url(#arrowhead-active)" : "url(#arrowhead)") : undefined;

                        return (
                            <g key={`edge-${i}`} className="transition-all duration-300">
                                {/* Base line */}
                                <line 
                                    x1={fromPos.x} 
                                    y1={fromPos.y} 
                                    x2={toPos.x} 
                                    y2={toPos.y} 
                                    stroke={strokeColor} 
                                    strokeWidth={strokeWidth} 
                                    markerEnd={markerEnd}
                                />
                                
                                {/* Moving flow particles for active traversal */}
                                {active && (
                                    <line
                                        x1={fromPos.x}
                                        y1={fromPos.y}
                                        x2={toPos.x}
                                        y2={toPos.y}
                                        stroke="#ffb3b3"
                                        strokeWidth={strokeWidth}
                                        className="av-graph-edge-flow"
                                        markerEnd={markerEnd}
                                    />
                                )}

                                {edge.weight !== undefined && (
                                    <g transform={`translate(${(fromPos.x + toPos.x) / 2}, ${(fromPos.y + toPos.y) / 2})`}>
                                        <rect
                                            x="-12"
                                            y="-10"
                                            width="24"
                                            height="16"
                                            rx="4"
                                            fill="#0B1120"
                                            stroke={active ? 'var(--color-accent-red)' : 'var(--color-border-subtle)'}
                                            strokeWidth="1"
                                        />
                                        <text 
                                            dy="2"
                                            fill={active ? 'var(--color-accent-red)' : 'var(--color-text-muted)'}
                                            fontSize="10"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            className="font-mono"
                                        >
                                            {edge.weight}
                                        </text>
                                    </g>
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

                        let fillColor = '#0f172a';
                        let strokeColor = 'var(--color-border-default)';
                        let strokeWidth = "1.5";
                        let filter = '';

                        if (isActive) {
                            fillColor = 'rgba(239, 68, 68, 0.15)';
                            strokeColor = 'var(--color-accent-red)';
                            strokeWidth = "2.5";
                            filter = 'url(#glow-red-graph)';
                        } else if (isVisited) {
                            fillColor = 'rgba(239, 68, 68, 0.05)';
                            strokeColor = 'rgba(239, 68, 68, 0.5)';
                            strokeWidth = "1.5";
                        }

                        return (
                            <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer group">
                                {/* Pulse circle for active node traversal */}
                                {isActive && (
                                    <circle
                                        r="26"
                                        fill="none"
                                        stroke="var(--color-accent-red)"
                                        strokeWidth="1.5"
                                        className="animate-ping opacity-50"
                                    />
                                )}
                                <circle 
                                    r="20" 
                                    fill={fillColor} 
                                    stroke={strokeColor} 
                                    strokeWidth={strokeWidth}
                                    filter={filter}
                                    className="transition-all duration-300 group-hover:scale-110 origin-center"
                                />
                                <text 
                                    textAnchor="middle" 
                                    dy=".3em" 
                                    fill={isActive ? 'var(--color-accent-red)' : 'var(--color-text-primary)'}
                                    fontSize="12"
                                    fontFamily="monospace"
                                    fontWeight={isActive ? 'bold' : 'normal'}
                                >
                                    {String(node.value).substring(0, 4)}
                                </text>
                                
                                <text 
                                    y="32"
                                    textAnchor="middle" 
                                    fill="var(--color-text-muted)"
                                    fontSize="10"
                                    className="font-bold font-mono"
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
                <div className="absolute top-4 right-4 bg-[#090d16]/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl text-[10px] font-mono max-h-60 overflow-y-auto custom-scrollbar z-20">
                    <div className="text-accent-red font-black mb-2 pb-1.5 border-b border-white/5 tracking-widest text-[9px] uppercase">
                        ADJACENCY LIST
                    </div>
                    {Object.entries(adjacencyList).map(([key, list]) => (
                        <div key={key} className="flex gap-2 mb-1">
                            <span className="text-text-primary w-5 text-right font-bold">{key}:</span>
                            <span className="text-text-muted">[ {list.join(', ')} ]</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

