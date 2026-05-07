import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, ExternalLink, Play, Search, Trophy, Zap, ChevronRight } from 'lucide-react';
import { problemsList, type ProblemDefinition } from '../data/problems/index';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicBackground from '../components/DynamicBackground';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
    }
};

export default function CuratedSheet() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { completed, toggleCompletion } = useProgressStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    
    // Group problems by category
    const groupedProblems = useMemo(() => {
        return (problemsList ?? []).reduce((acc, problem) => {
            const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'All' || problem.difficulty === activeFilter;
            
            if (matchesSearch && matchesFilter) {
                const category = problem.category || 'Uncategorized';
                if (!acc[category]) acc[category] = [];
                acc[category].push(problem);
            }
            return acc;
        }, {} as Record<string, ProblemDefinition[]>);
    }, [searchQuery, activeFilter]);

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
                    source: 'SWE180',
                    url: problem.url,
                }
            }
        });
    };

    const totalProblems = problemsList?.length ?? 0;
    const solvedCount = Object.values(completed).filter(Boolean).length;
    const progressPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-bg-main relative overflow-x-hidden">
            <DynamicBackground />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Trophy size={14} />
                        Master the Patterns
                    </motion.div>
                    
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        SWE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x">180</span> Sheet
                    </h1>
                    
                    <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
                        A high-fidelity roadmap to mastering DSA. 180 curated problems that cover every pattern you need for top-tier technical interviews.
                    </p>
                </motion.div>

                {/* Statistics & Search Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* Progress Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 glass-morphism p-8 rounded-3xl border border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={80} className="text-primary" />
                        </div>
                        
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Overall Progress</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white">{progressPercent}%</span>
                                    <span className="text-text-muted font-bold">Complete</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-primary font-black text-xl">{solvedCount}</span>
                                <span className="text-text-muted text-sm font-bold"> / {totalProblems}</span>
                            </div>
                        </div>

                        <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                            />
                        </div>
                    </motion.div>

                    {/* Search & Filters */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 flex flex-col justify-center gap-6"
                    >
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="text"
                                placeholder="Search by problem title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-text-muted focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all backdrop-blur-xl"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                        activeFilter === filter 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30 border border-primary/50' 
                                        : 'bg-white/5 text-text-muted hover:text-white hover:bg-white/10 border border-white/5'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Category Sections */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    {Object.entries(groupedProblems).map(([category, problems]) => {
                        const catSolved = problems.filter(p => completed[p.id]).length;
                        const catProgress = Math.round((catSolved / problems.length) * 100);
                        
                        return (
                            <motion.div 
                                key={category} 
                                variants={itemVariants}
                                className="glass-morphism rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                            >
                                {/* Category Header */}
                                <div className="px-8 py-6 bg-white/5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
                                            <BookOpen size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white tracking-tight">{category}</h2>
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                                {problems.length} Problems
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:block w-32 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${catProgress}%` }}
                                                className="h-full bg-secondary"
                                            />
                                        </div>
                                        <span className="px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-black">
                                            {catSolved} / {problems.length}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Problem Items */}
                                <div className="divide-y divide-white/5">
                                    {problems.map((problem) => (
                                        <motion.div 
                                            key={problem.id} 
                                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                                            className="group px-8 py-5 flex items-center justify-between cursor-pointer transition-all"
                                            onClick={() => handleSolve(problem)}
                                        >
                                            <div className="flex items-center gap-6">
                                                {/* Custom Checkbox */}
                                                <button 
                                                    onClick={(e) => handleToggle(problem.id, e)}
                                                    className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                                                        completed[problem.id] 
                                                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                                        : 'border-white/10 text-transparent hover:border-white/30'
                                                    }`}
                                                >
                                                    <CheckCircle size={18} className={completed[problem.id] ? "scale-100" : "scale-0"} />
                                                </button>
                                                
                                                <div className="flex flex-col">
                                                    <h4 className={`text-lg font-bold transition-all duration-300 ${
                                                        completed[problem.id] 
                                                        ? 'text-text-muted line-through opacity-50' 
                                                        : 'text-white group-hover:text-primary'
                                                    }`}>
                                                        {problem.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                            problem.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                                            problem.difficulty === 'Medium' ? 'border-orange-500/30 text-orange-400 bg-orange-500/5' :
                                                            'border-red-500/30 text-red-400 bg-red-500/5'
                                                        }`}>
                                                            {problem.difficulty}
                                                        </span>
                                                        <a 
                                                            href={problem.url} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-[10px] font-bold text-text-muted hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                                                        >
                                                            LeetCode <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-black text-white bg-primary px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20"
                                                >
                                                    <Play size={14} fill="currentColor" /> 
                                                    <span>Visualize</span>
                                                    <ChevronRight size={14} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
                
                <AnimatePresence>
                    {Object.keys(groupedProblems).length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="text-center py-32 glass-morphism rounded-3xl border border-white/10"
                        >
                            <div className="text-6xl mb-6 grayscale opacity-50">🔍</div>
                            <h3 className="text-2xl font-black text-white mb-2">No patterns found</h3>
                            <p className="text-text-muted">Try adjusting your search or filters to explore more problems.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
