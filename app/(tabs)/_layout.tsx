import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";
import { TouchableOpacity, useColorScheme } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { use } from 'react';


function TabBarButton(props: any) {
  return (
    <TouchableOpacity
      {...props}
      onPress={async () => {
        props.onPress?.();
      }}
    />
  );
}

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  const tabBarColor = colorScheme === 'light' ? '#FAFAFA' : '#111111';
  const tabBarBorder = colorScheme === 'light' ? '#e0e0e0' : '#222';
  const activeColor = colorScheme === 'light' ? '#166cffff' : '#FAFAFA';
  const inactiveColor = colorScheme === 'light' ? '#929292' : '#bdbdbd';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarColor,
          borderTopColor: tabBarBorder,
        },
        tabBarButton: TabBarButton,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Головна',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Записи',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="history" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Налаштування',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}