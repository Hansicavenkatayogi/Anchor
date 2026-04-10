import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

export default function UrgencySelector({ value, onChange }) {
  const options = [
    { id: 'low', label: 'Low', color: tokens.colors.warning },
    { id: 'medium', label: 'Medium', color: '#E87D65' },   // Coral
    { id: 'high', label: 'High', color: '#E24B4A' },       // Red
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How urgent does this feel?</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.8}
              onPress={() => onChange(opt.id)}
              style={[
                styles.option,
                selected && { backgroundColor: `${opt.color}15`, borderColor: opt.color, borderWidth: 2 }
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <View style={[styles.dot, { backgroundColor: opt.color }]} />
              <Text style={[styles.label, selected && { fontFamily: 'Nunito_700Bold', color: opt.color }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: tokens.spacing.md,
  },
  title: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.md,
    paddingVertical: tokens.spacing.sm,
    marginHorizontal: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textSecondary,
  },
});
