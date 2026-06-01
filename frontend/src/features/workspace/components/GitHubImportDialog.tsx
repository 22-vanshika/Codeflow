import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, FileCode2, Loader2, Download, AlertTriangle, LogIn } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useExecutionStore } from '../../../store/executionStore';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth, githubProvider } from '../../../config/firebase';

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
    const [connectingGitHub, setConnectingGitHub] = useState(false);
    
    const { githubAccessToken, setGithubAccessToken } = useAuthStore();
    const { setCode } = useExecutionStore();

    useEffect(() => {
        if (isOpen && githubAccessToken) {
            fetchRepos();
        }
        // Reset state when dialog opens
        if (isOpen) {
            setSelectedRepo(null);
            setFiles([]);
            setError('');
        }
    }, [isOpen, githubAccessToken]);

    const handleConnectGitHub = async () => {
        setConnectingGitHub(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, githubProvider);
            // The credential contains the GitHub access token
            const credential = GithubAuthProvider.credentialFromResult(result);
            if (credential?.accessToken) {
                setGithubAccessToken(credential.accessToken);
            } else {
                setError('Could not retrieve GitHub token. Please try again.');
            }
        } catch (err: any) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError('Failed to connect to GitHub.');
            }
        } finally {
            setConnectingGitHub(false);
        }
    };

    const fetchRepos = async () => {
        if (!githubAccessToken) return;
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
                headers: { Authorization: `token ${githubAccessToken}` },
            });
            if (res.status === 401) {
                // Token expired - clear it
                setGithubAccessToken(null);
                setError('GitHub session expired. Please reconnect.');
                return;
            }
            if (!res.ok) throw new Error('Failed to fetch repositories');
            const data = await res.json();
            setRepos(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load repositories.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFiles = async (repoName: string, ownerLogin: string) => {
        setSelectedRepo(repoName);
        setIsLoading(true);
        setError('');
        setFiles([]);
        try {
            const res = await fetch(
                `https://api.github.com/repos/${ownerLogin}/${repoName}/contents`,
                { headers: { Authorization: `token ${githubAccessToken}` } }
            );
            if (!res.ok) throw new Error('Failed to fetch repository contents');
            const data = await res.json();
            // Filter to .cpp files
            const codeFiles = data.filter((f: any) => f.type === 'file' && f.name.match(/\.(cpp|c|h|hpp)$/i));
            setFiles(codeFiles);
        } catch (err: any) {
            setError(err.message || 'Failed to load files.');
        } finally {
            setIsLoading(false);
        }
    };

    const importFile = async (downloadUrl: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(downloadUrl, {
                headers: githubAccessToken ? { Authorization: `token ${githubAccessToken}` } : {},
            });
            const content = await res.text();
            setCode(content);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to import file.');
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
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#24292e] text-white rounded-lg border border-border-subtle">
                                <Github size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">Import from GitHub</h2>
                                <p className="text-xs text-text-muted">
                                    {githubAccessToken 
                                        ? 'Select a C/C++ file from your repositories'
                                        : 'Connect your GitHub account to browse repositories'
                                    }
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-border-subtle/20 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-3 w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                                <AlertTriangle size={16} className="flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Not connected */}
                        {!githubAccessToken && !connectingGitHub && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[#24292e] border border-border-subtle flex items-center justify-center mb-6">
                                    <Github size={32} className="text-white" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">Connect GitHub</h3>
                                <p className="text-text-secondary text-sm max-w-xs mb-8">
                                    Authorize CodeFlow to read your repositories and import C++ files directly into the workspace.
                                </p>
                                <button
                                    onClick={handleConnectGitHub}
                                    className="flex items-center gap-3 px-6 py-3 bg-[#24292e] hover:bg-[#2f363d] text-white font-bold rounded-xl border border-white/10 transition-all"
                                >
                                    <Github size={20} />
                                    Authorize with GitHub
                                </button>
                                <p className="text-text-muted text-xs mt-4">
                                    Read-only access to your repositories.
                                </p>
                            </div>
                        )}

                        {/* Connecting */}
                        {connectingGitHub && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 size={32} className="animate-spin text-primary mb-4" />
                                <p className="text-text-secondary">Connecting to GitHub...</p>
                            </div>
                        )}

                        {/* Connected — show repos and files */}
                        {githubAccessToken && !connectingGitHub && (
                            <div className="flex gap-6">
                                {/* Repos List */}
                                <div className="w-1/2 flex flex-col border-r border-border-subtle pr-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Repositories</h3>
                                        <button
                                            onClick={fetchRepos}
                                            disabled={isLoading}
                                            className="text-xs text-primary hover:text-white transition-colors"
                                        >
                                            Refresh
                                        </button>
                                    </div>
                                    {isLoading && repos.length === 0 ? (
                                        <div className="flex items-center justify-center py-8 text-text-muted">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    ) : repos.length === 0 ? (
                                        <div className="text-center py-8 text-text-muted text-sm">
                                            No repositories found
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5 overflow-y-auto max-h-72 pr-1">
                                            {repos.map(repo => (
                                                <button
                                                    key={repo.id}
                                                    onClick={() => fetchFiles(repo.name, repo.owner.login)}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                                        selectedRepo === repo.name 
                                                            ? 'bg-primary/20 text-primary border border-primary/30' 
                                                            : 'text-text-primary hover:bg-border-subtle/10 border border-transparent'
                                                    }`}
                                                >
                                                    <div className="font-medium truncate">{repo.name}</div>
                                                    {repo.description && (
                                                        <div className="text-xs text-text-muted mt-0.5 truncate">{repo.description}</div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Files List */}
                                <div className="w-1/2 flex flex-col">
                                    <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">C/C++ Files</h3>
                                    {!selectedRepo ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-text-muted text-sm text-center gap-2">
                                            <LogIn size={24} className="opacity-40" />
                                            Select a repository to view files
                                        </div>
                                    ) : isLoading ? (
                                        <div className="flex items-center justify-center py-8 text-text-muted">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    ) : files.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-text-muted text-sm text-center">
                                            <FileCode2 size={32} className="mb-2 opacity-50" />
                                            No C/C++ files found in this repo
                                        </div>
                                    ) : (
                                        <div className="space-y-2 overflow-y-auto max-h-72">
                                            {files.map(file => (
                                                <div key={file.sha} className="flex items-center justify-between p-2.5 rounded-lg border border-border-subtle hover:border-primary bg-surface/50 transition-colors group">
                                                    <div className="min-w-0 mr-2">
                                                        <span className="text-sm text-text-primary truncate block font-mono">{file.name}</span>
                                                        <span className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => importFile(file.download_url)}
                                                        disabled={isLoading}
                                                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg transition-all"
                                                        title="Import this file"
                                                    >
                                                        <Download size={12} />
                                                        Import
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {githubAccessToken && (
                        <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted shrink-0">
                            <span>Connected to GitHub</span>
                            <button
                                onClick={() => { setGithubAccessToken(null); setRepos([]); setFiles([]); }}
                                className="text-red-400 hover:text-red-300 transition-colors font-bold"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
