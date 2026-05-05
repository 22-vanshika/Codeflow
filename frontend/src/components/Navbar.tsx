import { Link, useLocation } from 'react-router-dom';
import { Github, BookOpen, Cpu, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import AuthModal from '../features/auth/components/AuthModal';

export default function Navbar() {
    const location = useLocation();
    const isVisualizer = location.pathname === '/visualizer';
    const { user } = useAuthStore();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    useEffect(() => {
        const handleOpenAuth = () => setIsAuthOpen(true);
        document.addEventListener('open-auth-modal', handleOpenAuth);
        return () => document.removeEventListener('open-auth-modal', handleOpenAuth);
    }, []);

    return (
        <>
        <nav className="fixed top-0 left-0 right-0 h-[56px] z-50 bg-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                    <Cpu size={20} className="text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg leading-none tracking-tight text-text-primary">
                        Code<span className="text-primary">Flow</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Visualize Execution</span>
                </div>
            </Link>

            {/* Center: Language Selector (Only visible in Visualizer) */}
            {isVisualizer && (
                <div className="hidden md:flex items-center px-4 py-1.5 bg-surface rounded-full border border-white/10 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    <span className="text-sm font-mono font-bold text-text-primary">C++</span>
                    <span className="ml-2 text-xs text-text-muted px-2 py-0.5 rounded bg-white/5">Beta</span>
                </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
                <Link to="/sheet" className="text-text-muted hover:text-primary transition-colors flex items-center space-x-1 text-sm font-medium">
                    <BookOpen size={16} />
                    <span className="hidden sm:inline">SWE180</span>
                </Link>
                <a href="https://github.com/anshikaasati/codeflow" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors flex items-center space-x-1 text-sm font-medium">
                    <Github size={16} />
                    <span className="hidden sm:inline">GitHub</span>
                </a>
                
                {/* Auth / Profile */}
                {user ? (
                    <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        )}
                        <span className="text-sm font-medium hidden md:inline">{user.displayName?.split(' ')[0] || 'User'}</span>
                    </Link>
                ) : (
                    <button 
                        onClick={() => setIsAuthOpen(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors font-medium text-sm border border-primary/20"
                    >
                        <User size={16} />
                        Login
                    </button>
                )}
            </div>

        </nav>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
