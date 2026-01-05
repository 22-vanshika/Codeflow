
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useExecutionStore } from '../../store/executionStore';
import { Network, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

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
    const { flowchart, analysis, currentStepIndex, traces } = useExecutionStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>("");
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (flowchart && containerRef.current) {
            const renderFlowchart = async () => {
                try {
                    // Handle both string (legacy) and object (new) formats
                    let mermaidCode = "";
                    if (typeof flowchart === 'string') {
                        mermaidCode = flowchart;
                    } else if (flowchart.markdown) {
                        mermaidCode = flowchart.markdown;
                    }

                    if (!mermaidCode) return;

                    // Unique ID for each render to prevent conflicts
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
    }, [flowchart]);

    // Effect to highlight current node (Mock logic for now as we don't have direct mapping yet)
    // Real implementation would need the AI to return "Node ID" -> "Line Number" mapping or similar.
    // For now, we will just show the static chart. 
    // TODO: Implement node highlighting synchronization.

    return (
        <div className="flex-1 flex flex-col bg-bg-main relative text-text-primary overflow-hidden">
            {/* Header / Config Bar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto bg-bg-panel/80 backdrop-blur-md border border-border-subtle rounded-xl p-4 shadow-xl max-w-md">
                    <h2 className="text-lg font-bold text-accent-cyan flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        {analysis?.title || "Algorithm Flow"}
                    </h2>
                    {analysis && (
                        <div className="mt-2 text-sm text-text-muted space-y-1">
                            <p><span className="text-accent-purple font-mono text-xs uppercase tracking-wider">Pattern:</span> {analysis.pattern}</p>
                            <p><span className="text-accent-green font-mono text-xs uppercase tracking-wider">Complexity:</span> {analysis.complexity}</p>
                            <p className="border-t border-border-subtle pt-2 mt-2 italic text-xs leading-relaxed opacity-80">
                                {analysis.overview}
                            </p>
                        </div>
                    )}
                </div>

                <div className="pointer-events-auto flex flex-col gap-2 bg-bg-panel/80 backdrop-blur-md border border-border-subtle rounded-lg p-2 shadow-xl">
                    <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors">
                        <ZoomIn className="w-5 h-5" />
                    </button>
                    <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors">
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <button onClick={() => setScale(1)} className="p-2 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors">
                        <Maximize className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Whiteboard Canvas */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-10 bg-[radial-gradient(#313244_1px,transparent_1px)] [background-size:16px_16px]">
                <div
                    ref={containerRef}
                    className="transition-transform duration-300 ease-out origin-center"
                    style={{ transform: `scale(${scale})` }}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
            </div>

            {/* Placeholder for "No Data" */}
            {!flowchart && !analysis && (
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
