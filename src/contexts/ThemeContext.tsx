import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

/** localStorage key holding the visitor's explicit choice. */
const STORAGE_KEY = 'theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isTheme = (value: unknown): value is Theme =>
  value === 'dark' || value === 'light';

/**
 * The persisted preference, or null when there isn't a usable one.
 *
 * Returns null both when nothing is stored and when the stored value is
 * unrecognised, so a corrupted entry falls back to OS detection rather than
 * pinning the site to an invalid theme.
 */
const readStoredTheme = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    // Private browsing and hardened privacy settings make localStorage throw
    // on access rather than returning null.
    return null;
  }
};

/** OS-level preference. Falls back to dark where matchMedia is unavailable. */
const readSystemTheme = (): Theme => {
  if (typeof window.matchMedia !== 'function') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
};

/** Stored preference wins over the OS setting. */
export const resolveInitialTheme = (): Theme =>
  readStoredTheme() ?? readSystemTheme();

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);

  // Drives every token in src/styles/_tokens.scss.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // The choice just won't survive a reload; the theme still switches.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
