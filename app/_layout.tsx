import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from "expo-router";
import { ThemeProvider } from "../lib/theme-context";
import WelcomeScreen from '../components/WelcomeScreen';

export default function RootLayout() {
  const [showWelcome, setShowWelcome] = useState(true);
  const colorScheme = useColorScheme(); // 'light' або 'dark'

  const handleContinue = () => {
    setShowWelcome(false);
  };

  return (
    <ThemeProvider>
      {showWelcome ? (
        <WelcomeScreen onContinue={handleContinue} />
      ) : (
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: 'Головна',
            }}
          />
          <Stack.Screen
            name="chart"
            options={{
              headerLargeTitle: true,
              headerTitle: 'Вода',
              headerTransparent: true,
              headerBackTitle: 'Назад'
            }}
          />
        </Stack>
      )}
    </ThemeProvider>
  );
}