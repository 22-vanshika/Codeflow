import { Link, useLocation } from 'react-router-dom';
import {
    BookOpen, Cpu, User, LogOut, LayoutDashboard, ChevronDown,
    Newspaper, FileText, Brain, Settings, Bookmark, Menu, Star
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { problemsList } from '../data/problems/index';
import { useState, useEffect, useRef } from 'react';
import AuthModal from '../features/auth/components/AuthModal';
import MobileNavDrawer from './MobileNavDrawer';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItemProps {
    to?: string;
    onClick?: () => void;
    icon: React.ElementType;
    label: string;
    description?: string;
    danger?: boolean;
    accent?: boolean;
}

function DropdownItem({ to, onClick, icon: Icon, label, description, danger, accent }: DropdownItemProps) {
    const colorClass = danger
        ? 'text-accent-red hover:bg-accent-red/10 hover:text-accent-red'
        : accent
        ? 'text-primary hover:bg-primary/10 hover:text-primary'
        : 'text-text-secondary hover:text-white hover:bg-white/5';

    const content = (
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${colorClass}`}>
            <Icon size={17} className="flex-shrink-0" />
            <div>
                <p className="text-sm font-bold leading-none">{label}</p>
                {description && <p className="text-[11px] text-text-muted mt-0.5">{description}</p>}
            </div>
        </div>
    );

    if (to) {
        return <Link to={to} onClick={onClick}>{content}</Link>;
    }
    return <button className="w-full" onClick={onClick}>{content}</button>;
}

export default function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { getProgressPercent, fetchFromBackend, reset } = useProgressStore();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
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

    const closeDropdown = () => setIsProfileOpen(false);

    return (
        <>
        {/* Hover Trigger Zone for Workspace */}
        {isWorkspace && (
            <div
                className="fixed top-0 left-0 right-0 h-4 z-[100]"
                onMouseEnter={() => setIsHovered(true)}
            />
        )}

        {/* Mobile Drawer */}
        <MobileNavDrawer
            isOpen={isMobileDrawerOpen}
            onClose={() => setIsMobileDrawerOpen(false)}
            onOpenAuth={() => setIsAuthOpen(true)}
        />

        <nav
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed top-3 left-1/2 -translate-x-1/2 max-w-7xl w-[calc(100%-2rem)] h-[64px] z-50 bg-bg-header/80 backdrop-blur-2xl border border-card-border rounded-full flex items-center justify-between px-4 sm:px-8 shadow-xl transition-all duration-500 ease-in-out ${
                isWorkspace && !isHovered ? '-translate-y-[calc(100%+24px)]' : 'translate-y-0'
            }`}
        >
            {/* Left: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="lg:hidden p-2 text-text-muted hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                    aria-label="Open navigation"
                >
                    <Menu size={22} />
                </button>

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
            </div>

            {/* Center / Right: Nav Links + Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
                {/* Desktop nav links */}
                <Link to="/sheet" className={`relative hidden sm:flex items-center space-x-2 text-sm font-bold transition-all duration-300 ${location.pathname === '/sheet' ? 'text-primary' : 'text-text-muted hover:text-white'}`}>
                    <BookOpen size={18} />
                    <span className="hidden md:inline">DSA Sheet</span>
                    {location.pathname === '/sheet' && (
                        <motion.div layoutId="nav-underline" className="absolute -bottom-[22px] left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                </Link>

                <Link to="/algorithms" className={`relative hidden md:flex items-center space-x-2 text-sm font-bold transition-all duration-300 ${location.pathname === '/algorithms' ? 'text-primary' : 'text-text-muted hover:text-white'}`}>
                    <Brain size={16} />
                    <span>Algorithms</span>
                    {location.pathname === '/algorithms' && (
                        <motion.div layoutId="nav-underline" className="absolute -bottom-[22px] left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                </Link>

                <Link to="/docs" className={`relative hidden lg:flex items-center space-x-2 text-sm font-bold transition-all duration-300 ${location.pathname === '/docs' ? 'text-primary' : 'text-text-muted hover:text-white'}`}>
                    <FileText size={16} />
                    <span>Docs</span>
                    {location.pathname === '/docs' && (
                        <motion.div layoutId="nav-underline" className="absolute -bottom-[22px] left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                </Link>

                <Link to="/blog" className={`relative hidden xl:flex items-center space-x-2 text-sm font-bold transition-all duration-300 ${location.pathname === '/blog' ? 'text-primary' : 'text-text-muted hover:text-white'}`}>
                    <Newspaper size={16} />
                    <span>Blog</span>
                    {location.pathname === '/blog' && (
                        <motion.div layoutId="nav-underline" className="absolute -bottom-[22px] left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                </Link>

                <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

                {/* Progress Mini Widget */}
                <div className="hidden xl:flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-wider">Progress</div>
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
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
                                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-black text-white">
                                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-bg-main rounded-full" />
                            </div>
                            <span className="text-sm font-bold text-text-primary hidden md:inline">
                                {user.displayName?.split(' ')[0] || 'Member'}
                            </span>
                            <ChevronDown size={14} className={`text-text-muted group-hover:text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-64 bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl z-[60]"
                                >
                                    {/* User Info */}
                                    <div className="px-4 py-3 mb-1">
                                        <div className="flex items-center gap-3">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm">
                                                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-white font-bold text-sm truncate">{user.displayName || 'User'}</p>
                                                <p className="text-text-muted text-xs truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/5 pt-1 space-y-0.5">
                                        <DropdownItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" description="Your visualizations & stats" onClick={closeDropdown} />
                                        <DropdownItem to="/profile-settings" icon={User} label="Edit Profile" description="Name, avatar, social links" onClick={closeDropdown} />
                                        <DropdownItem to="/dashboard" icon={BookOpen} label="Saved Visualizations" onClick={closeDropdown} />
                                        <DropdownItem to="/sheet" icon={Star} label="Learning Progress" description="Track DSA topics" onClick={closeDropdown} />
                                        <DropdownItem to="/blog" icon={Newspaper} label="Blog" description="Insights & interview experiences" onClick={closeDropdown} />
                                        <DropdownItem to="/algorithm" icon={Brain} label="Algorithm Guide" description="Master core patterns" onClick={closeDropdown} />
                                    </div>

                                    <div className="border-t border-white/5 mt-1 pt-1 space-y-0.5">
                                        <DropdownItem to="/docs" icon={FileText} label="Documentation" onClick={closeDropdown} />
                                        <DropdownItem to="/contact" icon={Bookmark} label="Feedback & Suggestions" onClick={closeDropdown} />
                                        <DropdownItem to="/profile-settings" icon={Settings} label="Settings" description="Theme & preferences" onClick={closeDropdown} />
                                    </div>

                                    <div className="border-t border-white/5 mt-1 pt-1">
                                        <DropdownItem
                                            icon={LogOut}
                                            label="Sign Out"
                                            danger
                                            onClick={async () => {
                                                await logout();
                                                closeDropdown();
                                            }}
                                        />
                                    </div>
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
