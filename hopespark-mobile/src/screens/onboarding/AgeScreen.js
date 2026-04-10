import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tokens } from '../../theme/tokens';
import { UserContext } from '../../context/UserContext';
import PrimaryButton from '../../components/PrimaryButton';
import AgeChip from '../../components/AgeChip';

export default function AgeScreen({ navigation }) {
  const [selectedAge, setSelectedAge] = useState('');
  const { saveAgeGroup } = useContext(UserContext);
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    if (selectedAge) {
      await saveAgeGroup(selectedAge);
      navigation.navigate('Consent');
    }
  };

  const ageOptions = ['Under 10', '10 \u2013 13', '14 \u2013 17'];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + tokens.spacing.lg }]}>
      
      {/* Top Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>How old are you?</Text>
        <Text style={styles.subtext}>We'll make things just right for you.</Text>
        
        <View style={styles.chipsContainer}>
          {ageOptions.map((age) => (
            <AgeChip 
              key={age}
              label={age} 
              selected={selectedAge === age} 
              onPress={() => setSelectedAge(age)} 
            />
          ))}
        </View>
      </View>

      <PrimaryButton 
        title="Continue →" 
        onPress={handleContinue}
        disabled={!selectedAge}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: tokens.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: tokens.colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: tokens.spacing.xxl,
  },
  heading: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  subtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
  chipsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
});
