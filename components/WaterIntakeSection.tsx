/* 
Компонент для відстеження споживання води. Дозволяє користувачу встановлювати ціль споживання води та відзначати, 
скільки склянок води випито. Відображає статистику споживання води за тиждень у вигляді графіка.
*/

import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

interface WaterIntakeSectionProps {
    waterIntake: number;
    updateWaterIntake: (val: number) => void;
}

// Вмикаємо LayoutAnimation для Android. Це потрібно робити один раз при старті додатку.
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WaterIntakeSection({ waterIntake, updateWaterIntake }: WaterIntakeSectionProps) {
    const [waterGoal, setWaterGoal] = useState(7);
    const [expanded, setExpanded] = useState(false);
    const [weeklyData, setWeeklyData] = useState<number[]>([]);
    const [average, setAverage] = useState(0);
    const screenWidth = Dimensions.get('window').width;
    const [todayStr, setTodayStr] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // Цей інтервал перевіряє, чи змінився день, для оновлення даних.
        const interval = setInterval(() => {
            const nowStr = new Date().toISOString().split('T')[0];
            if (nowStr !== todayStr) {
                setTodayStr(nowStr);
            }
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, [todayStr]);

    useEffect(() => {
        if (expanded) fetchWeeklyData();
    }, [expanded, todayStr]);

    const fetchWeeklyData = async () => {
        const today = new Date();
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek - 1));
        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d.toISOString().split('T')[0];
        });
        const data = await Promise.all(
            weekDates.map(async (date) => {
                const stored = await AsyncStorage.getItem(`journal_${date}`);
                if (stored) {
                    const entry = JSON.parse(stored);
                    return entry.waterIntake || 0;
                }
                return 0;
            })
        );
        setWeeklyData(data);
        const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
        setAverage(avg);
    };

    // Змінює ціль споживання води на вказане значення
    const handleGoalChange = (delta: number) => {
        Haptics.selectionAsync();
        setWaterGoal((prev) => {
            const next = prev + delta; // Збільшує або зменшує ціль на 1
            if (next < 1) return 1;    // Мінімальна ціль - 1 склянка
            if (next > 20) return 20;  // Максимальна ціль - 20 склянок
            return next;
        });
    };

    const colorScheme = useColorScheme();

    const cardColor = colorScheme === 'dark' ? '#222' : 'white';
    const textColor = colorScheme === 'dark' ? '#aeaeae' : '#333';
    const subTextColor = colorScheme === 'dark' ? '#aaa' : '#666';

    const themeSectionStyle = colorScheme === 'light' ? styles.lightSection : styles.darkSection;
    const themeGoalValueStyle = colorScheme === 'light' ? styles.lightGoalValue : styles.darkGoalValue;
    const themeWaterSubtextStyle = colorScheme === 'light' ? styles.lightWaterSubtext : styles.darkWaterSubtext;
    const themeMoreButtonStyle = colorScheme === 'light' ? styles.lightMoreButton : styles.darkMoreButton;
    const themeMoreButtonTextStyle = colorScheme === 'light' ? styles.lightMoreButtonText : styles.darkMoreButtonText;
    const themeStatsContainerStyle = colorScheme === 'light' ? styles.lightStatsContainer : styles.darkStatsContainer;

    return (
        <View style={[styles.section, themeSectionStyle]}>
            <Text style={styles.sectionHeader}>Вода</Text>
            <View style={styles.goalRow}>
                <Text style={styles.goalLabel}>Норма: </Text>
                <TouchableOpacity onPress={() => handleGoalChange(-1)} style={styles.goalBtn}>
                    <Ionicons name="remove-circle-outline" size={24} color='#0077ffff' />
                </TouchableOpacity>
                <Text style={[styles.goalValue, themeGoalValueStyle]}>{waterGoal} склянок</Text>
                <TouchableOpacity onPress={() => handleGoalChange(1)} style={styles.goalBtn}>
                    <Ionicons name="add-circle-outline" size={24} color='#0077ffff' />
                </TouchableOpacity>
            </View>
            <Text style={[styles.waterSubtext, themeWaterSubtextStyle]}>Тисни, щоб заповнити скляночки (Ціль {waterGoal} склянок)</Text>
            <View style={styles.waterContainer}>
                {[...Array(waterGoal)].map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            Haptics.selectionAsync();
                            updateWaterIntake(index + 1);
                        }}
                        style={styles.waterDrop}
                    >
                        <Ionicons
                            name="water"
                            size={30}
                            color={index < waterIntake ? '#0077ffff' : '#AAAAAA'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.waterCount}>
                {waterIntake}/{waterGoal} склянок
            </Text>
            <TouchableOpacity
                style={[styles.moreBtn, themeMoreButtonStyle]}
                onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setExpanded((prev) => !prev);
                }}
                activeOpacity={0.7}
            >
                <Text style={themeMoreButtonTextStyle}>{expanded ? 'Сховати' : 'Більше'}</Text>
            </TouchableOpacity>
            {expanded && (
                <View style={[styles.statsContainer, themeStatsContainerStyle]}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor, marginBottom: 8 }}>
                        За тиждень
                    </Text>
                    <Text style={{ color: '#0077ffff', fontSize: 16, marginBottom: 4 }}>Середнє: {average.toFixed(1)} скл.</Text>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <BarChart
                            data={{
                                labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
                                datasets: [{ data: weeklyData }]
                            }}
                            width={screenWidth - 96}
                            height={180}
                            fromZero
                            yAxisInterval={1}
                            yAxisLabel=""
                            yAxisSuffix=" скл."
                            chartConfig={{
                                backgroundColor: cardColor,
                                backgroundGradientFrom: cardColor,
                                backgroundGradientTo: cardColor,
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                                labelColor: () => textColor,
                                barPercentage: 0.6,
                            }}
                            style={{ borderRadius: 12, marginVertical: 8 }}
                        />
                    </View>
                    <Text style={{ textAlign: 'center', color: subTextColor, fontSize: 13, marginTop: 4 }}>
                        Ціль — {waterGoal} склянок на день
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: 'white',
        margin: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lightSection: {
        borderColor: 'white',
    },
    darkSection: {
        backgroundColor: '#222'
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 2,
        color: '#0077ffff',
        borderBottomColor: '#0077ffff',
    },
    moreBtn: {
        alignSelf: 'center',
        marginTop: 8,
        backgroundColor: '#eaf2ff',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: '#0077ffff',
    },
    lightMoreButton: {
        backgroundColor: '#eaf2ff',
        borderColor: '#0077ffff',
    },
    darkMoreButton: {
        backgroundColor: '#232a36',
        borderColor: '#0077ffff',
    },
    lightMoreButtonText: {
        color: '#0077ffff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    darkMoreButtonText: {
        color: '#eaf2ff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    statsContainer: {
        marginTop: 12,
        backgroundColor: '#f6faff',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
        overflow: 'hidden',
        width: '100%',
        alignSelf: 'center',
    },
    lightStatsContainer: {
        backgroundColor: '#f6faff',
    },
    darkStatsContainer: {
        backgroundColor: '#232a36',
    },
    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalLabel: {
        fontSize: 16,
        color: '#0077ffff',
        fontWeight: 'bold',
    },
    goalBtn: {
        marginHorizontal: 8,
    },
    goalValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lightGoalValue: {
        color: '#333',
    },
    darkGoalValue: {
        color: '#aeaeae',
    },
    waterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    waterDrop: {
        padding: 8,
    },
    waterSubtext: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    lightWaterSubtext: {
        color: '#666',
    },
    darkWaterSubtext: {
        color: '#aaa',
    },
    waterCount: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0077ffff',
        marginTop: 8,
    },

});