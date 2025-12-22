import CodeEditor from './CodeEditor';
import InputPanel from '../../../components/panels/InputPanel';
import CallStackPanel from '../../../components/panels/CallStackPanel';
import MemoryPanel from '../../../components/panels/MemoryPanel';
import VariablesPanel from '../../../components/panels/VariablesPanel';
import { useExecutionStore } from '../../../store/executionStore';

export default function VisualizerLayout() {
    const { traces, currentStepIndex } = useExecutionStore();
    const currentTrace = traces[currentStepIndex];
    const explanation = currentTrace?.explanation || "Ready to execute...";
    const stack = currentTrace?.stack || [];

    return (
        <div className="flex-1 p-2 gap-2 flex min-h-0">
            {/* Col 1: Editor & Input (30%) */}
            <div className="w-[30%] flex flex-col gap-2">
                {/* Code Editor */}
                <div className="flex-[2] flex flex-col bg-bg-panel border border-border-subtle rounded-lg overflow-hidden">
                    <div className="h-9 border-b border-border-subtle flex items-center justify-between px-4 bg-bg-panel">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">CODE</span>
                    </div>
                    <div className="flex-1 relative">
                        <CodeEditor />
                    </div>
                </div>

                {/* Input Panel */}
                <div className="flex-1 flex flex-col bg-bg-panel border border-border-subtle rounded-lg overflow-hidden min-h-[150px]">
                    <div className="h-9 border-b border-border-subtle flex items-center justify-between px-4 bg-bg-panel">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">INPUT</span>
                    </div>
                    <div className="flex-1 relative">
                        <InputPanel />
                    </div>
                </div>
            </div>

            {/* Col 2: Visualization (40%) - Stack & Heap */}
            <div className="w-[40%] flex flex-col bg-bg-panel border border-border-subtle rounded-lg overflow-hidden relative">
                {/* Stack Section */}
                <div className="h-[40%] flex flex-col border-b border-border-subtle/50">
                    <div className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wider">STACK</div>
                    <div className="flex-1 overflow-hidden relative p-4">
                        <CallStackPanel stack={stack} />
                    </div>
                </div>

                {/* Heap Section */}
                <div className="flex-1 flex flex-col">
                    <div className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wider">HEAP</div>
                    <div className="flex-1 overflow-hidden relative p-4">
                        <MemoryPanel />
                    </div>
                </div>
            </div>

            {/* Col 3: Side Panel (30%) - Variables & Console */}
            <div className="w-[30%] flex flex-col gap-2">

                {/* Variable Watcher */}
                <div className="flex-[2] bg-bg-panel border border-border-subtle rounded-lg overflow-hidden flex flex-col">
                    <div className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border-subtle">VARIABLE WATCHER</div>
                    <div className="flex-1 overflow-auto">
                        <VariablesPanel stack={stack} />
                    </div>
                </div>

                {/* Console Output */}
                <div className="flex-1 bg-bg-panel border border-border-subtle rounded-lg overflow-hidden flex flex-col">
                    <div className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border-subtle">CONSOLE OUTPUT</div>
                    <div className="flex-1 overflow-auto p-4 font-mono text-xs text-text-muted">
                        <p className="mb-2 text-accent-cyan">&gt; {explanation}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
