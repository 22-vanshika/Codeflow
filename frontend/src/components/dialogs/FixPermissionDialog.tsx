import { useExecutionStore } from '../../store/executionStore';
import { AlertTriangle, Wrench, X, Check, Code, ArrowRight } from 'lucide-react';

export default function FixPermissionDialog() {
    const {
        showFixDialog,
        validationResult,
        acceptFix,
        rejectFix
    } = useExecutionStore();

    if (!showFixDialog || !validationResult) return null;

    const { issues, fixExplanations } = validationResult;
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-bg-panel border border-border-subtle rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="bg-accent-orange/10 border-b border-border-subtle p-4 flex items-center gap-3">
                    <div className="p-2 bg-accent-orange/20 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-accent-orange" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">Code Validation & Safety Check</h2>
                        <p className="text-sm text-text-muted">Issues found that prevent execution</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4">
                    {/* Error list */}
                    {errors.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-accent-red uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent-red"></span>
                                Issues Found ({errors.length})
                            </h3>
                            {errors.map((error, idx) => (
                                <div key={idx} className="bg-bg-main/50 rounded-lg p-3 border border-red-500/20">
                                    <p className="text-sm text-text-primary">{error.beginnerMessage}</p>
                                    {error.line && (
                                        <p className="text-xs text-text-muted mt-1">Line {error.line}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Warnings */}
                    {warnings.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-accent-orange uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent-orange"></span>
                                Warnings ({warnings.length})
                            </h3>
                            {warnings.map((warning, idx) => (
                                <div key={idx} className="bg-bg-main/50 rounded-lg p-3 border border-orange-500/20">
                                    <p className="text-sm text-text-primary">{warning.beginnerMessage}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Fix explanations */}
                    {fixExplanations && fixExplanations.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-accent-green uppercase tracking-wider flex items-center gap-2">
                                <Wrench className="w-4 h-4" />
                                Proposed Fixes
                            </h3>
                            {fixExplanations.map((fix, idx) => (
                                <div key={idx} className="bg-bg-main/50 rounded-lg p-3 border border-green-500/20 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-accent-red text-xs font-bold uppercase">What was wrong:</span>
                                        <span className="text-sm text-text-primary">{fix.whatWasWrong}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-accent-orange text-xs font-bold uppercase">Why it blocked:</span>
                                        <span className="text-sm text-text-primary">{fix.whyItBlocked}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-accent-green text-xs font-bold uppercase">What was changed:</span>
                                        <span className="text-sm text-text-primary">{fix.whatWasChanged}</span>
                                    </div>
                                    {fix.fixedSnippet && (
                                        <div className="mt-2 bg-bg-main rounded p-2 font-mono text-xs text-accent-cyan border border-border-subtle">
                                            <Code className="w-3 h-3 inline mr-1" />
                                            {fix.fixedSnippet}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Permission Request */}
                <div className="bg-bg-main/50 border-t border-border-subtle p-4">
                    <p className="text-text-primary text-center mb-4">
                        <strong>This code cannot be executed as-is.</strong><br />
                        <span className="text-text-muted text-sm">
                            May I apply minimal fixes (without changing your algorithm) so I can explain the execution flow?
                        </span>
                    </p>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={rejectFix}
                            className="px-4 py-2 rounded-lg bg-bg-panel border border-border-subtle text-text-muted hover:text-white hover:border-accent-red transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            No, I'll Fix it Myself
                        </button>
                        <button
                            onClick={acceptFix}
                            className="px-4 py-2 rounded-lg bg-accent-green/20 border border-accent-green text-accent-green hover:bg-accent-green hover:text-bg-main transition-colors flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Yes, Apply Fixes
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
