import React, { useEffect } from 'react';
import { useExecutionStore } from '../store/executionStore';
import CodeEditor from '../editor/CodeEditor';
import InputPanel from '../components/panels/InputPanel';
import VariablesPanel from '../components/panels/VariablesPanel';
import CallStackPanel from '../components/panels/CallStackPanel';
import MemoryPanel from '../components/panels/MemoryPanel';
import { Play, Pause, SkipBack, SkipForward, RotateCw, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Visualizer() {
    const {
        connect, traces, currentStepIndex,
        runCode, togglePlay, isPlaying, nextStep, prevStep,
        setStep, speed, setSpeed, isConnected, reset
    } = useExecutionStore();

    const currentTrace = traces[currentStepIndex];
    const explanation = currentTrace?.explanation || "Ready to execute...";
    const stack = currentTrace?.stack || [];

    useEffect(() => {
        connect();
    }, [connect]);

    // Scrubbing bar calculation
    const progress = traces.length > 1 ? (currentStepIndex / (traces.length - 1)) * 100 : 0;

    const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setStep(Math.floor((val / 100) * (traces.length - 1)));
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-bg-main overflow-hidden font-sans relative pt-14">
            {/* Error Toast */}
            {(!isConnected || useExecutionStore.getState().error) && (
                <div className="absolute top-16 right-6 z-50 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <div>
                        <p className="font-bold text-xs uppercase">
                            {!isConnected ? "Connection Error" : "Execution Error"}
                        </p>
                        <p className="text-xs">{useExecutionStore.getState().error || "Backend Disconnected"}</p>
                    </div>
                    {!isConnected && (
                        <button onClick={connect} className="ml-4 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
                            Retry
                        </button>
                    )}
                </div>
            )}

            {/* 1. Header (Reference Style) */}
            <header className="h-14 bg-bg-header border-b border-border-subtle flex items-center justify-between px-6 z-20">
                {/* Left: Controls Group */}
                <div className="flex items-center space-x-2">
                    <button onClick={connect} className="p-2 rounded hover:bg-white/5 text-accent-cyan" title="Reset/Reconnect">
                        <RotateCw size={18} className={!isConnected ? 'opacity-50' : ''} />
                    </button>
                    <div className="h-6 w-px bg-border-subtle mx-2"></div>

                    <ControlBtn onClick={prevStep} icon={<SkipBack size={18} />} disabled={currentStepIndex <= 0} />
                    <ControlBtn
                        onClick={togglePlay}
                        icon={isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        active={isPlaying}
                        className={isPlaying ? 'text-accent-cyan ring-1 ring-accent-cyan/50' : ''}
                    />
                    <ControlBtn onClick={nextStep} icon={<SkipForward size={18} />} disabled={currentStepIndex >= traces.length - 1} />
                    <div className="ml-4">
                        {traces.length > 0 ? (
                            <button
                                onClick={reset}
                                className="px-4 py-1.5 bg-accent-purple/10 border border-accent-purple/50 text-accent-purple rounded text-sm font-bold hover:bg-accent-purple/20 transition-colors"
                            >
                                EDIT CODE
                            </button>
                        ) : (
                            <button
                                onClick={runCode}
                                className="px-4 py-1.5 bg-accent-primary/10 border border-accent-primary/50 text-accent-primary rounded text-sm font-bold hover:bg-accent-primary/20 transition-colors"
                            >
                                RUN CODE
                            </button>
                        )}
                    </div>
                </div>

                {/* Center: Title */}
                <div className="absolute left-1/2 -translate-x-1/2 text-text-muted font-bold tracking-[0.2em] text-sm uppercase">
                    Memory Visualization
                </div>

                {/* Right: Language & Close */}
                <div className="flex items-center space-x-4">
                    <div className="px-3 py-1 bg-bg-panel rounded text-xs font-mono text-text-muted border border-border-subtle flex items-center">
                        <span>C++</span>
                    </div>
                    <Link to="/" className="text-text-muted hover:text-white transition-colors">
                        <X size={20} />
                    </Link>
                </div>
            </header>

            {/* 2. Main Grid Layout */}
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

            {/* 3. Footer: Scrubbing & Speed */}
            <footer className="h-12 bg-bg-header border-t border-border-subtle flex items-center px-6 space-x-6 z-20">
                <div className="flex items-center space-x-4 flex-1">
                    <span className="text-xs text-text-muted font-bold whitespace-nowrap">Scrubbing Bar</span>
                    <div className="flex-1 relative h-6 flex items-center">
                        <div className="absolute left-0 right-0 h-1 bg-border-subtle rounded-full"></div>
                        <div
                            className="absolute left-0 h-1 bg-accent-cyan rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleScrub}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                            disabled={traces.length <= 1}
                        />
                        {/* Thumb Indicator */}
                        <div
                            className="absolute h-3 w-3 bg-accent-cyan rounded-full shadow-glow transform -translate-x-1/2 pointer-events-none transition-all duration-100 ease-linear"
                            style={{ left: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 w-48 border-l border-border-subtle pl-6">
                    <span className="text-xs text-text-muted font-bold">Speed</span>
                    <input
                        type="range"
                        min="50"
                        max="1000"
                        step="50"
                        value={1050 - speed}
                        onChange={(e) => setSpeed(1050 - Number(e.target.value))}
                        className="w-full h-1 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-text-muted"
                    />
                </div>
            </footer>
        </div>
    );
}

function ControlBtn({ onClick, icon, disabled, active, className }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                p-2 rounded border border-border-subtle bg-bg-panel hover:bg-border-subtle/50 hover:text-white transition-all
                disabled:opacity-30 disabled:cursor-not-allowed text-text-muted
                ${active ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/50' : ''}
                ${className}
            `}
        >
            {icon}
        </button>
    )
}


