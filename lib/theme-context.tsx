import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const colorThemes = {
  red: { name: 'red', primary: 500, accent: 600 },
  orange: { name: 'orange', primary: 500, accent: 600 },
  amber: { name: 'amber', primary: 500, accent: 600 },
  yellow: { name: 'yellow', primary: 500, accent: 600 },
  lime: { name: 'lime', primary: 500, accent: 600 },
  green: { name: 'green', primary: 500, accent: 600 },
  emerald: { name: 'emerald', primary: 500, accent: 600 },
  teal: { name: 'teal', primary: 500, accent: 600 },
  cyan: { name: 'cyan', primary: 500, accent: 600 },
  sky: { name: 'sky', primary: 500, accent: 600 },
  blue: { name: 'blue', primary: 500, accent: 600 },
  indigo: { name: 'indigo', primary: 500, accent: 600 },
  violet: { name: 'violet', primary: 500, accent: 600 },
  purple: { name: 'purple', primary: 500, accent: 600 },
  fuchsia: { name: 'fuchsia', primary: 500, accent: 600 },
  pink: { name: 'pink', primary: 500, accent: 600 },
  rose: { name: 'rose', primary: 500, accent: 600 },
} as const;

type ColorThemeName = keyof typeof colorThemes;

type ThemeContextType = {
  colorTheme: ColorThemeName;
  setColorTheme: (theme: ColorThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorThemeState] = useState<ColorThemeName>('blue');
  const [isReady, setIsReady] = useState(false);

  const setColorTheme = (theme: ColorThemeName) => {
    setColorThemeState(theme);
    AsyncStorage.setItem('appTheme', theme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme && savedTheme in colorThemes) {
          setColorThemeState(savedTheme as ColorThemeName);
        }
      } catch (error) {
        console.error('Помилка завантаження теми:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, []);

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
