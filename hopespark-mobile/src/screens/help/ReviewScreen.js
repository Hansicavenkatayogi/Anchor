import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { CaseContext } from '../../context/CaseContext';
import StepProgressDots from '../../components/StepProgressDots';
import PrimaryButton from '../../components/PrimaryButton';

export default function ReviewScreen({ navigation }) {
  const { activeDraft, submitCase } = useContext(CaseContext);
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  const urgencyColors = {
    low: tokens.colors.warning,
    medium: '#E87D65',
    high: '#E24B4A',
  };
  const urgencyColor = urgencyColors[activeDraft.urgency] || tokens.colors.textMuted;

  const validate = () => {
    if (!activeDraft.category) {
      Alert.alert('Missing info', 'Please go back and choose a category.', [
        { text: 'Go back', onPress: () => navigation.navigate('CategoryScreen') }
      ]);
      return false;
    }
    if (activeDraft.description.trim().length < 20) {
      Alert.alert('Missing info', 'Please write at least 20 characters describing your situation.', [
        { text: 'Go back', onPress: () => navigation.navigate('StoryScreen') }
      ]);
      return false;
    }
    if (activeDraft.city.trim().length < 2) {
      Alert.alert('Missing info', 'Please enter your city or district.', [
        { text: 'Go back', onPress: () => navigation.navigate('LocationContextScreen') }
      ]);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    const caseId = 'HS-' + Math.floor(1000 + Math.random() * 9000);

    // Simulate async save with 1.5 second loading state
    setTimeout(async () => {
      await submitCase(caseId);
      setSubmitting(false);
      navigation.navigate('ConfirmationScreen', { caseId });
    }, 1500);
  };

  const familyLabel = {
    single_parent: 'Single parent',
    no_parents: 'No parents',
    guardian: 'Living with guardian',
    other: 'Other family',
    prefer_not: 'Prefer not to say',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>Step 4 of 4</Text>
        <StepProgressDots total={4} current={4} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}>
        <Text style={styles.heading}>Does this look right?</Text>
        <Text style={styles.subtext}>You can go back and change anything</Text>

        <View style={styles.summaryCard}>
          {/* Row 1: Category + Urgency */}
          <View style={styles.summaryRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{activeDraft.categoryLabel}</Text>
            </View>
            <View style={[styles.urgencyBadge, { backgroundColor: `${urgencyColor}20`, borderColor: urgencyColor }]}>
              <Text style={[styles.urgencyBadgeText, { color: urgencyColor }]}>
                {activeDraft.urgency ? activeDraft.urgency.charAt(0).toUpperCase() + activeDraft.urgency.slice(1) : ''} urgency
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Row 2: Description */}
          <Text style={styles.fieldLabel}>Your situation</Text>
          <Text style={styles.descriptionText}>{activeDraft.description}</Text>

          <View style={styles.divider} />

          {/* Row 3: Location + family */}
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.fieldLabel}>Location</Text>
              <Text style={styles.fieldValue}>
                {activeDraft.city}{activeDraft.state ? `, ${activeDraft.state}` : ''}
              </Text>
            </View>
            {activeDraft.familySituation ? (
              <View>
                <Text style={styles.fieldLabel}>Family</Text>
                <Text style={styles.fieldValue}>{familyLabel[activeDraft.familySituation] || activeDraft.familySituation}</Text>
              </View>
            ) : null}
          </View>

          {/* Row 4: Contact or anonymous */}
          <View style={styles.divider} />
          {activeDraft.contactInfo ? (
            <View style={styles.summaryRow}>
              <Text style={styles.fieldLabel}>Updates sent to:</Text>
              <Text style={styles.fieldValue}>{activeDraft.contactInfo}</Text>
            </View>
          ) : (
            <Text style={styles.anonymousText}>Mode: Fully anonymous</Text>
          )}
        </View>

        {/* Privacy assurance */}
        <View style={styles.privacyBox}>
          <Ionicons name="shield-checkmark" size={18} color={tokens.colors.primaryDark} style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={styles.privacyText}>
            We will never share your name. Only helpers in <Text style={{ fontFamily: 'Nunito_700Bold' }}>{activeDraft.city}</Text> can see this request.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + tokens.spacing.lg }]}>
        {submitting ? (
          <View style={styles.loadingBtn}>
            <ActivityIndicator color="#FFF" />
            <Text style={styles.loadingText}>Submitting...</Text>
          </View>
        ) : (
          <PrimaryButton
            title="Submit for help →"
            onPress={handleSubmit}
            accessibilityHint="Submits your help request"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg, paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1, borderBottomColor: tokens.colors.border,
  },
  backBtn: { padding: tokens.spacing.xs },
  stepLabel: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
  },
  content: { paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.lg },
  heading: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.lg,
    color: tokens.colors.textPrimary, marginBottom: tokens.spacing.xs,
  },
  subtext: {
    fontFamily: 'Nunito', fontSize: 13, color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.lg,
  },
  summaryCard: {
    backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1,
    borderColor: tokens.colors.border, padding: tokens.spacing.md,
    marginBottom: tokens.spacing.lg, ...tokens.shadows.card,
  },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', flexWrap: 'wrap', gap: 8,
  },
  categoryPill: {
    backgroundColor: tokens.colors.primaryLight, paddingHorizontal: 12,
    paddingVertical: 4, borderRadius: tokens.borderRadius.pill,
  },
  categoryPillText: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.xs,
    color: tokens.colors.primaryDark, textTransform: 'uppercase',
  },
  urgencyBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: tokens.borderRadius.pill, borderWidth: 1,
  },
  urgencyBadgeText: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth, backgroundColor: tokens.colors.border,
    marginVertical: tokens.spacing.md,
  },
  fieldLabel: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted, textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 4,
  },
  fieldValue: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textPrimary,
  },
  descriptionText: {
    fontFamily: 'Nunito', fontSize: tokens.fontSizes.base,
    color: tokens.colors.textSecondary, fontStyle: 'italic', lineHeight: 22,
  },
  anonymousText: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
  },
  privacyBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: tokens.colors.primaryLight, borderColor: '#9FE1CB',
    borderWidth: 1, borderRadius: 10, padding: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  },
  privacyText: {
    flex: 1, fontFamily: 'Nunito', fontSize: tokens.fontSizes.sm,
    color: '#0F6E56', lineHeight: 20,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1, borderTopColor: tokens.colors.border,
  },
  loadingBtn: {
    backgroundColor: tokens.colors.primary, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: tokens.spacing.md, borderRadius: tokens.borderRadius.pill,
    gap: 10,
  },
  loadingText: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md, color: '#FFF',
  },
});
