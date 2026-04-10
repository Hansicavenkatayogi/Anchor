import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { UserContext } from '../../context/UserContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function ReadyScreen() {
  const { name, completeOnboarding } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleFinish = async () => {
    await completeOnboarding();
    // No need to navigate manually, RootNavigator will render MainTabNavigator when onboardingDone becomes true
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + tokens.spacing.lg }]}>
      
      {/* Top Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </Animated.View>

        <Text style={styles.heading}>You're all set, {name || 'friend'}!</Text>
        <Text style={styles.subtext}>HopeSpark is your safe place.{"\n"}Whenever you need us, we're here.</Text>
      </View>

      <PrimaryButton 
        title="Let's go →" 
        onPress={handleFinish}
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
    justifyContent: 'center',
    paddingBottom: 80,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: tokens.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  heading: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  subtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
