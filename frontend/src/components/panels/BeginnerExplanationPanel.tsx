
import { useExecutionStore } from '../../store/executionStore';
import { Sparkles, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';

export default function BeginnerExplanationPanel() {
    const { traces, currentStepIndex, analysis } = useExecutionStore();

    // Safety check
    if (!traces || traces.length === 0 || currentStepIndex < 0 || currentStepIndex >= traces.length) {
        return null;
    }

    const currentTrace = traces[currentStepIndex];
    const visualization = currentTrace.visualization;

    // Get three-part explanation from visualization hints
    const what = visualization?.explanation?.what || currentTrace.explanation;
    const why = visualization?.explanation?.why || "This is part of the program's normal execution.";
    const next = visualization?.explanation?.next || "We'll continue to the next step.";

    // Determine the step type for styling
    const isLoop = currentTrace.type === 'loop_start' || currentTrace.type === 'loop_continue' || currentTrace.type === 'loop_end';
    const isCondition = currentTrace.type === 'condition';
    const loopIteration = visualization?.loopIteration;

    return (
        <div className="bg-bg-panel border-t border-border-subtle p-4 animate-slide-up">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${isLoop ? 'bg-accent-orange/20' : isCondition ? 'bg-accent-purple/20' : 'bg-accent-cyan/20'}`}>
                    <Sparkles className={`w-5 h-5 ${isLoop ? 'text-accent-orange' : isCondition ? 'text-accent-purple' : 'text-accent-cyan'}`} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide opacity-70">
                        Step {currentStepIndex + 1}
                        {loopIteration && <span className="text-accent-orange ml-2">• Iteration {loopIteration}</span>}
                    </h3>
                </div>
            </div>

            {/* Three-part explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* What happened */}
                <div className="explanation-what bg-bg-main/50 rounded-lg p-3 border border-border-subtle/50">
                    <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="w-4 h-4 text-accent-cyan" />
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">What happened</span>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">
                        {what}
                    </p>
                </div>

                {/* Why it happened */}
                <div className="explanation-why bg-bg-main/50 rounded-lg p-3 border border-border-subtle/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-accent-purple" />
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-purple">Why</span>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">
                        {why}
                    </p>
                </div>

                {/* What's next */}
                <div className="explanation-next bg-bg-main/50 rounded-lg p-3 border border-border-subtle/50">
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="w-4 h-4 text-accent-green" />
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-green">Next</span>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">
                        {next}
                    </p>
                </div>
            </div>

            {/* Type indicator badges */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
                {currentTrace.type === 'assignment' && (
                    <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-main/50 px-3 py-1.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-accent-green"></span>
                        Variable Updated
                    </div>
                )}
                {isCondition && (
                    <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-main/50 px-3 py-1.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-accent-purple"></span>
                        Decision Point
                    </div>
                )}
                {isLoop && (
                    <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-main/50 px-3 py-1.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-accent-orange"></span>
                        Loop Execution
                    </div>
                )}
                {currentTrace.type === 'function_call' && (
                    <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-main/50 px-3 py-1.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-accent-cyan"></span>
                        Function Call
                    </div>
                )}
                {currentTrace.type === 'return' && (
                    <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-main/50 px-3 py-1.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-accent-red"></span>
                        Return Statement
                    </div>
                )}
            </div>
        </div>
    );
}

