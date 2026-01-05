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

                <ExecutionControls />


            </div>

            {/* Center: Title */}
            <div className="absolute left-1/2 -translate-x-1/2 text-text-muted font-bold tracking-[0.2em] text-sm uppercase">
                Memory Visualization
            </div>

            {/* Right: Trace Control */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={requestTrace}
                    className="px-4 py-1.5 bg-accent-orange/10 border border-accent-orange/50 text-accent-orange rounded text-sm font-bold hover:bg-accent-orange/20 transition-colors flex items-center gap-1"
                    title="Visualize Execution"
                >
                    <Sparkles size={14} />
                    TRACE
                </button>
            </div>
        </header>
    );
}
