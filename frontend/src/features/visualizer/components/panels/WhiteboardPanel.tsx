
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import * as THREE from 'three';
import { useExecutionStore } from '../../../../store/executionStore';
import { Network } from 'lucide-react';
import type { FlowchartData, ArrayVisual, CallStackVisual, TreeVisual, GraphVisual, StackQueueVisual, HashMapVisual, LinkedListVisual } from '../../../../types';
import { ArrayVisualizer, CallStackVisualizer, TreeVisualizer, GraphVisualizer, StackQueueVisualizer, HashMapVisualizer, MatrixVisualizer, PriorityQueueVisualizer, LinkedListVisualizer, TrieVisualizer, StringVisualizer } from '../visualizers';

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        primaryColor: '#1e1e2e',
        primaryTextColor: '#cdd6f4',
        lineColor: '#585b70',
        mainBkg: '#1e1e2e',
        nodeBorder: '#fab387',
    },
    securityLevel: 'loose',
});

// Helper for variables formatting
function formatVarValue(val: any): string {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'string') return `"${val}"`;
    if (Array.isArray(val)) {
        if (val.length > 5) {
            return `[${val.slice(0, 4).map(x => typeof x === 'object' ? 'obj' : String(x)).join(', ')}, ... (${val.length})]`;
        }
        return `[${val.map(x => typeof x === 'object' ? 'obj' : String(x)).join(', ')}]`;
    }
    if (typeof val === 'object') {
        const keys = Object.keys(val);
        if (keys.length > 2) {
            return `{${keys.slice(0, 2).map(k => `${k}: ${typeof val[k] === 'object' ? 'obj' : String(val[k])}`).join(', ')}, ...}`;
        }
        return `{${keys.map(k => `${k}: ${typeof val[k] === 'object' ? 'obj' : String(val[k])}`).join(', ')}}`;
    }
    return String(val);
}

// 60 FPS Three.js Subtle Background Grid & Flowing Particles
const WhiteboardBackground = React.memo(function WhiteboardBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (!parent) return;

        let width = parent.clientWidth || window.innerWidth;
        let height = parent.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 18;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(width, height);

        // Light setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Flowing particles setup
        const particleCount = 35;
        const positions = new Float32Array(particleCount * 3);
        const velocities: { x: number; y: number; z: number }[] = [];
        const bounds = { x: 26, y: 16, z: 8 };

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * bounds.x;
            positions[i * 3 + 1] = (Math.random() - 0.5) * bounds.y;
            positions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z;

            velocities.push({
                x: (Math.random() - 0.5) * 0.006,
                y: (Math.random() - 0.5) * 0.006,
                z: (Math.random() - 0.5) * 0.003
            });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const pointMaterial = new THREE.PointsMaterial({
            size: 0.16,
            color: 0x0ea5e9, // cyan-500
            transparent: true,
            opacity: 0.3,
            sizeAttenuation: true
        });

        const pointCloud = new THREE.Points(geometry, pointMaterial);
        scene.add(pointCloud);

        // Neural network connections
        const maxConnections = 45;
        const linePositions = new Float32Array(maxConnections * 2 * 3);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x6366f1, // indigo-500
            transparent: true,
            opacity: 0.12
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        let animationId: number;
        const connectionThreshold = 4.8;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Move particles
            const posArr = geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                posArr[i * 3] += velocities[i].x;
                posArr[i * 3 + 1] += velocities[i].y;
                posArr[i * 3 + 2] += velocities[i].z;

                // Bounce at bounds
                if (Math.abs(posArr[i * 3]) > bounds.x / 2) velocities[i].x *= -1;
                if (Math.abs(posArr[i * 3 + 1]) > bounds.y / 2) velocities[i].y *= -1;
                if (Math.abs(posArr[i * 3 + 2]) > bounds.z / 2) velocities[i].z *= -1;
            }
            geometry.attributes.position.needsUpdate = true;

            // Update lines
            let lineIndex = 0;
            for (let i = 0; i < particleCount; i++) {
                const x1 = posArr[i * 3];
                const y1 = posArr[i * 3 + 1];
                const z1 = posArr[i * 3 + 2];

                for (let j = i + 1; j < particleCount; j++) {
                    const x2 = posArr[j * 3];
                    const y2 = posArr[j * 3 + 1];
                    const z2 = posArr[j * 3 + 2];

                    const dx = x1 - x2;
                    const dy = y1 - y2;
                    const dz = z1 - z2;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < connectionThreshold && lineIndex < maxConnections) {
                        const idx = lineIndex * 6;
                        linePositions[idx] = x1;
                        linePositions[idx + 1] = y1;
                        linePositions[idx + 2] = z1;
                        linePositions[idx + 3] = x2;
                        linePositions[idx + 4] = y2;
                        linePositions[idx + 5] = z2;
                        lineIndex++;
                    }
                }
            }

            // Reset other line indices
            for (let i = lineIndex; i < maxConnections; i++) {
                const idx = i * 6;
                linePositions[idx] = 0;
                linePositions[idx + 1] = 0;
                linePositions[idx + 2] = 0;
                linePositions[idx + 3] = 0;
                linePositions[idx + 4] = 0;
                linePositions[idx + 5] = 0;
            }
            lineGeometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!canvasRef.current) return;
            const w = parent.clientWidth;
            const h = parent.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(parent);

        return () => {
            cancelAnimationFrame(animationId);
            resizeObserver.disconnect();
            geometry.dispose();
            pointMaterial.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full block pointer-events-none opacity-20" 
            style={{ zIndex: 0 }}
        />
    );
});

