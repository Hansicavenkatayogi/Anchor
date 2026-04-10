import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { CaseContext } from '../../context/CaseContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function HelpLandingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cases, resetDraft } = useContext(CaseContext);

  const handleStart = () => {
    resetDraft();
    navigation.navigate('CategoryScreen');
  };

  const categories = [
    { id: '1', label: 'Food' },
    { id: '2', label: 'Shelter' },
    { id: '3', label: 'School' },
    { id: '4', label: 'Health' },
    { id: '5', label: 'Clothes' },
    { id: '6', label: 'Safety' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, { paddingTop: insets.top + tokens.spacing.xl }]}>
        <View style={styles.iconBox}>
          <View style={styles.innerCircle} />
        </View>
        <Text style={styles.heading}>Help Stream</Text>
        <Text style={styles.subtext}>
          Tell us what's going on. We'll find someone who can help.
        </Text>
      </View>

      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + tokens.spacing.lg }]}>
        <Text style={styles.cardLabel}>What we help with:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {categories.map((c) => (
            <View key={c.id} style={styles.pill}>
              <Text style={styles.pillText}>{c.label}</Text>
            </View>
          ))}
        </ScrollView>

        <PrimaryButton title="Share my situation →" onPress={handleStart} style={{ marginTop: tokens.spacing.md }} />
        
        <View style={styles.lockInfo}>
          <Ionicons name="lock-closed" size={10} color={tokens.colors.textMuted} />
          <Text style={styles.lockText}>Your real name is never shared</Text>
        </View>

        {cases.length > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('MyCasesScreen')} style={styles.pastLink}>
            <Text style={styles.pastLinkText}>See my past requests ({cases.length})</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.primaryLight,
  },
  topSection: {
    flex: 0.6,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  innerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: tokens.colors.primaryDark,
    marginBottom: tokens.spacing.sm,
  },
  subtext: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: '#0F6E56',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomCard: {
    flex: 0.4,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    ...tokens.shadows.card,
  },
  cardLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: tokens.spacing.sm,
  },
  pillsScroll: {
    flexGrow: 0,
    marginBottom: tokens.spacing.lg,
  },
  pill: {
    backgroundColor: tokens.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: tokens.borderRadius.pill,
    marginRight: 8,
  },
  pillText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    color: tokens.colors.primaryDark,
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
  },
  lockText: {
    fontFamily: 'Nunito',
    fontSize: 10,
    color: tokens.colors.textMuted,
    marginLeft: 4,
  },
  pastLink: {
    marginTop: tokens.spacing.lg,
    alignItems: 'center',
  },
  pastLinkText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.primary,
  },
});
