import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../theme/tokens';

export default function HelpPlaceholder({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name="hand-left" size={64} color="#FFFFFF" />
      </View>
      <Text style={styles.heading}>Help Stream is coming soon</Text>
      <Text style={styles.subtext}>
        In the next phase, you'll be able to share what you need and get real support.
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
    backgroundColor: tokens.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  heading: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: tokens.colors.primaryDark,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  subtext: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.md,
    color: '#0F6E56',
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
    color: tokens.colors.primaryDark,
  },
});