const WhiteboardPanel = React.memo(function WhiteboardPanel() {
    const {
        flowchart,
        currentStepIndex,
        traces,
        traceSteps,
        traceMode,
        togglePlay,
        nextStep,
        prevStep,
        reset,
    } = useExecutionStore();

    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>("");
    const [scale] = useState(1);
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());

    const stepsArray = traceSteps.length > 0 ? traceSteps : traces;
    const hasSteps = stepsArray.length > 0;
    const activeStep = stepsArray[currentStepIndex] as any;
    const activeLine = activeStep?.line;
    const currentTraceStep = stepsArray[currentStepIndex] as any;
    const currentTrace = stepsArray[currentStepIndex] as any;
    const currentNodeId = currentTrace?.visualization?.nodeId;
    const pathTaken = currentTrace?.visualization?.pathTaken;

    useEffect(() => {
        setVisitedNodes(new Set());
    }, [traces.length === 0, traceSteps.length === 0]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
            switch (e.key) {
                case ' ':  e.preventDefault(); if (hasSteps) togglePlay(); break;
                case 'ArrowRight': if (hasSteps) nextStep(); break;
                case 'ArrowLeft':  if (hasSteps) prevStep(); break;
                case 'r': case 'R': if (hasSteps) reset(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasSteps, togglePlay, nextStep, prevStep, reset]);

    useEffect(() => {
        if (currentNodeId) {
            setVisitedNodes(prev => new Set([...prev, currentNodeId]));
        }
    }, [currentNodeId, currentStepIndex]);

    useEffect(() => {
        if (!traceMode && flowchart && containerRef.current) {
            const renderFlowchart = async () => {
                try {
                    let mermaidCode = "";
                    if (typeof flowchart === 'string') mermaidCode = flowchart;
                    else if ((flowchart as FlowchartData).markdown) mermaidCode = (flowchart as FlowchartData).markdown;
                    if (!mermaidCode) return;
                    const { svg } = await mermaid.render(`mermaid-${Date.now()}`, mermaidCode);
                    setSvgContent(svg);
                } catch (e) {
                    setSvgContent(`<div class="text-red-400 p-4">Error rendering flowchart</div>`);
                }
            };
            renderFlowchart();
        }
    }, [flowchart, traceMode]);

    useEffect(() => {
        if (traceMode || !containerRef.current || !svgContent) return;
        const svg = containerRef.current.querySelector('svg');
        if (!svg) return;
        const mapping = typeof flowchart === 'object' && flowchart ? (flowchart as FlowchartData).mapping : {};
        const activeNodeId = activeLine ? mapping[String(activeLine)] : null;
        svg.querySelectorAll('.node').forEach((node) => {
            const el = node as HTMLElement;
            const nodeId = el.id?.replace('flowchart-', '').split('-')[0];
            el.classList.remove('node-active', 'node-visited', 'node-future');
            if (nodeId === activeNodeId || nodeId === currentNodeId) el.classList.add('node-active');
            else if (visitedNodes.has(nodeId)) el.classList.add('node-visited');
            else el.classList.add('node-future');
        });
    }, [svgContent, currentStepIndex, currentNodeId, visitedNodes, pathTaken, flowchart, activeLine, traceMode]);

    // Universal Assignment / Travel Animation Hook
    useEffect(() => {
        if (!currentTraceStep || !traceMode) return;
        const detail = (currentTraceStep as any).assignmentDetail;
        if (!detail || !detail.dest) return;

        // Give a tiny amount of time for cells/variables to mount/update positions
        const timer = setTimeout(() => {
            const dest = detail.dest;
            let destEl: HTMLElement | null = null;
            if (dest.row !== undefined && dest.col !== undefined) {
                destEl = document.querySelector(`[data-array-name="${dest.name}"][data-row-index="${dest.row}"][data-col-index="${dest.col}"]`);
            } else if (dest.index !== undefined) {
                destEl = document.querySelector(`[data-array-name="${dest.name}"][data-cell-index="${dest.index}"]`);
            } else {
                destEl = document.querySelector(`[data-var-name="${dest.name}"]`);
            }

            if (!destEl) return;

            const sources = detail.sources || [];
            sources.forEach((src: any) => {
                let srcEl: HTMLElement | null = null;
                if (src.row !== undefined && src.col !== undefined) {
                    srcEl = document.querySelector(`[data-array-name="${src.name}"][data-row-index="${src.row}"][data-col-index="${src.col}"]`);
                } else if (src.index !== undefined) {
                    srcEl = document.querySelector(`[data-array-name="${src.name}"][data-cell-index="${src.index}"]`);
                } else {
                    srcEl = document.querySelector(`[data-var-name="${src.name}"]`);
                }

                if (srcEl && destEl) {
                    triggerTravelAnimation(srcEl, destEl, src.value);
                }
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [currentStepIndex, traceMode, currentTraceStep]);

    // Compute sortedUntil: detect if step type is loop_end / return meaning a
    // sort pass just completed — track the minimum swap index seen so far
    const sortedUntilRef = React.useRef<number | undefined>(undefined);
    const prevStepIndexRef = React.useRef<number>(-1);
    if (currentStepIndex < prevStepIndexRef.current) {
        // Rewinding — reset sorted boundary
        sortedUntilRef.current = undefined;
    }
    prevStepIndexRef.current = currentStepIndex;

    const arrayStepType = (currentTraceStep as any)?.type as string | undefined;

    const renderVisualizerItem = (v: any, compact: boolean = false) => {
        if (!v) return null;
        switch (v.type) {
            case 'array_1d': {
                const av = v as ArrayVisual;
                return (
                    <ArrayVisualizer
                        visual={av}
                        stepType={arrayStepType as any}
                    />
                );
            }
            case 'matrix': {
                return <MatrixVisualizer visual={v as any} />;
            }
            case 'priority_queue': {
                return <PriorityQueueVisualizer visual={v as any} />;
            }
            case 'call_stack': return <CallStackVisualizer visual={v as CallStackVisual} />;
            case 'tree':       return <TreeVisualizer visual={v as TreeVisual} />;
            case 'graph':      return <GraphVisualizer visual={v as GraphVisual} />;
            case 'stack':
            case 'queue':
            case 'deque':      return <StackQueueVisualizer visual={v as StackQueueVisual} />;
            case 'hash_map':   return <HashMapVisualizer visual={v as HashMapVisual} compact={compact} />;
            case 'linked_list': return <LinkedListVisualizer visual={v as LinkedListVisual} compact={compact} />;
            case 'trie':       return <TrieVisualizer visual={v as any} />;
            case 'string':     return <StringVisualizer visual={v as any} stepType={arrayStepType as any} />;
            default:           return null;
        }
    };

    const renderVisualizer = () => {
        if (!currentTraceStep?.visuals) return null;
        const v = currentTraceStep.visuals;
        if (v.type === 'multi_visuals') {
            const list = (v as any).visuals || [];
            
            // Filter large visual structures into mainVisuals
            const mainVisuals = list.filter((subV: any) => 
                ['array_1d', 'matrix', 'tree', 'graph', 'call_stack', 'stack', 'queue', 'deque', 'priority_queue', 'linked_list', 'trie', 'string'].includes(subV.type)
            );
            
            // Filter smaller helper variables/hash_maps into sideVisuals
            const sideVisuals = list.filter((subV: any) => 
                !['array_1d', 'matrix', 'tree', 'graph', 'call_stack', 'stack', 'queue', 'deque', 'priority_queue', 'linked_list', 'trie', 'string'].includes(subV.type)
            );

            if (mainVisuals.length > 0 && sideVisuals.length > 0) {
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full h-full min-h-0 relative z-10">
                        {/* Main Visualizer Area: takes 2 columns (66% width) */}
                        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 h-full min-h-0 justify-center">
                            {mainVisuals.map((subV: any, idx: number) => (
                                <div key={subV.target || idx} className="w-full flex justify-center flex-none">
                                    {renderVisualizerItem(subV)}
                                </div>
                            ))}
                        </div>

                        {/* Side Panel Area: takes 1 column (33% width) for sticky scope variables */}
                        <div className="lg:col-span-1 flex flex-col bg-slate-900/40 border border-white/5 rounded-2xl p-5 h-full min-h-0 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-3 text-cyan-400">
                                <div className="w-1.5 h-3.5 rounded-full bg-cyan-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#768390]">Scope Variables</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                                {sideVisuals.map((subV: any, idx: number) => (
                                    <div key={subV.target || idx} className="w-full flex justify-center flex-none">
                                        {renderVisualizerItem(subV, true)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex flex-col gap-6 w-full items-center overflow-y-auto custom-scrollbar h-full p-2">
                    {list.map((subV: any, idx: number) => (
                        <div key={subV.target || idx} className="w-full flex justify-center flex-none">
                            {renderVisualizerItem(subV)}
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="p-4 w-full flex justify-center">
                {renderVisualizerItem(v)}
            </div>
        );
    };

    const showEmptyState = traceMode ? !hasSteps : !flowchart;

    if (showEmptyState) {
        return (
            <div className="flex-1 w-full h-full flex flex-col bg-[#0B1120] relative text-white overflow-hidden items-center justify-center">
                <WhiteboardBackground />

                <div className="flex flex-col items-center justify-center text-[#768390] gap-4 z-20 select-none">
                    <div className="w-16 h-16 rounded-2xl bg-[#0d1117] border border-[#1e2d3d] flex items-center justify-center">
                        <Network className="w-8 h-8 opacity-40" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-sm text-white/60">Canvas is empty</p>
                        <p className="text-xs mt-1 text-[#768390]">
                            {traceMode 
                                ? <>Click <span className="text-cyan-400 font-mono">GENERATE TRACE</span> to visualize your code step-by-step</>
                                : <>No flowchart data available. Click <span className="text-cyan-400 font-mono">GENERATE TRACE</span> to run code</>}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] mt-2 text-[#768390]/70">
                        <span>Space = Play/Pause</span>
                        <span>·</span>
                        <span>← / → = Step</span>
                        <span>·</span>
                        <span>R = Reset</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full h-full flex flex-col bg-[#0B1120] relative text-white overflow-hidden">
            <WhiteboardBackground />

            {traceMode && hasSteps && activeStep?.variables && Object.keys(activeStep.variables).length > 0 && (!currentTraceStep?.visuals || currentTraceStep.visuals.type !== 'multi_visuals') && (
                <div className="absolute top-4 right-4 z-30 w-60 bg-[#090d16]/85 border border-white/10 rounded-2xl p-4 shadow-2xl text-xs font-mono max-h-64 overflow-y-auto custom-scrollbar backdrop-blur-md animate-fade-slide-in">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-black mb-2 pb-1 border-b border-white/5 tracking-widest text-[9px] uppercase">
                        <div className="w-1.5 h-3.5 rounded-full bg-cyan-400" />
                        <span>Scope Variables</span>
                    </div>
                    <div className="space-y-1.5 mt-2">
                        {Object.entries(activeStep.variables).map(([name, value]) => {
                            let typeStr = 'var';
                            if (typeof value === 'number') {
                                typeStr = Number.isInteger(value) ? 'int' : 'double';
                            } else if (typeof value === 'boolean') {
                                typeStr = 'bool';
                            } else if (typeof value === 'string') {
                                typeStr = value.length === 1 ? 'char' : 'string';
                            } else if (Array.isArray(value)) {
                                typeStr = 'vector';
                            } else if (typeof value === 'object' && value !== null) {
                                typeStr = 'struct';
                            }
                            return (
                                <div key={name} className="flex items-center justify-between py-1 border-b border-white/5 last:border-b-0 px-1 rounded hover:bg-white/5 transition-colors group">
                                    <span className="text-cyan-400 font-bold">
                                        {name}
                                        <span className="text-[8px] font-normal text-slate-500 ml-1">({typeStr})</span>
                                    </span>
                                    <span className="text-orange-400 font-semibold truncate max-w-[120px]" title={String(value)}>
                                        {formatVarValue(value)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {traceMode ? (
                /* Primary Data Visualization Area takes 100% of height */
                <div className="flex-1 w-full h-full flex flex-col min-h-0 relative z-10">
                    <div className="flex-1 w-full min-h-0 flex items-stretch justify-center p-6 overflow-hidden">
                        <div className={`w-full h-full flex justify-center min-h-0 ${
                            currentTraceStep?.visuals?.type === 'multi_visuals' ? 'max-w-7xl' : 'max-w-4xl items-center overflow-y-auto custom-scrollbar'
                        }`}>
                            {renderVisualizer()}
                        </div>
                    </div>
                </div>
            ) : (
                /* Flowchart Mode */
                <div
                    className="flex-1 overflow-auto flex items-center justify-center p-10 relative z-10"
                    style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
                >
                    <div className="flex flex-col items-center gap-6">
                        <div
                            ref={containerRef}
                            className="transition-transform duration-300 flowchart-container"
                            dangerouslySetInnerHTML={{ __html: svgContent }}
                        />
                        {!currentTraceStep && currentTrace && (
                            <div className="bg-[#0d1117]/90 border border-[#1e2d3d] rounded-lg px-4 py-2 font-mono text-xs text-[#768390]">
                                <span>Line {currentTrace?.line}:</span>
                                <span className="ml-2 text-cyan-400">{currentTrace?.explanation || ''}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

export default WhiteboardPanel;

function triggerTravelAnimation(sourceEl: HTMLElement, destEl: HTMLElement, value: any) {
    const srcRect = sourceEl.getBoundingClientRect();
    const destRect = destEl.getBoundingClientRect();

    // Create particle element
    const particle = document.createElement('div');
    particle.className = 'av-flying-particle';
    particle.innerText = String(value);

    // Style particle
    Object.assign(particle.style, {
        position: 'fixed',
        top: `${srcRect.top}px`,
        left: `${srcRect.left}px`,
        width: `${srcRect.width}px`,
        height: `${srcRect.height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(6, 182, 212, 0.3)',
        border: '2px solid rgb(6, 182, 212)',
        borderRadius: '12px',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '15px',
        fontWeight: 'bold',
        zIndex: '9999',
        pointerEvents: 'none',
        boxShadow: '0 0 12px rgba(6, 182, 212, 0.6)',
        transition: 'all 0.55s cubic-bezier(0.25, 1, 0.5, 1)'
    });

    document.body.appendChild(particle);

    // Trigger animation frame to transition
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            Object.assign(particle.style, {
                top: `${destRect.top}px`,
                left: `${destRect.left}px`,
                width: `${destRect.width}px`,
                height: `${destRect.height}px`,
                background: 'rgba(251, 146, 60, 0.35)',
                borderColor: 'rgb(251, 146, 60)',
                boxShadow: '0 0 15px rgba(251, 146, 60, 0.7)',
                transform: 'scale(1.05)'
            });
        });
    });

    // Cleanup after animation completes
    setTimeout(() => {
        // Landing pulse effect using native Web Animations API
        try {
            destEl.animate([
                { transform: 'scale(1)', boxShadow: '0 0 0 rgba(251, 146, 60, 0)' },
                { transform: 'scale(1.08)', boxShadow: '0 0 16px rgba(251, 146, 60, 0.8)', borderColor: 'rgb(251, 146, 60)' },
                { transform: 'scale(1)', boxShadow: '0 0 0 rgba(251, 146, 60, 0)' }
            ], {
                duration: 400,
                easing: 'ease-out'
            });
        } catch (e) {
            console.error('Error playing landing pulse animation:', e);
        }

        particle.remove();
    }, 550);
}
