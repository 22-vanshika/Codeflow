import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useVisualizationStore } from '../store/visualizationStore';
import type { SavedVisualization } from '../store/visualizationStore';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, Code2, Play, Calendar, Search, ArrowUpDown, 
    Trash2, Edit3, Copy, AlertCircle, RefreshCw, Clock, X,
    BookOpen, Brain, Settings, Trophy, Zap, Star, LayoutGrid, CheckCircle2,
    Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import { problemsList } from '../data/problems/index';

const TOPIC_MAPPING: Record<string, string[]> = {
  'Arrays & Hashing': ['Arrays & Hashing', 'Sorting'],
  'Two Pointers': ['Two Pointers'],
  'Sliding Window': ['Sliding Window'],
  'Binary Search': ['Binary Search'],
  'Stack': ['Stack'],
  'Linked List': ['Linked List'],
  'Trees': ['Trees', 'Trie'],
  'Heaps & Queues': ['Heap', 'Heap / Priority Queue'],
  'Backtracking': ['Backtracking'],
  'Graphs': ['Graphs'],
  'Dynamic Programming': ['Dynamic Programming'],
  'Bit Manipulation': ['Bit Manipulation', 'Intervals']
};

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const { 
        visualizations, fetchUserVisualizations, isLoading, error,
        updateVisualization, deleteVisualization, duplicateVisualization 
    } = useVisualizationStore();
    const navigate = useNavigate();
    const { completed } = useProgressStore();

    // State for search and sort
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAtNewest' | 'createdAtOldest' | 'nameAZ' | 'nameZA'>('updatedAt');

    // Dynamic stats and logs
    const [dashboardData, setDashboardData] = useState<{
        stats: { solvedCount: number; savedTracesCount: number; streak: number };
        activityLogs: { title: string; type: string; createdAt: string }[];
        learningStats: { id: string; completed: number }[];
    } | null>(null);

    useEffect(() => {
        const loadDashboardStats = async () => {
            if (!user) return;
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const token = await user.getIdToken();
                const res = await fetch(`${API_URL}/api/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.stats) {
                    setDashboardData(data);
                }
            } catch (err) {
                console.error("Failed to load dashboard stats:", err);
            }
        };

        loadDashboardStats();
    }, [user]);

    // Dialog state for Rename/Edit Details
    const [editingVis, setEditingVis] = useState<SavedVisualization | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Dialog state for Delete Confirmation
    const [deletingVis, setDeletingVis] = useState<SavedVisualization | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Duplicating state feedback
    const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        user.getIdToken().then(t => {
            fetchUserVisualizations(t);
        });
    }, [user, navigate, fetchUserVisualizations]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleOpenVis = (id: string) => {
        navigate(`/workspace?vid=${id}`);
    };

    const handleEditStart = (e: React.MouseEvent, vis: SavedVisualization) => {
        e.stopPropagation();
        setEditingVis(vis);
        setEditTitle(vis.title);
        setEditDescription(vis.description || '');
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVis || !user) return;

        setIsUpdating(true);
        try {
            const token = await user.getIdToken();
            await updateVisualization(editingVis._id, {
                title: editTitle,
                description: editDescription
            }, token);
            setEditingVis(null);
        } catch (err) {
            console.error("Failed to update visualization:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteStart = (e: React.MouseEvent, vis: SavedVisualization) => {
        e.stopPropagation();
        setDeletingVis(vis);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingVis || !user) return;

        setIsDeleting(true);
        try {
            const token = await user.getIdToken();
            await deleteVisualization(deletingVis._id, token);
            setDeletingVis(null);
        } catch (err) {
            console.error("Failed to delete visualization:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!user) return;

        setDuplicatingId(id);
        try {
            const token = await user.getIdToken();
            await duplicateVisualization(id, token);
        } catch (err) {
            console.error("Failed to duplicate visualization:", err);
        } finally {
            setDuplicatingId(null);
        }
    };

    if (!user) return null;

    // Filter and Sort logic
    const filteredVisualizations = visualizations.filter(vis => 
        vis.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (vis.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedVisualizations = [...filteredVisualizations].sort((a, b) => {
        if (sortBy === 'updatedAt') {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === 'createdAtNewest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'createdAtOldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'nameAZ') {
            return a.title.localeCompare(b.title);
        }
        if (sortBy === 'nameZA') {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });

    const totalProblems = problemsList?.length ?? 0;
    const solvedProblems = problemsList.filter(p => completed[p.id]);
    const solvedCount = dashboardData?.stats?.solvedCount ?? solvedProblems.length;
    const savedCount = dashboardData?.stats?.savedTracesCount ?? visualizations.length;
    const streakCount = dashboardData?.stats?.streak ?? Number(localStorage.getItem('cf_streak') || '3');

    return (
        <div className="min-h-screen pt-[80px] px-6 pb-12 bg-bg-main text-text-primary relative overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-primary/5 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-secondary/5 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                
                {/* ── PROFILE HEADER ────────────────────────────────────────── */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism border border-white/5 rounded-2xl p-8 mb-10 flex items-center justify-between shadow-2xl"
                >
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-lg shadow-primary/20">
                                <div className="w-full h-full bg-bg-panel rounded-full overflow-hidden flex items-center justify-center">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-black text-white">{user.email?.[0].toUpperCase()}</span>
                                    )}
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-primary/10 rounded-full filter blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-[4px] tracking-wider">PRO DEVELOPER</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">{user.displayName || 'Developer'}</h1>
                            <p className="text-sm font-medium text-text-secondary font-mono">{user.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-text-secondary bg-white/5 border border-white/5 hover:border-red-500/20 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all font-bold text-sm"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </motion.div>

                {/* ── STATS ROW ──────────────────────────────────────────────── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                    <div className="glass-morphism border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 text-primary/5 group-hover:text-primary/10 transition-colors transform scale-150 pointer-events-none">
                            <Trophy size={96} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-text-muted tracking-wider mb-1 font-mono">Problems Solved</p>
                            <h3 className="text-3xl font-black text-white font-mono">{solvedCount} <span className="text-sm font-normal text-text-secondary">/ {totalProblems}</span></h3>
                            <p className="text-[10px] font-bold text-primary mt-1.5 flex items-center gap-1">
                                <Star size={10} fill="currentColor" /> {totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0}% of sheet completed
                            </p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 border border-primary/20 shadow-inner">
                            <Trophy size={24} />
                        </div>
                    </div>

                    <div className="glass-morphism border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 text-secondary/5 group-hover:text-secondary/10 transition-colors transform scale-150 pointer-events-none">
                            <Code2 size={96} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-text-muted tracking-wider mb-1 font-mono">Saved Workspaces</p>
                            <h3 className="text-3xl font-black text-white font-mono">{savedCount}</h3>
                            <p className="text-[10px] font-bold text-secondary mt-1.5 flex items-center gap-1">
                                <Clock size={10} /> Persistent algorithm visualizers
                            </p>
                        </div>
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary shrink-0 border border-secondary/20 shadow-inner">
                            <Code2 size={24} />
                        </div>
                    </div>

                    <div className="glass-morphism border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 text-accent-yellow/5 group-hover:text-accent-yellow/10 transition-colors transform scale-150 pointer-events-none">
                            <Zap size={96} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-text-muted tracking-wider mb-1 font-mono">Daily Streak</p>
                            <h3 className="text-3xl font-black text-white font-mono">{streakCount} <span className="text-sm font-normal text-text-secondary">Days</span></h3>
                            <p className="text-[10px] font-bold text-accent-yellow mt-1.5 flex items-center gap-1">
                                <Zap size={10} fill="currentColor" className="animate-pulse" /> Active coding momentum
                            </p>
                        </div>
                        <div className="p-3 bg-accent-yellow/10 rounded-2xl text-accent-yellow shrink-0 border border-accent-yellow/20 shadow-inner">
                            <Zap size={24} fill="currentColor" />
                        </div>
                    </div>
                </motion.div>

                {/* ── QUICK ACTIONS ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
                >
                    {[
                        { label: 'Sandbox Visualizer', to: '/workspace', desc: 'Create code trace', icon: Play, color: 'bg-primary/10 border-primary/20 hover:border-primary/50 text-primary' },
                        { label: 'DSA Sheet', to: '/sheet', desc: 'Practice problems', icon: BookOpen, color: 'bg-accent-green/10 border-accent-green/20 hover:border-accent-green/50 text-accent-green' },
                        { label: 'Algorithms Hub', to: '/algorithms', desc: 'Learn core concepts', icon: Brain, color: 'bg-accent-yellow/10 border-accent-yellow/20 hover:border-accent-yellow/50 text-accent-yellow' },
                        { label: 'Edit Profile', to: '/profile-settings', desc: 'Theme & details', icon: Settings, color: 'bg-secondary/10 border-secondary/20 hover:border-secondary/50 text-secondary' }
                    ].map((act, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(act.to)}
                            className={`flex flex-col items-start p-5 rounded-2xl border transition-all text-left group shadow-sm active:scale-95 ${act.color}`}
                        >
                            <div className="p-2 rounded-xl bg-white/5 mb-3 group-hover:scale-110 transition-transform">
                                <act.icon size={18} />
                            </div>
                            <span className="text-sm font-extrabold text-white block leading-tight">{act.label}</span>
                            <span className="text-[10px] text-text-muted mt-1 leading-tight font-mono">{act.desc}</span>
                        </button>
                    ))}
                </motion.div>

                {/* ── TOPIC PROGRESS GRID ─────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-morphism border border-white/5 rounded-2xl p-6 mb-12 shadow-xl"
                >
                    <h3 className="text-lg font-black flex items-center gap-2 mb-6 text-white tracking-tight">
                        <LayoutGrid size={18} className="text-primary" />
                        Topic Progress Grid
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(TOPIC_MAPPING).map(([topic, cats]) => {
                            const topicProblems = problemsList.filter(p => cats.includes(p.category));
                            const total = topicProblems.length;
                            const solved = topicProblems.filter(p => completed[p.id]).length;
                            const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

                            return (
                                <div key={topic} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <span className="text-xs font-black text-white leading-tight group-hover:text-primary transition-colors">{topic}</span>
                                            <span className="text-[10px] font-bold text-text-muted font-mono shrink-0">{solved}/{total}</span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                                            <div 
                                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" 
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] font-bold text-text-muted font-mono">{percent}% done</span>
                                        {percent === 100 && (
                                            <CheckCircle2 size={12} className="text-accent-green" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ── RECENT ACTIVITY FEED ────────────────────────────────────── */}
                {dashboardData && dashboardData.activityLogs && dashboardData.activityLogs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 }}
                        className="glass-morphism border border-white/5 rounded-2xl p-6 mb-12 shadow-xl"
                    >
                        <h3 className="text-lg font-black flex items-center gap-2 mb-6 text-white tracking-tight">
                            <Clock size={18} className="text-secondary" />
                            Recent Activity Feed
                        </h3>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {dashboardData.activityLogs.map((log, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${
                                            log.type === 'streak_keep' || log.type === 'streak_start' ? 'bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/20' :
                                            log.type === 'github_connect' ? 'bg-primary/15 text-primary border border-primary/20' :
                                            log.type === 'profile_update' || log.type === 'avatar_update' ? 'bg-secondary/15 text-secondary border border-secondary/20' :
                                            'bg-accent-green/15 text-accent-green border border-accent-green/20'
                                        }`}>
                                            {log.type === 'streak_keep' || log.type === 'streak_start' ? <Zap size={15} fill="currentColor" /> :
                                             log.type === 'github_connect' ? <Github size={15} /> :
                                             log.type === 'profile_update' || log.type === 'avatar_update' ? <Settings size={15} /> :
                                             <CheckCircle2 size={15} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-tight">{log.title}</p>
                                            <p className="text-[10px] text-text-muted mt-0.5 font-mono">{log.type.replace('_', ' ').toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted font-mono">{new Date(log.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── FILTER & CONTROL BAR ──────────────────────────────────── */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-2.5 text-white tracking-tight">
                            <Code2 className="text-primary" />
                            Saved Visualizations
                        </h2>
                        <p className="text-xs text-text-muted mt-1 font-mono">Manage and replay your persistent algorithm workspaces</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64 group">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-primary transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by name or note..."
                                className="w-full pl-10 pr-4 py-2 bg-white/5 hover:bg-white/[0.07] border border-white/5 rounded-xl text-xs font-bold text-white placeholder-text-muted outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-mono"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative w-full sm:w-auto shrink-0 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-xl">
                            <ArrowUpDown size={14} className="text-primary" />
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as any)}
                                className="bg-transparent text-xs font-bold text-text-secondary hover:text-white outline-none border-none cursor-pointer pr-4 font-mono"
                            >
                                <option value="updatedAt" className="bg-bg-panel">Last Modified</option>
                                <option value="createdAtNewest" className="bg-bg-panel">Created: Newest</option>
                                <option value="createdAtOldest" className="bg-bg-panel">Created: Oldest</option>
                                <option value="nameAZ" className="bg-bg-panel">Name: A to Z</option>
                                <option value="nameZA" className="bg-bg-panel">Name: Z to A</option>
                            </select>
                        </div>

                        <button 
                            onClick={() => navigate('/workspace')} 
                            className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                            New Workspace
                        </button>
                    </div>
                </div>

                {/* ── VISUALIZATIONS LIST ────────────────────────────────────── */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span>Error loading projects: {error}</span>
                    </div>
                )}

                {isLoading && sortedVisualizations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-3">
                        <RefreshCw className="animate-spin text-primary" size={32} />
                        <span className="text-sm font-bold tracking-widest uppercase font-mono">Restoring saved projects...</span>
                    </div>
                ) : sortedVisualizations.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-bg-panel border border-white/5 rounded-2xl p-16 text-center shadow-xl"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5 border border-white/5">
                            <Code2 size={32} className="text-text-muted" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No matching visualizations</h3>
                        <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
                            {searchQuery ? "We couldn't find any saved projects matching your query." : "Save your algorithm visualizer traces to access them here."}
                        </p>
                        <button onClick={() => navigate('/workspace')} className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-primary/20">
                            Launch Sandbox
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {sortedVisualizations.map((vis, idx) => (
                                <motion.div 
                                    layout
                                    key={vis._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                                    className="group bg-bg-panel border border-white/5 rounded-2xl p-6 hover:border-primary/50 hover:-translate-y-1 transition-all cursor-pointer shadow-xl flex flex-col justify-between"
                                    onClick={() => handleOpenVis(vis._id)}
                                >
                                    <div>
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-3.5 gap-2">
                                            <h3 className="text-base font-extrabold text-white group-hover:text-primary transition-colors line-clamp-1 leading-tight tracking-tight">
                                                {vis.title}
                                            </h3>
                                            <span className="text-[9px] px-2 py-0.5 rounded-[4px] bg-white/5 border border-white/5 font-black uppercase tracking-wider text-text-secondary font-mono shrink-0">
                                                {vis.language}
                                            </span>
                                        </div>

                                        {/* Preview Card Placeholder */}
                                        <div className="relative h-28 w-full bg-bg-main/60 rounded-xl mb-4 border border-white/5 overflow-hidden flex flex-col justify-center items-center group-hover:bg-bg-main/40 transition-colors">
                                            <div className="absolute top-2 left-3 flex items-center gap-1.5 opacity-65 text-[9px] font-black text-text-muted font-mono tracking-wider">
                                                <Clock size={10} />
                                                <span>PREVIEW</span>
                                            </div>
                                            {/* Code visualization representation */}
                                            <div className="flex flex-col gap-2 w-[80%] opacity-20">
                                                <div className="h-1.5 bg-primary/80 rounded-full w-[45%]" />
                                                <div className="h-1.5 bg-secondary/80 rounded-full w-[70%] ml-4" />
                                                <div className="h-1.5 bg-accent-cyan/80 rounded-full w-[30%] ml-4" />
                                                <div className="h-1.5 bg-white/40 rounded-full w-[50%]" />
                                            </div>
                                            <div className="absolute p-3 rounded-full bg-primary/0 group-hover:bg-primary/20 text-primary/0 group-hover:text-primary transition-all duration-300 transform scale-75 group-hover:scale-100 flex items-center justify-center shadow-lg">
                                                <Play size={20} fill="currentColor" />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs font-semibold text-text-secondary line-clamp-2 mb-6 h-9 font-mono leading-relaxed">
                                            {vis.description || 'No description or developer notes provided.'}
                                        </p>
                                    </div>

                                    {/* Action footer */}
                                    <div className="flex items-center justify-between text-[11px] text-text-muted border-t border-white/5 pt-4">
                                        <span className="flex items-center gap-1.5 font-bold font-mono">
                                            <Calendar size={13} className="text-primary" />
                                            {new Date(vis.updatedAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {/* Duplicate */}
                                            <button 
                                                onClick={(e) => handleDuplicate(e, vis._id)}
                                                disabled={duplicatingId === vis._id}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors text-text-muted"
                                                title="Duplicate Project"
                                            >
                                                {duplicatingId === vis._id ? (
                                                    <RefreshCw size={13} className="animate-spin text-primary" />
                                                ) : (
                                                    <Copy size={13} />
                                                )}
                                            </button>

                                            {/* Edit details */}
                                            <button 
                                                onClick={(e) => handleEditStart(e, vis)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-secondary/20 hover:text-secondary transition-colors text-text-muted"
                                                title="Edit Details / Rename"
                                            >
                                                <Edit3 size={13} />
                                            </button>

                                            {/* Delete */}
                                            <button 
                                                onClick={(e) => handleDeleteStart(e, vis)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors text-text-muted"
                                                title="Delete Project"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── RENAME / DETAILS DIALOG ─────────────────────────────────── */}
            <AnimatePresence>
                {editingVis && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-bg-panel border border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden"
                        >
                            <button 
                                onClick={() => setEditingVis(null)}
                                className="absolute top-4 right-4 p-2 text-text-muted hover:text-white rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-secondary/20 text-secondary rounded-lg">
                                    <Edit3 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Edit Project Details</h3>
                            </div>

                            <form onSubmit={handleEditSave} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-secondary font-mono">Project Title</label>
                                    <input 
                                        type="text" 
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-bg-main border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white outline-none transition-all font-mono"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-secondary font-mono">Description / Notes</label>
                                    <textarea 
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-bg-main border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white outline-none transition-all h-28 resize-none font-mono text-sm leading-relaxed"
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setEditingVis(null)}
                                        className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5 font-mono"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-1 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:bg-secondary/90 disabled:opacity-50 font-mono"
                                    >
                                        {isUpdating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── DELETE CONFIRMATION DIALOG ──────────────────────────────── */}
            <AnimatePresence>
                {deletingVis && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-bg-panel border border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 mb-4 animate-pulse">
                                    <Trash2 size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Delete Visualization?</h3>
                                <p className="text-xs text-text-muted font-mono leading-relaxed mb-6 max-w-xs">
                                    Are you sure you want to delete <span className="text-white">"{deletingVis.title}"</span>? This action is permanent and cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setDeletingVis(null)}
                                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5 font-mono"
                                >
                                    No, Keep it
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:bg-red-600 disabled:opacity-50 font-mono"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
