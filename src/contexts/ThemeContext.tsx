'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type ThemePalette = 'default' | 'pink' | 'blue' | 'green' | 'light';

interface ThemeContextType {
  currentPalette: ThemePalette;
  setCurrentPalette: (palette: ThemePalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ThemePalette>('default');

  useEffect(() => {
    document.body.className = `theme-${currentPalette}`;
  }, [currentPalette]);

  return (
    <ThemeContext.Provider value={{ currentPalette, setCurrentPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 