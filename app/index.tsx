import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, SplashScreen } from 'expo-router';
import WelcomeScreen from '@/components/WelcomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type ThemeOption = 'light' | 'dark' | 'auto';

export default function AppEntry() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    const prepareAndNavigate = async () => {
      try {
        const seenValue = await AsyncStorage.getItem('has_seen_welcome_screen');
        if (seenValue) {
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    };

    prepareAndNavigate();
  }, [router]);

  const [theme, setTheme] = useState<ThemeOption>('auto');
  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const themeValue = await AsyncStorage.getItem('app_theme');
        if (themeValue) {
          setTheme(themeValue as ThemeOption);
        }
      } catch (e) {
        console.warn(e);
      }
    };
    loadTheme();
  }, []);

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('has_seen_welcome_screen', 'true');
      router.replace('/(tabs)');
    } catch (e) {
      console.error("Failed to save welcome screen state", e);
    }
  };

  const currentTheme = theme === 'auto' ? colorScheme ?? 'light' : theme;

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WelcomeScreen onContinue={handleContinue} />
    </GestureHandlerRootView>
  );
}