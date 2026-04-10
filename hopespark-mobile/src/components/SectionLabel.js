import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

export default function SectionLabel({ text, style }) {
  return <Text style={[styles.label, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.sm,
  },
});
