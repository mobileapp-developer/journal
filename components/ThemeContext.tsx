import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeOption = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeOption>('light');

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem('app_theme');
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'auto') {
        setThemeState(storedTheme);
      }
    })();
  }, []);

  const setTheme = async (newTheme: ThemeOption) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('app_theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
