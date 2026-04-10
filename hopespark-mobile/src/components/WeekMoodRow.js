import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOOD_EMOJIS = {
  happy: '😊', sad: '😔', worried: '😰',
  frustrated: '😤', okay: '😐', tired: '😴',
};

const isSameDay = (d1, d2) => {
  const a = new Date(d1); const b = new Date(d2);
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

export default function WeekMoodRow({ moodLog }) {
  const today = new Date();
  // Build Mon–Sun of current week
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekDays = DAYS.map((label, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + idx);
    return { label, date: d };
  });

  return (
    <View style={styles.row}>
      {weekDays.map(({ label, date }) => {
        const entry = moodLog.find(m => isSameDay(m.date, date));
        const isToday = isSameDay(date, today);
        return (
          <View key={label} style={styles.col}>
            <Text style={styles.emoji}>{entry ? MOOD_EMOJIS[entry.mood] || '•' : '—'}</Text>
            <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>{label}</Text>
            {isToday && <View style={styles.todayDot} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: tokens.spacing.lg,
  },
  col: { alignItems: 'center', flex: 1 },
  emoji: { fontSize: 16, marginBottom: 4 },
  dayLabel: {
    fontFamily: 'Nunito', fontSize: 9, color: tokens.colors.textMuted,
  },
  todayLabel: { color: tokens.colors.uplift, fontFamily: 'Nunito_700Bold' },
  todayDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: tokens.colors.uplift, marginTop: 2,
  },
});
