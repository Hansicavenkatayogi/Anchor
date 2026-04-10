import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../theme/tokens';

export default function ActivityCard({ bg, border, iconName, iconColor, title, titleColor, description, duration, ctaLabel, onPress }) {
  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
      <View style={styles.top}>
        <View style={styles.iconRow}>
          <Ionicons name={iconName} size={28} color={iconColor} />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <TouchableOpacity style={[styles.cta, { borderColor: border }]} onPress={onPress} activeOpacity={0.8}>
        <Text style={[styles.ctaText, { color: titleColor }]}>{ctaLabel}</Text>
        <Ionicons name="arrow-forward" size={16} color={titleColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.borderRadius.lg, borderWidth: 1,
    padding: tokens.spacing.lg, marginBottom: tokens.spacing.md,
    ...tokens.shadows.card,
  },
  top: { marginBottom: tokens.spacing.md },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.sm },
  durationBadge: {
    backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: tokens.borderRadius.pill,
  },
  durationText: { fontFamily: 'Nunito_600SemiBold', fontSize: 10, color: '#444' },
  title: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md, marginBottom: 6 },
  description: {
    fontFamily: 'Nunito', fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textSecondary, lineHeight: 20,
  },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    gap: 6, borderTopWidth: 1, paddingTop: tokens.spacing.sm,
  },
  ctaText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm },
});
