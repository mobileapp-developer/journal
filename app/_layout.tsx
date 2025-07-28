import React, { useState, useEffect } from 'react';
import { Stack } from "expo-router";
import { ThemeProvider } from "../components/ThemeContext";
import WelcomeScreen from '../components/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [showWelcome, setShowWelcome] = useState(true); // або null, якщо хочеш уникнути миготіння

  // Закоментовано, як і в тебе:
  // useEffect(() => {
  //   (async () => {
  //     const seen = await AsyncStorage.getItem('welcome_seen');
  //     setShowWelcome(seen !== 'true');
  //   })();
  // }, []);

  const handleContinue = () => {
    // await AsyncStorage.setItem('welcome_seen', 'true');
    setShowWelcome(false);
  };

  // if (showWelcome === null) return null;

  return (
    <ThemeProvider>
      {showWelcome ? (
        <WelcomeScreen onContinue={handleContinue} />
      ) : (
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      )}
    </ThemeProvider>
  );
}
