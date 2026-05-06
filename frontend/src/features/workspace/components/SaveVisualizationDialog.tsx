import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useExecutionStore } from '../../../store/executionStore';

interface SaveVisualizationDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SaveVisualizationDialog({ isOpen, onClose }: SaveVisualizationDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    
    const { user } = useAuthStore();
    const { code, traceSteps, traces } = useExecutionStore();

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            setError("You must be logged in to save visualizations.");
            return;
        }

        const steps = traceSteps.length > 0 ? traceSteps : traces;
        if (!steps || steps.length === 0) {
            setError("Please generate a trace before saving.");
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const token = await user.getIdToken();
            const response = await fetch('http://localhost:5000/api/visualizations/save', {
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
                    traceSteps: steps,
                    isPublic: true
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save visualization');
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);

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
                    className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-text-muted hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                <Save size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Save Visualization</h2>
                        </div>

                        {success ? (
                            <div className="flex flex-col items-center justify-center py-8 text-green-400">
                                <CheckCircle size={48} className="mb-4" />
                                <p className="text-lg font-medium">Successfully saved to your profile!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Title</label>
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white outline-none transition-all"
                                        placeholder="e.g. Binary Search implementation"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Description (optional)</label>
                                    <textarea 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white outline-none transition-all h-24 resize-none"
                                        placeholder="Add some notes about this algorithm..."
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors mt-4 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? 'Saving...' : 'Save to Profile'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
