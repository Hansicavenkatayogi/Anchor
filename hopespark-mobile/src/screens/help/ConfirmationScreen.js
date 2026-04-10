import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import PrimaryButton from '../../components/PrimaryButton';

export default function ConfirmationScreen({ route, navigation }) {
  const { caseId } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const nextSteps = [
    { num: '1', text: 'Helpers in your area see your request' },
    { num: '2', text: 'A welfare society or fundraiser reaches out' },
    { num: '3', text: 'You get support — right where you are' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + tokens.spacing.lg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark" size={52} color="#FFFFFF" />
        </Animated.View>

        <Text style={styles.heading}>Your request is in!</Text>
        <Text style={styles.subtext}>We've shared it with helpers near you.</Text>

        {/* Case card */}
        <View style={styles.caseCard}>
          <Text style={styles.caseId}>{caseId}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '20%' }]} />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.statusText}>Submitted → Under review</Text>
          </View>
        </View>

        {/* What happens next */}
        <Text style={styles.sectionTitle}>What happens next?</Text>
        <View style={styles.stepsList}>
          {nextSteps.map((step) => (
            <View key={step.num} style={styles.stepItem}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNum}>{step.num}</Text>
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          title="Track my request"
          onPress={() => navigation.navigate('MyCasesScreen')}
          style={{ marginTop: tokens.spacing.lg }}
        />

        <TouchableOpacity
          style={styles.homeLink}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.homeLinkText}>Go back home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  content: {
    paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.xl,
    alignItems: 'center',
  },
  checkCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: tokens.colors.success,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  heading: {
    fontFamily: 'Nunito_700Bold', fontSize: 22,
    color: tokens.colors.textPrimary, marginBottom: tokens.spacing.xs,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: 'Nunito', fontSize: 13, color: tokens.colors.textMuted,
    textAlign: 'center', marginBottom: tokens.spacing.xl,
  },
  caseCard: {
    width: '100%', backgroundColor: tokens.colors.primaryLight,
    borderColor: '#9FE1CB', borderWidth: 1, borderRadius: 12,
    padding: tokens.spacing.md, marginBottom: tokens.spacing.xl,
  },
  caseId: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.lg,
    color: tokens.colors.primaryDark, marginBottom: tokens.spacing.sm,
  },
  progressBarBg: {
    height: 8, backgroundColor: tokens.colors.border, borderRadius: 4,
    width: '100%', overflow: 'hidden', marginBottom: tokens.spacing.xs,
  },
  progressBarFill: {
    height: '100%', backgroundColor: tokens.colors.primary, borderRadius: 4,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDot: { color: tokens.colors.primary, marginRight: 6, fontSize: 10 },
  statusText: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.sm,
    color: '#0F6E56',
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary, alignSelf: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  stepsList: { width: '100%', marginBottom: tokens.spacing.md },
  stepItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  stepNumCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: tokens.colors.primary, justifyContent: 'center',
    alignItems: 'center', marginRight: tokens.spacing.md,
  },
  stepNum: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm, color: '#FFF',
  },
  stepText: {
    flex: 1, fontFamily: 'Nunito', fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary, lineHeight: 22, paddingTop: 3,
  },
  homeLink: { marginTop: tokens.spacing.lg, paddingVertical: tokens.spacing.md },
  homeLinkText: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.base,
    color: tokens.colors.textSecondary,
  },
});
