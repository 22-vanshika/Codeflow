import { motion } from 'framer-motion';
import { BookOpen, Info, Target, AlertCircle, Code, ListFilter } from 'lucide-react';

interface ProblemDescriptionProps {
    problem: {
        title: string;
        description?: string;
        difficulty: string;
        topicTags?: string[];
        examples?: {
            input: string;
            output: string;
            explanation?: string;
        }[];
        constraints?: string[];
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
            <div className="space-y-10 pb-10">
                {/* Problem Statement */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <BookOpen size={18} />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Problem Statement</h3>
                    </div>
                    <div className="text-text-secondary leading-relaxed text-[13px] space-y-4">
                        {problem.description ? (
                            problem.description.split('\n\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))
                        ) : (
                            <p className="italic">No description provided for this problem.</p>
                        )}
                    </div>
                </section>

                {/* Examples */}
                {problem.examples && problem.examples.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-5 text-secondary">
                            <Code size={18} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Examples</h3>
                        </div>
                        <div className="space-y-6">
                            {problem.examples.map((example, i) => (
                                <div key={i} className="space-y-3">
                                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Example {i + 1}</h4>
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3 font-mono text-[12px]">
                                        <div>
                                            <span className="text-secondary font-bold mr-2">Input:</span>
                                            <span className="text-text-primary">{example.input}</span>
                                        </div>
                                        <div>
                                            <span className="text-accent-green font-bold mr-2">Output:</span>
                                            <span className="text-text-primary">{example.output}</span>
                                        </div>
                                        {example.explanation && (
                                            <div>
                                                <span className="text-text-muted font-bold mr-2">Explanation:</span>
                                                <span className="text-text-secondary italic">{example.explanation}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4 text-accent-cyan">
                            <ListFilter size={18} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Constraints</h3>
                        </div>
                        <ul className="space-y-2.5">
                            {problem.constraints.map((constraint, i) => (
                                <li key={i} className="flex items-start gap-3 text-[12px] text-text-secondary">
                                    <div className="mt-1.5 w-1 h-1 rounded-full bg-accent-cyan shrink-0" />
                                    <code className="bg-white/5 px-1.5 py-0.5 rounded text-accent-cyan">{constraint}</code>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Pro Tip */}
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                        <AlertCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pro Tip</span>
                    </div>
                    <p className="text-[12px] text-text-muted leading-relaxed">
                        Use the <span className="text-primary font-bold">TRACE</span> button to visualize how your code executes step-by-step. This is extremely helpful for debugging recursive logic and pointer manipulations.
                    </p>
                </div>
            </div>
        </div>
    );
}
