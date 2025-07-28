import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelfCareSectionProps {
    selfCare: string[];
    toggleSelfCare: (item: string) => void;
    SELF_CARE_OPTIONS: readonly string[];
}

export default function SelfCareSection({ selfCare, toggleSelfCare, SELF_CARE_OPTIONS }: SelfCareSectionProps) {

    const colorScheme = useColorScheme();
    const themeSectionStyle = colorScheme === 'light' ? styles.lightSection : styles.darkSection;
    const themeCheckboxStyle = colorScheme === 'light' ? styles.lightCheckbox : styles.darkCheckbox;
    const themeChecklistTextStyle = colorScheme === 'light' ? styles.lightChecklistText : styles.darkChecklistText;

    return (
        <View style={[styles.section, themeSectionStyle]}>
            <Text style={styles.sectionHeader}>Самотурбота</Text>
            {SELF_CARE_OPTIONS.map((item) => (
                <TouchableOpacity
                    key={item}
                    style={styles.checklistItem}
                    onPress={() => toggleSelfCare(item)}
                >
                    <View style={[styles.checkbox, themeCheckboxStyle, {
                        backgroundColor: selfCare.includes(item) ? '#0077ffff' : (colorScheme === 'light' ? 'white' : '#222')
                    }]}>
                        {selfCare.includes(item) && (
                            <Ionicons name="checkmark" size={16} color="white" />
                        )}
                    </View>
                    <Text style={[styles.checklistText, themeChecklistTextStyle]}>
                        {item}
                    </Text>
                </TouchableOpacity>
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
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lightCheckbox: {
        borderColor: '#E0E0E0',
    },
    darkCheckbox: {
        borderColor: '#444'
    },
    checklistText: {
        fontSize: 16,
        flex: 1,
    },
    lightChecklistText: {
        color: '#333',
    },
    darkChecklistText: {
        color: '#FAFAFA'
    },
});
