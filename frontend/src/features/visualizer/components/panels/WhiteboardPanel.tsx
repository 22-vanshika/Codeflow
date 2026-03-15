
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useExecutionStore } from '../../../../store/executionStore';
import { Network } from 'lucide-react';
import type { FlowchartData, ArrayVisual, CallStackVisual, TreeVisual, GraphVisual, StackQueueVisual } from '../../../../types';
import { ArrayVisualizer, TeacherNoteCard, CallStackVisualizer, TreeVisualizer, GraphVisualizer, StackQueueVisualizer } from '../visualizers';

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

export default function WhiteboardPanel() {
    const {
        flowchart,
        analysis,
        currentStepIndex,
        traces,
        traceSteps,
        traceMode,
        currentPattern,
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
    const activeStep = stepsArray[currentStepIndex];
    const activeLine = activeStep?.line;
    const currentTraceStep = traceSteps[currentStepIndex];
    const currentTrace = traces[currentStepIndex];
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

    const renderVisualizer = () => {
        if (!currentTraceStep?.visuals) return null;
        const v = currentTraceStep.visuals;
        switch (v.type) {
            case 'array_1d':   return <ArrayVisualizer visual={v as ArrayVisual} />;
            case 'call_stack': return <CallStackVisualizer visual={v as CallStackVisual} />;
            case 'tree':       return <TreeVisualizer visual={v as TreeVisual} />;
            case 'graph':      return <GraphVisualizer visual={v as GraphVisual} />;
            case 'stack':
            case 'queue':      return <StackQueueVisualizer visual={v as StackQueueVisual} />;
            default:           return null;
        }
    };

    return (
        <div className="flex-1 w-full h-full flex flex-col bg-[#0B1120] relative text-white overflow-hidden">

            {/* Dot-grid background */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#1e2d3d 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Main Canvas Area */}
            <div
                className="flex-1 overflow-auto flex items-center justify-center p-10 relative z-10"
                style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            >
                {traceMode ? (
                    /* Blackboard Mode */
                    <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
                        {/* Variables Chips */}
                        {currentTraceStep && Object.keys(currentTraceStep.variables).length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {Object.entries(currentTraceStep.variables).map(([name, value]) => (
                                    <div key={name} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1117] border border-[#1e2d3d] rounded-lg text-xs font-mono">
                                        <span className="text-[#58a6ff]">{name}</span>
                                        <span className="text-[#768390]">=</span>
                                        <span className="text-amber-300 font-semibold">
                                            {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dynamic DSA Visualizer */}
                        <div className="w-full flex justify-center">
                            {renderVisualizer()}
                        </div>

                        {/* Current Line Badge */}
                        {currentTraceStep && (
                            <div className="flex items-center gap-2 bg-[#0d1117]/80 backdrop-blur-sm border border-[#1e2d3d] rounded-lg px-4 py-2 font-mono text-sm">
                                <span className="text-[#768390]">Line {currentTraceStep.line}:</span>
                                <span className="text-cyan-400">{currentTraceStep.lineContent}</span>
                            </div>
                        )}

                        {/* Teacher Note Card */}
                        {currentTraceStep && (
                            <TeacherNoteCard
                                note={currentTraceStep.teacherNote}
                                pattern={currentTraceStep.pattern || currentPattern || undefined}
                                step={currentStepIndex + 1}
                                totalSteps={traceSteps.length}
                            />
                        )}
                    </div>
                ) : (
                    /* Flowchart Mode */
                    <div className="flex flex-col items-center gap-6">
                        <div
                            ref={containerRef}
                            className="transition-transform duration-300 flowchart-container"
                            dangerouslySetInnerHTML={{ __html: svgContent }}
                        />
                        {currentTraceStep && (
                            <TeacherNoteCard
                                note={currentTraceStep.teacherNote}
                                pattern={currentTraceStep.pattern || currentPattern || undefined}
                                step={currentStepIndex + 1}
                                totalSteps={traceSteps.length || traces.length}
                            />
                        )}
                        {!currentTraceStep && currentTrace && (
                            <div className="bg-[#0d1117]/90 border border-[#1e2d3d] rounded-xl p-5 max-w-lg space-y-3">
                                <p className="font-bold text-white">Step {currentStepIndex + 1} of {traces.length}</p>
                                <p className="text-sm text-[#768390]">{currentTrace?.explanation || `Line ${currentTrace?.line}`}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Empty State */}
            {!hasSteps && !flowchart && !analysis && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#768390] gap-4 z-20">
                    <div className="w-16 h-16 rounded-2xl bg-[#0d1117] border border-[#1e2d3d] flex items-center justify-center">
                        <Network className="w-8 h-8 opacity-40" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-sm text-white/60">Canvas is empty</p>
                        <p className="text-xs mt-1 text-[#768390]">Click <span className="text-cyan-400 font-mono">TRACE</span> to visualize your code step-by-step</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] mt-2 text-[#768390]/70">
                        <span>Space = Play/Pause</span>
                        <span>·</span>
                        <span>← / → = Step</span>
                        <span>·</span>
                        <span>R = Reset</span>
                    </div>
                </div>
            )}
        </div>
    );
}
