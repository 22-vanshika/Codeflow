import { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, githubProvider } from '../../../config/firebase';
import { useAuthStore } from '../../../store/authStore';
import { X, Github, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { setUser } = useAuthStore();

    const handleGithubAuth = async () => {
        setIsLoading(true);
        try {
            setError('');
            const result = await signInWithPopup(auth, githubProvider);
            await syncUserWithBackend(result.user);
            setUser(result.user);
            onClose();
        } catch (err: any) {
            const errorCode = err.code;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                setError('An account already exists with the same email.');
            } else if (errorCode !== 'auth/popup-closed-by-user') {
                setError('Failed to sign in with GitHub.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            }
            
            await syncUserWithBackend(userCredential.user);
            setUser(userCredential.user);
            onClose();
        } catch (err: any) {
            const errorCode = err.code;
            if (errorCode === 'auth/email-already-in-use') {
                setError('Account already exists! Please log in.');
                setIsLogin(true);
            } else if (errorCode === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else {
                setError('Authentication failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const syncUserWithBackend = async (firebaseUser: any) => {
        try {
            const token = await firebaseUser.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await fetch(`${API_URL}/api/users/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || name || 'User',
                    photoURL: firebaseUser.photoURL
                })
            });
        } catch (err) {
            console.error('Failed to sync user with backend', err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-bg-main/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-[440px] liquid-glass-card shadow-2xl overflow-hidden z-10"
                    >
                        {/* Internal Decorative Blobs */}
                        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-secondary/20 blur-[80px] rounded-full" />

                        <div className="relative p-10">
                            {/* Close Button */}
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-text-muted hover:text-text-primary rounded-full bg-surface/50 hover:bg-border-subtle/50 transition-all border border-border-subtle"
                            >
                                <X size={18} />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-10">
                                <motion.div 
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20 mb-6"
                                >
                                    <ShieldCheck size={24} className="text-white" />
                                </motion.div>
                                <h2 className="text-3xl font-black text-text-primary mb-2 tracking-tight">
                                    {isLogin ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p className="text-text-secondary text-sm font-medium">
                                    {isLogin ? 'Sign in to sync your DSA progress' : 'Join CodeFlow to master your patterns'}
                                </p>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mb-6 overflow-hidden"
                                    >
                                        <div className="p-4 rounded-2xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-bold flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                                            {error}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Social Auth */}
                            <button 
                                onClick={handleGithubAuth}
                                disabled={isLoading}
                                className="group relative w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-surface hover:bg-border-subtle/20 text-text-primary font-bold transition-all border border-border-subtle overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                <Github size={20} className="relative z-10" />
                                <span className="relative z-10">Continue with GitHub</span>
                            </button>

                            <div className="relative flex items-center py-8">
                                <div className="flex-grow border-t border-border-subtle"></div>
                                <span className="flex-shrink-0 mx-4 text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">or email</span>
                                <div className="flex-grow border-t border-border-subtle"></div>
                            </div>

                            {/* Email Form */}
                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {!isLogin && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Display Name</label>
                                            <div className="relative group">
                                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                                <input 
                                                    type="text" 
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary font-bold placeholder:text-text-muted/50 outline-none transition-all"
                                                    placeholder="Example: John Doe"
                                                    required={!isLogin}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary font-bold placeholder:text-text-muted/50 outline-none transition-all"
                                            placeholder="Example: user@codeflow.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-14 py-4 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary font-bold placeholder:text-text-muted/50 outline-none transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full py-4 px-6 rounded-2xl bg-primary text-white font-black transition-all mt-4 overflow-hidden shadow-lg shadow-primary/20 hover:shadow-primary/40"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                                        {!isLoading && <ArrowRight size={18} />}
                                    </span>
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-10 text-center">
                                <p className="text-sm font-bold text-text-secondary">
                                    {isLogin ? "New to CodeFlow? " : "Already have an account? "}
                                    <button 
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-primary hover:text-text-primary transition-colors font-black inline-flex items-center gap-1"
                                    >
                                        {isLogin ? 'Create Account' : 'Sign In'}
                                        <Sparkles size={14} />
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
