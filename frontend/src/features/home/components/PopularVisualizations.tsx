import { motion } from 'framer-motion';
import { Code2, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import { problemsMap, problemsList } from '../../../data/problems/index';

// Helper to get random problems
const getRandomProblems = (list: any[], count: number) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
        <section className="py-20 px-6 bg-surface/50 border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold text-white mb-4">Learn DSA Visually</h2>
                        <p className="text-text-muted max-w-2xl">
                            Explore some of the most popular algorithms and see exactly how they work under the hood.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-all"
                        >
                            <ChevronRight size={24} />
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
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => handleViewTrace(problem.id)}
                            className="flex-none w-[320px] bg-background border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group shadow-xl snap-start"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                                    <Code2 size={28} />
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
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{problem.title}</h3>
                                <p className="text-sm text-text-muted line-clamp-2">
                                    Master the <span className="text-text-primary font-medium">{problem.category}</span> pattern with step-by-step visual execution.
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-primary font-bold">
                                    <Play size={16} className="mr-2 fill-primary/20" /> View Trace
                                </div>
                                <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 group-hover:text-primary transition-all" />
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
