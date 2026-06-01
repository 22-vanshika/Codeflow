import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, CheckCircle, ExternalLink, Play, Search, Trophy, Zap, ChevronRight, ArrowUpDown } from 'lucide-react';
import { problemsList, type ProblemDefinition } from '../data/problems/index';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { useVisualizationStore } from '../store/visualizationStore';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicBackground from '../components/DynamicBackground';

const URL_TO_CAT_MAP: Record<string, string> = {
  'arrays': 'Arrays & Hashing',
  'sorting': 'Sorting',
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  'binary-search': 'Binary Search',
  'linked-list': 'Linked List',
  'stack': 'Stack',
  'intervals': 'Intervals',
  'trees': 'Trees',
  'graphs': 'Graphs',
  'backtracking': 'Backtracking',
  'heap': 'Heap',
  'heaps': 'Heap',
  'queues': 'Heap',
  'dp': 'Dynamic Programming',
  'dynamic-programming': 'Dynamic Programming',
  'trie': 'Trie',
  'bit-manipulation': 'Bit Manipulation'
};

export default function CuratedSheet() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { completed, toggleCompletion } = useProgressStore();
    const { category: categoryParam } = useParams<{ category?: string }>();
    const { visualizations, fetchUserVisualizations } = useVisualizationStore();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Solved' | 'Not Solved'>('All');
    const [sortBy, setSortBy] = useState<'Default' | 'Difficulty' | 'Completion'>('Default');
    
    // Stable list of unique categories
    const categories = useMemo(() => {
        return Array.from(new Set((problemsList || []).map(p => p.category || 'Uncategorized')));
    }, []);

    // Initial selected category based on URL parameter
    const [selectedCategory, setSelectedCategory] = useState<string>(() => {
        if (categoryParam) {
            const mapped = URL_TO_CAT_MAP[categoryParam.toLowerCase()];
            if (mapped) return mapped;
        }
        const unique = Array.from(new Set((problemsList || []).map(p => p.category || 'Uncategorized')));
        return unique[0] || '';
    });

    // Keep active selection in sync if category URL changes
    useEffect(() => {
        if (categoryParam) {
            const mapped = URL_TO_CAT_MAP[categoryParam.toLowerCase()];
            if (mapped) {
                setSelectedCategory(mapped);
            }
        }
    }, [categoryParam]);

    // Fetch user's saved visualizations to determine "In Progress" status
    useEffect(() => {
        if (user) {
            user.getIdToken().then(t => {
                fetchUserVisualizations(t);
            });
        }
    }, [user, fetchUserVisualizations]);

    // Compute stats for all categories
    const categoriesStats = useMemo(() => {
        const stats: Record<string, { total: number; completedCount: number; percent: number }> = {};
        
        (problemsList || []).forEach(problem => {
            const cat = problem.category || 'Uncategorized';
            if (!stats[cat]) {
                stats[cat] = { total: 0, completedCount: 0, percent: 0 };
            }
            stats[cat].total += 1;
            if (completed[problem.id]) {
                stats[cat].completedCount += 1;
            }
        });

        Object.keys(stats).forEach(cat => {
            const s = stats[cat];
            s.percent = s.total > 0 ? Math.round((s.completedCount / s.total) * 100) : 0;
        });

        return stats;
    }, [completed]);

    const handleToggle = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleCompletion(id, user);
    };

    const handleSolve = (problem: ProblemDefinition) => {
        navigate('/workspace', {
            state: {
                problemData: {
                    id: problem.id,
                    title: problem.title,
                    difficulty: problem.difficulty,
                    category: problem.category,
                    starterCode: { cpp: problem.starterCode },
                    description: problem.description,
                    examples: problem.examples,
                    constraints: problem.constraints,
                    source: 'SWE180',
                    url: problem.url,
                }
            }
        });
    };

    const totalProblems = problemsList?.length ?? 0;
    const solvedCount = Object.values(completed).filter(Boolean).length;
    const progressPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    // Filter and Sort problems of the selected category based on search, completion filter, and sorting options
    const filteredProblems = useMemo(() => {
        const catProblems = (problemsList || []).filter(p => (p.category || 'Uncategorized') === selectedCategory);
        let result = catProblems.filter(problem => {
            const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
            const isSolved = completed[problem.id];
            const matchesFilter = 
                activeFilter === 'All' || 
                (activeFilter === 'Solved' && isSolved) || 
                (activeFilter === 'Not Solved' && !isSolved);
            return matchesSearch && matchesFilter;
        });

        // Apply sorting
        if (sortBy === 'Difficulty') {
            const diffRank: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };
            result.sort((a, b) => diffRank[a.difficulty] - diffRank[b.difficulty]);
        } else if (sortBy === 'Completion') {
            // Solved first
            result.sort((a, b) => {
                const aCompleted = completed[a.id] ? 1 : 0;
                const bCompleted = completed[b.id] ? 1 : 0;
                return bCompleted - aCompleted; // 1 (solved) before 0 (unsolved)
            });
        }

        return result;
    }, [selectedCategory, searchQuery, activeFilter, completed, sortBy]);

    return (
        <div className="min-h-screen pt-20 pb-12 sm:pt-24 sm:pb-20 bg-transparent relative overflow-x-hidden">
            <DynamicBackground />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 sm:mb-16"
                >
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Trophy size={14} />
                        Master the Patterns
                    </motion.div>
                    
                    <h1 className="text-5xl md:text-6xl font-black text-text-primary mb-6 tracking-tighter">
                        DSA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x">Sheet</span>
                    </h1>
                    
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
                        A high-fidelity roadmap to mastering DSA. 200 curated problems that cover every pattern you need for top-tier technical interviews.
                    </p>
                </motion.div>

                {/* Overall Progression Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full mb-8 sm:mb-12 liquid-glass-card p-5 sm:p-6 md:p-8 relative overflow-hidden group border border-border-subtle"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={100} className="text-primary" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-1.5">Overall Progression</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">{progressPercent}%</span>
                                <span className="text-text-secondary text-sm font-bold">Complete</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 max-w-md w-full">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-black text-text-muted uppercase tracking-wider">Solved Problems</span>
                                <div>
                                    <span className="text-primary font-black text-base">{solvedCount}</span>
                                    <span className="text-text-secondary text-xs font-bold"> / {totalProblems}</span>
                                </div>
                            </div>
                            <div className="relative h-2.5 bg-border-subtle rounded-full overflow-hidden border border-border-subtle">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Two-Column Explorer Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Category Navigation Panel */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 space-y-3 lg:sticky lg:top-24 h-fit"
                    >
                        <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-4 px-2">
                            Categories
                        </h3>
                        <div className="space-y-2.5">
                            {categories.map((category) => {
                                const stats = categoriesStats[category] || { total: 0, completedCount: 0, percent: 0 };
                                const isSelected = selectedCategory === category;
                                
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`w-full text-left p-4 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 border ${
                                            isSelected 
                                            ? 'liquid-glass-card bg-primary/10 border-primary shadow-lg shadow-primary/5 text-text-primary' 
                                            : 'bg-surface/30 hover:bg-surface/60 border-border-subtle text-text-secondary hover:text-text-primary'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                                                isSelected 
                                                ? 'bg-primary/20 border-primary/30 text-primary' 
                                                : 'bg-surface border-border-subtle text-text-muted'
                                            }`}>
                                                <BookOpen size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="block text-sm font-bold truncate leading-tight tracking-tight">
                                                    {category}
                                                </span>
                                                <span className="block text-[10px] font-black text-text-muted uppercase tracking-wider mt-0.5">
                                                    {stats.total} Problems
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Circular Progress Ring */}
                                        <div className="relative flex items-center justify-center shrink-0 w-11 h-11">
                                            <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="14"
                                                    fill="none"
                                                    className={isSelected ? "stroke-primary/10" : "stroke-border-subtle/50"}
                                                    strokeWidth="3.5"
                                                />
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="14"
                                                    fill="none"
                                                    className={`transition-all duration-500 ease-out ${
                                                        isSelected ? "stroke-primary" : "stroke-secondary"
                                                    }`}
                                                    strokeWidth="3.5"
                                                    strokeDasharray="87.96"
                                                    strokeDashoffset={87.96 - (87.96 * stats.percent) / 100}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="absolute text-[9px] font-black text-text-primary font-mono">
                                                {stats.percent}%
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Right Explorer Main Area */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 space-y-6"
                    >
                        {/* Right Header Stats & Banner */}
                        <div className="liquid-glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-border-subtle">
                            <div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Selected Category</span>
                                <h2 className="text-2xl font-black text-text-primary mt-1 tracking-tight">{selectedCategory}</h2>
                            </div>
                            
                            {/* Category Stats Display */}
                            {selectedCategory && (
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="flex flex-col gap-1 w-full md:w-44">
                                        <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase">
                                            <span>Completed</span>
                                            <span>{categoriesStats[selectedCategory]?.completedCount || 0} / {categoriesStats[selectedCategory]?.total || 0}</span>
                                        </div>
                                        <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden border border-border-subtle">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${categoriesStats[selectedCategory]?.percent || 0}%` }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search & Filters */}
                        <div className="space-y-4">
                            {/* Search Input Row (Full-width) */}
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Search problems in this category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface border border-border-subtle rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all backdrop-blur-xl"
                                />
                            </div>
                            
                            {/* Filters & Sort Row (Responsive flex container) */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    {(['All', 'Solved', 'Not Solved'] as const).map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 ${
                                                activeFilter === filter 
                                                ? 'bg-primary text-white border border-primary' 
                                                : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-border-subtle/20 border border-border-subtle'
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-1.5 bg-surface/50 border border-border-subtle rounded-xl p-1 backdrop-blur-xl self-start sm:self-auto">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2 flex items-center gap-1 shrink-0">
                                        <ArrowUpDown size={11} />
                                        Sort
                                    </span>
                                    {(['Default', 'Difficulty', 'Completion'] as const).map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setSortBy(option)}
                                            className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all shrink-0 uppercase tracking-wider ${
                                                sortBy === option 
                                                ? 'bg-secondary text-white shadow-md shadow-secondary/15' 
                                                : 'text-text-secondary hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Problems Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence mode="popLayout">
                                {filteredProblems.map((problem) => {
                                    const isSolved = completed[problem.id];
                                    const isInProgress = !isSolved && (
                                        visualizations.some(v => 
                                            v.metadata?.problemDetails?.id === problem.id || 
                                            v.title.toLowerCase().includes(problem.title.toLowerCase())
                                        )
                                    );

                                    return (
                                        <motion.div 
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            key={problem.id} 
                                            onClick={() => handleSolve(problem)}
                                            className="group liquid-glass-card hover:translate-y-[-2px] hover:border-primary/50 transition-all duration-300 relative overflow-hidden border border-border-subtle p-5 flex flex-col justify-between h-42 cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 min-w-0">
                                                    {/* Checkbox button */}
                                                    <button 
                                                        onClick={(e) => handleToggle(problem.id, e)}
                                                        className={`mt-0.5 relative w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 border-2 shrink-0 ${
                                                            isSolved 
                                                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(123,116,209,0.3)]' 
                                                            : isInProgress
                                                            ? 'bg-accent-yellow/10 border-accent-yellow/60 text-accent-yellow shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                                            : 'border-border-subtle text-transparent hover:border-text-muted'
                                                        }`}
                                                    >
                                                        {isSolved ? (
                                                            <CheckCircle size={14} className="scale-100" />
                                                        ) : isInProgress ? (
                                                            <div className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
                                                        ) : null}
                                                    </button>
                                                    
                                                    <div className="min-w-0">
                                                        <h4 className={`text-base font-black tracking-tight leading-snug transition-all duration-300 ${
                                                            isSolved 
                                                            ? 'text-text-muted line-through opacity-50' 
                                                            : 'text-text-primary group-hover:text-primary'
                                                        }`}>
                                                            {problem.title}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                        problem.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                                        problem.difficulty === 'Medium' ? 'border-orange-500/30 text-orange-400 bg-orange-500/5' :
                                                        'border-red-500/30 text-red-400 bg-red-500/5'
                                                    }`}>
                                                        {problem.difficulty}
                                                    </span>
                                                    
                                                    {/* Status Badge */}
                                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                        isSolved ? 'border-accent-green/30 text-accent-green bg-accent-green/5' :
                                                        isInProgress ? 'border-accent-yellow/30 text-accent-yellow bg-accent-yellow/5' :
                                                        'border-white/5 text-text-muted bg-white/5'
                                                    }`}>
                                                        {isSolved ? '✅ Solved' : isInProgress ? '🟡 In Progress' : '⚪ Not Started'}
                                                    </span>

                                                    {problem.url && (
                                                        <a 
                                                            href={problem.url} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-[9px] font-black text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors uppercase tracking-wider ml-1"
                                                        >
                                                            LeetCode <ExternalLink size={9} />
                                                        </a>
                                                    )}
                                                </div>

                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center gap-1.5 text-[10px] font-black text-white bg-primary px-3.5 py-2 rounded-lg transition-all shadow-md shadow-primary/20 opacity-0 group-hover:opacity-100"
                                                >
                                                    <Play size={10} fill="currentColor" /> 
                                                    <span>Visualize</span>
                                                    <ChevronRight size={10} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Empty state for filtered problems */}
                        {filteredProblems.length === 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 liquid-glass-card border border-border-subtle"
                            >
                                <div className="text-4xl mb-4 grayscale opacity-40">🔍</div>
                                <h3 className="text-lg font-black text-text-primary mb-1">No matches found</h3>
                                <p className="text-sm text-text-muted">Try adjusting search or difficulty filters.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
