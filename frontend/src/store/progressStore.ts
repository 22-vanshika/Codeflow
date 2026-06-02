import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_URL } from '../config/api';

interface ProgressState {
    completed: Record<string, boolean>;
    toggleCompletion: (id: string, user?: any) => Promise<void>;
    setCompleted: (completed: Record<string, boolean>) => void;
    getProgressPercent: (total: number) => number;
    getSolvedCount: () => number;
    fetchFromBackend: (user: any) => Promise<void>;
    syncWithBackend: (user: any) => Promise<void>;
    reset: () => void;
}



export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            completed: {},
            
            toggleCompletion: async (id: string, user?: any) => {
                const newCompleted = {
                    ...get().completed,
                    [id]: !get().completed[id]
                };
                set({ completed: newCompleted });

                if (user) {
                    await get().syncWithBackend(user);
                }
            },

            setCompleted: (completed: Record<string, boolean>) => {
                set({ completed });
            },

            getSolvedCount: () => {
                return Object.values(get().completed).filter(Boolean).length;
            },

            getProgressPercent: (total: number) => {
                if (total === 0) return 0;
                const solved = get().getSolvedCount();
                return Math.round((solved / total) * 100);
            },

            fetchFromBackend: async (user: any) => {
                if (!user) return;
                try {
                    const token = await user.getIdToken();
                    console.log('[ProgressStore] Fetching from backend...');
                    const res = await fetch(`${API_URL}/api/users/progress`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    console.log('[ProgressStore] Fetch status:', res.status);
                    if (res.ok) {
                        const data = await res.json();
                        console.log('[ProgressStore] Received progress items:', Object.keys(data.progress || {}).length);
                        set({ completed: data.progress || {} });
                    }
                } catch (err) {
                    console.error('[ProgressStore] Failed to fetch progress from backend', err);
                }
            },

            syncWithBackend: async (user: any) => {
                if (!user) return;
                try {
                    const token = await user.getIdToken();
                    console.log('[ProgressStore] Syncing to backend...', Object.keys(get().completed).length, 'items');
                    const res = await fetch(`${API_URL}/api/users/progress`, {
                        method: 'POST',
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ progress: get().completed })
                    });
                    console.log('[ProgressStore] Sync status:', res.status);
                } catch (err) {
                    console.error('[ProgressStore] Failed to sync progress with backend', err);
                }
            },

            reset: () => {
                set({ completed: {} });
                localStorage.removeItem('codeflow-progress');
            }
        }),
        {
            name: 'codeflow-progress'
        }
    )
);
