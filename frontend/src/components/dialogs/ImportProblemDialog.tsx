import { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { useExecutionStore } from '../../store/executionStore';

interface ImportProblemDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess: (data: any) => void;
}

export default function ImportProblemDialog({ isOpen, onClose, onImportSuccess }: ImportProblemDialogProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setCode } = useExecutionStore();

    if (!isOpen) return null;

    const handleImport = async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Using absolute URL to ensure it hits the backend correctly in dev
            const response = await fetch('http://localhost:3000/api/problems/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to import problem');
            }

            // Set the editor code
            setCode(result.data.starterCode.cpp);
            
            // Pass data up to Workspace
            onImportSuccess(result.data);
            
            // Clean up and close
            setUrl('');
            onClose();

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-bg-panel border border-border-subtle rounded-xl w-[500px] shadow-2xl animate-slide-up overflow-hidden">
                <div className="h-12 border-b border-border-subtle flex items-center justify-between px-4 bg-bg-main/50">
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                        <Search size={16} className="text-accent-primary" />
                        Import Problem
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-white/5 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-text-muted mb-4">
                        Paste a LeetCode problem URL to automatically pull the description and starter code into the workspace.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2" htmlFor="problem-url">
                                Problem URL
                            </label>
                            <input
                                id="problem-url"
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://leetcode.com/problems/two-sum/"
                                className="w-full bg-bg-main border border-border-subtle rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder:text-text-muted/50"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="text-xs text-red-500 bg-red-500/10 p-2 rounded-md border border-red-500/20">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-14 border-t border-border-subtle bg-bg-main/30 flex items-center justify-end px-4 gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleImport}
                        disabled={loading || !url.trim()}
                        className="px-5 py-2 text-sm font-medium bg-accent-primary text-bg-main rounded-md hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-glow"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Importing...
                            </>
                        ) : (
                            'Import'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
