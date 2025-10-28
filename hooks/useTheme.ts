import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(() => {
    // During server-side rendering or in environments without a window object,
    // default to 'light' theme.
    if (typeof window === 'undefined') {
      return 'light';
    }
    
    const storedTheme = localStorage.getItem('theme');
    
    // Check if the stored theme is a valid, expected value.
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    
    // If no valid theme is in storage, check the user's system-level preference.
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Otherwise, default to the 'light' theme.
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (theme === 'dark') {
      root.classList.add('dark');
      // zinc-950, matching the dark background color in App.tsx
      metaThemeColor?.setAttribute('content', '#09090b');
    } else {
      root.classList.remove('dark');
      // slate-100, matching the light background color in App.tsx
      metaThemeColor?.setAttribute('content', '#f1f5f9');
    }
    
    // Always save the current theme to localStorage. This ensures it's up-to-date
    // and automatically corrects any invalid value that might have been stored previously.
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
};
