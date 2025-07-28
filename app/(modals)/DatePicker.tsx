import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import { Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';

interface DatePickerProps {
    visible: boolean;
    value: Date;
    onChange: (event: any, date?: Date) => void;
    onClose: () => void;
}

export default function DatePicker({ visible, value, onChange, onClose }: DatePickerProps) {

    const colorScheme = useColorScheme();
    const sheetBackgroundColor = colorScheme === 'light' ? styles.lightSheet : styles.darkSheet;
    const themeLabelStyle = colorScheme === 'light' ? styles.lightLabel : styles.darkLabel;

    if (Platform.OS === 'android') {
        if (!visible) {
            return null;
        }
        return (
            <DateTimePicker
                value={value}
                mode="date"
                display="default"
                onChange={onChange}
                themeVariant={colorScheme === 'light' ? 'light' : 'dark'}
            />
        );
    }

    return (
        <Modal
            visible={visible}
            animationType='slide'
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.sheet, sheetBackgroundColor]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Скасувати</Text>
                        </TouchableOpacity>
                        <Text style={[styles.label, themeLabelStyle]}>Вибір дати</Text>
                        <View style={{ width: 70 }} />
                    </View>
                    <DateTimePicker
                        value={value}
                        mode='date'
                        display="spinner"
                        onChange={onChange}
                        themeVariant={colorScheme === 'light' ? 'light' : 'dark'}
                        style={styles.picker}
                    />
                    <TouchableOpacity style={styles.button} onPress={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        onClose();
                    }}>
                        <Text style={styles.buttonText}>Продовжити</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 32,
        alignItems: 'center',
    },
    lightSheet: {
        backgroundColor: '#fff',
    },
    darkSheet: {
        backgroundColor: '#232323',
    },
    label: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
        left: -15,
    },
    darkLabel: {
        color: '#fff',
    },
    lightLabel: {
        color: '#222',
    },
    picker: {
        width: 180,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#0077ffff',
        marginTop: 16,
        marginBottom: 8,
        alignSelf: 'stretch',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    cancelBtn: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    cancelText: {
        color: '#0077ff',
        fontSize: 17,
        left: -15,
        top: -4,
    },
});