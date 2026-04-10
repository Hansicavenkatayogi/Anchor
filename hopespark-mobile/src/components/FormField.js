import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

export default function FormField({ label, value, onChangeText, placeholder, optional, helperText, keyboardType = 'default' }) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && <Text style={styles.optional}>(optional)</Text>}
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.textMuted}
        keyboardType={keyboardType}
      />
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.xl,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  label: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
  },
  optional: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
    marginLeft: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.sm,
    paddingHorizontal: tokens.spacing.md,
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
    backgroundColor: '#FFFFFF',
  },
  helperText: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted,
    marginTop: 6,
    lineHeight: 16,
  },
});
