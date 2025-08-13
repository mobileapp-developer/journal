export interface BarData {
    value: number;
    label?: string;
    frontColor?: string;
    [key: string]: any;
};

export interface JournalEntry {
    date: string;
    feelings: string[];
    selfLove: string;
    selfCare: string[];
    gratitude: [string, string, string];
    waterIntake: number;
};