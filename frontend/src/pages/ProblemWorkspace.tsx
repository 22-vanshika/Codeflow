import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useExecutionStore } from '../store/executionStore';
import VisualizerHeader from '../features/visualizer/components/VisualizerHeader';
import ScrubbingBar from '../features/visualizer/components/ScrubbingBar';
import CodeEditor from '../features/visualizer/components/CodeEditor';
import InputPanel from '../components/panels/InputPanel';
import WhiteboardPanel from '../components/panels/WhiteboardPanel';
import OutputPanel from '../components/panels/OutputPanel';
import FixPermissionDialog from '../components/dialogs/FixPermissionDialog';
import ImportProblemDialog from '../components/dialogs/ImportProblemDialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, RotateCw, Play, PanelLeftClose, PanelLeftOpen, Download, Eraser } from 'lucide-react';

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
    const { connect, isConnected, reset, executeRealCode, error, setCode, code } = useExecutionStore();
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [problemDetails, setProblemDetails] = useState<ProblemData | null>(null);
    const location = useLocation();
    const hasAutoImported = useRef(false);
    const [showSaveToast, setShowSaveToast] = useState(false);

    const handleSaveCode = () => {
        if (problemDetails?.id || location.state?.autoImportUrl) {
            const id = problemDetails?.id || 'custom';
            localStorage.setItem(`codeflow_saved_code_${id}`, code);
            setShowSaveToast(true);
            setTimeout(() => setShowSaveToast(false), 2000);
        } else {
            localStorage.setItem(`codeflow_saved_code_scratchpad`, code);
            setShowSaveToast(true);
            setTimeout(() => setShowSaveToast(false), 2000);
        }
    };

    const handleResetCode = () => {
        if (problemDetails?.starterCode?.cpp) {
            if (window.confirm("Are you sure you want to reset to the starter code? All unsaved changes will be lost.")) {
                setCode(problemDetails.starterCode.cpp);
                reset(); // clear output
            }
        } else {
             if (window.confirm("Are you sure you want to reset the editor? All unsaved changes will be lost.")) {
                 setCode(`int main() {\n  \n  return 0;\n}`);
                 reset(); // clear output
             }
        }
    };

    useEffect(() => {
        connect();
    }, [connect]);

    useEffect(() => {
        const autoImportUrl = location.state?.autoImportUrl;
        if (autoImportUrl && !hasAutoImported.current) {
            hasAutoImported.current = true;
            // Trigger import silently
            const fetchProblem = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/problems/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: autoImportUrl })
                    });
                    const result = await response.json();
                    if (result.success) {
                        // Check if we have saved code for this
                        const savedCode = localStorage.getItem(`codeflow_saved_code_${result.data.id || 'custom'}`);
                        if (savedCode) {
                            setCode(savedCode);
                        } else {
                            setCode(result.data.starterCode.cpp);
                        }
                        setProblemDetails(result.data);
                    }
                } catch (err) {
                    console.error('Auto-import failed:', err);
                }
            };
            fetchProblem();
        }
    }, [location, setCode]);

    return (
        <div className="h-screen w-screen flex flex-col bg-bg-main overflow-hidden font-sans relative pt-14">
            {/* Error Toast */}
            {(!isConnected || error) && (
                <div className="absolute top-16 right-6 z-50 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <div>
                        <p className="font-bold text-xs uppercase">
                            {!isConnected ? "Connection Error" : "Execution Error"}
                        </p>
                        <p className="text-xs">{error || "Backend Disconnected"}</p>
                    </div>
                    {!isConnected && (
                        <button onClick={connect} className="ml-4 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
                            Retry
                        </button>
                    )}
                </div>
            )}

            {showSaveToast && (
                <div className="absolute top-16 right-1/2 translate-x-1/2 z-50 bg-green-500/10 border border-green-500 text-green-400 px-4 py-2 rounded-lg shadow-lg backdrop-blur-md flex items-center space-x-2 animate-slide-down">
                    <span className="font-bold text-xs">Code Saved Successfully!</span>
                </div>
            )}

            <VisualizerHeader />
            
            {/* Action Bar Header Layer (beneath visualizer header but above workspace) */}
            <div className="h-10 bg-bg-panel border-b border-border-subtle flex items-center px-4 justify-between z-30">
                 <div className="flex items-center gap-4">
                     {problemDetails && (
                         <span className="text-sm font-semibold text-text-primary px-2 py-1 bg-bg-main rounded-md border border-border-subtle">
                             {problemDetails.title}
                             <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                 problemDetails.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                 problemDetails.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                                 'bg-red-500/20 text-red-400'
                             }`}>
                                 {problemDetails.difficulty}
                             </span>
                         </span>
                     )}
                 </div>
                 <div>
                     <button
                         onClick={() => setIsImportOpen(true)}
                         className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-text-primary rounded-md transition-colors border border-border-subtle"
                     >
                         <Download size={14} className="text-accent-purple" />
                         Import LeetCode
                     </button>
                 </div>
            </div>

            {/* Main Split Layout */}
            <div className="flex-1 flex overflow-hidden relative bg-bg-main">
                
                {/* PANEL 1: Problem Description (Left View - Toggleable) */}
                <div 
                    className={`transition-all duration-300 ease-in-out flex flex-col border-r border-border-subtle bg-bg-panel z-20 shrink-0 ${leftPanelOpen ? 'w-[350px]' : 'w-0 overflow-hidden'}`}
                >
                    <div className="h-10 border-b border-border-subtle flex items-center justify-between px-4 bg-bg-main/50 sticky top-0">
                        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                            Problem Description
                        </span>
                        <button onClick={() => setLeftPanelOpen(false)} className="text-text-muted hover:text-text-primary">
                            <PanelLeftClose size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 prose prose-invert prose-sm max-w-none prose-pre:bg-bg-main prose-pre:border prose-pre:border-border-subtle prose-a:text-accent-primary">
                        {problemDetails ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {problemDetails.description}
                            </ReactMarkdown>
                        ) : (
                            <div className="animate-pulse">
                                <div className="h-6 bg-border-subtle rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-bg-main rounded w-full mb-2"></div>
                                <div className="h-4 bg-bg-main rounded w-5/6 mb-2"></div>
                                <div className="h-4 bg-bg-main rounded w-full mb-6"></div>
                                <div className="h-32 bg-bg-main rounded w-full mb-4 opacity-50"></div>
                                <p className="text-text-muted text-sm text-center mt-10">Select a problem or click "Import LeetCode" to begin.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* PANEL 2: Code Editor (Middle View) */}
                <div className="w-[400px] flex flex-col border-r border-border-subtle bg-bg-panel z-10 shrink-0 relative">
                    {/* Toggle Button when Left Panel is Closed */}
                    {!leftPanelOpen && (
                        <button 
                            onClick={() => setLeftPanelOpen(true)} 
                            className="absolute -left-3 top-2 bg-border-subtle text-text-primary p-1 rounded-r-md z-50 hover:bg-accent-primary hover:text-bg-main shadow-md transition-colors"
                        >
                            <PanelLeftOpen size={16} />
                        </button>
                    )}
                    
                    <div className="flex-[2] flex flex-col min-h-0">
                        <div className="h-10 border-b border-border-subtle flex items-center justify-between pl-8 pr-4 bg-bg-main/50">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                                Code Editor
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={executeRealCode}
                                    className="p-1.5 bg-accent-green/10 text-accent-green hover:bg-accent-green/20 rounded-md transition-all flex items-center gap-1 px-3"
                                    title="Run Code (Real Execution)"
                                >
                                    <Play size={14} fill="currentColor" />
                                    <span className="text-xs font-bold">RUN</span>
                                </button>
                                <div className="w-px h-4 bg-border-subtle mx-1" />
                                <button onClick={reset} className="p-1.5 bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 rounded-md transition-all" title="Clear Output & Traces">
                                    <Eraser size={14} />
                                </button>
                                <button onClick={handleSaveCode} className="p-1.5 bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 rounded-md transition-all" title="Save Code Locally">
                                    <Save size={14} />
                                </button>
                                <button onClick={handleResetCode} className="p-1.5 bg-accent-red/10 text-accent-red hover:bg-accent-red/20 rounded-md transition-all" title="Reset to Starter Code">
                                    <RotateCw size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <CodeEditor />
                        </div>
                    </div>

                    {/* Input Panel */}
                    <div className="h-[200px] flex flex-col border-t border-border-subtle min-h-0">
                        <div className="h-9 border-b border-border-subtle flex items-center px-4 bg-bg-main/50">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Test Cases</span>
                        </div>
                        <div className="flex-1 relative">
                            <InputPanel />
                        </div>
                    </div>
                </div>

                {/* PANEL 3: Visualizer & Output (Right View) */}
                <div className="flex-1 flex flex-col relative min-w-0 bg-bg-main">
                    <WhiteboardPanel />
                    <OutputPanel />
                </div>

                <FixPermissionDialog />
                <ImportProblemDialog 
                    isOpen={isImportOpen} 
                    onClose={() => setIsImportOpen(false)} 
                    onImportSuccess={(data) => setProblemDetails(data)}
                />
            </div>

            <ScrubbingBar />
        </div>
    );
}
