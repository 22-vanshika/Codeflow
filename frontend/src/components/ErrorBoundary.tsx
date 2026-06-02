import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error in CodeFlow Frontend:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#07090e] p-6 text-white overflow-y-auto">
                    {/* Glowing background circles for modern premium aesthetic */}
                    <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[100px] sm:blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-secondary/10 rounded-full blur-[80px] sm:blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

                    <div className="relative w-full max-w-2xl bg-bg-header/40 border border-card-border backdrop-blur-3xl rounded-3xl p-6 sm:p-12 shadow-2xl flex flex-col items-center text-center">
                        
                        {/* Glow and Icon */}
                        <div className="p-4 bg-gradient-to-br from-accent-red/20 to-transparent border border-accent-red/20 rounded-2xl shadow-lg shadow-accent-red/10 scale-110 mb-6 relative group">
                            <div className="absolute inset-0 bg-accent-red/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                            <AlertOctagon size={42} className="text-accent-red relative z-10 animate-pulse" />
                        </div>

                        {/* Title & Description */}
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                            Oops! Something went <span className="text-accent-red">wrong</span>.
                        </h1>
                        <p className="text-text-muted text-sm sm:text-base max-w-lg mb-8">
                            An unexpected application crash occurred. Our system logged the incident, but you can attempt a reload or head back home.
                        </p>

                        {/* Interactive error details (Premium disclosure widget) */}
                        {this.state.error && (
                            <div className="w-full text-left bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-6 mb-8 max-h-[220px] overflow-y-auto font-mono text-xs text-text-secondary select-text scrollbar-thin scrollbar-thumb-white/10">
                                <span className="text-accent-red font-bold uppercase tracking-wider block mb-1 text-[10px]">Error Details:</span>
                                <div className="font-semibold text-white/95 break-words mb-2">
                                    {this.state.error.toString()}
                                </div>
                                {this.state.errorInfo && (
                                    <div className="text-text-muted whitespace-pre break-all leading-relaxed">
                                        {this.state.errorInfo.componentStack}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <button
                                onClick={this.handleReload}
                                className="w-full sm:w-auto capsule-btn-primary flex items-center justify-center gap-2 py-3 px-6 text-sm bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all font-bold"
                            >
                                <RotateCw size={16} className="animate-spin-slow" />
                                Reload Application
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all font-bold"
                            >
                                <Home size={16} />
                                Back to Safety
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
