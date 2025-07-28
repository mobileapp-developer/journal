import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../components/ThemeContext';
import NotificationTimePicker from '../(modals)/NotificationTimePicker';

const Settings: React.FC<{ onBack?: () => void }> = () => {
    const { theme, setTheme } = useTheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationTime, setNotificationTime] = useState<Date | null>(null);

    // Кольори для теми
    const colorScheme = useColorScheme();
    const themeTitleStyle = colorScheme === 'light' ? styles.lightTitleText : styles.darkTitleText;
    const themeSafeAreaViewStyle = colorScheme === 'light' ? styles.lightSafeAreaView : styles.darkSafeAreaView;
    const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeNameStyle = colorScheme === 'light' ? styles.lightNameText : styles.darkNameText;
    const themeNitificationCardStyle = colorScheme === 'light' ? styles.lightNotificationCard : styles.darkNotificationCard;
    const themeNotificationTextStyle = colorScheme === 'light' ? styles.lightNotificationText : styles.darkNotificationText;

    return (
        <SafeAreaView style={themeSafeAreaViewStyle} edges={['top']}>
            <View style={themeContainerStyle}>
                <View style={styles.header}>
                    <Text style={themeTitleStyle}>Налаштування</Text>
                </View>
                <Text style={themeNameStyle}>Сповіщення</Text>
                <View style={[styles.notificationCard, themeNitificationCardStyle]}>
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
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    lightContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 16,
    },
    darkContainer: {
        flex: 1,
        backgroundColor: '#000',
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
        color: '#929292',
        fontSize: 16,
        fontWeight: 'medium',
        marginBottom: 6,
        paddingLeft: 20,
    },
    darkNameText: {
        color: '#bdbdbd',
        fontSize: 16,
        fontWeight: 'medium',
        marginBottom: 6,
        paddingLeft: 20,
    },
});

export default Settings;