import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { tokens } from '../theme/tokens';

const CHIPS_BANK = [
  'Tell me more', 'Not really', 'Yes!', "I'm not sure",
  'A little bit', 'That was hard', 'It made me happy',
  'I did okay', 'My teacher', 'My friend', 'Maybe', 'I think so',
  "Not today", "Kind of", "A lot actually",
];

export default function QuickReplyChips({ onSend, visible }) {
  if (!visible) return null;

  // Pick 3 chips randomly per render (stable per AI message)
  const chips = CHIPS_BANK.slice(0, 3);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {chips.map((chip) => (
        <TouchableOpacity
          key={chip}
          style={styles.chip}
          onPress={() => onSend(chip)}
          activeOpacity={0.8}
        >
          <Text style={styles.chipText}>{chip}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { maxHeight: 44, marginBottom: 4 },
  container: { paddingHorizontal: tokens.spacing.md, gap: 8, alignItems: 'center' },
  chip: {
    backgroundColor: tokens.colors.upliftLight,
    borderColor: '#CECBF6', borderWidth: 1,
    borderRadius: tokens.borderRadius.pill,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  chipText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.upliftDark,
  },
});
