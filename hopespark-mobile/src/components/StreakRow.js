import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { tokens } from '../theme/tokens';

export default function StreakRow({ streak }) {
  const currentAnim = useRef(new Animated.Value(0)).current;
  const totalAnim   = useRef(new Animated.Value(0)).current;
  const goodAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (anim, target) =>
      Animated.timing(anim, { toValue: target, duration: 600, useNativeDriver: false });
    Animated.parallel([
      animate(currentAnim, streak.current),
      animate(totalAnim, streak.total),
      animate(goodAnim, streak.goodDays),
    ]).start();
  }, [streak]);

  const AnimNum = ({ anim }) => {
    const display = anim.interpolate({ inputRange: [0, Math.max(anim._value || 1, 1)], outputRange: ['0', String(Math.round(anim._value || 0))] });
    return null; // Use state-based approach below
  };

  const chips = [
    { label: 'Day streak', value: streak.current, bg: '#E1F5EE', color: tokens.colors.primary },
    { label: 'Total chats', value: streak.total,  bg: tokens.colors.upliftLight, color: tokens.colors.uplift },
    { label: 'Good days',  value: streak.goodDays,bg: '#FAEEDA', color: tokens.colors.warning },
  ];

  return (
    <View style={styles.row}>
      {chips.map((chip) => (
        <View key={chip.label} style={[styles.chip, { backgroundColor: chip.bg }]}>
          <Text style={[styles.number, { color: chip.color }]}>{chip.value}</Text>
          <Text style={[styles.label, { color: chip.color }]}>{chip.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.lg },
  chip: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, paddingVertical: tokens.spacing.md, marginHorizontal: 4,
  },
  number: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.xl },
  label:  { fontFamily: 'Nunito_600SemiBold', fontSize: 10, marginTop: 2 },
});
