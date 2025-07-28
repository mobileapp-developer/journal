import React from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native';

interface SelfLoveSectionProps {
    selfLove: string;
    setSelfLove: (text: string) => void;
}

export default function SelfLoveSection({ selfLove, setSelfLove }: SelfLoveSectionProps) {

    const colorScheme = useColorScheme();
    const themeSectionStyle = colorScheme === 'light' ? styles.lightSection : styles.darkSection;
    const themeTextInputStyle = colorScheme === 'light' ? styles.lightTextInput : styles.darkTextInput;

    return (
        <View style={[styles.section, themeSectionStyle]}>
            <Text style={styles.sectionHeader}>Любов до себе</Text>
            <TextInput
                style={[styles.textInput, themeTextInputStyle]}
                placeholder="Напиши щось приємне для себе..."
                placeholderTextColor={colorScheme === 'light' ? '#999' : '#AAAAAA'}
                value={selfLove}
                onChangeText={setSelfLove}
                multiline
                numberOfLines={4}
            />
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
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    lightTextInput: {
        backgroundColor: '#FAFAFA',
        borderColor: '#E0E0E0',
        color: '#333',
    },
    darkTextInput: {
        backgroundColor: '#171717',
        borderColor: '#444',
        color: '#FAFAFA',
    },
});