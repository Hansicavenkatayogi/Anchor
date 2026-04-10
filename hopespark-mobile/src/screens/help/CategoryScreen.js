import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { CaseContext } from '../../context/CaseContext';
import CategoryCard from '../../components/CategoryCard';
import SafetyBanner from '../../components/SafetyBanner';
import StepProgressDots from '../../components/StepProgressDots';
import PrimaryButton from '../../components/PrimaryButton';

const CATEGORIES = [
  { id: 'food',     label: 'Food & basics',     icon: 'restaurant-outline',     color: '#1D9E75' },
  { id: 'shelter',  label: 'A safe place',       icon: 'home-outline',           color: '#1E7EC8' },
  { id: 'school',   label: 'School & learning',  icon: 'book-outline',           color: '#7F77DD' },
  { id: 'health',   label: 'Health & body',      icon: 'medkit-outline',         color: '#E87D65' },
  { id: 'clothing', label: 'Clothes & things',   icon: 'shirt-outline',          color: '#BA7517' },
  { id: 'safety',   label: 'I feel unsafe',      icon: 'shield-outline',         color: '#E24B4A' },
  { id: 'other',    label: 'Something else',     icon: 'help-circle-outline',    color: '#888780' },
];

export default function CategoryScreen({ navigation }) {
  const { setDraftField, activeDraft } = useContext(CaseContext);
  const [selectedId, setSelectedId] = useState(activeDraft.category || '');
  const insets = useSafeAreaInsets();

  const handleSelect = (cat) => {
    setSelectedId(cat.id);
    setDraftField('category', cat.id);
    setDraftField('categoryLabel', cat.label);
  };

  const handleContinue = () => {
    navigation.navigate('StoryScreen');
  };

  const mainCats = CATEGORIES.filter(c => c.id !== 'other');
  const otherCat = CATEGORIES.find(c => c.id === 'other');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}
          accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>Step 1 of 4</Text>
        <StepProgressDots total={4} current={1} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Text style={styles.heading}>What do you need help with?</Text>
        <Text style={styles.subtext}>Choose the one that fits best right now</Text>

        <View style={styles.grid}>
          {mainCats.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              label={cat.label}
              iconName={cat.icon}
              color={cat.color}
              selected={selectedId === cat.id}
              onPress={() => handleSelect(cat)}
            />
          ))}
        </View>

        {otherCat && (
          <CategoryCard
            id={otherCat.id}
            label={otherCat.label}
            iconName={otherCat.icon}
            color={otherCat.color}
            selected={selectedId === otherCat.id}
            onPress={() => handleSelect(otherCat)}
          />
        )}

        {selectedId === 'safety' && <SafetyBanner />}

        {/* "Need help now?" floating-style link */}
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
          disabled={!selectedId}
          accessibilityHint="Go to step 2"
        />
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
    marginBottom: tokens.spacing.xl,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
  },
  safetyLink: {
    flexDirection: 'row', alignItems: 'center', marginTop: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
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
});
