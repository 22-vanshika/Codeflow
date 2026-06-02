import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { TreeVisual } from '../../../../types';
import { useExecutionStore } from '../../../../store/executionStore';
import './visualizers.css';

interface TreeVisualizerProps {
    visual: TreeVisual;
    className?: string;
}

interface Position {
    x: number;
    y: number;
}

function formatVarValue(val: any): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? 'T' : 'F';
    if (typeof val === 'object') return 'obj';
    return String(val);
}

export default function TreeVisualizer({ visual, className = '' }: TreeVisualizerProps) {
    const { nodes, currentNodeId, activeNodes = [], visitedNodes = [], pointers = [] } = visual;
    
    // Fetch call stack from execution store
    const { currentStepIndex, traceSteps, traces } = useExecutionStore();
    const stepsArray = traceSteps.length > 0 ? traceSteps : traces;
    const currentStep = stepsArray[currentStepIndex] as any;
    const stack = currentStep?.stack || [];

    // Calculate layout for tree nodes
    const { positions, edges, width, height } = useMemo(() => {
        const layout = new Map<string, Position>();
        const edgeList: {from: Position, to: Position}[] = [];
        
        if (!nodes || nodes.length === 0) return { positions: layout, edges: edgeList, width: 600, height: 400 };

        const roots = nodes.filter(n => !n.parentId);
        const root = roots.length > 0 ? roots[0] : nodes[0];
        
        if (!root) return { positions: layout, edges: edgeList, width: 600, height: 400 };

        const childrenMap = new Map<string, typeof nodes>();
        for (const node of nodes) {
            if (node.parentId) {
                const siblings = childrenMap.get(node.parentId) || [];
                siblings.push(node);
                childrenMap.set(node.parentId, siblings);
            }
        }

        let maxDepth = 0;
        const nodeDepth = new Map<string, number>();
        const traverseDepth = (n: any, depth: number) => {
            nodeDepth.set(n.id, depth);
            maxDepth = Math.max(maxDepth, depth);
            const children = childrenMap.get(n.id) || [];
            children.forEach(c => traverseDepth(c, depth + 1));
        };
        traverseDepth(root, 0);

        const depthCount = new Map<number, number>();
        const depthProcessed = new Map<number, number>();

        for (const depth of nodeDepth.values()) {
            depthCount.set(depth, (depthCount.get(depth) || 0) + 1);
        }

        const W = 600; // Adjusted SVG Width to fit recursion stack nicely
        const Y_SPACING = 70;
        const TOP_PADDING = 60;

        for (const node of nodes) {
            const d = nodeDepth.get(node.id) || 0;
            const totalAtDepth = depthCount.get(d) || 1;
            const currentAtDepth = depthProcessed.get(d) || 0;
            
            const sectionWidth = W / totalAtDepth;
            const x = (currentAtDepth * sectionWidth) + (sectionWidth / 2);
            const y = TOP_PADDING + (d * Y_SPACING);

            layout.set(node.id, { x, y });
            depthProcessed.set(d, currentAtDepth + 1);
        }

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
            height: TOP_PADDING + (maxDepth * Y_SPACING) + 60 
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
        <div className={`tree-visualizer-container flex flex-col md:flex-row items-stretch gap-6 w-full ${className}`}>
            {/* Tree Canvas */}
            <div className="flex-1 flex justify-center items-center relative overflow-auto custom-scrollbar bg-slate-950/20 border border-white/5 rounded-2xl p-4 min-h-[320px]">
                {nodes.length === 0 ? (
                    <div className="text-text-muted italic text-sm">Tree is empty</div>
                ) : (
                    <svg width={width} height={height} className="min-w-max min-h-max" style={{ overflow: 'visible' }}>
                        <defs>
                            <filter id="glow-cyan-tree" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                            <marker id="marker-arrow-tree" markerWidth="6" markerHeight="5" refX="22" refY="2.5" orient="auto">
                                <polygon points="0 0, 6 2.5, 0 5" fill="var(--color-border-subtle)" />
                            </marker>
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
                                strokeWidth="1.5" 
                                markerEnd="url(#marker-arrow-tree)"
                            />
                        ))}

                        {/* Tree pointers */}
                        {pointerPositions.map(p => (
                            <g key={`ptr-group-${p.name}`}>
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
                                        fill={`${p.color}20`}
                                        stroke={p.color}
                                        strokeWidth="1.2"
                                    />
                                    <text 
                                        x="0"
                                        y="3"
                                        textAnchor="middle"
                                        fill={p.color}
                                        fontSize="8"
                                        fontWeight="black"
                                    >
                                        {p.name.toUpperCase()}
                                    </text>
                                </motion.g>
                            </g>
                        ))}

                        {/* Nodes */}
                        {nodes.map(node => {
                            const pos = positions.get(node.id);
                            if (!pos) return null;

                            const isActive = activeSet.has(node.id);
                            const isVisited = visitedSet.has(node.id) && !isActive;

                            let fillColor = '#0f172a';
                            let strokeColor = 'var(--color-border-default)';
                            let strokeWidth = '1.5';
                            let filter = '';

                            if (isActive) {
                                fillColor = 'rgba(6, 182, 212, 0.15)';
                                strokeColor = 'var(--color-accent-cyan)';
                                strokeWidth = '2.5';
                                filter = 'url(#glow-cyan-tree)';
                            } else if (isVisited) {
                                fillColor = 'rgba(16, 185, 129, 0.05)';
                                strokeColor = 'rgba(16, 185, 129, 0.5)';
                            }

                            return (
                                <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                                    {/* Pulse circle for active node traversal */}
                                    {isActive && (
                                        <circle
                                            r="24"
                                            fill="none"
                                            stroke="var(--color-accent-cyan)"
                                            strokeWidth="1.5"
                                            className="animate-ping opacity-50"
                                        />
                                    )}
                                    <circle 
                                        r="18" 
                                        fill={fillColor} 
                                        stroke={strokeColor} 
                                        strokeWidth={strokeWidth}
                                        filter={filter}
                                        className="transition-all duration-300"
                                    />
                                    <text 
                                        textAnchor="middle" 
                                        dy=".3em" 
                                        fill={isActive ? 'var(--color-accent-cyan)' : 'var(--color-text-primary)'}
                                        fontSize="11"
                                        fontFamily="monospace"
                                        fontWeight={isActive ? 'bold' : 'normal'}
                                    >
                                        {String(node.value).substring(0, 4)}
                                    </text>
                                    
                                    <text 
                                        y="28"
                                        textAnchor="middle" 
                                        fill="var(--color-text-muted)"
                                        fontSize="8"
                                    >
                                        {node.id.startsWith('#') ? node.id : node.id.substring(0, 3)}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                )}
            </div>

            {/* Recursion Stack Panel Overlay */}
            {stack.length > 0 && (
                <div className="w-full md:w-60 flex flex-col bg-[#090d16]/85 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-h-[360px] relative z-10 shrink-0">
                    <div className="flex items-center gap-1.5 pb-2.5 border-b border-white/5 text-purple-400 font-black tracking-widest text-[9px] uppercase">
                        <div className="w-1.5 h-3.5 rounded-full bg-purple-500" />
                        <span>Recursion Stack</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar mt-3 space-y-2 flex flex-col-reverse justify-end pr-1">
                        {stack.map((frame: any, idx: number) => {
                            const isTop = idx === stack.length - 1;
                            return (
                                <div
                                    key={`${frame.function}-${idx}`}
                                    className={`p-2.5 rounded-xl border transition-all duration-300 font-mono text-[10px] ${
                                        isTop
                                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-glow ring-1 ring-cyan-500/10'
                                            : 'bg-slate-950/60 border-white/5 text-slate-500'
                                    }`}
                                >
                                    <div className="font-bold truncate">
                                        {frame.function}()
                                    </div>
                                    <div className="text-[8px] text-[#768390] mt-1 truncate">
                                        {Object.entries(frame.locals).map(([k, v]) => `${k}:${formatVarValue(v)}`).join(', ')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
