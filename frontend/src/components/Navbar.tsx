import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Cpu, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { problemsList } from '../data/problems/index';
import { useState, useEffect, useRef } from 'react';
import AuthModal from '../features/auth/components/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { getProgressPercent, fetchFromBackend, reset } = useProgressStore();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isWorkspace = location.pathname === '/workspace';
    const totalProblems = problemsList?.length ?? 0;
    const progressPercent = getProgressPercent(totalProblems);

    useEffect(() => {
        if (user) {
            fetchFromBackend(user);
        } else {
            reset();
        }
    }, [user, fetchFromBackend, reset]);

    useEffect(() => {
        const handleOpenAuth = () => setIsAuthOpen(true);
        document.addEventListener('open-auth-modal', handleOpenAuth);
        
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('open-auth-modal', handleOpenAuth);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
        {/* Hover Trigger Zone for Workspace */}
        {isWorkspace && (
            <div 
                className="fixed top-0 left-0 right-0 h-4 z-[100]" 
                onMouseEnter={() => setIsHovered(true)}
            />
        )}

        <nav 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed top-3 left-1/2 -translate-x-1/2 max-w-7xl w-[calc(100%-2rem)] h-[64px] z-50 bg-bg-header/80 backdrop-blur-2xl border border-card-border rounded-full flex items-center justify-between px-6 sm:px-8 shadow-xl transition-all duration-500 ease-in-out ${
                isWorkspace && !isHovered ? '-translate-y-[calc(100%+24px)]' : 'translate-y-0'
            }`}
        >
            {/* Left: Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300">
                    <Cpu size={22} className="text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-xl leading-none tracking-tighter text-white">
                        Code<span className="text-primary">Flow</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">Visualizer</span>
                </div>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center space-x-6">
                <Link to="/sheet" className={`relative flex items-center space-x-2 text-sm font-bold transition-all duration-300 ${location.pathname === '/sheet' ? 'text-primary' : 'text-text-muted hover:text-white'}`}>
                    <BookOpen size={18} />
                    <span className="hidden sm:inline">DSA Sheet</span>
                    {location.pathname === '/sheet' && (
                        <motion.div layoutId="nav-underline" className="absolute -bottom-[22px] left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                </Link>
                
                <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

                <ThemeToggle />

                {/* Progress Mini Widget */}
                <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-wider">Progress</div>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="h-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                        />
                    </div>
                    <span className="text-xs font-bold text-white">{progressPercent}%</span>
                </div>
                
                {/* Auth / Profile */}
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2.5 p-1 pr-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 group"
                        >
                            <div className="relative">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/10" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-black text-white">
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-bg-main rounded-full" />
                            </div>
                            <span className="text-sm font-bold text-text-primary hidden md:inline">{user.displayName?.split(' ')[0] || 'Member'}</span>
                            <ChevronDown size={14} className={`text-text-muted group-hover:text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-56 bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl z-[60]"
                                >
                                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Account</p>
                                        <p className="text-sm font-bold text-white truncate">{user.email}</p>
                                    </div>
                                    
                                    <Link 
                                        to="/dashboard" 
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                    >
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                    
                                    <button 
                                        onClick={async () => {
                                            await logout();
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all mt-1"
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAuthOpen(true)}
                        className="capsule-btn-primary py-2 px-5 text-xs flex items-center gap-2"
                    >
                        <User size={15} />
                        Sign In
                    </button>
                )}
            </div>
        </nav>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
