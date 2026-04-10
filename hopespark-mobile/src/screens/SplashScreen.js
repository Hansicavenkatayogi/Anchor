import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';
import { tokens } from '../theme/tokens';

export default function SplashScreen({ navigation }) {
  const { onboardingDone } = useContext(UserContext);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // The RootNavigator handles the actual routing implicitly based on onboardingDone,
      // but to force the transition animation without jarring logic jumps if they are
      // manually resetting states, we could navigate if we used different screens.
      // Since our RootNavigator switches conditionally, we just replace the stack root
      if (onboardingDone) {
        navigation.replace('Main');
      } else {
        navigation.replace('Welcome');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigation, opacityAnim, onboardingDone]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
        <View style={styles.logoBox}>
          <View style={styles.sparkCircle} />
        </View>
        <Text style={styles.appName}>HopeSpark</Text>
        <Text style={styles.tagline}>You are not alone.{"\n"}We're here with you.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoBox: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  sparkCircle: {
    width: 28,
    height: 28,
    backgroundColor: tokens.colors.primary, // using primary to act as abstract shape
    borderRadius: 14,
  },
  appName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 26,
    color: '#FFFFFF',
    marginBottom: tokens.spacing.sm,
  },
  tagline: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#9FE1CB',
    textAlign: 'center',
    lineHeight: 20.8, // 13 * 1.6
  },
});
