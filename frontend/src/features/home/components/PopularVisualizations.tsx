import { motion } from 'framer-motion';
import { Code2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POPULAR_VISUALIZATIONS = [
    { id: 'binary-search', title: 'Binary Search', desc: 'Visualize the divide and conquer approach on a sorted array.', difficulty: 'Easy' },
    { id: 'merge-sort', title: 'Merge Sort', desc: 'Watch the array split and merge back together step-by-step.', difficulty: 'Medium' },
    { id: 'n-queens', title: 'N-Queens Backtracking', desc: 'See how backtracking explores the state space and un-chooses moves.', difficulty: 'Hard' }
];

export default function PopularVisualizations() {
    const navigate = useNavigate();

    return (
        <section className="py-20 px-6 bg-surface/50 border-t border-white/5 relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Learn DSA Visually</h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Explore some of the most popular algorithms and see exactly how they work under the hood.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {POPULAR_VISUALIZATIONS.map((vis, i) => (
                        <motion.div
                            key={vis.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => navigate('/workspace')}
                            className="bg-background border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Code2 size={24} />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    vis.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                                    vis.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                    'bg-red-500/10 text-red-400'
                                }`}>
                                    {vis.difficulty}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{vis.title}</h3>
                            <p className="text-sm text-text-muted mb-6">
                                {vis.desc}
                            </p>
                            <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                                <Play size={16} className="mr-1" /> View Trace
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
