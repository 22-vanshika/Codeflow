import { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
import FeedbackModal from '../components/FeedbackModal';
import AuthModal from '../features/auth/components/AuthModal';
import { problemsList } from '../data/problems/index';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { 
    Play, Pause, SkipBack, SkipForward, RotateCcw, 
    ChevronLeft, ChevronRight, Sparkles, ChevronDown, 
    ChevronUp, Code2, Save, Github, BookOpen, 
    Zap, Terminal, Layers, MousePointer2,
    Maximize2, Minimize2, Menu, Search, CheckCircle, Trophy,
    Cpu, LogOut, LayoutDashboard, Settings, Newspaper, Brain,
    Star, FileText, Bookmark, Edit3, User
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

interface DropdownItemProps {
    to?: string;
    onClick?: () => void;
    icon: React.ElementType;
    label: string;
    description?: string;
    danger?: boolean;
    accent?: boolean;
}

function DropdownItem({ to, onClick, icon: Icon, label, description, danger, accent }: DropdownItemProps) {
    const colorClass = danger
        ? 'text-accent-red hover:bg-accent-red/10 hover:text-accent-red'
        : accent
        ? 'text-primary hover:bg-primary/10 hover:text-primary'
        : 'text-text-secondary hover:text-white hover:bg-white/5';

    const content = (
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${colorClass}`}>
            <Icon size={17} className="flex-shrink-0" />
            <div>
                <p className="text-sm font-bold leading-none">{label}</p>
                {description && <p className="text-[11px] text-text-muted mt-0.5">{description}</p>}
            </div>
        </div>
    );

    if (to) {
        return <Link to={to} onClick={onClick}>{content}</Link>;
    }
    return <button className="w-full text-left" onClick={onClick}>{content}</button>;
}

export default function ProblemWorkspace() {
    const {
        connect, reset, executeRealCode, error, setCode,
        requestTrace, nextStep, prevStep, togglePlay, isPlaying,
        currentStepIndex, traceSteps, traces,
        currentPattern, speed, setSpeed
    } = useExecutionStore();

    const { user, logout } = useAuthStore();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dropdown click outside listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
    const [dsaDrawerOpen, setDsaDrawerOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    useEffect(() => {
        if (traceSteps && traceSteps.length > 0 && currentStepIndex === traceSteps.length - 1) {
            const alreadySubmitted = sessionStorage.getItem('cf_feedback_submitted') === 'true';
            const shownThisSession = sessionStorage.getItem('cf_feedback_shown') === 'true';
            if (!alreadySubmitted && !shownThisSession) {
                const timer = setTimeout(() => {
                    setIsFeedbackOpen(true);
                    sessionStorage.setItem('cf_feedback_shown', 'true');
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [currentStepIndex, traceSteps?.length]);
    const hasAutoImported = useRef(false);
    const fetchVisualizationById = useVisualizationStore(s => s.fetchVisualizationById);
    
    const loadProblem = (problem: any) => {
        const saved = localStorage.getItem(`codeflow_saved_code_${problem.id}`);
        reset();
        setLoadedVis(null);
        // Clear vid from URL search params to prevent reload sync bugs
        const params = new URLSearchParams(window.location.search);
        if (params.has('vid')) {
            window.history.replaceState({}, '', window.location.pathname);
        }
        setCode(saved || problem.starterCode);
        setProblemDetails({
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            starterCode: { cpp: problem.starterCode },
            description: problem.description,
            examples: problem.examples,
            constraints: problem.constraints,
            source: 'SWE180',
            url: problem.url,
        });
        setActiveTab('description');
    };

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

    const renderPlaybackControls = () => {
        return (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-[760px]">
                <div className="liquid-glass-card bg-surface/85 backdrop-blur-xl border border-border-subtle shadow-2xl rounded-2xl px-6 py-3 flex items-center justify-between gap-6 select-none">
                    {/* Left Section: Playback buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={prevStep}
                            disabled={!hasSteps || currentStepIndex <= 0}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-border-subtle text-text-secondary hover:text-text-primary hover:border-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            title="Previous Step"
                        >
                            <SkipBack size={16} />
                        </button>
                        <button
                            onClick={togglePlay}
                            disabled={!hasSteps}
                            className={`group relative w-24 h-9 flex items-center justify-center gap-1.5 rounded-xl font-black text-[9px] tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed border overflow-hidden active:scale-95 ${
                                isPlaying
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                                    : 'bg-primary/10 border-primary/40 text-primary hover:bg-primary/20'
                            }`}
                        >
                            {isPlaying ? <><Pause size={14} fill="currentColor" /> PAUSE</> : <><Play size={14} fill="currentColor" /> PLAY</>}
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={!hasSteps || currentStepIndex >= stepsArray.length - 1}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-border-subtle text-text-secondary hover:text-text-primary hover:border-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            title="Next Step"
                        >
                            <SkipForward size={16} />
                        </button>
                        <button
                            onClick={reset}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-border-subtle text-text-secondary hover:text-accent-red hover:border-accent-red transition-all shadow-md active:scale-95"
                            title="Reset Visualization"
                        >
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    {/* Center Section: Step Progression Slider */}
                    <div className="flex-1 flex items-center gap-4 min-w-0">
                        {hasSteps ? (
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Step Progression</span>
                                    <span className="text-[9px] font-black text-primary font-mono">{currentStepIndex + 1} / {stepsArray.length}</span>
                                </div>
                                <div className="relative h-1.5 rounded-full bg-border-subtle cursor-pointer group">
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
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-xl transition-all duration-100 pointer-events-none z-20 border border-primary"
                                        style={{ left: `${stepsArray.length > 1 ? (currentStepIndex / (stepsArray.length - 1)) * 100 : 0}%`, transform: 'translate(-50%, -50%)' }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col gap-1.5 opacity-30">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Awaiting Trace</span>
                                </div>
                                <div className="h-1 rounded-full bg-border-subtle" />
                            </div>
                        )}
                    </div>

                    {/* Right Section: Speed Controls */}
                    <div className="flex items-center gap-4 shrink-0 border-l border-border-subtle pl-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Speed</span>
                                <span className="text-[9px] font-black text-accent-cyan font-mono">{speedLabel}</span>
                            </div>
                            <div className="relative w-24">
                                <input
                                    type="range"
                                    min={50}
                                    max={1000}
                                    step={50}
                                    value={1050 - speed}
                                    onChange={e => setSpeed(1050 - Number(e.target.value))}
                                    className="w-full h-1 appearance-none bg-border-subtle rounded-full cursor-pointer
                                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 
                                               [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full 
                                               [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:cursor-pointer
                                               [&::-webkit-slider-thumb]:shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-transparent overflow-hidden font-sans text-text-primary">

            {/* ── PREMIUM HEADER ─────────────────────────────────────────── */}
            <header className="flex-none h-14 bg-bg-header backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6 z-40 shrink-0">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-300">
                            <Cpu size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base leading-none tracking-tighter text-white">
                                Code<span className="text-primary">Flow</span>
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-bold leading-none mt-0.5">Visualizer</span>
                        </div>
                    </Link>

                    <div className="h-6 w-px bg-border-subtle" />

                    {/* Language Selector */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle hover:border-primary transition-all text-[11px] font-bold text-text-secondary hover:text-text-primary group">
                            <Layers size={14} className="text-primary group-hover:scale-110 transition-transform" />
                            {selectedLanguage}
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* Complexity Button */}
                    <button 
                        onClick={() => setComplexityOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/50 transition-all text-[11px] font-black text-primary hover:text-text-primary group"
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
                            className="p-2.5 text-text-muted hover:text-text-primary bg-surface border border-border-subtle hover:border-border-active rounded-xl transition-all"
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

                    {/* Profile Dropdown Section */}
                    {user ? (
                        <div className="relative shrink-0 flex items-center" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 pr-1 sm:pr-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 group cursor-pointer"
                            >
                                <div className="relative">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-black text-white">
                                            {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-bg-main rounded-full" />
                                </div>
                                <ChevronDown size={12} className={`text-text-muted group-hover:text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-14 w-64 bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl z-[60] top-0"
                                    >
                                        {/* User Info */}
                                        <div className="px-4 py-3 mb-1 text-left">
                                            <div className="flex items-center gap-3">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xs">
                                                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="min-w-0 text-left">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-white font-bold text-sm truncate">{user.displayName || 'User'}</p>
                                                        <Link to="/profile-settings" onClick={() => setIsProfileOpen(false)} className="text-text-muted hover:text-primary transition-colors shrink-0" title="Edit Profile">
                                                            <Edit3 size={13} />
                                                        </Link>
                                                    </div>
                                                    <p className="text-text-muted text-xs truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-white/5 pt-1 space-y-0.5 text-left">
                                            <DropdownItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" description="Your visualizations & stats" onClick={() => setIsProfileOpen(false)} />
                                            <DropdownItem to="/dashboard" icon={BookOpen} label="Saved Visualizations" onClick={() => setIsProfileOpen(false)} />
                                            <DropdownItem to="/sheet" icon={Star} label="Learning Progress" description="Track DSA topics" onClick={() => setIsProfileOpen(false)} />
                                            <DropdownItem to="/blog" icon={Newspaper} label="Blog" description="Insights & interview experiences" onClick={() => setIsProfileOpen(false)} />
                                            <DropdownItem to="/algorithm" icon={Brain} label="Algorithm Guide" description="Master core patterns" onClick={() => setIsProfileOpen(false)} />
                                        </div>

                                        <div className="border-t border-white/5 mt-1 pt-1 space-y-0.5 text-left">
                                            <DropdownItem to="/docs" icon={FileText} label="Documentation" onClick={() => setIsProfileOpen(false)} />
                                            <DropdownItem to="/contact" icon={Bookmark} label="Feedback & Suggestions" onClick={() => setIsProfileOpen(false)} />
                                            <DropdownItem to="/profile-settings" icon={Settings} label="Settings" description="Theme & preferences" onClick={() => setIsProfileOpen(false)} />
                                        </div>

                                        <div className="border-t border-white/5 mt-1 pt-1 text-left">
                                            <DropdownItem
                                                icon={LogOut}
                                                label="Sign Out"
                                                danger
                                                onClick={async () => {
                                                    setIsProfileOpen(false);
                                                    await logout();
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary hover:text-white text-primary text-xs font-black tracking-wide transition-all active:scale-95 shadow-md shadow-primary/5 shrink-0"
                        >
                            <User size={14} />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>
            </header>

            {/* ── MAIN WORKSPACE ─────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden min-h-0 relative">
                
                {/* ── LEFT PANEL: Tabs + Content ─────────────────────────── */}
                <div className={`flex flex-col shrink-0 bg-bg-panel/75 backdrop-blur-xl border-r border-border-subtle transition-all duration-500 ease-in-out ${
                    leftPanelOpen ? 'w-[440px]' : 'w-0 overflow-hidden opacity-0'
                }`}>
                    {/* Tabs */}
                    <div className="flex items-center p-1.5 bg-surface border-b border-border-subtle gap-1.5">
                        {/* Three line component which opens DSA sheet */}
                        <button 
                            onClick={() => setDsaDrawerOpen(true)}
                            className="p-2 rounded-lg bg-surface border border-border-subtle text-text-muted hover:text-text-primary hover:bg-border-subtle/10 transition-all active:scale-95 shrink-0 flex items-center justify-center"
                            title="Open DSA Sheet"
                        >
                            <Menu size={14} />
                        </button>
                        
                        <button 
                            onClick={() => setActiveTab('description')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'description' 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-text-muted hover:text-text-primary hover:bg-border-subtle/10'
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
                                : 'text-text-muted hover:text-text-primary hover:bg-border-subtle/10'
                            }`}
                        >
                            <Code2 size={14} />
                            Editor
                        </button>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {activeTab === 'description' && (
                                <motion.div 
                                    key="desc"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full"
                                >
                                    <ProblemDescription problem={problemDetails} />
                                </motion.div>
                            )}
                            {activeTab === 'editor' && (
                                <motion.div 
                                    key="editor"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full flex flex-col relative"
                                >
                                    <div className="flex items-center justify-between px-6 py-3 border-b border-border-subtle shrink-0 bg-surface/10">
                                        <div className="flex items-center gap-2.5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex-wrap">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span> {problemDetails ? problemDetails.title : 'Playground (Untitled)'}</span>
                                            {problemDetails && (
                                                <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-tighter normal-case shrink-0 ${
                                                    problemDetails.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    problemDetails.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                    {problemDetails.difficulty}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={requestTrace}
                                                className="group relative flex items-center gap-2 px-4 py-1.5 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary hover:text-text-primary hover:border-secondary transition-all text-[10px] font-black overflow-hidden"
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
                    className="flex-none self-stretch w-4 bg-surface/10 border-r border-border-subtle hover:bg-surface/20 flex items-center justify-center text-text-muted hover:text-primary transition-all group z-30"
                    title={leftPanelOpen ? 'Collapse Panel' : 'Expand Panel'}
                >
                    <div className="w-px h-12 bg-border-subtle group-hover:bg-primary transition-colors" />
                    <div className="absolute flex flex-col gap-1 items-center">
                        {leftPanelOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
                    </div>
                </button>

                {/* ── RIGHT PANEL: Visualizer ─────────────────────────────── */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-transparent relative">
                    
                    <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="flex items-center justify-between px-8 py-3 border-b border-border-subtle bg-surface/30 shrink-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <MousePointer2 size={14} className="text-text-muted" />
                                <span className="font-black text-text-muted uppercase tracking-[0.2em] text-[10px]">Canvas Visualizer</span>
                            </div>
                            
                            {hasSteps && currentTraceStep && (
                                <>
                                    <div className="h-4 w-px bg-border-subtle" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-primary font-black font-mono text-[11px] tracking-tight">
                                            {currentStepIndex + 1} <span className="text-text-muted font-medium mx-1">/</span> {stepsArray.length}
                                        </span>
                                        {currentPattern && (
                                            <span className="px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-tighter border border-border-subtle"
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
                                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-border-subtle/10 transition-all group"
                                title="Fullscreen (F)"
                            >
                                <Maximize2 size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle text-[10px] font-bold text-text-muted">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                LIVE SYNC
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-hidden relative z-0 bg-transparent">
                        <WhiteboardPanel />
                        {renderPlaybackControls()}
                    </div>

                    <motion.div 
                        animate={{ height: logicPanelOpen ? 220 : 44 }}
                        className="border-t border-border-subtle shrink-0 flex flex-col bg-bg-panel/75 backdrop-blur-xl z-20 overflow-hidden"
                    >
                        <div
                            className="flex items-center justify-between px-8 cursor-pointer h-11 shrink-0 hover:bg-border-subtle/20 transition-colors select-none"
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
                                <span className="text-[9px] font-black px-2 py-0.5 bg-surface text-text-secondary rounded border border-border-subtle tracking-widest uppercase">
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
                                                <p className="text-sm font-bold text-text-primary leading-relaxed font-mono whitespace-pre-wrap">
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
                            {renderPlaybackControls()}
                        </div>

                        {/* Controls on top with very high z-index */}
                        <div className="absolute top-6 right-6 z-[300] flex items-center gap-3">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] bg-bg-panel/90 px-4 py-2 rounded-xl border border-border-subtle backdrop-blur-xl shadow-2xl">
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
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                topicViewed={problemDetails?.title || 'Algorithm Workspace'}
            />
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
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
            />

            {/* Sliding Drawer for DSA Sheet */}
            <AnimatePresence>
                {dsaDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDsaDrawerOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-sm"
                        />
                        
                        {/* Sliding Panel */}
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[440px] max-w-[90%] bg-bg-panel/95 backdrop-blur-2xl border-r border-border-subtle z-[160] flex flex-col shadow-2xl overflow-hidden text-text-primary"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0">
                                <div className="flex items-center gap-2">
                                    <Trophy size={18} className="text-primary animate-pulse" />
                                    <span className="font-black text-sm uppercase tracking-wider text-text-primary">DSA Sheet Explorer</span>
                                </div>
                                <button 
                                    onClick={() => setDsaDrawerOpen(false)}
                                    className="p-2 rounded-lg hover:bg-surface border border-transparent hover:border-border-subtle text-text-muted hover:text-text-primary transition-all active:scale-95 flex items-center justify-center"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                            </div>
                            
                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <CuratedSheetDrawerContent onSelectProblem={(problem) => {
                                    loadProblem(problem);
                                    setDsaDrawerOpen(false);
                                }} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function CuratedSheetDrawerContent({ onSelectProblem }: { onSelectProblem: (p: any) => void }) {
    const { user } = useAuthStore();
    const { completed, toggleCompletion } = useProgressStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    
    // Stable list of unique categories
    const categories = useMemo(() => {
        return Array.from(new Set((problemsList || []).map(p => p.category || 'Uncategorized')));
    }, []);

    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');

    const categoriesStats = useMemo(() => {
        const stats: Record<string, { total: number; completedCount: number; percent: number }> = {};
        
        (problemsList || []).forEach(problem => {
            const cat = problem.category || 'Uncategorized';
            if (!stats[cat]) {
                stats[cat] = { total: 0, completedCount: 0, percent: 0 };
            }
            stats[cat].total += 1;
            if (completed[problem.id]) {
                stats[cat].completedCount += 1;
            }
        });

        Object.keys(stats).forEach(cat => {
            const s = stats[cat];
            s.percent = s.total > 0 ? Math.round((s.completedCount / s.total) * 100) : 0;
        });

        return stats;
    }, [completed]);

    const filteredProblems = useMemo(() => {
        const catProblems = (problemsList || []).filter(p => (p.category || 'Uncategorized') === selectedCategory);
        return catProblems.filter(problem => {
            const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'All' || problem.difficulty === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [selectedCategory, searchQuery, activeFilter]);

    return (
        <div className="space-y-6">
            {/* Category selection dropdown */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Category</label>
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-surface border border-border-subtle rounded-xl py-3 px-4 text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer appearance-none"
                    >
                        {categories.map(cat => {
                            const stats = categoriesStats[cat] || { total: 0, completedCount: 0, percent: 0 };
                            return (
                                <option key={cat} value={cat} className="bg-bg-panel text-text-primary">
                                    {cat} ({stats.completedCount}/{stats.total} completed)
                                </option>
                            );
                        })}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="space-y-3">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                        type="text"
                        placeholder="Search problems..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all shrink-0 ${
                                activeFilter === filter 
                                ? 'bg-primary text-white border border-primary' 
                                : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-border-subtle/20 border border-border-subtle'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Problems List */}
            <div className="space-y-2.5">
                {filteredProblems.map((problem) => (
                    <div 
                        key={problem.id} 
                        onClick={() => onSelectProblem(problem)}
                        className="group liquid-glass-card hover:border-primary/50 transition-all duration-300 relative overflow-hidden border border-border-subtle p-4 flex flex-col justify-between h-32 cursor-pointer bg-surface/20"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCompletion(problem.id, user);
                                    }}
                                    className={`mt-0.5 relative w-5 h-5 rounded flex items-center justify-center transition-all duration-300 border-2 shrink-0 ${
                                        completed[problem.id] 
                                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_8px_rgba(123,116,209,0.3)]' 
                                        : 'border-border-subtle text-transparent hover:border-text-muted'
                                    }`}
                                >
                                    <CheckCircle size={12} className={completed[problem.id] ? "scale-100" : "scale-0"} />
                                </button>
                                
                                <div className="min-w-0">
                                    <h4 className={`text-sm font-black tracking-tight leading-snug transition-all duration-300 ${
                                        completed[problem.id] 
                                        ? 'text-text-muted line-through opacity-50' 
                                        : 'text-text-primary group-hover:text-primary'
                                    }`}>
                                        {problem.title}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                problem.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                problem.difficulty === 'Medium' ? 'border-orange-500/30 text-orange-400 bg-orange-500/5' :
                                'border-red-500/30 text-red-400 bg-red-500/5'
                            }`}>
                                {problem.difficulty}
                            </span>

                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1 text-[9px] font-black text-white bg-primary px-3 py-1.5 rounded-md transition-all shadow-md shadow-primary/20 opacity-0 group-hover:opacity-100"
                            >
                                <Play size={8} fill="currentColor" /> 
                                <span>Visualize</span>
                                <ChevronRight size={8} />
                            </motion.button>
                        </div>
                    </div>
                ))}

                {filteredProblems.length === 0 && (
                    <div className="text-center py-10 border border-border-subtle rounded-2xl bg-surface/10">
                        <p className="text-xs text-text-muted">No matches found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
