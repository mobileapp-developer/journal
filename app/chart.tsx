import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-gifted-charts';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Color } from '@/constants/TWPalette';
import { getMonthlyWaterIntake } from '@/constants/waterStorage';

interface BarData {
  value: number;
  label?: string;
  frontColor?: string;
  [key: string]: any;
}

const colorThemes = {
  blue: { name: 'blue', primary: 500, accent: 600 },
  cyan: { name: 'cyan', primary: 500, accent: 600 },
} as const;

export default function HomeScreen() {

  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('blue');

  const colorScheme = useColorScheme();

  const theme = colorThemes[colorTheme];
  const themeColor = Color[theme.name];

  const bgColors = [
    Color[colorThemes[colorTheme].name][100],
    '#ffffff',
    Color[colorThemes[colorTheme].name][100],
  ] as const;

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

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={bgColors}
    >
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
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
          <Text style={[styles.subtitle, { marginBottom: 16 }]}>
            Choose Theme
          </Text>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            {Object.keys(colorThemes).map((theme) => (
              <Pressable
                key={theme}
                onPress={() => setColorTheme(theme as keyof typeof colorThemes)}
                style={{
                  backgroundColor:
                    //@ts-ignore
                    Color[colorThemes[theme].name as keyof typeof Color][500],
                  width: 30,
                  height: 30,
                  borderRadius: 16,
                  borderWidth: colorTheme === theme ? 3 : 0,
                  borderColor: 'white',
                  boxShadow: colorTheme === theme ? '0px 2px 8px rgba(0,0,0,0.2)' : 'none',
                }}
              />
            ))}
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
});