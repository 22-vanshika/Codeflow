import { create } from 'zustand';

export interface SavedVisualization {
    _id: string;
    title: string;
    description?: string;
    language: string;
    createdAt: string;
    isPublic: boolean;
}

interface VisualizationState {
    visualizations: SavedVisualization[];
    isLoading: boolean;
    error: string | null;
    setVisualizations: (visualizations: SavedVisualization[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    fetchUserVisualizations: (token: string) => Promise<void>;
}

export const useVisualizationStore = create<VisualizationState>((set) => ({
    visualizations: [],
    isLoading: false,
    error: null,
    setVisualizations: (visualizations) => set({ visualizations }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    
    fetchUserVisualizations: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/visualizations/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch visualizations');
            
            const data = await res.json();
            set({ visualizations: data, isLoading: false });
        } catch (error: any) {
            console.error('Error:', error);
            set({ error: error.message, isLoading: false });
        }
    }
}));
