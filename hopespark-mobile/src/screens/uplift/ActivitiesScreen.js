import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from '../../theme/tokens';
import ActivityCard from '../../components/ActivityCard';

export default function ActivitiesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [gratitudeText, setGratitudeText] = useState('');
  const [gratitudeSaved, setGratitudeSaved] = useState(false);
  const [showGratitudeInput, setShowGratitudeInput] = useState(false);

  const handleSaveGratitude = async () => {
    if (!gratitudeText.trim()) return;
    try {
      const existing = await AsyncStorage.getItem('gratitude_log');
      const log = existing ? JSON.parse(existing) : [];
      log.push({ date: new Date().toISOString(), entry: gratitudeText.trim() });
      await AsyncStorage.setItem('gratitude_log', JSON.stringify(log));
      setGratitudeSaved(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Things to try</Text>
          <Text style={styles.subtitle}>Little moments that help</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ActivityCard
          bg={tokens.colors.primaryLight}
          border="#9FE1CB"
          iconName="leaf-outline"
          iconColor={tokens.colors.primaryDark}
          title="Breathe with me"
          titleColor={tokens.colors.primaryDark}
          description="A 2-minute breathing exercise to calm your mind when things feel overwhelming."
          duration="2 min"
          ctaLabel="Start"
          onPress={() => navigation.navigate('BreathingScreen')}
        />

        <ActivityCard
          bg={tokens.colors.upliftLight}
          border="#CECBF6"
          iconName="pencil-outline"
          iconColor={tokens.colors.upliftDark}
          title="Write it out"
          titleColor={tokens.colors.upliftDark}
          description="A gentle daily prompt to help you understand your feelings and remember good things."
          duration="5 min"
          ctaLabel="Open journal"
          onPress={() => navigation.navigate('JournalScreen')}
        />

        <View style={[styles.gratitudeCard]}>
          <View style={styles.gratitudeTop}>
            <View style={styles.gratitudeIconRow}>
              <Ionicons name="sunny-outline" size={28} color="#633806" />
              <View style={styles.durationBadge}><Text style={styles.durationText}>1 min</Text></View>
            </View>
            <Text style={[styles.actTitle, { color: '#633806' }]}>Something good today</Text>
            <Text style={styles.actDesc}>
              Name one small good thing from today. Even tiny good things count.
            </Text>
          </View>

          {!showGratitudeInput && !gratitudeSaved && (
            <TouchableOpacity
              style={[styles.actCta, { borderTopColor: '#FAC775' }]}
              onPress={() => setShowGratitudeInput(true)}
            >
              <Text style={[styles.actCtaText, { color: '#633806' }]}>Try it</Text>
              <Ionicons name="arrow-forward" size={16} color="#633806" />
            </TouchableOpacity>
          )}

          {showGratitudeInput && !gratitudeSaved && (
            <View style={styles.gratitudeInputRow}>
              <TextInput
                style={styles.gratitudeInput}
                value={gratitudeText}
                onChangeText={setGratitudeText}
                placeholder="Something good today..."
                placeholderTextColor={tokens.colors.textMuted}
                autoFocus
                maxLength={120}
              />
              <TouchableOpacity style={styles.saveGratitude} onPress={handleSaveGratitude}>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {gratitudeSaved && (
            <View style={styles.gratitudeSaved}>
              <Text style={styles.sparkSays}>
                ✨ Spark says: That's beautiful. Hold onto that feeling. 🌟
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1, borderBottomColor: tokens.colors.border,
  },
  backBtn: { padding: tokens.spacing.xs },
  title: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.lg, color: tokens.colors.textPrimary },
  subtitle: { fontFamily: 'Nunito', fontSize: 12, color: tokens.colors.textMuted },
  content: { padding: tokens.spacing.lg },
  // Gratitude card (manual since it has inline input)
  gratitudeCard: {
    backgroundColor: '#FAEEDA', borderColor: '#FAC775', borderWidth: 1,
    borderRadius: tokens.borderRadius.lg, padding: tokens.spacing.lg,
    ...tokens.shadows.card,
  },
  gratitudeTop: { marginBottom: tokens.spacing.md },
  gratitudeIconRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.sm,
  },
  durationBadge: {
    backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: tokens.borderRadius.pill,
  },
  durationText: { fontFamily: 'Nunito_600SemiBold', fontSize: 10, color: '#444' },
  actTitle: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md, marginBottom: 6 },
  actDesc: {
    fontFamily: 'Nunito', fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textSecondary, lineHeight: 20,
  },
  actCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    gap: 6, borderTopWidth: 1, paddingTop: tokens.spacing.sm,
  },
  actCtaText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm },
  gratitudeInputRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: tokens.spacing.sm, gap: 8,
  },
  gratitudeInput: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1,
    borderColor: '#FAC775', paddingHorizontal: 12, paddingVertical: 8,
    fontFamily: 'Nunito', fontSize: 14, color: tokens.colors.textPrimary,
  },
  saveGratitude: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#BA7517',
    justifyContent: 'center', alignItems: 'center',
  },
  gratitudeSaved: { marginTop: tokens.spacing.sm },
  sparkSays: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm, color: '#633806' },
});
