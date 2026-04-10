import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { CaseContext } from '../../context/CaseContext';
import StepProgressDots from '../../components/StepProgressDots';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';

const FAMILY_OPTIONS = [
  { id: 'single_parent', label: 'Single parent' },
  { id: 'no_parents',    label: 'No parents' },
  { id: 'guardian',      label: 'Living with guardian' },
  { id: 'other',         label: 'Other family' },
  { id: 'prefer_not',    label: 'Prefer not to say' },
];

export default function LocationContextScreen({ navigation }) {
  const { setDraftField, activeDraft } = useContext(CaseContext);
  const insets = useSafeAreaInsets();

  const [city, setCity]                     = useState(activeDraft.city || '');
  const [state, setState]                   = useState(activeDraft.state || '');
  const [familySituation, setFamilySit]     = useState(activeDraft.familySituation || '');
  const [contactInfo, setContactInfo]       = useState(activeDraft.contactInfo || '');

  const isValid = city.trim().length >= 2;

  const handleContinue = () => {
    setDraftField('city', city.trim());
    setDraftField('state', state.trim());
    setDraftField('familySituation', familySituation);
    setDraftField('contactInfo', contactInfo.trim());
    navigation.navigate('ReviewScreen');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.stepLabel}>Step 3 of 4</Text>
          <StepProgressDots total={4} current={3} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>A little more about you</Text>
          <Text style={styles.subtext}>Helps us find support close to where you are</Text>

          <FormField
            label="City / District"
            value={city}
            onChangeText={(t) => { setCity(t); setDraftField('city', t); }}
            placeholder="e.g. Hyderabad"
          />

          <FormField
            label="State"
            value={state}
            onChangeText={(t) => { setState(t); setDraftField('state', t); }}
            placeholder="e.g. Telangana"
            optional
          />

          {/* Family situation chips */}
          <Text style={styles.chipGroupLabel}>Family situation</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {FAMILY_OPTIONS.map((opt) => {
              const sel = familySituation === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.chip, sel && styles.chipSelected]}
                  onPress={() => { setFamilySit(opt.id); setDraftField('familySituation', opt.id); }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: sel }}
                >
                  <Text style={[styles.chipText, sel && styles.chipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <FormField
            label="Contact"
            value={contactInfo}
            onChangeText={(t) => { setContactInfo(t); setDraftField('contactInfo', t); }}
            placeholder="Phone or email (optional)"
            optional
            keyboardType="email-address"
            helperText="Only used to send you updates. Leave blank to stay fully anonymous."
          />

          {/* Privacy card */}
          <View style={styles.privacyCard}>
            <Ionicons name="lock-closed" size={16} color={tokens.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.privacyText}>
              Your name is replaced with a code. Only your situation and city are shared with helpers.
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + tokens.spacing.lg }]}>
          <PrimaryButton
            title="Continue →"
            onPress={handleContinue}
            disabled={!isValid}
            accessibilityHint="Go to step 4 — review before submitting"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: tokens.spacing.xl,
  },
  chipGroupLabel: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary, marginBottom: tokens.spacing.sm,
  },
  chipScroll: { flexGrow: 0, marginBottom: tokens.spacing.xl },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: tokens.borderRadius.pill,
    borderWidth: 1, borderColor: tokens.colors.border,
    backgroundColor: '#FFF', marginRight: 8,
  },
  chipSelected: {
    backgroundColor: tokens.colors.primaryLight,
    borderColor: tokens.colors.primary, borderWidth: 1.5,
  },
  chipText: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textSecondary,
  },
  chipTextSelected: { color: tokens.colors.primaryDark },
  privacyCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: tokens.colors.primaryLight,
    borderColor: '#9FE1CB', borderWidth: 1,
    borderRadius: 10, padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
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
});
