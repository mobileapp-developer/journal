import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-gifted-charts';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Color } from '@/constants/TWPalette';
import { getMonthlyWaterIntake } from '@/constants/waterStorage';
import { WATERTEXT } from '@/constants/Texts';
import { colorThemes, useTheme } from '@/lib/theme-context';

interface BarData {
  value: number;
  label?: string;
  frontColor?: string;
  [key: string]: any;
}

export default function HomeScreen() {

  const colorScheme = useColorScheme();

  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { colorTheme } = useTheme(); //* Get the current color theme from the context

  const themeBackgroundGradient = colorScheme === 'light' ?
          [
              Color[colorThemes[colorTheme].name][300],
              '#ffffff',
              Color[colorThemes[colorTheme].name][300],
          ] : [
              Color[colorThemes[colorTheme].name][900],
              '#dbdbdbff',
              Color[colorThemes[colorTheme].name][900],
          ];

  const theme = colorThemes[colorTheme];
  const themeColor = Color[theme.name];

  const [monthlyWaterData, setMonthlyWaterData] = useState<number[]>([]);

  const getMonthName = (month: number) => {
    const months = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
    return months[month];
  };

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedBarIndex(null);
  }

  // Отримуємо реальні дані про воду для поточного місяця
  React.useEffect(() => {
    getMonthlyWaterIntake(currentYear, currentMonth).then(setMonthlyWaterData);
  }, [currentMonth, currentYear]);

  const getChartData = () => {
    return monthlyWaterData.map((value, index) => ({
      value,
      label: `${index + 1}`,
      topLabelComponent: () =>
        selectedBarIndex === index ? (
          <Text
            style={{
              color: themeColor[700],
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 4,
            }}
          >
            {value}
          </Text>
        ) : null,
    }));
  }

  const getGlassWordForm = (count: number): string => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return 'склянка';
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'склянки';
    return 'склянок';
  }

  const themeCardStyle = colorScheme === 'light' ? styles.lightCard : styles.darkCard;
  const themeTextStyle = colorScheme === 'light' ? styles.lightText : styles.darkText;

  return (
    <LinearGradient
      style={{ flex: 1 }}
      //@ts-ignore
      colors={themeBackgroundGradient}
    >
      <ScrollView contentInsetAdjustmentBehavior='automatic' showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Pressable
            onPress={() => navigateMonth(-1)}
            style={styles.button}
            hitSlop={20}
          >
            <IconSymbol
              name={'chevron.backward'}
              size={16}
              color={Color.gray[500]}
            />
          </Pressable>
          <Text style={styles.date}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>
          <Pressable
            onPress={() => navigateMonth(1)}
            style={styles.button}
            hitSlop={20}
          >
            <IconSymbol
              name={'chevron.forward'}
              size={16}
              color={Color.gray[500]}
            />
          </Pressable>
        </View>
        <BarChart data={getChartData()}
          noOfSections={5}
          barBorderRadius={4}
          yAxisThickness={0}
          xAxisThickness={0}
          showGradient
          gradientColor={Color[theme.name][500]}
          frontColor={Color[theme.name][300]}
          xAxisLabelTextStyle={{
            color: Color.gray[400],
            fontSize: 12,
            fontWeight: '500'
          }}
          yAxisTextStyle={{
            color: Color.gray[400],
            fontSize: 12,
            fontWeight: '500',
          }}
          dashGap={10}
          onPress={(_item: BarData, index: number) => {
            setSelectedBarIndex(selectedBarIndex === index ? null : index);
          }}
        />

        <View style={{ paddingHorizontal: 16 }}>
          <View style={[styles.card, themeCardStyle]}>
            <Text style={[styles.waterText, themeTextStyle]}>
              {selectedBarIndex !== null && monthlyWaterData[selectedBarIndex] !== undefined
                ? `Ви випили ${monthlyWaterData[selectedBarIndex]} ${getGlassWordForm(monthlyWaterData[selectedBarIndex])} води ${selectedBarIndex + 1} ${getMonthName(currentMonth)}. ${currentYear}`
                : 'Виберіть день, щоб побачити деталі'}

            </Text>
          </View>
          <Text style={[styles.waterTitleText]}>
            Про "Вода"
          </Text>

          <View style={[styles.card, themeCardStyle]}>
            <Text style={[styles.waterText, themeTextStyle]}>
              {WATERTEXT}
            </Text>
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  button: {
    padding: 8,
    borderRadius: 8,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: Color.gray[900],
  },
  subtitle: {
    fontSize: 16,
    color: Color.gray[600],
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lightCard: {
    backgroundColor: 'white',
  },
  darkCard: {
    backgroundColor: '#222',
  },
  waterTitleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    marginBottom: -8,
  },
  waterText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  lightText: {
    color : '#333',
  },
  darkText: {
    color: '#FAFAFA',
  },
});