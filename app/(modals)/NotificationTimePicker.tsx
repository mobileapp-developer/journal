import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform, Alert, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';

interface NotificationTimePickerProps {
    visible: boolean;
    value: Date;
    onChange: (event: any, date?: Date) => void;
    onClose: () => void;
}

export default function NotificationTimePicker({ visible, value, onChange, onClose }: NotificationTimePickerProps) {

    const colorScheme = useColorScheme(); 

    if (Platform.OS === 'android') {
        if (!visible) {
            return null;
        }
        return (
            <DateTimePicker
                value={value}
                mode='time'
                display="default"
                onChange={onChange}
                themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
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
                <View style={[styles.sheet, colorScheme === 'dark' && styles.sheetDark]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                            <Text style={[styles.cancelText, colorScheme === 'dark' && styles.cancelTextDark]}>Скасувати</Text>
                        </TouchableOpacity>
                        <Text style={[styles.label, colorScheme === 'dark' && styles.labelDark]}>Час сповіщення</Text>
                        <View style={{ width: 70 }} />
                    </View>
                    <DateTimePicker
                        value={value}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                        onChange={onChange}
                        themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                        style={styles.picker}
                    />
                    <TouchableOpacity style={styles.button} onPress={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        onClose();
                        Alert.alert(
                            'Сповіщення поки не доступні',)
                    }}>
                        <Text style={styles.buttonText}>
                            {`Надсилати о ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`}
                        </Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 32,
        alignItems: 'center',
    },
    sheetDark: {
        backgroundColor: '#232323',
    },
    label: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#222',
    },
    labelDark: {
        color: '#fff',
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
    cancelTextDark: {
        color: '#4e8cff',
    },
});