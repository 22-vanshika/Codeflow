import { motion } from 'framer-motion';
import { BookOpen, Info, Target, AlertCircle } from 'lucide-react';

interface ProblemDescriptionProps {
    problem: {
        title: string;
        description?: string;
        difficulty: string;
        topicTags?: string[];
    } | null;
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
    if (!problem) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-text-muted p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Info size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">No Problem Selected</h3>
                    <p className="text-sm">Select a problem from the DSA Sheet to view its description and constraints.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-8 select-text">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                        problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                        {problem.difficulty}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
                    {problem.title}
                </h1>
            </div>

            {/* Tags */}
            {problem.topicTags && problem.topicTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {problem.topicTags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] font-bold text-text-secondary hover:text-white hover:border-primary/30 transition-all cursor-default">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Description Body */}
            <div className="space-y-6">
                <section>
                    <div className="flex items-center gap-2 mb-3 text-primary">
                        <BookOpen size={18} />
                        <h3 className="text-sm font-black uppercase tracking-widest">Problem Statement</h3>
                    </div>
                    <div className="text-text-secondary leading-relaxed text-sm prose prose-invert max-w-none">
                        {problem.description ? (
                            <div dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <p className="italic">No description provided for this problem.</p>
                        )}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-3 text-secondary">
                        <Target size={18} />
                        <h3 className="text-sm font-black uppercase tracking-widest">Goal</h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Implement the solution to pass all hidden test cases. Focus on optimizing the time and space complexity as much as possible.
                    </p>
                </section>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                        <AlertCircle size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Pro Tip</span>
                    </div>
                    <p className="text-[12px] text-text-muted leading-relaxed">
                        Use the <span className="text-primary font-bold">TRACE</span> button to visualize how your code executes step-by-step. This is extremely helpful for debugging recursive logic and pointer manipulations.
                    </p>
                </div>
            </div>
        </div>
    );
}
