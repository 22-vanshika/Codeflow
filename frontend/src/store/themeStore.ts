import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>(() => {
  // Enforce dark class on HTML element and remove light class
  if (typeof window !== 'undefined') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }

  return {
    theme: 'dark',
    toggleTheme: () => {
      // Day mode removed: do nothing
    },
    setTheme: () => {
      // Day mode removed: do nothing
    }
  };
});
