import { useMemo } from 'react';
import { motion } from 'framer-motion';
import './visualizers.css';

interface TrieNodeVisual {
    id: string;
    val: string;
    isWord: boolean;
    parentId?: string;
}

interface TrieVisual {
    type: 'trie';
    target: string;
    nodes: TrieNodeVisual[];
    pointers: { name: string; nodeId: string; color: string }[];
}

interface TrieVisualizerProps {
    visual: TrieVisual;
    className?: string;
}

export default function TrieVisualizer({ visual, className = '' }: TrieVisualizerProps) {
    const { target, nodes = [], pointers = [] } = visual;

    // Calculate dynamic layout for Trie nodes
    const { positions, edges, width, height } = useMemo(() => {
        const layout = new Map<string, { x: number; y: number }>();
        const edgeList: { from: string; to: string; label: string }[] = [];

        if (nodes.length === 0) return { positions: layout, edges: edgeList, width: 400, height: 100 };

        const root = nodes.find(n => !n.parentId) || nodes[0];
        if (!root) return { positions: layout, edges: edgeList, width: 400, height: 100 };

        const subtreeWidths = new Map<string, number>();
        const calculateSubtreeWidth = (nodeId: string): number => {
            const children = nodes.filter(n => n.parentId === nodeId);
            if (children.length === 0) {
                subtreeWidths.set(nodeId, 45); // Leaf width
                return 45;
            }
            const totalWidth = children.reduce((sum, c) => sum + calculateSubtreeWidth(c.id), 0);
            const resolved = Math.max(totalWidth, 45);
            subtreeWidths.set(nodeId, resolved);
            return resolved;
        };
        calculateSubtreeWidth(root.id);

        const Y_SPACING = 75;
        const TOP_PADDING = 85; // Extra padding for pointer badges
        let maxDepth = 0;

        const assignPositions = (nodeId: string, startX: number, depth: number) => {
            maxDepth = Math.max(maxDepth, depth);
            const w = subtreeWidths.get(nodeId) || 45;
            const x = startX + w / 2;
            const y = TOP_PADDING + depth * Y_SPACING;
            layout.set(nodeId, { x, y });

            const children = nodes.filter(n => n.parentId === nodeId);
            let currentX = startX;
            children.forEach(child => {
                const childWidth = subtreeWidths.get(child.id) || 45;
                assignPositions(child.id, currentX, depth + 1);
                currentX += childWidth;
            });
        };

        const totalWidth = subtreeWidths.get(root.id) || 500;
        const svgWidth = Math.max(600, totalWidth + 100);
        assignPositions(root.id, 50, 0);

        nodes.forEach(node => {
            if (node.parentId && layout.has(node.parentId) && layout.has(node.id)) {
                edgeList.push({
                    from: node.parentId,
                    to: node.id,
                    label: node.val
                });
            }
        });

        return {
            positions: layout,
            edges: edgeList,
            width: svgWidth,
            height: TOP_PADDING + maxDepth * Y_SPACING + 80
        };
    }, [nodes]);

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
                y: pos.y - 36 - count * 22,
                lineY: pos.y - 20
            };
        }).filter(Boolean) as any[];
    }, [pointers, positions]);

    const activeNodeIds = useMemo(() => {
        return new Set(pointers.map(p => p.nodeId));
    }, [pointers]);

    if (nodes.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
                <div className="text-xs font-black text-accent-cyan uppercase tracking-[0.2em] mb-4">
                    Trie: {target}
                </div>
                <div className="flex items-center justify-center h-24 border border-dashed border-border-subtle rounded-xl w-64 text-text-muted text-sm italic">
                    Trie is empty
                </div>
            </div>
        );
    }

    return (
        <div className={`trie-visualizer flex flex-col items-center w-full overflow-x-auto custom-scrollbar p-2 ${className}`}>
            <div className="av-label mb-4 self-start pl-2">
                <span className="av-label-text">Trie Prefix Tree: {target}</span>
                <span className="av-count-badge bg-accent-cyan/15 text-accent-cyan">
                    {nodes.length} nodes
                </span>
            </div>

            <div className="relative w-full overflow-x-auto custom-scrollbar flex justify-start min-h-[300px]">
                <svg width={width} height={height} className="overflow-visible select-none flex-none">
                    <defs>
                        <filter id="glow-cyan-trie" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <marker id="trie-arrow" markerWidth="6" markerHeight="5" refX="20" refY="2.5" orient="auto">
                            <polygon points="0 0, 6 2.5, 0 5" fill="var(--color-border-subtle)" />
                        </marker>
                        <marker id="trie-arrow-active" markerWidth="6" markerHeight="5" refX="20" refY="2.5" orient="auto">
                            <polygon points="0 0, 6 2.5, 0 5" fill="var(--color-accent-cyan)" />
                        </marker>
                    </defs>

                    {/* Links */}
                    {edges.map((edge, idx) => {
                        const fromPos = positions.get(edge.from);
                        const toPos = positions.get(edge.to);
                        if (!fromPos || !toPos) return null;

                        const isActive = activeNodeIds.has(edge.to);
                        return (
                            <g key={`edge-${idx}`} className="transition-all duration-300">
                                <line
                                    x1={fromPos.x}
                                    y1={fromPos.y}
                                    x2={toPos.x}
                                    y2={toPos.y}
                                    stroke={isActive ? 'var(--color-accent-cyan)' : 'var(--color-border-subtle)'}
                                    strokeWidth={isActive ? '2' : '1.2'}
                                    markerEnd={isActive ? 'url(#trie-arrow-active)' : 'url(#trie-arrow)'}
                                />
                                
                                {isActive && (
                                    <line
                                        x1={fromPos.x}
                                        y1={fromPos.y}
                                        x2={toPos.x}
                                        y2={toPos.y}
                                        stroke="#a5f3fc"
                                        strokeWidth="2"
                                        className="av-graph-edge-flow"
                                        markerEnd="url(#trie-arrow-active)"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Pointer badges */}
                    {pointerPositions.map(p => (
                        <g key={`ptr-${p.name}`}>
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
                            <motion.g
                                key={`badge-${p.name}`}
                                layout
                                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                                transform={`translate(${p.x}, ${p.y})`}
                                className="font-mono"
                            >
                                <rect
                                    x="-26"
                                    y="-9"
                                    width="52"
                                    height="18"
                                    rx="5"
                                    fill={`${p.color}20`}
                                    stroke={p.color}
                                    strokeWidth="1.2"
                                    className="shadow-md"
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

                        const isActive = activeNodeIds.has(node.id);
                        const isRoot = node.val === 'ROOT';

                        let circleColor = '#0f172a';
                        let strokeColor = 'var(--color-border-active)';
                        let strokeWidth = '1.5';
                        let filter = '';

                        if (isActive) {
                            circleColor = 'rgba(6, 182, 212, 0.15)';
                            strokeColor = 'var(--color-accent-cyan)';
                            strokeWidth = '2.5';
                            filter = 'url(#glow-cyan-trie)';
                        } else if (node.isWord) {
                            circleColor = 'rgba(34, 197, 94, 0.1)';
                            strokeColor = 'var(--color-accent-green)';
                            strokeWidth = '2';
                        } else if (isRoot) {
                            circleColor = 'rgba(99, 102, 241, 0.05)';
                            strokeColor = '#6366f1';
                        }

                        return (
                            <motion.g
                                key={node.id}
                                layout
                                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                                transform={`translate(${pos.x}, ${pos.y})`}
                            >
                                {isActive && (
                                    <circle
                                        r="22"
                                        fill="none"
                                        stroke="var(--color-accent-cyan)"
                                        strokeWidth="1.5"
                                        className="animate-ping opacity-50"
                                    />
                                )}
                                <circle
                                    r="16"
                                    fill={circleColor}
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    filter={filter}
                                    className="transition-all duration-300"
                                />
                                <text
                                    textAnchor="middle"
                                    dy=".3em"
                                    fill={isActive ? 'var(--color-accent-cyan)' : (node.isWord ? 'var(--color-accent-green)' : 'var(--color-text-primary)')}
                                    fontSize={isRoot ? '7' : '11'}
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                >
                                    {node.val}
                                </text>

                                {/* Word End Indicator Ribbon */}
                                {node.isWord && (
                                    <circle
                                        cx="10"
                                        cy="-10"
                                        r="3.5"
                                        fill="var(--color-accent-green)"
                                    />
                                )}
                            </motion.g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

