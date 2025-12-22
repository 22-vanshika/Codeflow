import { useEffect } from 'react';
import { useExecutionStore } from '../store/executionStore';
import VisualizerHeader from '../features/visualizer/components/VisualizerHeader';
import VisualizerLayout from '../features/visualizer/components/VisualizerLayout';
import ScrubbingBar from '../features/visualizer/components/ScrubbingBar';

export default function Visualizer() {
    const { connect, isConnected } = useExecutionStore();

    useEffect(() => {
        connect();
    }, [connect]);

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

            <VisualizerHeader />
            <VisualizerLayout />
            <ScrubbingBar />
        </div>
    );
}



