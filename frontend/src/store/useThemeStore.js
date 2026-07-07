import { create } from 'zustand';

// Read persisted theme (default = dark)
const getSavedTheme = () => {
  try {
    return localStorage.getItem('studyflow_theme') || 'dark';
  } catch { return 'dark'; }
};

// Apply theme class to <html> element
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
};

export const useThemeStore = create((set, get) => ({
  theme: getSavedTheme(),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('studyflow_theme', next);
    applyTheme(next);
    set({ theme: next });
  },

  initTheme: () => {
    const theme = getSavedTheme();
    applyTheme(theme);
    set({ theme });
  },
}));
