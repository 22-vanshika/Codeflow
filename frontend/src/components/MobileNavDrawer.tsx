import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, BookOpen, Cpu, Brain, Code2, Newspaper, FileText, LayoutDashboard, Settings, LogOut, Bookmark } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/workspace', icon: Code2, label: 'Visualizer' },
  { to: '/sheet', icon: BookOpen, label: 'DSA Sheet' },
  { to: '/algorithms', icon: Brain, label: 'Algorithms' },
  { to: '/blog', icon: Newspaper, label: 'Blog' },
  { to: '/docs', icon: FileText, label: 'Documentation' },
];

const userNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile-settings', icon: Settings, label: 'Profile Settings' },
];

export default function MobileNavDrawer({ isOpen, onClose, onOpenAuth }: MobileNavDrawerProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleSignOut = async () => {
    await logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed left-0 top-0 bottom-0 z-[90] w-72 bg-bg-panel border-r border-border-subtle flex flex-col shadow-2xl shadow-black/50 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                  <Cpu size={18} className="text-white" />
                </div>
                <div>
                  <span className="font-black text-lg text-white tracking-tight leading-none block">
                    Code<span className="text-primary">Flow</span>
                  </span>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Visualizer</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-text-muted hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Snippet */}
            {user ? (
              <div className="px-4 py-4 border-b border-border-subtle shrink-0">
                <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-2xl border border-border-subtle">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{user.displayName || 'User'}</p>
                    <p className="text-text-muted text-xs truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 border-b border-border-subtle shrink-0">
                <button
                  onClick={() => { onClose(); onOpenAuth?.(); }}
                  className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Sign In / Create Account
                </button>
              </div>
            )}

            {/* Main Nav */}
            <nav className="flex-1 p-4 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted px-3 mb-3">Navigation</p>
              {navItems.map(item => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${ 
                      isActive
                        ? 'bg-primary/15 text-primary border border-primary/20'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-primary' : ''} />
                    {item.label}
                  </Link>
                );
              })}

              {user && (
                <>
                  <div className="pt-4 pb-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted px-3 mb-3">My Account</p>
                  </div>
                  {userNavItems.map(item => {
                    const isActive = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${ 
                          isActive
                            ? 'bg-primary/15 text-primary border border-primary/20'
                            : 'text-text-secondary hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <item.icon size={18} className={isActive ? 'text-primary' : ''} />
                        {item.label}
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border-subtle shrink-0 space-y-2">
              <Link to="/contact" onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-white hover:bg-white/5 transition-all font-bold">
                <Bookmark size={16} /> Feedback & Suggestions
              </Link>
              {user && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-accent-red hover:bg-accent-red/10 transition-all font-bold"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
