// components/themeProvider.tsx
'use client';

import { createContext, useContext, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export type Theme = 'default' | 'dark' | 'pastel';
type Ctx = { theme: Theme; setTheme: (t: Theme) => Promise<void> };

const ThemeContext = createContext<Ctx>({ theme: 'default', setTheme: async () => {} });
const STORAGE_KEY = 'app:theme';
const isAllowed = (t: unknown): t is Theme => t === 'default' || t === 'dark' || t === 'pastel';

function applyHtmlClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('theme-dark', 'theme-pastel');
  if (theme !== 'default') root.classList.add(`theme-${theme}`);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'default';
    const stored = localStorage.getItem(STORAGE_KEY);
    return isAllowed(stored) ? stored : 'default';
  });

  // 2) Apply class before paint (no flash)
  useLayoutEffect(() => {
    applyHtmlClass(theme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      if (status === 'unauthenticated' || !(session?.user as any)?.id) {
        // 👇 force reset
        setThemeState('default');
        localStorage.setItem(STORAGE_KEY, 'default');
        applyHtmlClass('default');
        return;
      }

      if (status !== 'authenticated') return; 

      const sessionTheme = (session?.user as any)?.theme as Theme | undefined;
      if (isAllowed(sessionTheme) && sessionTheme !== theme) {
        setThemeState(sessionTheme);
        localStorage.setItem(STORAGE_KEY, sessionTheme);
        applyHtmlClass(sessionTheme);
        return;
      }

      try {
        const res = await fetch('/api/me/theme', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const serverTheme = data?.theme as Theme | undefined;
          if (isAllowed(serverTheme) && serverTheme !== theme) {
            setThemeState(serverTheme);
            localStorage.setItem(STORAGE_KEY, serverTheme);
            applyHtmlClass(serverTheme);
          }
        }
      } catch {}
    })();
  }, [status, (session?.user as any)?.id, (session?.user as any)?.theme]);

  const persist = useCallback(
    async (t: Theme) => {
      if (!isAllowed(t)) return;
      // Immediate UX
      setThemeState(t);
      localStorage.setItem(STORAGE_KEY, t);
      applyHtmlClass(t);

      try {
        await fetch('/api/me/theme', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: t }),
        });
      } catch {}

      try {
        await update?.({ theme: t });
      } catch {}
    },
    [update]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme: persist }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
