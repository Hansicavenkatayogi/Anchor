import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

export default function StepProgressDots({ total = 4, current = 1 }) {
  const dots = [];
  for (let i = 1; i <= total; i++) {
    dots.push(
      <View
        key={i}
        style={[
          styles.dot,
          i <= current && styles.dotActive
        ]}
      />
    );
  }

  return <View style={styles.container}>{dots}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.border,
    marginHorizontal: 3, // gap will be 6
  },
  dotActive: {
    backgroundColor: tokens.colors.primary,
  },
});
