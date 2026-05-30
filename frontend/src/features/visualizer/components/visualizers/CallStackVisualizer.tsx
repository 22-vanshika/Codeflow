import type { CallStackVisual } from '../../../../types';
import './visualizers.css';

interface CallStackVisualizerProps {
    visual: CallStackVisual;
    className?: string;
}

export default function CallStackVisualizer({ visual, className = '' }: CallStackVisualizerProps) {
    const { frames, activeFrame } = visual;

    return (
        <div className={`call-stack-visualizer ${className}`}>
            <div className="text-center mb-4">
                <span className="text-sm font-semibold text-accent-purple uppercase tracking-wider">
                    Call Stack
                </span>
            </div>

            <div className="call-stack">
                {frames.map((frame, index) => {
                    const isActive = index === activeFrame;
                    const argsStr = Object.entries(frame.args)
                        .filter(([k, v]) => {
                            if (k === 'this' || k.startsWith('__')) return false;
                            if (v !== null && typeof v === 'object' && !Array.isArray(v)) return false;
                            return true;
                        })
                        .map(([k, v]) => `${k}=${formatValue(v)}`)
                        .join(', ');

                    return (
                        <div
                            key={index}
                            className={`call-stack-frame ${isActive ? 'active' : ''}`}
                        >
                            <div className="call-stack-func-name">
                                {frame.functionName}({argsStr})
                            </div>
                            {frame.returnValue !== undefined && (
                                <div className="call-stack-args">
                                    → returns {formatValue(frame.returnValue)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Stack visualization labels */}
            <div className="flex justify-between text-xs text-text-muted mt-2 px-4">
                <span>← Bottom (first called)</span>
                <span>Top (most recent) →</span>
            </div>
        </div>
    );
}

function formatValue(value: any): string {
    if (value === null || value === undefined) return 'undefined';
    if (Array.isArray(value)) return `[${value.join(', ')}]`;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}
