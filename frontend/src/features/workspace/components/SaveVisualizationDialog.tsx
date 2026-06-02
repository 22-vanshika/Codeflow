import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, CheckCircle, Copy, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useExecutionStore } from '../../../store/executionStore';
import { useVisualizationStore } from '../../../store/visualizationStore';
import type { SavedVisualization } from '../../../store/visualizationStore';
import { API_URL } from '../../../config/api';

interface SaveVisualizationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    loadedVis?: SavedVisualization | null;
    onSaveSuccess?: (vis: SavedVisualization) => void;
}

export default function SaveVisualizationDialog({ isOpen, onClose, loadedVis, onSaveSuccess }: SaveVisualizationDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [overwriteMode, setOverwriteMode] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    
    const { user } = useAuthStore();
    const { code, traceSteps, traces, speed, input } = useExecutionStore();
    const updateVisualization = useVisualizationStore(s => s.updateVisualization);

    // Prefill title & description if loadedVis is active
    useEffect(() => {
        if (isOpen) {
            if (loadedVis) {
                setTitle(loadedVis.title);
                setDescription(loadedVis.description || '');
                // Default to overwrite mode if owned by the user
                const isOwner = user && loadedVis.userId === user.uid;
                setOverwriteMode(!!isOwner);
            } else {
                setTitle('');
                setDescription('');
                setOverwriteMode(false);
            }
            setError('');
            setSuccess(false);
        }
    }, [isOpen, loadedVis, user]);

    if (!isOpen) return null;

    const isOwner = user && loadedVis && loadedVis.userId === user.uid;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            setError("You must be logged in to save visualizations.");
            return;
        }

        const steps = traceSteps.length > 0 ? traceSteps : traces;
        const saveSteps = steps || [];

        setIsSaving(true);
        setError('');

        const settings = { speed, input };
        const metadata = loadedVis?.metadata || {};

        try {
            const token = await user.getIdToken();
            let savedVis: SavedVisualization;

            if (isOwner && overwriteMode && loadedVis) {
                // Update existing visualization
                savedVis = await updateVisualization(loadedVis._id, {
                    title,
                    description,
                    code,
                    traceSteps: saveSteps,
                    settings,
                    metadata
                }, token);
            } else {
                // Save new visualization
                const response = await fetch(`${API_URL}/api/visualizations/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        code,
                        language: 'cpp',
                        traceSteps: saveSteps,
                        isPublic: true,
                        settings,
                        metadata
                    })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to save visualization');
                }

                const resData = await response.json();
                savedVis = resData.visualization;
            }

            setSuccess(true);
            if (onSaveSuccess) {
                onSaveSuccess(savedVis);
            }
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md liquid-glass-card shadow-2xl overflow-hidden"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-border-subtle/20 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                <Save size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary">Save Visualization</h2>
                        </div>

                        {success ? (
                            <div className="flex flex-col items-center justify-center py-8 text-green-400">
                                <CheckCircle size={48} className="mb-4 animate-bounce" />
                                <p className="text-lg font-medium">Successfully saved project!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Choice: Overwrite or New copy */}
                                {isOwner && (
                                    <div className="flex items-center p-1 bg-surface rounded-xl border border-border-subtle mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setOverwriteMode(true)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                                                overwriteMode 
                                                ? 'bg-primary text-white shadow-lg' 
                                                : 'text-text-muted hover:text-text-primary'
                                            }`}
                                        >
                                            <RefreshCw size={14} />
                                            Update Existing
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOverwriteMode(false)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                                                !overwriteMode 
                                                ? 'bg-primary text-white shadow-lg' 
                                                : 'text-text-muted hover:text-text-primary'
                                            }`}
                                        >
                                            <Copy size={14} />
                                            Save As Copy
                                        </button>
                                    </div>
                                )}
                                
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Project Name</label>
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-surface border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary outline-none transition-all placeholder:text-text-muted/50"
                                        placeholder="e.g. Binary Search implementation"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Description (optional)</label>
                                    <textarea 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-surface border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary outline-none transition-all h-24 resize-none placeholder:text-text-muted/50"
                                        placeholder="Add some notes about this algorithm..."
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors mt-4 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? 'Saving...' : overwriteMode ? 'Update Visualization' : 'Save as New Project'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
