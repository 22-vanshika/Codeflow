import { create } from 'zustand';
import { type User, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthState {
    user: User | null;
    githubAccessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setGithubAccessToken: (token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    githubAccessToken: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setGithubAccessToken: (githubAccessToken) => set({ githubAccessToken }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null, isAuthenticated: false, githubAccessToken: null });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}));
