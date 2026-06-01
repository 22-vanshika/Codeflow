import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, FileCode2, Loader2, Download } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useExecutionStore } from '../../../store/executionStore';

interface GitHubImportDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GitHubImportDialog({ isOpen, onClose }: GitHubImportDialogProps) {
    const [repos, setRepos] = useState<any[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { user } = useAuthStore();
    const { setCode } = useExecutionStore();

    useEffect(() => {
        if (isOpen && user) {
            // Ideally use the actual github token if we have it from Firebase OAuth
            // For now, if we don't have it, we might only be able to fetch public repos
            // or prompt user to re-authenticate with GitHub.
            fetchRepos();
        }
    }, [isOpen, user]);

    const fetchRepos = async () => {
        if (!user) return;
        setIsLoading(true);
        setError('');
        try {
            // In a real scenario, use the githubAccessToken.
            // Here we just fetch by GitHub username if available, or just fallback to public codeflow repo
            const res = await fetch(`https://api.github.com/users/anshikaasati/repos`);
            if (!res.ok) throw new Error('Failed to fetch repositories');
            const data = await res.json();
            setRepos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFiles = async (repoName: string) => {
        setSelectedRepo(repoName);
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`https://api.github.com/repos/anshikaasati/${repoName}/contents`);
            if (!res.ok) throw new Error('Failed to fetch repository contents');
            const data = await res.json();
            // Filter to only show code files (e.g. .cpp, .js, .py)
            const codeFiles = data.filter((f: any) => f.type === 'file' && f.name.endsWith('.cpp'));
            setFiles(codeFiles);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const importFile = async (downloadUrl: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(downloadUrl);
            const content = await res.text();
            setCode(content);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl liquid-glass-card shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                    <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#24292e] text-white rounded-lg border border-border-subtle">
                                <Github size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">Import from GitHub</h2>
                                <p className="text-xs text-text-muted">Select a C++ file to import into the workspace</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-border-subtle/20 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 flex gap-6">
                        {error && (
                            <div className="w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                                {error}
                            </div>
                        )}

                        {/* Repos List */}
                        <div className="w-1/2 flex flex-col border-r border-border-subtle pr-6">
                            <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">Repositories</h3>
                            {isLoading && repos.length === 0 ? (
                                <div className="flex items-center justify-center py-8 text-text-muted"><Loader2 className="animate-spin" /></div>
                            ) : (
                                <div className="space-y-2 overflow-y-auto pr-2">
                                    {repos.map(repo => (
                                        <button
                                            key={repo.id}
                                            onClick={() => fetchFiles(repo.name)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                selectedRepo === repo.name ? 'bg-primary/20 text-primary border border-primary/30' : 'text-text-primary hover:bg-border-subtle/10 border border-transparent'
                                            }`}
                                        >
                                            {repo.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Files List */}
                        <div className="w-1/2 flex flex-col">
                            <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">C++ Files</h3>
                            {!selectedRepo ? (
                                <div className="flex items-center justify-center py-8 text-text-muted text-sm text-center">
                                    Select a repository to view files
                                </div>
                            ) : isLoading && files.length === 0 ? (
                                <div className="flex items-center justify-center py-8 text-text-muted"><Loader2 className="animate-spin" /></div>
                            ) : files.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-text-muted text-sm text-center">
                                    <FileCode2 size={32} className="mb-2 opacity-50" />
                                    No C++ files found in this repo
                                </div>
                            ) : (
                                <div className="space-y-2 overflow-y-auto pr-2">
                                    {files.map(file => (
                                        <div key={file.sha} className="flex items-center justify-between p-2 rounded-lg border border-border-subtle hover:border-primary bg-surface/50 transition-colors group">
                                            <span className="text-sm text-text-primary truncate mr-2">{file.name}</span>
                                            <button 
                                                onClick={() => importFile(file.download_url)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 bg-primary hover:bg-primary/90 text-white rounded transition-all"
                                                title="Import"
                                            >
                                                <Download size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
