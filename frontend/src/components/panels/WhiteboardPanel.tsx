
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useExecutionStore } from '../../store/executionStore';
import { Network, ZoomIn, ZoomOut, Maximize, Play, Pause, LayoutGrid, GitBranch } from 'lucide-react';
import type { FlowchartData, ArrayVisual, CallStackVisual } from '../../types';
import { ArrayVisualizer, TeacherNoteCard, CallStackVisualizer } from '../visualizers';

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
        isPlaying,
        togglePlay,
        setTraceMode
    } = useExecutionStore();

    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>("");
    const [scale, setScale] = useState(1);
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());

    // Determine which steps array to use (prioritize new trace steps)
    const stepsArray = traceSteps.length > 0 ? traceSteps : traces;
    const hasSteps = stepsArray.length > 0;

    // Get current line for highlighting (works for both trace types)
    const activeStep = stepsArray[currentStepIndex];
    const activeLine = activeStep?.line;

    // Current trace step for blackboard mode
    const currentTraceStep = traceSteps[currentStepIndex];

    // Get current trace info for flowchart visualization (Legacy)
    const currentTrace = traces[currentStepIndex];
    const currentNodeId = currentTrace?.visualization?.nodeId;
    const loopIteration = currentTrace?.visualization?.loopIteration;
    const pathTaken = currentTrace?.visualization?.pathTaken;

    // Reset visited nodes when traces change (new execution)
    useEffect(() => {
        setVisitedNodes(new Set());
    }, [traces.length === 0, traceSteps.length === 0]);

    // Track visited nodes as we progress
    useEffect(() => {
        if (currentNodeId) {
            setVisitedNodes(prev => new Set([...prev, currentNodeId]));
        }
    }, [currentNodeId, currentStepIndex]);

    // Render flowchart (only in flowchart mode)
    useEffect(() => {
        if (!traceMode && flowchart && containerRef.current) {
            const renderFlowchart = async () => {
                try {
                    let mermaidCode = "";
                    if (typeof flowchart === 'string') {
                        mermaidCode = flowchart;
                    } else if ((flowchart as FlowchartData).markdown) {
                        mermaidCode = (flowchart as FlowchartData).markdown;
                    }

                    if (!mermaidCode) return;

                    const id = `mermaid-${Date.now()}`;
                    const { svg } = await mermaid.render(id, mermaidCode);
                    setSvgContent(svg);
                } catch (e) {
                    console.error("Mermaid render error:", e);
                    setSvgContent(`<div class="text-red-400 p-4">Error rendering flowchart</div>`);
                }
            };
            renderFlowchart();
        }
    }, [flowchart, traceMode]);

    // Apply node highlighting after SVG is rendered (flowchart mode only)
    useEffect(() => {
        if (traceMode || !containerRef.current || !svgContent) return;

        const svg = containerRef.current.querySelector('svg');
        if (!svg) return;

        const mapping = typeof flowchart === 'object' && flowchart
            ? (flowchart as FlowchartData).mapping
            : {};

        const currentLine = activeLine;
        const activeNodeId = currentLine ? mapping[String(currentLine)] : null;

        svg.querySelectorAll('.node').forEach((node) => {
            const nodeElement = node as HTMLElement;
            const nodeId = nodeElement.id?.replace('flowchart-', '').split('-')[0];

            nodeElement.classList.remove('node-active', 'node-visited', 'node-future', 'node-dimmed');

            if (nodeId === activeNodeId || nodeId === currentNodeId) {
                nodeElement.classList.add('node-active');
            } else if (visitedNodes.has(nodeId)) {
                nodeElement.classList.add('node-visited');
            } else {
                nodeElement.classList.add('node-future');
            }
        });

        if (pathTaken && activeNodeId) {
            svg.querySelectorAll('.edgePath').forEach((edge) => {
                const edgeElement = edge as HTMLElement;
                edgeElement.classList.remove('edge-active', 'edge-taken', 'edge-not-taken');
            });
        }
    }, [svgContent, currentStepIndex, currentNodeId, visitedNodes, pathTaken, flowchart, activeLine, traceMode]);

    // Get visual component based on trace step visuals
    const renderVisualizer = () => {
        if (!currentTraceStep?.visuals) return null;

        const visuals = currentTraceStep.visuals;

        switch (visuals.type) {
            case 'array_1d':
                return <ArrayVisualizer visual={visuals as ArrayVisual} />;
            case 'call_stack':
                return <CallStackVisualizer visual={visuals as CallStackVisual} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-bg-main relative text-text-primary overflow-hidden">
            {/* Header / Config Bar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto bg-bg-panel/80 backdrop-blur-md border border-border-subtle rounded-xl p-4 shadow-xl max-w-md">
                    <h2 className="text-lg font-bold text-accent-cyan flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        {traceMode
                            ? (currentPattern?.name || "Blackboard Mode")
                            : (analysis?.title || "Algorithm Flow")
                        }
                    </h2>

                    {/* Pattern info for trace mode */}
                    {traceMode && currentPattern && (
                        <div className="mt-2 text-sm text-text-muted">
                            <p className="text-xs leading-relaxed opacity-80">
                                {currentPattern.description}
                            </p>
                        </div>
                    )}

                    {/* Analysis info for flowchart mode */}
                    {!traceMode && analysis && (
                        <div className="mt-2 text-sm text-text-muted space-y-1">
                            <p><span className="text-accent-purple font-mono text-xs uppercase tracking-wider">Pattern:</span> {analysis.pattern}</p>
                            <p><span className="text-accent-green font-mono text-xs uppercase tracking-wider">Complexity:</span> {analysis.complexity}</p>
                            <p className="border-t border-border-subtle pt-2 mt-2 italic text-xs leading-relaxed opacity-80">
                                {analysis.overview}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right side controls */}
                <div className="pointer-events-auto flex flex-col gap-3">
                    {/* Mode Toggle */}
                    <div className="flex bg-bg-panel/80 backdrop-blur-md border border-border-subtle rounded-lg overflow-hidden shadow-xl">
                        <button
                            onClick={() => setTraceMode(true)}
                            className={`p-2 px-3 flex items-center gap-2 text-xs font-medium transition-colors ${traceMode ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Blackboard
                        </button>
                        <button
                            onClick={() => setTraceMode(false)}
                            className={`p-2 px-3 flex items-center gap-2 text-xs font-medium transition-colors ${!traceMode ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <GitBranch className="w-4 h-4" />
                            Flowchart
                        </button>
                    </div>

                    {/* Step Counter */}
                    {hasSteps && (
                        <div className="bg-bg-panel/80 backdrop-blur-md border border-border-subtle rounded-lg p-3 shadow-xl text-center w-14 ml-auto">
                            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Step</div>
                            <div className="text-xs font-bold text-accent-cyan">
                                {currentStepIndex + 1} <span className="text-text-muted text-sm">/ {stepsArray.length}</span>
                            </div>
                            {!traceMode && loopIteration && (
                                <div className="text-xs text-accent-orange mt-1">
                                    🔄 Loop iteration {loopIteration}
                                </div>
                            )}
                            {!traceMode && pathTaken && (
                                <div className={`text-xs mt-1 ${pathTaken === 'true' ? 'text-accent-green' : 'text-accent-red'}`}>
                                    {pathTaken === 'true' ? '✓ Yes branch' : '✗ No branch'}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Zoom controls */}
                    <div className="flex flex-col gap-2 bg-bg-panel/80 backdrop-blur-md border border-border-subtle rounded-lg p-2 shadow-xl w-14 ml-auto">
                        <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors">
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors">
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <button onClick={() => setScale(1)} className="p-2 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors">
                            <Maximize className="w-5 h-5" />
                        </button>
                        <div className="border-t border-border-subtle my-1" />
                        <button
                            onClick={togglePlay}
                            className={`p-2 rounded-md transition-colors ${isPlaying ? 'bg-accent-orange/20 text-accent-orange' : 'hover:bg-white/5 text-text-muted hover:text-white'}`}
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-10 bg-[radial-gradient(#313244_1px,transparent_1px)] [background-size:16px_16px]">
                {traceMode ? (
                    /* Blackboard Mode - Show visualizers */
                    <div
                        className="flex flex-col items-center gap-6 transition-transform duration-300 ease-out"
                        style={{ transform: `scale(${scale})` }}
                    >
                        {/* Variables Display */}
                        {currentTraceStep && (
                            <div className="variables-panel">
                                {Object.entries(currentTraceStep.variables).map(([name, value]) => (
                                    <div key={name} className="variable-chip">
                                        <span className="variable-name">{name}</span>
                                        <span className="text-text-muted">=</span>
                                        <span className="variable-value">
                                            {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dynamic Visualizer */}
                        {renderVisualizer()}

                        {/* Current Line Display */}
                        {currentTraceStep && (
                            <div className="bg-bg-panel/60 backdrop-blur-sm border border-border-subtle rounded-lg px-4 py-2 font-mono text-sm">
                                <span className="text-text-muted mr-2">Line {currentTraceStep.line}:</span>
                                <span className="text-accent-cyan">{currentTraceStep.lineContent}</span>
                            </div>
                        )}

                        {/* Teacher's Note */}
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
                    /* Flowchart Mode - Show Mermaid diagram with Teacher's Note */
                    <div className="flex flex-col items-center gap-6">
                        <div
                            ref={containerRef}
                            className="transition-transform duration-300 ease-out origin-center flowchart-container"
                            style={{ transform: `scale(${scale})` }}
                            dangerouslySetInnerHTML={{ __html: svgContent }}
                        />

                        {/* Teacher's Note for Flowchart Mode - using trace data if available */}
                        {currentTraceStep && (
                            <TeacherNoteCard
                                note={currentTraceStep.teacherNote}
                                pattern={currentTraceStep.pattern || currentPattern || undefined}
                                step={currentStepIndex + 1}
                                totalSteps={traceSteps.length || traces.length}
                            />
                        )}

                        {/* Fallback: Show current execution info if no trace step */}
                        {!currentTraceStep && currentTrace && (
                            <div className="bg-bg-panel/80 backdrop-blur-md border border-border-subtle rounded-xl p-5 shadow-xl max-w-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-bold text-white">
                                        Step {currentStepIndex + 1} of {traces.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs font-semibold text-accent-yellow uppercase tracking-wider flex items-center gap-1">
                                            💡 WHAT HAPPENED
                                        </span>
                                        {currentTrace?.explanation || `Executing line ${currentTrace?.line}`}
                                    </div>

                                    <div>
                                        <span className="text-xs font-semibold text-accent-red uppercase tracking-wider flex items-center gap-1">
                                            🎯 WHY IT MATTERS
                                        </span>
                                        <p className="text-text-muted text-sm mt-1">
                                            {currentTrace?.type === 'loop_start'
                                                ? 'Loops allow repeated execution of code blocks'
                                                : currentTrace?.type === 'assignment'
                                                    ? 'Variables store data that changes during execution'
                                                    : currentTrace?.type === 'condition'
                                                        ? 'Conditions control which path the program takes'
                                                        : 'Each step moves the program closer to completion'}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-xs font-semibold text-accent-blue uppercase tracking-wider flex items-center gap-1">
                                            ➡️ NEXT STEP
                                        </span>
                                        <p className="text-text-muted text-sm mt-1">
                                            {currentStepIndex < traces.length - 1
                                                ? 'Continue to the next line of execution'
                                                : 'Execution complete'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Placeholder for "No Data" */}
            {!hasSteps && !flowchart && !analysis && (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted flex-col gap-4">
                    <div className="w-16 h-16 rounded-full bg-bg-panel border border-border-subtle flex items-center justify-center animate-pulse">
                        <Network className="w-8 h-8 opacity-50" />
                    </div>
                    <p>Enter code and run to visualize logic</p>
                </div>
            )}
        </div>
    );
}

