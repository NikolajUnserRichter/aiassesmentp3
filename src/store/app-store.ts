import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Language } from '@/types';

interface AppState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      sidebarOpen: true,

      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
            document.documentElement.classList.add(systemTheme);
          } else {
            document.documentElement.classList.add(theme);
          }
        }
      },

      setLanguage: (language) => {
        set({ language });
        // Update document lang attribute
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language;
        }
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'p3-assessment-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
