import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationTimePicker from '../(modals)/NotificationTimePicker';
import { Color } from '@/constants/TWPalette';
import { LinearGradient } from 'expo-linear-gradient';
import { colorThemes, useTheme } from '@/lib/theme-context';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState<Date | null>(null);

  const { colorTheme, setColorTheme } = useTheme();
  const colorScheme = useColorScheme();

  const themeTitleStyle = colorScheme === 'light' ? styles.lightTitleText : styles.darkTitleText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeNameStyle = colorScheme === 'light' ? styles.lightNameText : styles.darkNameText;
  const themeNotificationCardStyle = colorScheme === 'light' ? styles.lightNotificationCard : styles.darkNotificationCard;
  const themeNotificationTextStyle = colorScheme === 'light' ? styles.lightNotificationText : styles.darkNotificationText;

  const themeBackgroundGradient = colorScheme === 'light'
    ? [
      Color[colorThemes[colorTheme].name][300],
      '#ffffff',
      Color[colorThemes[colorTheme].name][300],
    ]
    : [
      Color[colorThemes[colorTheme].name][900],
      '#ffffff',
      Color[colorThemes[colorTheme].name][900],
    ];

  return (
    <LinearGradient
      style={{ flex: 1 }}
      //@ts-ignore
      colors={themeBackgroundGradient}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={themeContainerStyle}>
          <View style={styles.header}>
            <Text style={themeTitleStyle}>Налаштування</Text>
          </View>

          <Text style={themeNameStyle}>Сповіщення</Text>
          <View style={[styles.notificationCard, themeNotificationCardStyle]}>
            <View style={styles.notificationSettings}>
              <Text style={themeNotificationTextStyle}>Дозволити сповіщення</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            {notificationsEnabled && (
              <NotificationTimePicker
                visible={notificationsEnabled}
                value={notificationTime ?? new Date()}
                onChange={(event, date) => {
                  if (date) setNotificationTime(date);
                }}
                onClose={() => setNotificationsEnabled(false)}
              />
            )}
          </View>

          <Text style={themeNameStyle}>Оформлення</Text>
          <View style={[styles.notificationCard, themeNotificationCardStyle]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 16, }}>
                {Object.keys(colorThemes).map((theme) => (
                  <Pressable
                    key={theme}
                    onPress={() => setColorTheme(theme as keyof typeof colorThemes)}
                    style={{
                      backgroundColor:
                        //@ts-ignore
                        Color[colorThemes[theme as keyof typeof colorThemes].name][500],
                      width: 30,
                      height: 30,
                      borderRadius: 16,
                      borderWidth: colorTheme === theme ? 3 : 0,
                      borderColor: 'white',
                      boxShadow: colorTheme === theme ? '0px 2px 8px rgba(0,0,0,0.2)' : 'none',
                    }}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    // backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
  },
  darkContainer: {
    flex: 1,
    // backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  lightTitleText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center'
  },
  darkTitleText: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center'
  },
  lightSafeAreaView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  darkSafeAreaView: {
    flex: 1,
    backgroundColor: '#000',
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lightNotificationCard: {
    backgroundColor: 'white',
  },
  darkNotificationCard: {
    backgroundColor: '#222',
  },
  lightNotificationText: {
    color: '#333',
    fontSize: 17,
    fontWeight: '400',
  },
  darkNotificationText: {
    color: '#FAFAFA',
    fontSize: 17,
    fontWeight: '400',
  },
  notificationSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  lightNameText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'medium',
    marginBottom: 6,
    paddingLeft: 20,
  },
  darkNameText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'medium',
    marginBottom: 6,
    paddingLeft: 20,
  },
});