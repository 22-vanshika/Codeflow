import { motion } from 'framer-motion';
import { Code2, Play, ChevronRight, ChevronLeft, Search, Link2, GitBranch, Network, Layers, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import { problemsMap, problemsList } from '../../../data/problems/index';

// Helper to get random problems
const getRandomProblems = (list: any[], count: number) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Category Icon Helper for Visual Quality
const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('search')) return <Search size={22} />;
    if (cat.includes('list')) return <Link2 size={22} />;
    if (cat.includes('tree') || cat.includes('bst')) return <GitBranch size={22} />;
    if (cat.includes('graph')) return <Network size={22} />;
    if (cat.includes('stack') || cat.includes('queue') || cat.includes('heap')) return <Layers size={22} />;
    if (cat.includes('dynamic') || cat.includes('dp')) return <Cpu size={22} />;
    return <Code2 size={22} />;
};

export default function PopularVisualizations() {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Pick 7 random problems on mount
    const randomProblems = useMemo(() => {
        if (!problemsList || problemsList.length === 0) return [];
        return getRandomProblems(problemsList, 7);
    }, []);

    const handleViewTrace = (id: string) => {
        const problem = problemsMap[id];
        if (problem) {
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
        } else {
            navigate('/workspace');
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 px-6 bg-black/5 border-t border-border-subtle relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="text-left">
                        <h2 className="text-3xl sm:text-5xl font-black text-text-primary mb-4 tracking-tight">Learn DSA Visually</h2>
                        <p className="text-text-secondary max-w-2xl text-base sm:text-lg leading-relaxed">
                            Explore some of the most popular algorithms and see exactly how they work under the hood.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => scroll('left')}
                            className="p-2.5 rounded-full bg-white/5 dark:bg-white/5 border border-border-subtle text-text-secondary hover:text-text-primary hover:border-primary/20 transition-all cursor-pointer"
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="p-2.5 rounded-full bg-white/5 dark:bg-white/5 border border-border-subtle text-text-secondary hover:text-text-primary hover:border-primary/20 transition-all cursor-pointer"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {randomProblems.map((problem, i) => (
                        <motion.div
                            key={problem.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => handleViewTrace(problem.id)}
                            className="flex-none w-[320px] liquid-glass-card p-6 transition-all cursor-pointer group snap-start"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform flex items-center justify-center">
                                    {getCategoryIcon(problem.category)}
                                </div>
                                <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold border ${
                                    problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                    {problem.difficulty}
                                </span>
                            </div>
                            
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">{problem.title}</h3>
                                <p className="text-sm text-text-secondary line-clamp-2">
                                    Master the <span className="text-text-primary font-medium">{problem.category}</span> pattern with step-by-step visual execution.
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-primary font-bold">
                                    <Play size={16} className="mr-2 fill-primary/20" /> View Trace
                                </div>
                                <ChevronRight size={18} className="text-text-secondary group-hover:translate-x-1 group-hover:text-primary transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* Custom Styles for hiding scrollbar */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
