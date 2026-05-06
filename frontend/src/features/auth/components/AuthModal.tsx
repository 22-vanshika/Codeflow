import { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, githubProvider } from '../../../config/firebase';
import { useAuthStore } from '../../../store/authStore';
import { X, Github, Mail, Lock, User as UserIcon } from 'lucide-react';
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
    
    const { setUser } = useAuthStore();

    if (!isOpen) return null;

    const handleGithubAuth = async () => {
        try {
            setError('');
            const result = await signInWithPopup(auth, githubProvider);
            setUser(result.user);
            
            // Extract GitHub access token from credential if available
            // Note: Firebase may not return the OAuth access token directly in standard signInWithPopup
            // depending on the exact configuration. For now we just sync the user profile.
            
            // Sync with backend
            await syncUserWithBackend(result.user);
            onClose();
        } catch (err: any) {
            const errorCode = err.code;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                setError('An account already exists with the same email. Please use your email and password.');
            } else if (errorCode === 'auth/popup-closed-by-user') {
                setError('');
            } else {
                setError('Failed to sign in with GitHub. Please try again.');
            }
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Can also update profile with name here using updateProfile
            }
            setUser(userCredential.user);
            await syncUserWithBackend(userCredential.user);
            onClose();
        } catch (err: any) {
            const errorCode = err.code;
            if (errorCode === 'auth/email-already-in-use') {
                setError('Account already exists! Please log in instead.');
                setIsLogin(true);
            } else if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
                setError('Invalid email or password.');
            } else if (errorCode === 'auth/weak-password') {
                setError('Password must be at least 6 characters long.');
            } else {
                setError('Authentication failed. Please try again.');
            }
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-text-muted hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {isLogin ? 'Welcome back' : 'Create an account'}
                            </h2>
                            <p className="text-text-muted text-sm">
                                {isLogin ? 'Enter your details to access your dashboard' : 'Join CodeFlow to save and share visualizations'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button 
                            onClick={handleGithubAuth}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#24292e] hover:bg-[#2f363d] text-white font-medium transition-colors mb-6 border border-white/5"
                        >
                            <Github size={20} />
                            Continue with GitHub
                        </button>

                        <div className="relative flex items-center py-2 mb-6">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-text-muted text-sm">or</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white outline-none transition-all"
                                            placeholder="John Doe"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white outline-none transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-colors mt-2 shadow-lg shadow-primary/20"
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-text-muted">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
