import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useExecutionStore } from '../store/executionStore';
import { useVisualizationStore } from '../store/visualizationStore';
import type { SavedVisualization } from '../store/visualizationStore';
import CodeEditor from '../features/visualizer/components/CodeEditor';
import WhiteboardPanel from '../features/visualizer/components/panels/WhiteboardPanel';
import FixPermissionDialog from '../components/dialogs/FixPermissionDialog';
import ImportProblemDialog from '../features/workspace/components/ImportProblemDialog';
import SaveVisualizationDialog from '../features/workspace/components/SaveVisualizationDialog';
import GitHubImportDialog from '../features/workspace/components/GitHubImportDialog';
import ComplexityInfo from '../features/workspace/components/ComplexityInfo';
import ProblemDescription from '../features/workspace/components/ProblemDescription';
import SlidingConsole from '../features/workspace/components/SlidingConsole';
import { 
    Play, Pause, SkipBack, SkipForward, RotateCcw, 
    ChevronLeft, ChevronRight, Sparkles, ChevronDown, 
    ChevronUp, Code2, Save, Github, BookOpen, 
    Zap, Terminal, Layers, MousePointer2,
    Maximize2, Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProblemData {
    id: string;
    title: string;
    description?: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topicTags?: string[];
    category?: string;
    examples?: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    constraints?: string[];
    starterCode: { cpp: string };
    source: 'LeetCode' | 'Custom' | 'SWE180';
    url?: string;
}



export default function ProblemWorkspace() {
    const {
        connect, reset, executeRealCode, error, setCode,
        requestTrace, nextStep, prevStep, togglePlay, isPlaying,
        currentStepIndex, traceSteps, traces,
        currentPattern, speed, setSpeed
    } = useExecutionStore();

    const [activeTab, setActiveTab] = useState<'description' | 'editor'>('editor');
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [complexityOpen, setComplexityOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isGithubImportOpen, setIsGithubImportOpen] = useState(false);
    const [problemDetails, setProblemDetails] = useState<ProblemData | null>(null);
    const [logicPanelOpen, setLogicPanelOpen] = useState(true);
    const [selectedLanguage] = useState('C++');
    const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false);
    const [loadedVis, setLoadedVis] = useState<SavedVisualization | null>(null);
    
    const location = useLocation();
    const hasAutoImported = useRef(false);
    const fetchVisualizationById = useVisualizationStore(s => s.fetchVisualizationById);

    // Load visualization if vid param is present
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const vid = params.get('vid');
        if (vid) {
            fetchVisualizationById(vid).then(vis => {
                setLoadedVis(vis);
                setCode(vis.code);
                useExecutionStore.getState().setInput(vis.settings?.input || "");
                useExecutionStore.getState().setSpeed(vis.settings?.speed !== undefined ? vis.settings.speed : 500);
                
                // Load trace steps directly into store
                const steps = vis.traceSteps || [];
                if (steps.length > 0) {
                    useExecutionStore.setState({
                        traceSteps: steps,
                        traces: steps,
                        currentStepIndex: 0,
                        isPlaying: false,
                        traceMode: true
                    });
                }
                
                if (vis.metadata?.problemDetails) {
                    setProblemDetails(vis.metadata.problemDetails);
                } else {
                    setProblemDetails({
                        id: 'custom-playground',
                        title: vis.title,
                        difficulty: 'Medium',
                        starterCode: { cpp: vis.code },
                        source: 'Custom'
                    });
                }
                
                setActiveTab('editor');
            }).catch(err => {
                console.error("Failed to load visualization:", err);
            });
        }
    }, [location.search, fetchVisualizationById, setCode]);

    const stepsArray = traceSteps.length > 0 ? traceSteps : traces;
    const hasSteps = stepsArray.length > 0;
    const currentTraceStep = stepsArray[currentStepIndex];



    useEffect(() => { connect(); }, [connect]);

    useEffect(() => {
        const problemData = location.state?.problemData;
        if (problemData && !hasAutoImported.current) {
            hasAutoImported.current = true;
            const saved = localStorage.getItem(`codeflow_saved_code_${problemData.id}`);
            setCode(saved || problemData.starterCode.cpp);
            setProblemDetails(problemData);
            if (!saved) setActiveTab('description');
        }
    }, [location, setCode]);

    // Keyboard shortcuts for fullscreen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key.toLowerCase() === 'f') {
                setIsCanvasFullscreen(true);
            } else if (e.key === 'Escape') {
                setIsCanvasFullscreen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const speedMultiplier = (1050 - speed) / 500;
    const speedLabel = speedMultiplier.toFixed(1) + 'x';

    return (
        <div className="h-screen w-screen flex flex-col bg-bg-main overflow-hidden font-sans text-text-primary">

            {/* ── PREMIUM HEADER ─────────────────────────────────────────── */}
            <header className="flex-none h-14 glass-morphism border-b border-white/5 flex items-center justify-between px-6 z-40 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                            <Code2 size={20} className="text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Workspace</span>
                                {problemDetails && (
                                    <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-tighter ${
                                        problemDetails.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                        problemDetails.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                        {problemDetails.difficulty}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-sm font-bold text-white truncate max-w-[200px]">
                                {problemDetails ? problemDetails.title : 'Playground (Untitled)'}
                            </h2>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-white/5" />

                    {/* Language Selector */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all text-[11px] font-bold text-text-secondary hover:text-white group">
                            <Layers size={14} className="text-primary group-hover:scale-110 transition-transform" />
                            {selectedLanguage}
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* Complexity Button */}
                    <button 
                        onClick={() => setComplexityOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/50 transition-all text-[11px] font-black text-primary hover:text-white group"
                    >
                        <Zap size={14} className="group-hover:animate-pulse" />
                        COMPLEXITY
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsGithubImportOpen(true)}
                            className="p-2.5 text-text-muted hover:text-white bg-white/5 border border-white/5 hover:border-white/20 rounded-xl transition-all"
                            title="Import from GitHub"
                        >
                            <Github size={20} />
                        </button>
                        <button
                            onClick={() => setIsSaveOpen(true)}
                            className="p-2.5 text-primary hover:text-white bg-primary/10 border border-primary/30 hover:border-primary rounded-xl transition-all shadow-lg shadow-primary/5"
                            title="Save Visualization"
                        >
                            <Save size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── MAIN WORKSPACE ─────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden min-h-0 relative">
                
                {/* ── LEFT PANEL: Tabs + Content ─────────────────────────── */}
                <div className={`flex flex-col shrink-0 glass-morphism border-r border-white/5 transition-all duration-500 ease-in-out ${
                    leftPanelOpen ? 'w-[440px]' : 'w-0 overflow-hidden opacity-0'
                }`}>
                    {/* Tabs */}
                    <div className="flex items-center p-1.5 bg-white/5 border-b border-white/5">
                        <button 
                            onClick={() => setActiveTab('description')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'description' 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <BookOpen size={14} />
                            Description
                        </button>
                        <button 
                            onClick={() => setActiveTab('editor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'editor' 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Code2 size={14} />
                            Editor
                        </button>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {activeTab === 'description' ? (
                                <motion.div 
                                    key="desc"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full"
                                >
                                    <ProblemDescription problem={problemDetails} />
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="editor"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full flex flex-col relative"
                                >
                                    <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 shrink-0 bg-white/[0.02]">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            Active Editor
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={requestTrace}
                                                className="group relative flex items-center gap-2 px-4 py-1.5 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary hover:text-white hover:border-secondary transition-all text-[10px] font-black overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-secondary/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                                                <Sparkles size={12} className="relative z-10" />
                                                <span className="relative z-10">GENERATE TRACE</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 relative">
                                        <CodeEditor />
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md z-20 flex items-center gap-3"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    <span className="text-[11px] font-bold text-red-400 leading-tight">{error}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <SlidingConsole 
                                        isOpen={consoleOpen} 
                                        onToggle={() => setConsoleOpen(!consoleOpen)} 
                                        onRun={executeRealCode}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── PANEL TOGGLE ─────────────────────────────────────── */}
                <button
                    onClick={() => setLeftPanelOpen(v => !v)}
                    className="flex-none self-stretch w-4 bg-white/[0.02] border-r border-white/5 hover:bg-white/[0.05] flex items-center justify-center text-text-muted hover:text-primary transition-all group z-30"
                    title={leftPanelOpen ? 'Collapse Panel' : 'Expand Panel'}
                >
                    <div className="w-px h-12 bg-white/10 group-hover:bg-primary/50 transition-colors" />
                    <div className="absolute flex flex-col gap-1 items-center">
                        {leftPanelOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
                    </div>
                </button>

                {/* ── RIGHT PANEL: Visualizer ─────────────────────────────── */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-bg-main relative">
                    
                    <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="flex items-center justify-between px-8 py-3 border-b border-white/5 bg-white/[0.02] shrink-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <MousePointer2 size={14} className="text-text-muted" />
                                <span className="font-black text-text-muted uppercase tracking-[0.2em] text-[10px]">Canvas Visualizer</span>
                            </div>
                            
                            {hasSteps && currentTraceStep && (
                                <>
                                    <div className="h-4 w-px bg-white/10" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-primary font-black font-mono text-[11px] tracking-tight">
                                            {currentStepIndex + 1} <span className="text-text-muted font-medium mx-1">/</span> {stepsArray.length}
                                        </span>
                                        {currentPattern && (
                                            <span className="px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-tighter border border-white/10"
                                                style={{ color: currentPattern.color, borderColor: currentPattern.color + '44', backgroundColor: currentPattern.color + '15' }}>
                                                {currentPattern.name}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsCanvasFullscreen(true)}
                                className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-white/5 transition-all group"
                                title="Fullscreen (F)"
                            >
                                <Maximize2 size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold text-text-muted">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                LIVE SYNC
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-hidden relative z-0">
                        <WhiteboardPanel />
                    </div>

                    <motion.div 
                        animate={{ height: logicPanelOpen ? 220 : 44 }}
                        className="border-t border-white/5 shrink-0 flex flex-col bg-bg-panel/90 backdrop-blur-xl z-20 overflow-hidden"
                    >
                        <div
                            className="flex items-center justify-between px-8 cursor-pointer h-11 shrink-0 hover:bg-white/5 transition-colors select-none"
                            onClick={() => setLogicPanelOpen(v => !v)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-accent-cyan animate-ping opacity-50" />
                                </div>
                                <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em]">Execution Trace Logic</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 text-text-muted rounded border border-white/5 tracking-widest uppercase">
                                    {logicPanelOpen ? 'Collapse' : 'Expand Details'}
                                </span>
                                {logicPanelOpen ? <ChevronDown size={16} className="text-text-muted"/> : <ChevronUp size={16} className="text-text-muted"/>}
                            </div>
                        </div>

                        <AnimatePresence>
                            {logicPanelOpen && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 overflow-y-auto custom-scrollbar px-8 py-5 space-y-4"
                                >
                                    {currentTraceStep ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* What's Happening: the raw trace explanation + any calculation detail */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <div className="w-1 h-3 rounded-full bg-primary" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">What's Happening</span>
                                                </div>
                                                <p className="text-sm font-bold text-white leading-relaxed font-mono whitespace-pre-wrap">
                                                    {(currentTraceStep as any).teacherNote?.what || (currentTraceStep as any).explanation || ''}
                                                </p>
                                            </div>
                                            {/* Step Detail: state-specific contextual info (no generic boilerplate) */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-secondary">
                                                    <div className="w-1 h-3 rounded-full bg-secondary" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Step Detail</span>
                                                </div>
                                                <p className="text-[13px] font-medium text-text-secondary leading-relaxed font-mono">
                                                    {(currentTraceStep as any).teacherNote?.why || ''}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 space-y-3 opacity-50">
                                            <Terminal size={24} className="text-text-muted" />
                                            <p className="text-[11px] font-black text-text-muted uppercase tracking-widest">
                                                Awaiting execution trace...
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* ── BOTTOM PLAYBACK BAR ──────────────────────────────────────── */}
            <footer className="flex-none h-16 glass-morphism border-t border-white/5 flex items-center px-8 gap-8 z-40 shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={prevStep}
                        disabled={!hasSteps || currentStepIndex <= 0}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-text-muted hover:text-white hover:border-primary/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                        <SkipBack size={18} />
                    </button>
                    <button
                        onClick={togglePlay}
                        disabled={!hasSteps}
                        className={`group relative w-28 h-10 flex items-center justify-center gap-2 rounded-xl font-black text-[10px] tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed border overflow-hidden ${
                            isPlaying
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                                : 'bg-primary/10 border-primary/40 text-primary hover:bg-primary/20'
                        }`}
                    >
                        {isPlaying ? <><Pause size={16} fill="currentColor" /> PAUSE</> : <><Play size={16} fill="currentColor" /> PLAY</>}
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={!hasSteps || currentStepIndex >= stepsArray.length - 1}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-text-muted hover:text-white hover:border-primary/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                        <SkipForward size={18} />
                    </button>
                    <button
                        onClick={reset}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-text-muted hover:text-red-400 hover:border-red-500/40 transition-all ml-1"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                <div className="flex-1 flex items-center gap-4 min-w-0">
                    {hasSteps && (
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Step Progression</span>
                                <span className="text-[10px] font-black text-primary font-mono">{currentStepIndex + 1} / {stepsArray.length}</span>
                            </div>
                            <div className="relative h-2 rounded-full bg-white/5 cursor-pointer group">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                    style={{ width: `${stepsArray.length > 1 ? (currentStepIndex / (stepsArray.length - 1)) * 100 : 0}%` }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={stepsArray.length - 1}
                                    value={currentStepIndex}
                                    onChange={e => useExecutionStore.getState().setStep(Number(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-xl transition-all duration-100 pointer-events-none z-20 border-2 border-primary"
                                    style={{ left: `${stepsArray.length > 1 ? (currentStepIndex / (stepsArray.length - 1)) * 100 : 0}%`, transform: 'translate(-50%, -50%)' }}
                                />
                            </div>
                        </div>
                    )}
                    {!hasSteps && (
                        <div className="flex-1 flex flex-col gap-2 opacity-30">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Awaiting Trace</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6 shrink-0 border-l border-white/5 pl-8">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Speed</span>
                            <span className="text-[10px] font-black text-accent-cyan font-mono">{speedLabel}</span>
                        </div>
                        <div className="relative w-32">
                            <input
                                type="range"
                                min={50}
                                max={1000}
                                step={50}
                                value={1050 - speed}
                                onChange={e => setSpeed(1050 - Number(e.target.value))}
                                className="w-full h-1 appearance-none bg-white/5 rounded-full cursor-pointer
                                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 
                                           [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full 
                                           [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:cursor-pointer
                                           [&::-webkit-slider-thumb]:shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── FULLSCREEN CANVAS OVERLAY ────────────────────────────── */}
            <AnimatePresence>
                {isCanvasFullscreen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-bg-main"
                    >
                        {/* Canvas fills background */}
                        <div className="w-full h-full relative z-0">
                            <WhiteboardPanel />
                        </div>

                        {/* Controls on top with very high z-index */}
                        <div className="absolute top-6 right-6 z-[300] flex items-center gap-3">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] bg-bg-panel/90 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl">
                                Fullscreen Mode (Esc to Exit)
                            </span>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsCanvasFullscreen(false);
                                }}
                                className="p-4 text-white bg-primary hover:bg-primary/90 border border-primary/20 rounded-2xl transition-all shadow-2xl shadow-primary/40 cursor-pointer active:scale-95 z-[310]"
                                title="Exit Fullscreen (Esc)"
                            >
                                <Minimize2 size={28} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dialogs */}
            <FixPermissionDialog />
            <ComplexityInfo 
                isOpen={complexityOpen} 
                onClose={() => setComplexityOpen(false)} 
            />
            <ImportProblemDialog
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                onImportSuccess={(data) => setProblemDetails(data)}
            />
            <SaveVisualizationDialog
                isOpen={isSaveOpen}
                onClose={() => setIsSaveOpen(false)}
                loadedVis={loadedVis}
                onSaveSuccess={(updatedVis) => {
                    setLoadedVis(updatedVis);
                    if (updatedVis && updatedVis._id) {
                        const params = new URLSearchParams(window.location.search);
                        if (params.get('vid') !== updatedVis._id) {
                            window.history.replaceState(null, '', `${window.location.pathname}?vid=${updatedVis._id}`);
                        }
                    }
                }}
            />
            <GitHubImportDialog
                isOpen={isGithubImportOpen}
                onClose={() => setIsGithubImportOpen(false)}
            />
        </div>
    );
}
