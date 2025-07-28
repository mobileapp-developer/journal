import React from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native';

interface GratitudeSectionProps {
    gratitude: string[];
    updateGratitude: (index: number, text: string) => void;
}

export default function GratitudeSection({ gratitude, updateGratitude }: GratitudeSectionProps) {

    const colorScheme = useColorScheme();
    const themeSectionStyle = colorScheme === 'light' ? styles.lightSection : styles.darkSection;
    const themeGratitudeInputStyle = colorScheme === 'light' ? styles.lightGratitudeInput : styles.darkGratitudeInput;

    const placeholders = [
        'За що сьогодні дякую (момент, людина, річ, відчуття)?',
        'Яка думка була зі мною ввесь день?',
        'Що я буду робити з цією думкою далі?'
    ];

    return (
        <View style={[styles.section, themeSectionStyle]}>
            <Text style={styles.sectionHeader}>
                Вдячність
            </Text>
            {placeholders.map((placeholder, index) => (
                <View key={placeholder} style={styles.gratitudeItem}>
                    <Text style={[styles.gratitudeNumber]}>
                        {index + 1}.
                    </Text>
                    <TextInput
                        style={[styles.gratitudeInput, themeGratitudeInputStyle]}
                        placeholder={placeholder}
                        placeholderTextColor={colorScheme === 'light' ? '#888888' : '#AAAAAA'}
                        value={gratitude[index]}
                        onChangeText={(text) => updateGratitude(index, text)}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
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
        backgroundColor: 'white',
    },
    darkSection: {
        backgroundColor: '#222',
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
    gratitudeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    gratitudeNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
        width: 20,
        color: '#0077ffff'
    },
    gratitudeInput: {
        flex: 1,
        borderBottomWidth: 1,
        padding: 8,
        fontSize: 16,
    },
    lightGratitudeInput: {
        color: '#333',
        borderBottomColor: '#E0E0E0',
    },
    darkGratitudeInput: {
        color: '#FAFAFA',
        borderBottomColor: '#444'
    },
});
