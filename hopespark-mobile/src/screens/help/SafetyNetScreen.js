import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';

export default function SafetyNetScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const contacts = [
    { name: 'Childline India', num: '1098', desc: 'Free · 24/7 · All India' },
    { name: 'iCall (TISS)', num: '9152987821', desc: 'Counselling' },
    { name: 'Vandrevala Foundation', num: '18602662345', desc: 'Mental Health 24/7', displayNum: '1860-2662-345' },
    { name: 'Local police', num: '100', desc: 'Emergency response' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + tokens.spacing.lg }]}>
      <View style={styles.topBanner}>
        <Text style={styles.bannerTitle}>Are you safe right now?</Text>
        <Text style={styles.bannerDesc}>
          If you're in danger, please contact someone you trust or call emergency services right away.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Quick contacts</Text>

      {contacts.map((c, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardName}>{c.name}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.num}`)}>
              <Text style={styles.cardNumber}>{c.displayNum || c.num}</Text>
            </TouchableOpacity>
            <Text style={styles.cardDesc}>{c.desc}</Text>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL(`tel:${c.num}`)}>
            <Ionicons name="call" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.bottomBtnText}>I'm okay — go back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    paddingHorizontal: tokens.spacing.lg,
  },
  topBanner: {
    backgroundColor: '#FFECD1',
    borderColor: '#FFC885',
    borderWidth: 1,
    padding: tokens.spacing.md,
    borderRadius: 12,
    marginTop: tokens.spacing.xl,
    marginBottom: tokens.spacing.xl,
  },
  bannerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: '#BA7517',
    marginBottom: tokens.spacing.xs,
  },
  bannerDesc: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.sm,
    color: '#93580A',
    lineHeight: 20,
  },
  sectionHeader: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: tokens.spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 10,
    padding: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  cardLeft: {
    flex: 1,
  },
  cardName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
  },
  cardNumber: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.primary,
    marginVertical: 4,
  },
  cardDesc: {
    fontFamily: 'Nunito',
    fontSize: 11,
    color: tokens.colors.textMuted,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  bottomBtn: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  bottomBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textSecondary,
  },
});
