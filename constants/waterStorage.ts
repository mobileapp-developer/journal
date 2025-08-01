import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveWaterIntake(date: string, value: number) {
  const entry = { waterIntake: value };
  await AsyncStorage.setItem(`journal_${date}`, JSON.stringify(entry));
}

export async function getWaterIntake(date: string): Promise<number> {
  const stored = await AsyncStorage.getItem(`journal_${date}`);
  if (stored) {
    try {
      const entry = JSON.parse(stored);
      return entry.waterIntake || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

export async function getMonthlyWaterIntake(year: number, month: number): Promise<number[]> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data: number[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    data.push(await getWaterIntake(dateStr));
  }
  return data;
}
