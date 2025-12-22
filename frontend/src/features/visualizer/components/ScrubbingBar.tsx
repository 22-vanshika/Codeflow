import React from 'react';
import { useExecutionStore } from '../../../store/executionStore';

export default function ScrubbingBar() {
    const { traces, currentStepIndex, setStep, speed, setSpeed } = useExecutionStore();

    // Scrubbing bar calculation
    const progress = traces.length > 1 ? (currentStepIndex / (traces.length - 1)) * 100 : 0;

    const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setStep(Math.floor((val / 100) * (traces.length - 1)));
    };

    return (
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
    );
}
