
import CodeEditor from './CodeEditor';
import InputPanel from '../../../components/panels/InputPanel';

import WhiteboardPanel from '../../../components/panels/WhiteboardPanel';
import OutputPanel from '../../../components/panels/OutputPanel';
import FixPermissionDialog from '../../../components/dialogs/FixPermissionDialog';
import { useExecutionStore } from '../../../store/executionStore';
import { Edit2, Save, RotateCw, Play } from 'lucide-react';

export default function VisualizerLayout() {
    const { reset, executeRealCode } = useExecutionStore();
    // Check if execution finished


    return (
        <div className="flex-1 flex overflow-hidden relative bg-bg-main">
            {/* LEFT SIDE: Code & Input (30%) */}
            <div className="w-[400px] flex flex-col border-r border-border-subtle bg-bg-panel z-10 shrink-0">
                {/* Code Editor */}
                <div className="flex-[2] flex flex-col min-h-0">
                    <div className="h-10 border-b border-border-subtle flex items-center justify-between px-4 bg-bg-main/50">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                            Code
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={executeRealCode}
                                className="p-1.5 bg-accent-green/10 text-accent-green hover:bg-accent-green/20 rounded-md transition-all flex items-center gap-1 px-3"
                                title="Run Code (Real Execution)"
                            >
                                <Play size={14} fill="currentColor" />
                                <span className="text-xs font-bold">RUN</span>
                            </button>
                            <div className="w-px h-4 bg-border-subtle mx-1" />
                            <button
                                onClick={reset}
                                className="p-1.5 bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 rounded-md transition-all"
                                title="Edit Code"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                className="p-1.5 bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 rounded-md transition-all"
                                title="Save Code"
                            >
                                <Save size={14} />
                            </button>
                            <button
                                onClick={reset}
                                className="p-1.5 bg-accent-red/10 text-accent-red hover:bg-accent-red/20 rounded-md transition-all"
                                title="Reset Execution"
                            >
                                <RotateCw size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <CodeEditor />
                    </div>
                </div>

                {/* Input Panel */}
                <div className="h-[200px] flex flex-col border-t border-border-subtle min-h-0">
                    <div className="h-9 border-b border-border-subtle flex items-center px-4 bg-bg-main/50">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Input / Test Case</span>
                    </div>
                    <div className="flex-1 relative">
                        <InputPanel />
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Whiteboard (Main) */}
            <div className="flex-1 flex flex-col relative min-w-0">
                <WhiteboardPanel />

                {/* VISUALIZER OUTPUT PANEL */}
                <OutputPanel />
            </div>

            {/* Fix Permission Dialog */}
            <FixPermissionDialog />
        </div>
    );
}
