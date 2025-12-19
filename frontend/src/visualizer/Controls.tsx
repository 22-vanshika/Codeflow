import { Play, Pause, SkipForward, SkipBack, Zap, RefreshCw, Activity } from 'lucide-react';
import { useExecutionStore } from '../store/executionStore';

export default function Controls() {
    const {
        runCode, nextStep, prevStep, togglePlay, isPlaying,
        isConnected, traces, currentStepIndex, speed, setSpeed,
        code
    } = useExecutionStore();

    const isRunDisabled = !isConnected;
    const isNavDisabled = traces.length === 0;

    // Calculate progress
    const progress = traces.length > 0 ? (currentStepIndex / (traces.length - 1)) * 100 : 0;

    return (
        <div className="bg-surfaceHighlight border-t border-white/5 p-4 flex flex-col space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-30">

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative group cursor-pointer">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={runCode}
                        disabled={isRunDisabled}
                        className={`
                group relative flex items-center justify-center h-10 px-4 rounded-lg font-bold text-sm transition-all duration-200
                ${isRunDisabled
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]'}
              `}
                    >
                        <Zap size={16} className={`mr-2 ${!isRunDisabled && 'group-hover:text-yellow-300 transition-colors'}`} />
                        Run Code
                    </button>

                    <div className={`p-2 rounded-full border ${isConnected ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                        <Activity size={14} className={isConnected ? 'text-green-400' : 'text-red-400'} />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={prevStep} disabled={isNavDisabled || currentStepIndex <= 0} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                        <SkipBack size={18} />
                    </button>

                    <button
                        onClick={togglePlay}
                        disabled={isNavDisabled}
                        className={`
                    w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 shadow-lg
                    ${isPlaying
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
                                : 'bg-white text-black hover:bg-gray-100 hover:scale-105'}
                    disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-500 disabled:hover:scale-100 disabled:border-none
                `}
                    >
                        {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                    </button>

                    <button onClick={nextStep} disabled={isNavDisabled || currentStepIndex >= traces.length - 1} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                        <SkipForward size={18} />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Speed</span>
                <div className="flex items-center space-x-2 w-32">
                    <span className="text-[10px] uppercase font-bold">Fast</span>
                    <input
                        type="range"
                        min="50"
                        max="1000"
                        step="50"
                        value={1050 - speed}
                        onChange={(e) => setSpeed(1050 - Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-[10px] uppercase font-bold">Slow</span>
                </div>
            </div>
        </div>
    );
}
