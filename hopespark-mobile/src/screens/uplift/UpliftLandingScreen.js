import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens } from '../../theme/tokens';
import { UpliftContext } from '../../context/UpliftContext';
import MoodGrid, { MOODS } from '../../components/MoodGrid';
import MotivationCard from '../../components/MotivationCard';
import PrimaryButton from '../../components/PrimaryButton';

export default function UpliftLandingScreen({ navigation }) {
  const { todayMood, todayCard } = useContext(UpliftContext);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (todayMood) {
      navigation.replace('MotivationHomeScreen');
    }
  }, [todayMood, navigation]);

  if (todayMood) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.top, { paddingTop: insets.top + tokens.spacing.xl }]}>
        <View style={styles.iconBox}><View style={styles.innerCircle} /></View>
        <Text style={styles.heading}>Uplift Stream</Text>
        <Text style={styles.subtext}>Your AI friend is here. Talk, share, feel better.</Text>
      </View>

      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + tokens.spacing.lg }]}>
        <Text style={styles.cardHeading}>How are you feeling today?</Text>
        <View style={styles.moodPreview}>
          {MOODS.slice(0, 3).map(m => (
            <View key={m.id} style={styles.moodPill}>
              <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
            </View>
          ))}
          <Text style={styles.moodEllipsis}>···</Text>
        </View>
        <PrimaryButton
          title="Check in & chat →"
          onPress={() => navigation.navigate('MoodCheckInScreen')}
          style={{ backgroundColor: tokens.colors.uplift }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.upliftLight },
  top: {
    flex: 0.5, alignItems: 'center', paddingHorizontal: tokens.spacing.xl,
  },
  iconBox: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: tokens.colors.uplift,
    justifyContent: 'center', alignItems: 'center', marginBottom: tokens.spacing.md,
  },
  innerCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF' },
  heading: {
    fontFamily: 'Nunito_700Bold', fontSize: 22,
    color: tokens.colors.upliftDark, marginBottom: tokens.spacing.xs,
  },
  subtext: {
    fontFamily: 'Nunito', fontSize: 13, color: '#534AB7', textAlign: 'center',
  },
  bottomCard: {
    flex: 0.5, backgroundColor: '#FFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, ...tokens.shadows.card,
  },
  cardHeading: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary, marginBottom: tokens.spacing.md,
  },
  moodPreview: {
    flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.lg, gap: 8,
  },
  moodPill: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: tokens.colors.upliftLight,
    justifyContent: 'center', alignItems: 'center',
  },
  moodEllipsis: { fontFamily: 'Nunito_700Bold', color: tokens.colors.textMuted, fontSize: 18 },
  moodDone: { flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.md },
  moodBigEmoji: { fontSize: 32, marginRight: tokens.spacing.sm },
  moodDoneLabel: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: tokens.colors.upliftDark },
  secondaryLinks: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  secondaryLink: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm, color: tokens.colors.uplift,
  },
  secondaryDivider: { color: tokens.colors.textMuted },
});
