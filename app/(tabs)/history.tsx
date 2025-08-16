import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JournalEntry } from '@/types';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchEntries();
    }, [])
  );

  const fetchEntries = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const journalKeys = keys.filter(k => k.startsWith('journal_'));
    const stores = await AsyncStorage.multiGet(journalKeys);
    const loaded = stores.map(([key, value]) => value ? JSON.parse(value) : null).filter(Boolean);
    loaded.sort((a, b) => (a.date < b.date ? 1 : -1));
    setEntries(loaded);
  };

  const handleDelete = (date: string) => {
    Alert.alert(
      'Видалити запис?',
      'Ви точно бажаєте видалити цей запис? Це дію не можна скасувати.',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити', style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(`journal_${date}`);
            setEntries(prev => prev.filter(e => e.date !== date));
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-'); // бо date у тебе у форматі YYYY-MM-DD
    return `${day}.${month}.${year}`;
  };

  const colorScheme = useColorScheme();
  const themeTitleStyle = colorScheme === 'light' ? styles.lightTitleText : styles.darkTitleText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeTextStyle = colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themeSafeAreaViewStyle = colorScheme === 'light' ? styles.lightSafeAreaView : styles.darkSafeAreaView;
  const themeCardStyle = colorScheme === 'light' ? styles.lightCard : styles.darkCard;

  return (
    <SafeAreaView style={[styles.safeAreaView, themeSafeAreaViewStyle]}>
      <View style={[styles.container, themeContainerStyle]}>
        <View>
          <Text style={[styles.title, themeTitleStyle]}>Мої записи</Text>
        </View>
        <FlatList
          data={entries}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.date}
          renderItem={({ item }) => (
            <View style={[styles.entryCard, themeCardStyle]}>
              <Text style={[styles.date, themeTextStyle]}>{formatDate(item.date)}</Text>
              <Text style={[styles.feelings, themeTextStyle]}>Настрій: {item.feelings.join(', ') || '—'}</Text>
              <Text style={[styles.selfLove, themeTextStyle]}>Любов до себе: {item.selfLove || '—'}</Text>
              <Text style={[styles.selfCare, themeTextStyle]}>Самотурбота: {item.selfCare.join(', ') || '—'}</Text>
              <Text style={[styles.gratitude, themeTextStyle]}>Вдячність: {item.gratitude.filter(Boolean).join(', ') || '—'}</Text>
              <Text style={[styles.water, themeTextStyle]}>Вода: {item.waterIntake} склянок</Text>
              <TouchableOpacity
                style={styles.trashIcon}
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  handleDelete(item.date);
                }}
              >
                <Ionicons name="trash" size={24} color="#fd5b5bff" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={[styles.empty, themeTextStyle]}>Зроби свій перший запис</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 2,
    paddingHorizontal: 16,
  },
  lightContainer: {
    position: 'relative',
    backgroundColor: '#FAFAFA',
  },
  darkContainer: {
    position: 'relative',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  lightTitleText: {
    color: '#000',
  },
  darkTitleText: {
    color: '#fff',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
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
  entryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  lightCard: {
    backgroundColor: 'white',
  },
  darkCard: {
    backgroundColor: '#222',
  },
  trashIcon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    padding: 6,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  feelings: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  selfLove: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  selfCare: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  gratitude: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  water: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
    fontSize: 16,
  },
});