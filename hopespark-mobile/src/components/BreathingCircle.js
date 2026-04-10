import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { tokens } from '../theme/tokens';

// size: 60 = resting, 110 = expanded
export default function BreathingCircle({ phase, sizePct }) {
  const sizeAnim = useRef(new Animated.Value(60)).current;

  const phaseLabels = {
    inhale: 'Breathe in...',
    hold: 'Hold...',
    exhale: 'Breathe out...',
    rest: 'Rest...',
  };

  useEffect(() => {
    const targets = { inhale: 110, hold: 110, exhale: 60, rest: 60 };
    const durations = { inhale: 4000, hold: 100, exhale: 6000, rest: 100 };
    Animated.timing(sizeAnim, {
      toValue: targets[phase] ?? 60,
      duration: durations[phase] ?? 1000,
      useNativeDriver: false,
    }).start();
  }, [phase]);

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          width: sizeAnim,
          height: sizeAnim,
          borderRadius: Animated.divide(sizeAnim, 2),
        },
      ]}
    >
      <Text style={styles.label}>{phaseLabels[phase] ?? 'Rest...'}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 3,
    borderColor: tokens.colors.uplift,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${tokens.colors.uplift}18`,
  },
  label: {
    fontFamily: 'Nunito_700Bold', fontSize: 10,
    color: tokens.colors.upliftDark, textAlign: 'center',
    paddingHorizontal: 6,
  },
});
