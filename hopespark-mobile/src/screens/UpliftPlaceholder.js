import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../theme/tokens';

export default function UpliftPlaceholder({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name="heart" size={64} color="#FFFFFF" />
      </View>
      <Text style={styles.heading}>Your AI friend is almost ready</Text>
      <Text style={styles.subtext}>
        The Uplift Stream with your personal companion launches in Phase 3.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.upliftLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: tokens.colors.uplift,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  heading: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: tokens.colors.upliftDark,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  subtext: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.md,
    color: '#534AB7',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: tokens.spacing.xl,
  },
  backButton: {
    padding: tokens.spacing.md,
  },
  backText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.upliftDark,
  },
});
