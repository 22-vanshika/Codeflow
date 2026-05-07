import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, ExternalLink, Play } from 'lucide-react';
import { problemsList, type ProblemDefinition } from '../data/problems/index';


import { useProgressStore } from '../store/progressStore';


import { useAuthStore } from '../store/authStore';


export default function CuratedSheet() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { completed, toggleCompletion } = useProgressStore();
    
    // Group problems by category (defensive: never blank the page)
    let groupedProblems: Record<string, ProblemDefinition[]> = {};
    let fatalError: Error | null = null;
    try {
        groupedProblems = (problemsList ?? []).reduce((acc, problem) => {
            const category = problem?.category || 'Uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(problem);
            return acc;
        }, {} as Record<string, ProblemDefinition[]>);
    } catch (e) {
        fatalError = e instanceof Error ? e : new Error(String(e));
        groupedProblems = {};
        // eslint-disable-next-line no-console
        console.error('[CuratedSheet] Failed to build groupedProblems', e);
    }

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
        <div className="min-h-screen pt-[56px] pb-20 bg-bg-main text-text-primary overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-12">
                
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-accent-primary/10 rounded-2xl mb-6 border border-accent-primary/20">
                        <BookOpen size={32} className="text-accent-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">SWE 180 Sheet</h1>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        A curated list of essential Data Structures and Algorithms problems. Master these patterns to ace your technical interviews.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="bg-bg-panel border border-border-subtle rounded-xl p-6 mb-12 shadow-lg">
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <h3 className="font-bold text-lg text-white">Your Progress</h3>
                            <p className="text-sm text-text-muted">{solvedCount} of {totalProblems} problems solved</p>
                        </div>
                        <span className="text-2xl font-bold border-b-2 border-accent-green text-accent-green pb-1">{progressPercent}%</span>
                    </div>
                    <div className="h-3 bg-bg-main rounded-full overflow-hidden border border-border-subtle">
                        <div 
                            className="h-full bg-accent-green transition-all duration-500 ease-out relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Category Lists */}
                <div className="space-y-10">
                    {fatalError && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-200">
                            <div className="font-bold mb-1">Something crashed while loading the sheet.</div>
                            <div className="text-red-200/80">
                                Open the browser console for the exact error. This page should still render, but the problem list may be empty until it’s fixed.
                            </div>
                        </div>
                    )}
                    {Object.entries(groupedProblems).map(([category, problems]) => {
                        const catSolved = problems.filter(p => completed[p.id]).length;
                        return (
                            <div key={category} className="bg-bg-panel border border-border-subtle rounded-xl overflow-hidden shadow-md">
                                {/* Category Header */}
                                <div className="bg-bg-main/50 px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-white tracking-wide">{category}</h2>
                                    <span className="text-xs font-semibold px-3 py-1 bg-border-subtle rounded-full text-text-muted">
                                        {catSolved} / {problems.length}
                                    </span>
                                </div>
                                
                                {/* Problem List */}
                                <div className="divide-y divide-border-subtle/50">
                                    {problems.map((problem) => (
                                        <div 
                                            key={problem.id} 
                                            className="group px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                                            onClick={() => handleSolve(problem)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={(e) => handleToggle(problem.id, e)}
                                                    className={`p-1 rounded-full transition-colors ${completed[problem.id] ? 'text-accent-green' : 'text-text-muted hover:text-white'}`}
                                                >
                                                    <CheckCircle size={22} className={completed[problem.id] ? "fill-accent-green/20" : ""} />
                                                </button>
                                                
                                                <div>
                                                    <h4 className={`font-semibold text-base mb-1 transition-colors ${completed[problem.id] ? 'text-text-muted line-through decoration-text-muted/50' : 'text-white group-hover:text-accent-primary'}`}>
                                                        {problem.title}
                                                    </h4>
                                                    <a 
                                                        href={problem.url} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-xs text-text-muted hover:text-accent-cyan flex items-center gap-1 w-fit"
                                                    >
                                                        View on LeetCode <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                    problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    problem.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                    {problem.difficulty}
                                                </span>
                                                
                                                <button className="opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold text-bg-main bg-accent-primary px-3 py-1.5 rounded pr-4 transition-all hover:bg-blue-400 translate-x-2 group-hover:translate-x-0">
                                                    <Play size={12} fill="currentColor" /> Visualize
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
            </div>
        </div>
    );
}
