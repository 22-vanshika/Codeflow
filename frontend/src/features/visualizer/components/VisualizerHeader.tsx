import { RotateCw, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExecutionStore } from '../../../store/executionStore';
import ExecutionControls from './ExecutionControls';

export default function VisualizerHeader() {
    const { connect, isConnected, runCode, reset, traces, traceSteps, requestTrace } = useExecutionStore();

    const hasExecution = traces.length > 0 || traceSteps.length > 0;

    return (
        <header className="h-14 bg-bg-header border-b border-border-subtle flex items-center justify-between px-6 z-20">
            {/* Left: Controls Group */}
            <div className="flex items-center space-x-2">
                <button onClick={connect} className="p-2 rounded hover:bg-white/5 text-accent-cyan" title="Reset/Reconnect">
                    <RotateCw size={18} className={!isConnected ? 'opacity-50' : ''} />
                </button>
                <div className="h-6 w-px bg-border-subtle mx-2"></div>

                <ExecutionControls />

                <div className="ml-4 flex gap-2">
                    {hasExecution ? (
                        <button
                            onClick={reset}
                            className="px-4 py-1.5 bg-accent-purple/10 border border-accent-purple/50 text-accent-purple rounded text-sm font-bold hover:bg-accent-purple/20 transition-colors"
                        >
                            EDIT CODE
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={runCode}
                                className="px-4 py-1.5 bg-accent-primary/10 border border-accent-primary/50 text-accent-primary rounded text-sm font-bold hover:bg-accent-primary/20 transition-colors"
                            >
                                RUN CODE
                            </button>
                            <button
                                onClick={requestTrace}
                                className="px-4 py-1.5 bg-accent-orange/10 border border-accent-orange/50 text-accent-orange rounded text-sm font-bold hover:bg-accent-orange/20 transition-colors flex items-center gap-1"
                                title="Blackboard-style step-by-step visualization"
                            >
                                <Sparkles size={14} />
                                TRACE
                            </button>
                        </>
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
    );
}
