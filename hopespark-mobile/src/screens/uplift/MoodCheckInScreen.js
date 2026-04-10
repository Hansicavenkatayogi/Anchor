import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';
import { UpliftContext } from '../../context/UpliftContext';
import MoodGrid, { MOODS } from '../../components/MoodGrid';
import PrimaryButton from '../../components/PrimaryButton';

export default function MoodCheckInScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const { logMood } = useContext(UpliftContext);
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    const mood = MOODS.find(m => m.id === selectedMood.id);
    await logMood({ mood: mood.id, emoji: mood.emoji, label: mood.label });
    navigation.replace('ChatScreen', { mood: mood.id });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + tokens.spacing.lg }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={tokens.colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.heading}>How are you feeling right now?</Text>
      <Text style={styles.subtext}>Just tap the one that feels closest.</Text>

      <MoodGrid selectedId={selectedMood?.id} onSelect={setSelectedMood} />

      <PrimaryButton
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedMood}
        style={{ backgroundColor: selectedMood ? tokens.colors.uplift : undefined, marginTop: tokens.spacing.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface, paddingHorizontal: tokens.spacing.lg },
  backBtn: { paddingVertical: tokens.spacing.md },
  heading: {
    fontFamily: 'Nunito_700Bold', fontSize: 20,
    color: tokens.colors.textPrimary, marginBottom: tokens.spacing.xs,
  },
  subtext: {
    fontFamily: 'Nunito', fontSize: 13, color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xl,
  },
});
