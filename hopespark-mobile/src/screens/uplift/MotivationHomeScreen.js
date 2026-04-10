import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';
import { UpliftContext } from '../../context/UpliftContext';
import MotivationCard from '../../components/MotivationCard';
import StreakRow from '../../components/StreakRow';
import WeekMoodRow from '../../components/WeekMoodRow';
import SectionLabel from '../../components/SectionLabel';

export default function MotivationHomeScreen({ navigation }) {
  const { todayCard, todayPrompt, streak, moodLog } = useContext(UpliftContext);
  const insets = useSafeAreaInsets();

  const quickActivities = [
    { label: '🌬️ Breathe', screen: 'BreathingScreen' },
    { label: '✏️ Journal', screen: 'JournalScreen' },
    { label: '☀️ Gratitude', screen: 'ActivitiesScreen' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + tokens.spacing.md, paddingBottom: tokens.spacing.xxl }]}
    >
      <MotivationCard card={todayCard} />
      <StreakRow streak={streak} />
      <SectionLabel text="This week" style={{ marginBottom: tokens.spacing.sm }} />
      <WeekMoodRow moodLog={moodLog} />

      <SectionLabel text="Quick activities" style={{ marginBottom: tokens.spacing.sm }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
        {quickActivities.map(a => (
          <TouchableOpacity
            key={a.label}
            style={styles.quickChip}
            onPress={() => navigation.navigate(a.screen)}
          >
            <Text style={styles.quickChipText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionLabel text="Open journal" style={{ marginTop: tokens.spacing.lg, marginBottom: tokens.spacing.sm }} />
      <TouchableOpacity style={styles.journalCard} onPress={() => navigation.navigate('JournalScreen')}>
        <Ionicons name="pencil-outline" size={20} color={tokens.colors.upliftDark} style={{ marginRight: tokens.spacing.sm }} />
        <Text style={styles.journalPromptText} numberOfLines={2}>
          {todayPrompt?.prompt?.slice(0, 60) ?? 'Write your thoughts...'}...
        </Text>
        <Ionicons name="chevron-forward" size={18} color={tokens.colors.upliftDark} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  content: { paddingHorizontal: tokens.spacing.lg },
  quickScroll: { flexGrow: 0, marginBottom: tokens.spacing.lg },
  quickChip: {
    backgroundColor: tokens.colors.upliftLight, borderColor: '#CECBF6',
    borderWidth: 1, borderRadius: tokens.borderRadius.pill,
    paddingHorizontal: 16, paddingVertical: 10, marginRight: tokens.spacing.sm,
  },
  quickChipText: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm, color: tokens.colors.upliftDark,
  },
  journalCard: {
    backgroundColor: tokens.colors.upliftLight, borderColor: '#CECBF6', borderWidth: 1,
    borderRadius: 12, padding: tokens.spacing.md,
    flexDirection: 'row', alignItems: 'center',
  },
  journalPromptText: {
    flex: 1, fontFamily: 'Nunito', fontStyle: 'italic',
    fontSize: tokens.fontSizes.sm, color: tokens.colors.upliftDark, lineHeight: 20,
  },
});
