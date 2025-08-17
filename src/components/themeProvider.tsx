// components/themeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type Theme = 'default' | 'dark' | 'pastel';

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void; }>({
  theme: 'default',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [theme, setThemeState] = useState<Theme>('default');

  // Apply the theme class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-pastel');
    if (theme !== 'default') root.classList.add(`theme-${theme}`);
  }, [theme]);

  // React to auth status changes (login/logout)
  useEffect(() => {
    if (status === 'authenticated') {
      // 1) Prefer theme from session (you added this in auth callbacks)
      const sessionTheme = (session?.user as any)?.theme as Theme | undefined;
      if (sessionTheme) {
        setThemeState(sessionTheme);
        return;
      }
      // 2) Fallback: fetch from API
      (async () => {
        try {
          const res = await fetch('/api/me/theme', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data?.theme) setThemeState(data.theme as Theme);
          }
        } catch {}
      })();
    } else if (status === 'unauthenticated') {
      // Reset to default when signed out
      setThemeState('default');
    }
  }, [status, session?.user?.id, session?.user?.theme]); // re-run when these change

  // Persist to DB (and update state immediately)
  const persist = async (t: Theme) => {
    setThemeState(t);
    try {
      await fetch('/api/me/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: t }),
      });
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: persist }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
