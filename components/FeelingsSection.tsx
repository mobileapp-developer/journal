import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

interface FeelingsSectionProps {
    feelings: string[];
    toggleFeeling: (feeling: string) => void;
    FEELINGS_OPTIONS: readonly string[];
}

export default function FeelingsSection({ feelings, toggleFeeling, FEELINGS_OPTIONS }: FeelingsSectionProps) {

    const colorScheme = useColorScheme();
    const themeSectionStyle = colorScheme === 'light' ? styles.lightSection : styles.darkSection;

    return (
        <View style={[styles.section, themeSectionStyle]}>
            <Text style={styles.sectionHeader}>Відчуття</Text>
            <View style={styles.feelingsGrid}>
                {FEELINGS_OPTIONS.map((feeling) => {
                    const selected = feelings.includes(feeling);
                    return (
                        <TouchableOpacity
                            key={feeling}
                            style={[
                                styles.feelingItem, {
                                    backgroundColor: selected
                                        ? '#0077ffff'
                                        : (colorScheme === 'light' ? styles.lightFeelingItem.backgroundColor : styles.darkFeelingItem.backgroundColor),
                                    borderColor: selected
                                        ? '#0077ffff'
                                        : (colorScheme === 'light' ? styles.lightFeelingItem.borderColor : styles.darkFeelingItem.borderColor)
                                }
                            ]}
                            onPress={() => {
                                toggleFeeling(feeling);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                        >
                            <Text style={[
                                styles.feelingText, {
                                    color: selected
                                        ? 'white'
                                        : (colorScheme === 'light' ? styles.lightFeelingText.color : styles.darkFeelingText.color)
                                }
                            ]}>
                                {feeling}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        margin: 16,
        padding: 20,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lightSection: {
        backgroundColor: 'white',
        shadowColor: '#000',
    },
    darkSection: {
        backgroundColor: '#222',
        shadowColor: '#000',
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
    feelingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    feelingItem: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 8,
        borderWidth: 1,
    },
    lightFeelingItem: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
    },
    darkFeelingItem: {
        backgroundColor: '#333',
        borderColor: '#444',
    },
    feelingText: {
        fontSize: 14,
    },
    lightFeelingText: {
        color: '#333',
    },
    darkFeelingText: {
        color: '#FAFAFA',
    },
});
