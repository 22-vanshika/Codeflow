import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useExecutionStore } from '../store/executionStore';
import CodeEditor from '../features/visualizer/components/CodeEditor';
import InputPanel from '../features/visualizer/components/panels/InputPanel';
import WhiteboardPanel from '../features/visualizer/components/panels/WhiteboardPanel';
import OutputPanel from '../features/visualizer/components/panels/OutputPanel';
import FixPermissionDialog from '../components/dialogs/FixPermissionDialog';
import ImportProblemDialog from '../features/workspace/components/ImportProblemDialog';
import SaveVisualizationDialog from '../features/workspace/components/SaveVisualizationDialog';
import GitHubImportDialog from '../features/workspace/components/GitHubImportDialog';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronLeft, ChevronRight, Sparkles, Terminal, ChevronDown, ChevronUp, Code2, Save, Github } from 'lucide-react';

interface ProblemData {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topicTags: string[];
    starterCode: { cpp: string };
    source: 'LeetCode' | 'Custom';
    url?: string;
}

export default function ProblemWorkspace() {
    const {
        connect, reset, executeRealCode, error, setCode,
        requestTrace, nextStep, prevStep, togglePlay, isPlaying,
        currentStepIndex, traceSteps, traces,
        currentPattern, speed, setSpeed
    } = useExecutionStore();

    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [testCasesOpen, setTestCasesOpen] = useState(true);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isGithubImportOpen, setIsGithubImportOpen] = useState(false);
    const [problemDetails, setProblemDetails] = useState<ProblemData | null>(null);
    const [logicPanelOpen, setLogicPanelOpen] = useState(true);
    const location = useLocation();
    const hasAutoImported = useRef(false);

    const stepsArray = traceSteps.length > 0 ? traceSteps : traces;
    const hasSteps = stepsArray.length > 0;
    const currentTraceStep = traceSteps[currentStepIndex];



    const handleResetCode = () => {
        if (problemDetails?.starterCode?.cpp) {
            if (window.confirm("Reset to starter code? Unsaved changes will be lost.")) {
                setCode(problemDetails.starterCode.cpp);
                reset();
            }
        } else {
            if (window.confirm("Reset editor? Unsaved changes will be lost.")) {
                setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}`);
                reset();
            }
        }
    };

    useEffect(() => { connect(); }, [connect]);

    useEffect(() => {
        const url = location.state?.autoImportUrl;
        if (url && !hasAutoImported.current) {
            hasAutoImported.current = true;
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            fetch(`${API_URL}/api/problems/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    const saved = localStorage.getItem(`codeflow_saved_code_${result.data.id}`);
                    setCode(saved || result.data.starterCode.cpp);
                    setProblemDetails(result.data);
                }
            })
            .catch(console.error);
        }
    }, [location, setCode]);

    // Speed display (convert ms to multiplier)
    const speedMultiplier = (1050 - speed) / 500;
    const speedLabel = speedMultiplier.toFixed(1) + 'x';

    return (
        <div className="h-[calc(100vh-56px)] mt-[56px] w-screen flex flex-col bg-[#0B1120] overflow-hidden font-sans text-[#c9d1d9]">

            {/* ── TOP STATUS BAR ─────────────────────────────────────────── */}
            <header className="flex-none h-12 bg-[#0d1117] border-b border-[#1e2d3d] flex items-center justify-between px-5 z-30 shrink-0">
                {/* Left: Logo + File */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1e2d3d] flex items-center justify-center">
                            <Code2 size={14} className="text-[#58a6ff]" />
                        </div>
                        <span className="text-[#58a6ff] font-mono text-sm ml-1">
                            {problemDetails ? `${problemDetails.id}.cpp` : 'main.cpp'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#768390]">
                        {problemDetails && (
                            <>
                                <span>·</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                    problemDetails.difficulty === 'Easy' ? 'bg-green-900/40 text-green-400' :
                                    problemDetails.difficulty === 'Medium' ? 'bg-amber-900/40 text-amber-400' :
                                    'bg-red-900/40 text-red-400'
                                }`}>{problemDetails.difficulty}</span>
                                <span className="text-[#c9d1d9] font-medium">{problemDetails.title}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Center: Meta Pills */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-1 rounded-full bg-[#1a2332] border border-[#1e2d3d] text-[#768390]">
                        Language: <span className="text-[#58a6ff] font-semibold">C++</span>
                    </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {error && (
                        <span className="text-[10px] text-red-400 max-w-[200px] truncate">{error}</span>
                    )}
                    <button
                        onClick={() => setIsGithubImportOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-[#1a2332] border border-[#1e2d3d] hover:border-[#58a6ff]/50 text-[#768390] hover:text-white rounded-md transition-all"
                        title="Import from GitHub"
                    >
                        <Github size={12} />
                        GitHub
                    </button>
                    <button
                        onClick={() => setIsImportOpen(true)}
                        className="px-3 py-1.5 text-[11px] font-semibold bg-[#1a2332] border border-[#1e2d3d] hover:border-[#58a6ff]/50 text-[#768390] hover:text-[#58a6ff] rounded-md transition-all"
                    >
                        LeetCode
                    </button>
                    <button
                        onClick={() => setIsSaveOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-[#1a2332] border border-[#1e2d3d] hover:border-cyan-500/50 text-cyan-500 hover:text-cyan-400 rounded-md transition-all"
                    >
                        <Save size={12} />
                        Save
                    </button>
                    <button
                        onClick={handleResetCode}
                        className="px-3 py-1.5 text-[11px] font-semibold bg-[#1a2332] border border-[#1e2d3d] text-[#768390] hover:text-red-400 rounded-md transition-all"
                    >
                        Reset
                    </button>
                </div>
            </header>

            {/* ── MAIN CONTENT SPLIT ──────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden min-h-0">

                {/* ── LEFT PANEL: Code Editor + Test Cases ─────────────────── */}
                <div className={`flex flex-col shrink-0 border-r border-[#1e2d3d] bg-[#0d1117] transition-all duration-300 ${
                    leftPanelOpen ? 'w-[380px]' : 'w-0 overflow-hidden'
                }`}>

                    {/* Code Editor Section */}
                    <div className="flex flex-col flex-1 min-h-0 border-b border-[#1e2d3d]">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-[#1e2d3d] shrink-0">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#768390] uppercase tracking-widest">
                                <Code2 size={12} />
                                Code Editor
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={executeRealCode}
                                    className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-[#196127] hover:bg-[#1d7a30] text-green-300 rounded transition-colors"
                                    title="Run Code"
                                >
                                    <Play size={10} fill="currentColor" />
                                    RUN
                                </button>
                                <button
                                    onClick={requestTrace}
                                    className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 text-[#58a6ff] rounded border border-[#58a6ff]/30 transition-colors"
                                    title="Generate Visualization Trace"
                                >
                                    <Sparkles size={10} />
                                    TRACE
                                </button>
                            </div>
                        </div>

                        {/* Monaco Editor fills remaining */}
                        <div className="flex-1 relative min-h-0">
                            <CodeEditor />
                        </div>
                    </div>

                    {/* Test Cases + Output Section */}
                    <div className={`flex flex-col shrink-0 transition-all duration-300 ${testCasesOpen ? 'h-[300px]' : 'h-9'}`}>
                        <div
                            className="flex items-center justify-between px-4 cursor-pointer h-9 border-b border-[#1e2d3d] bg-[#0d1117] shrink-0 hover:bg-[#111827] transition-colors select-none"
                            onClick={() => setTestCasesOpen(v => !v)}
                        >
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#768390] uppercase tracking-widest">
                                <Terminal size={12} />
                                Test Cases & Output
                            </div>
                            {testCasesOpen ? <ChevronDown size={14} className="text-[#768390]"/> : <ChevronUp size={14} className="text-[#768390]"/>}
                        </div>
                        {testCasesOpen && (
                            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                {/* Input area — fixed height */}
                                <div className="h-[100px] shrink-0 border-b border-[#1e2d3d]">
                                    <InputPanel />
                                </div>
                                {/* Output area — takes remaining space, scrollable */}
                                <div className="flex-1 min-h-0 overflow-hidden">
                                    <OutputPanel />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── COLLAPSE TOGGLE ─────────────────────────────────────── */}
                <button
                    onClick={() => setLeftPanelOpen(v => !v)}
                    className="flex-none self-stretch w-5 bg-[#0d1117] border-r border-[#1e2d3d] hover:bg-[#1a2332] flex items-center justify-center text-[#768390] hover:text-[#58a6ff] transition-all group z-10"
                    title={leftPanelOpen ? 'Collapse Editor' : 'Expand Editor'}
                >
                    {leftPanelOpen
                        ? <ChevronLeft size={12} className="group-hover:scale-110 transition-transform" />
                        : <ChevronRight size={12} className="group-hover:scale-110 transition-transform" />
                    }
                </button>

                {/* ── RIGHT PANEL: Main Blackboard Canvas + Logic Panel ─────── */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0B1120]">

                    {/* Canvas Header */}
                    <div className="flex items-center justify-between px-5 py-2 border-b border-[#1e2d3d] bg-[#0d1117] shrink-0">
                        <div className="flex items-center gap-3 text-xs">
                            <span className="font-bold text-[#768390] uppercase tracking-widest text-[11px]">Main Blackboard</span>
                            {hasSteps && currentTraceStep && (
                                <>
                                    <span className="text-[#768390]">·</span>
                                    <span className="text-cyan-400 font-mono text-[11px]">
                                        Step {currentStepIndex + 1} / {stepsArray.length}
                                    </span>
                                    {currentPattern && (
                                        <>
                                            <span className="text-[#768390]">·</span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                                                style={{ color: currentPattern.color, borderColor: currentPattern.color + '44', backgroundColor: currentPattern.color + '15' }}>
                                                {currentPattern.name}
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        {/* View Mode: Blackboard only */}
                    </div>

                    {/* Infinite Canvas */}
                    <div className="flex-1 min-h-0 overflow-hidden relative">
                        <WhiteboardPanel />
                    </div>

                    {/* ── LOGIC PANEL (toggle) ───────────────────────────────── */}
                    <div className={`border-t border-[#1e2d3d] shrink-0 flex flex-col transition-all duration-300 ${logicPanelOpen ? 'h-[160px]' : 'h-9'}`}>
                        <div
                            className="flex items-center justify-between px-4 cursor-pointer h-9 bg-[#0d1117] shrink-0 hover:bg-[#111827] transition-colors select-none"
                            onClick={() => setLogicPanelOpen(v => !v)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Written Logic Panel</span>
                                <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-cyan-900/20 text-cyan-400 rounded border border-cyan-800/30 font-semibold">
                                    {logicPanelOpen ? 'ON' : 'OFF'}
                                </span>
                            </div>
                            {logicPanelOpen
                                ? <ChevronDown size={14} className="text-[#768390]"/>
                                : <ChevronUp size={14} className="text-[#768390]"/>
                            }
                        </div>

                        {logicPanelOpen && (
                            <div className="flex-1 overflow-y-auto px-5 py-3 bg-[#0d1117] font-mono text-sm space-y-2">
                                {currentTraceStep ? (
                                    <>
                                        <div className="flex gap-3 text-[#768390]">
                                            <span className="text-cyan-400 font-bold shrink-0">&gt; ACTION:</span>
                                            <span className="text-[#c9d1d9]">{currentTraceStep.teacherNote.what}</span>
                                        </div>
                                        <div className="flex gap-3 text-[#768390]">
                                            <span className="text-amber-400 font-bold shrink-0">&gt; LOGIC:</span>
                                            <span className="text-[#c9d1d9]">{currentTraceStep.teacherNote.why}</span>
                                        </div>
                                        <div className="flex gap-3 text-[#768390]">
                                            <span className="text-green-400 font-bold shrink-0">&gt; NEXT:</span>
                                            <span className="text-[#c9d1d9]">{currentTraceStep.teacherNote.next}</span>
                                        </div>
                                        {Object.keys(currentTraceStep.variables).length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {Object.entries(currentTraceStep.variables).map(([k, v]) => (
                                                    <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1a2332] border border-[#1e2d3d] text-[11px]">
                                                        <span className="text-[#58a6ff]">{k}</span>
                                                        <span className="text-[#768390]">=</span>
                                                        <span className="text-amber-300">{Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-[#768390] italic text-xs">
                                        Run a trace to see step-by-step logic explanations here...
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── BOTTOM PLAYBACK BAR ──────────────────────────────────────── */}
            <footer className="flex-none h-14 bg-[#0d1117] border-t border-[#1e2d3d] flex items-center px-6 gap-6 z-30 shrink-0">

                {/* Step Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevStep}
                        disabled={!hasSteps || currentStepIndex <= 0}
                        title="Step Back (←)"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a2332] border border-[#1e2d3d] text-[#768390] hover:text-white hover:border-[#58a6ff]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-semibold"
                    >
                        <SkipBack size={14} /> STEP BACK
                    </button>

                    <button
                        onClick={togglePlay}
                        disabled={!hasSteps}
                        title="Play / Pause (Space)"
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed border ${
                            isPlaying
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                                : 'bg-[#58a6ff]/10 border-[#58a6ff]/40 text-[#58a6ff] hover:bg-[#58a6ff]/20'
                        }`}
                    >
                        {isPlaying ? <><Pause size={14} fill="currentColor" /> PAUSE</> : <><Play size={14} fill="currentColor" /> PLAY</>}
                    </button>

                    <button
                        onClick={nextStep}
                        disabled={!hasSteps || currentStepIndex >= stepsArray.length - 1}
                        title="Step Forward (→)"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a2332] border border-[#1e2d3d] text-[#768390] hover:text-white hover:border-[#58a6ff]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-semibold"
                    >
                        STEP FORWARD <SkipForward size={14} />
                    </button>

                    <div className="w-px h-5 bg-[#1e2d3d] mx-1" />

                    <button
                        onClick={reset}
                        title="Reset (R)"
                        className="p-2 rounded-lg bg-[#1a2332] border border-[#1e2d3d] text-[#768390] hover:text-red-400 hover:border-red-500/40 transition-all"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>

                {/* Scrubbing Bar */}
                <div className="flex-1 flex items-center gap-3 min-w-0">
                    {hasSteps && (
                        <>
                            <span className="text-[10px] text-[#768390] font-mono whitespace-nowrap">
                                {currentStepIndex + 1} / {stepsArray.length}
                            </span>
                            <div className="flex-1 relative h-1.5 rounded-full bg-[#1a2332] cursor-pointer group">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-100"
                                    style={{ width: `${stepsArray.length > 1 ? (currentStepIndex / (stepsArray.length - 1)) * 100 : 0}%` }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={stepsArray.length - 1}
                                    value={currentStepIndex}
                                    onChange={e => useExecutionStore.getState().setStep(Number(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {/* Thumb */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-lg transition-all duration-100 pointer-events-none"
                                    style={{ left: `${stepsArray.length > 1 ? (currentStepIndex / (stepsArray.length - 1)) * 100 : 0}%`, transform: 'translate(-50%, -50%)' }}
                                />
                            </div>
                        </>
                    )}
                    {!hasSteps && (
                        <div className="flex-1 h-1 rounded-full bg-[#1a2332] opacity-50" />
                    )}
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-3 shrink-0 border-l border-[#1e2d3d] pl-6">
                    <span className="text-[11px] text-[#768390] font-bold">SPEED:</span>
                    <span className="text-[11px] font-mono text-[#58a6ff] w-8">1.0x</span>
                    <div className="relative w-28">
                        <input
                            type="range"
                            min={50}
                            max={1000}
                            step={50}
                            value={1050 - speed}
                            onChange={e => setSpeed(1050 - Number(e.target.value))}
                            className="w-full h-1 appearance-none bg-[#1a2332] rounded-full cursor-pointer
                                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 
                                       [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full 
                                       [&::-webkit-slider-thumb]:bg-[#58a6ff] [&::-webkit-slider-thumb]:cursor-pointer
                                       [&::-webkit-slider-thumb]:shadow-lg"
                        />
                    </div>
                    <span className="text-[11px] font-mono text-[#768390] w-8">2.0x</span>
                    <div className="ml-1 px-2 py-1 bg-[#1a2332] border border-[#1e2d3d] rounded text-[11px] font-mono font-bold text-cyan-400">
                        {speedLabel}
                    </div>
                </div>
            </footer>

            {/* Dialogs */}
            <FixPermissionDialog />
            <ImportProblemDialog
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                onImportSuccess={(data) => setProblemDetails(data)}
            />
            <SaveVisualizationDialog
                isOpen={isSaveOpen}
                onClose={() => setIsSaveOpen(false)}
            />
            <GitHubImportDialog
                isOpen={isGithubImportOpen}
                onClose={() => setIsGithubImportOpen(false)}
            />
        </div>
    );
}
