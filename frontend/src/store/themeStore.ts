import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Check initial theme from localStorage or system preference
  const getInitialTheme = (): 'dark' | 'light' => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // Default to dark theme as requested
  };

  const initialTheme = getInitialTheme();
  
  // Apply initial theme class to HTML element
  if (typeof window !== 'undefined') {
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }

  return {
    theme: initialTheme,
    toggleTheme: () => set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      if (nextTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
      return { theme: nextTheme };
    }),
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
      set({ theme });
    }
  };
});
