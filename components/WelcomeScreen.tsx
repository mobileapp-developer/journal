import React, { useRef } from 'react';
import { Animated, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleStart = () => {
    Animated.timing(slideAnim, {
      toValue: -Dimensions.get('window').width,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      if (typeof onContinue === 'function') onContinue();
    });
  };

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#111111' : '#FAFAFA';
  const textColor = colorScheme === 'dark' ? '#FAFAFA' : '#333';

  return (
    <Animated.View style={[styles.container, { backgroundColor, transform: [{ translateX: slideAnim }] }] }>
      {/* Статусбар для видимості при темній/світлій темі */}
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />
      <View style={styles.content}>
        <Text style={styles.title}>Moody</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>Твій щоденник настрою!</Text>
        <Text style={[styles.description, { color: colorScheme === 'dark' ? '#ccc' : '#666' }] }>
          Відстежуй свої емоції, турбуйся про себе та знаходь моменти вдячності щодня❤️
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Почати</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 32,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0077ffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 22,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 19,
    paddingHorizontal: 140,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#0077ffff',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;