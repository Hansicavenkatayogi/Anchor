import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { tokens } from '../theme/tokens';

export default function AgeChip({ label, selected, onPress }) {
  const bgAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: selected ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selected, bgAnim]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [tokens.colors.upliftLight, tokens.colors.uplift],
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <Animated.View style={[styles.chip, { backgroundColor: bgColor }]}>
        <Text style={[styles.text, selected && styles.textSelected]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.borderRadius.pill,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: tokens.spacing.xs,
  },
  text: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.upliftDark,
  },
  textSelected: {
    color: '#FFFFFF',
  },
});
