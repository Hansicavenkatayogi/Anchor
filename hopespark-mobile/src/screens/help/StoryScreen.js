import React, { useContext, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { CaseContext } from '../../context/CaseContext';
import StepProgressDots from '../../components/StepProgressDots';
import UrgencySelector from '../../components/UrgencySelector';
import PrimaryButton from '../../components/PrimaryButton';

export default function StoryScreen({ navigation }) {
  const { setDraftField, activeDraft } = useContext(CaseContext);
  const [description, setDescription] = useState(activeDraft.description || '');
  const [urgency, setUrgency] = useState(activeDraft.urgency || 'medium');
  const [focused, setFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const handleDescChange = (text) => {
    setDescription(text);
    setDraftField('description', text);
  };

  const handleUrgencyChange = (val) => {
    setUrgency(val);
    setDraftField('urgency', val);
  };

  const handleContinue = () => {
    setDraftField('description', description);
    setDraftField('urgency', urgency);
    navigation.navigate('LocationContextScreen');
  };

  const isValid = description.trim().length >= 20;

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
          <Text style={styles.stepLabel}>Step 2 of 4</Text>
          <StepProgressDots total={4} current={2} />
        </View>

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
          keyboardShouldPersistTaps="handled">

          {/* Category badge */}
          {activeDraft.categoryLabel ? (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{activeDraft.categoryLabel}</Text>
            </View>
          ) : null}

          <Text style={styles.heading}>Tell us more</Text>
          <Text style={styles.subtext}>Use your own words. There are no wrong answers.</Text>

          <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={handleDescChange}
              multiline
              textAlignVertical="top"
              maxLength={600}
              placeholder={"What's been happening?\nYou can share as much or as little as you want..."}
              placeholderTextColor={tokens.colors.textMuted}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              accessibilityLabel="Describe your situation"
            />
            <Text style={styles.charCounter}>{description.length} / 600</Text>
          </View>

          <UrgencySelector value={urgency} onChange={handleUrgencyChange} />

          {/* Safety link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SafetyNetScreen')}
            style={styles.safetyLink}
          >
            <Ionicons name="warning-outline" size={14} color={tokens.colors.warning} />
            <Text style={styles.safetyLinkText}>Need help right now?</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + tokens.spacing.lg }]}>
          <PrimaryButton
            title="Continue →"
            onPress={handleContinue}
            disabled={!isValid}
            accessibilityHint="Submits your description and goes to step 3"
          />
          {!isValid && (
            <Text style={styles.validationHint}>
              Please write at least 20 characters
            </Text>
          )}
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
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.primaryLight,
    borderRadius: tokens.borderRadius.pill,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: tokens.spacing.md,
  },
  categoryBadgeText: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.xs,
    color: tokens.colors.primaryDark, textTransform: 'uppercase',
  },
  heading: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.lg,
    color: tokens.colors.textPrimary, marginBottom: tokens.spacing.xs,
  },
  subtext: {
    fontFamily: 'Nunito', fontSize: 13, color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.md,
  },
  inputWrapper: {
    backgroundColor: '#FFF', borderRadius: tokens.borderRadius.sm,
    borderWidth: 1, borderColor: tokens.colors.border,
    padding: tokens.spacing.md, minHeight: 120, maxHeight: 180,
  },
  inputWrapperFocused: {
    borderColor: tokens.colors.primary, borderWidth: 2,
  },
  textInput: {
    fontFamily: 'Nunito', fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary, flex: 1,
  },
  charCounter: {
    fontFamily: 'Nunito', fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted, textAlign: 'right', marginTop: 6,
  },
  safetyLink: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: tokens.spacing.lg, paddingVertical: tokens.spacing.sm,
  },
  safetyLinkText: {
    fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.sm,
    color: tokens.colors.warning, marginLeft: 6,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1, borderTopColor: tokens.colors.border,
  },
  validationHint: {
    fontFamily: 'Nunito', fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted, textAlign: 'center', marginTop: tokens.spacing.xs,
  },
});
