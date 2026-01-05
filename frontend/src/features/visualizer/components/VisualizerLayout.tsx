import { useState } from 'react';
import CodeEditor from './CodeEditor';
import InputPanel from '../../../components/panels/InputPanel';
import CallStackPanel from '../../../components/panels/CallStackPanel';
import MemoryPanel from '../../../components/panels/MemoryPanel';
import VariablesPanel from '../../../components/panels/VariablesPanel';
import WhiteboardPanel from '../../../components/panels/WhiteboardPanel';
import BeginnerExplanationPanel from '../../../components/panels/BeginnerExplanationPanel';
import OutputPanel from '../../../components/panels/OutputPanel';
import FixPermissionDialog from '../../../components/dialogs/FixPermissionDialog';
import { useExecutionStore } from '../../../store/executionStore';
import { Layers, ChevronRight, ChevronLeft, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VisualizerLayout() {
    const { stack, traces, currentStepIndex } = useExecutionStore();
    const [isMemoryOpen, setIsMemoryOpen] = useState(false);
    const [isOutputOpen, setIsOutputOpen] = useState(false); // Bottom sheet logic if needed

    // Check if execution finished
    const isFinished = currentStepIndex === traces.length - 1 && traces.length > 0;

    // Auto-open output on finish (optional, maybe annoying if auto)
    // useEffect(() => { if(isFinished) setIsOutputOpen(true); }, [isFinished]);

    return (
        <div className="flex-1 flex overflow-hidden relative bg-bg-main">
            {/* LEFT SIDE: Code & Input (30%) */}
            <div className="w-[400px] flex flex-col border-r border-border-subtle bg-bg-panel z-10 shrink-0">
                {/* Code Editor */}
                <div className="flex-[2] flex flex-col min-h-0">
                    <div className="h-10 border-b border-border-subtle flex items-center px-4 bg-bg-main/50">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                            Code
                        </span>
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

            {/* FLOATING / SLIDING MEMORY PANEL */}
            <AnimatePresence>
                {isMemoryOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-0 right-0 bottom-0 w-[400px] bg-bg-panel border-l border-border-subtle shadow-2xl z-40 flex flex-col"
                    >
                        <div className="h-12 border-b border-border-subtle flex items-center justify-between px-4">
                            <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider flex items-center gap-2">
                                <Layers className="w-4 h-4 text-accent-cyan" />
                                Memory State
                            </h3>
                            <button onClick={() => setIsMemoryOpen(false)} className="p-1 hover:bg-white/10 rounded">
                                <ChevronRight className="w-5 h-5 text-text-muted" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-2 space-y-2">
                            {/* Stack */}
                            <div className="bg-bg-main rounded-lg border border-border-subtle overflow-hidden">
                                <div className="px-3 py-2 text-xs font-bold text-text-muted border-b border-border-subtle">CALL STACK</div>
                                <div className="p-2 h-[200px] overflow-auto">
                                    <CallStackPanel stack={stack} />
                                </div>
                            </div>

                            {/* Variables */}
                            <div className="bg-bg-main rounded-lg border border-border-subtle overflow-hidden">
                                <div className="px-3 py-2 text-xs font-bold text-text-muted border-b border-border-subtle">VARIABLES</div>
                                <div className="p-2 h-[200px] overflow-auto">
                                    <VariablesPanel stack={stack} />
                                </div>
                            </div>

                            {/* Heap */}
                            <div className="bg-bg-main rounded-lg border border-border-subtle overflow-hidden">
                                <div className="px-3 py-2 text-xs font-bold text-text-muted border-b border-border-subtle">HEAP</div>
                                <div className="p-2 h-[200px] overflow-auto">
                                    <MemoryPanel />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOGGLE MEMORY BUTTON */}
            <button
                onClick={() => setIsMemoryOpen(!isMemoryOpen)}
                className={`absolute top-4 right-4 z-30 p-2 rounded-full shadow-xl border border-border-subtle transition-all duration-300 ${isMemoryOpen ? 'opacity-0 pointer-events-none' : 'bg-bg-panel hover:bg-white/10 text-accent-cyan'}`}
                title="Show Memory"
            >
                <Layers className="w-6 h-6" />
            </button>

            {/* Fix Permission Dialog */}
            <FixPermissionDialog />
        </div>
    );
}
