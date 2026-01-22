'use client';

import * as React from 'react';
import { MsalProvider } from '@/lib/auth/msal-provider';
import { useAppStore } from '@/store/app-store';

// Theme initialization component
function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { theme } = useAppStore();

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MsalProvider>
      <ThemeInitializer>{children}</ThemeInitializer>
    </MsalProvider>
  );
}
