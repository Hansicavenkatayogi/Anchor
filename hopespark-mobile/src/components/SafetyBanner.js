import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../theme/tokens';

export default function SafetyBanner() {
  const handleCall = () => {
    Linking.openURL('tel:1098');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        <Text style={styles.text}>
          If you feel unsafe right now, you can call Childline: <Text style={styles.bold}>1098</Text> — it's free and confidential.
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCall}
        accessibilityLabel="Call Childline, 1098"
      >
        <Ionicons name="call" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
        <Text style={styles.buttonText}>Call now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF0F0',
    borderColor: '#F09595',
    borderWidth: 1,
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tokens.spacing.md,
  },
  textColumn: {
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  text: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.sm,
    color: '#D14343',
    lineHeight: 18,
  },
  bold: {
    fontFamily: 'Nunito_700Bold',
  },
  button: {
    backgroundColor: '#E24B4A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: tokens.borderRadius.sm,
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.sm,
    color: '#FFFFFF',
  },
});
