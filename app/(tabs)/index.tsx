import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from '../(modals)/DatePicker';
import FeelingsSection from '@/components/FeelingsSection';
import GratitudeSection from '@/components/GratitudeSection';
import SelfCareSection from '@/components/SelfCareSection';
import SelfLoveSection from '@/components/SelfLoveSection';
import WaterIntakeSection from '@/components/WaterIntakeSection';

const FEELINGS_OPTIONS = [
    '😊 Щастя', '😌 Спокій', '😆 Радість', '😤 Роздратованість', '😰 Тривожність', '😴 Втома', '😢 Сум',
    '😎 Гордість', '💪 Стійкість', '😠 Злість', '🤢 Відраза', '😔 Розгубленість', '😊 Вдячність',
];

const SELF_CARE_OPTIONS = [
    'Сніданок', 'Обід', 'Вечеря', 'Свіже повітря', 'Прогулянка', 'Розмова з друзями',
    'Вітаміни', 'Зарядка', 'Читання', 'Спорт', 'Відпочити',
];

export interface JournalEntry {
    date: string;
    feelings: string[];
    selfLove: string;
    selfCare: string[];
    gratitude: [string, string, string];
    waterIntake: number;
}

interface JournalScreenProps {
    onOpenSettings?: () => void;
}

export default function JournalScreen({ onOpenSettings }: JournalScreenProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [journalEntry, setJournalEntry] = useState<JournalEntry>({
        date: '', feelings: [], selfLove: '', selfCare: [], gratitude: ['', '', ''], waterIntake: 0,
    });

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDisplayDate = (date: Date) => date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    useEffect(() => { loadJournalEntry(selectedDate); }, [selectedDate]);

    const loadJournalEntry = async (date: Date) => {
        try {
            const dateKey = formatDate(date);
            const storedEntry = await AsyncStorage.getItem(`journal_${dateKey}`);
            if (storedEntry) setJournalEntry(JSON.parse(storedEntry));
            else setJournalEntry({ date: dateKey, feelings: [], selfLove: '', selfCare: [], gratitude: ['', '', ''], waterIntake: 0 });
        } catch (error) { console.error('Error loading journal entry:', error); }
    };

    const saveJournalEntry = async () => {
        try {
            const dateKey = formatDate(selectedDate);
            const entryToSave = { ...journalEntry, date: dateKey };
            await AsyncStorage.setItem(`journal_${dateKey}`, JSON.stringify(entryToSave));
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Успішно!', 'Запис збережено!');
        } catch (error) {
            console.error('Error saving journal entry:', error);
            Alert.alert('Error', 'Failed to save journal entry');
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const toggleFeeling = (feeling: string) => {
        setJournalEntry(prev => ({
            ...prev,
            feelings: prev.feelings.includes(feeling)
                ? prev.feelings.filter(f => f !== feeling)
                : [...prev.feelings, feeling]
        }));
    };

    const toggleSelfCare = (item: string) => {
        setJournalEntry(prev => ({
            ...prev,
            selfCare: prev.selfCare.includes(item)
                ? prev.selfCare.filter(i => i !== item)
                : [...prev.selfCare, item]
        }));
    };

    const updateGratitude = (index: number, value: string) => {
        setJournalEntry(prev => {
            const newGratitude = [...prev.gratitude] as [string, string, string];
            newGratitude[index] = value;
            return { ...prev, gratitude: newGratitude };
        });
    };

    const updateWaterIntake = (glasses: number) => {
        setJournalEntry(prev => ({
            ...prev,
            waterIntake: Math.max(0, Math.min(8, glasses))
        }));
    };

    const colorScheme = useColorScheme();
    const themeTitleStyle = colorScheme === 'light' ? styles.lightTitleText : styles.darkTitleText;
    const themeSafeAreaViewStyle = colorScheme === 'light' ? styles.lightSafeAreaView : styles.darkSafeAreaView;
    const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
    const themeCalendarButtonStyle = colorScheme === 'light' ? styles.lightCalendarButton : styles.darkCalendarButton;

    return (
        <SafeAreaView style={[styles.safeAreaView, themeSafeAreaViewStyle]} edges={['top']}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={[styles.container, themeContainerStyle]}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, themeTitleStyle]}>Щоденник</Text>
                    </View>
                    <TouchableOpacity style={[styles.calenderButton, themeCalendarButtonStyle]} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowDatePicker(true);
                    }}
                    >
                        <Text style={[styles.text]}>
                            {formatDisplayDate(selectedDate)}
                        </Text>
                        <Ionicons name="calendar" size={20} color='#0077ffff' />
                    </TouchableOpacity>
                </View>
                {showDatePicker && (
                    <DatePicker
                        visible={showDatePicker}
                        value={selectedDate}
                        onChange={(event: any, date?: Date) => {
                            /* Для Android пікер закривається автоматично після взаємодії
                               Для iOS користувач закриває модальне вікно кнопкою */
                            if (Platform.OS === 'android') {
                                setShowDatePicker(false);
                            }
                            if (date) setSelectedDate(date);
                        }}
                        onClose={() => setShowDatePicker(false)}
                    />
                )}
                <FeelingsSection feelings={journalEntry.feelings} toggleFeeling={toggleFeeling} FEELINGS_OPTIONS={FEELINGS_OPTIONS} />
                <SelfLoveSection selfLove={journalEntry.selfLove} setSelfLove={text => setJournalEntry(prev => ({ ...prev, selfLove: text }))} />
                <SelfCareSection selfCare={journalEntry.selfCare} toggleSelfCare={toggleSelfCare} SELF_CARE_OPTIONS={SELF_CARE_OPTIONS} />
                <GratitudeSection gratitude={journalEntry.gratitude} updateGratitude={updateGratitude} />
                <WaterIntakeSection waterIntake={journalEntry.waterIntake} updateWaterIntake={updateWaterIntake} />
                <TouchableOpacity style={styles.saveButton} onPress={() => {
                    router.push('/history');
                    saveJournalEntry();
                }}>
                    <Text style={styles.safeButtonText}>Зберегти запис</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA'
    },
    lightContainer: {
        backgroundColor: 'white',
        borderBlockColor: '#FAFAFA',
    },
    darkContainer: {
        backgroundColor: '#000',
        borderBlockColor: '#222',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    lightTitleText: {
        color: '#333',
    },
    darkTitleText: {
        color: '#FAFAFA',
    },
    safeAreaView: {
        flex: 1,
    },
    lightSafeAreaView: {
        backgroundColor: '#FAFAFA',
    },
    darkSafeAreaView: {
        backgroundColor: '#000',
    },
    calenderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0F8FF',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0077ffff'
    },
    lightCalendarButton: {
        backgroundColor: '#F0F8FF',
        borderColor: '#0077ffff'
    },
    darkCalendarButton: {
        backgroundColor: '#222',
        borderColor: '#0077ffff'
    },
    text: {
        fontSize: 16,
        color: '#0077ffff',
        fontWeight: '500'
    },
    saveButton: {
        backgroundColor: '#0077ffff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4
    },
    safeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
})