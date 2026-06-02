import { create } from 'zustand';
import { API_URL } from '../config/api';

export interface SavedVisualization {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    code: string;
    language: string;
    traceSteps: any[];
    isPublic: boolean;
    settings?: {
        speed?: number;
        input?: string;
    };
    metadata?: {
        problemDetails?: any;
    };
    createdAt: string;
    updatedAt: string;
}

interface VisualizationState {
    visualizations: SavedVisualization[];
    isLoading: boolean;
    error: string | null;
    setVisualizations: (visualizations: SavedVisualization[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    fetchUserVisualizations: (token: string) => Promise<void>;
    fetchVisualizationById: (id: string) => Promise<SavedVisualization>;
    updateVisualization: (id: string, updates: Partial<SavedVisualization>, token: string) => Promise<SavedVisualization>;
    deleteVisualization: (id: string, token: string) => Promise<void>;
    duplicateVisualization: (id: string, token: string) => Promise<SavedVisualization>;
}



export const useVisualizationStore = create<VisualizationState>((set, get) => ({
    visualizations: [],
    isLoading: false,
    error: null,
    setVisualizations: (visualizations) => set({ visualizations }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    
    fetchUserVisualizations: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
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
    },

    fetchVisualizationById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/api/visualizations/${id}`);
            if (!res.ok) throw new Error('Failed to fetch visualization details');
            const data = await res.json();
            set({ isLoading: false });
            return data;
        } catch (error: any) {
            console.error('Error:', error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateVisualization: async (id: string, updates: Partial<SavedVisualization>, token: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/api/visualizations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to update visualization');
            }
            const data = await res.json();
            
            // Refresh list
            const currentList = get().visualizations;
            const updatedList = currentList.map(v => v._id === id ? { ...v, ...updates } : v);
            set({ visualizations: updatedList, isLoading: false });
            
            return data.visualization;
        } catch (error: any) {
            console.error('Error:', error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteVisualization: async (id: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/api/visualizations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to delete visualization');
            }
            
            // Refresh list
            const currentList = get().visualizations;
            const updatedList = currentList.filter(v => v._id !== id);
            set({ visualizations: updatedList, isLoading: false });
        } catch (error: any) {
            console.error('Error:', error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    duplicateVisualization: async (id: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/api/visualizations/${id}/duplicate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to duplicate visualization');
            }
            const data = await res.json();
            
            // Refresh list
            const currentList = get().visualizations;
            set({ visualizations: [data.visualization, ...currentList], isLoading: false });
            return data.visualization;
        } catch (error: any) {
            console.error('Error:', error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    }
}));
