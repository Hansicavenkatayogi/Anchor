import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { tokens } from '../theme/tokens';

const MOODS = [
  { id: 'happy',      emoji: '😊', label: 'Happy',     color: '#1D9E75', bg: '#E1F5EE' },
  { id: 'sad',        emoji: '😔', label: 'Sad',       color: '#378ADD', bg: '#E6F1FB' },
  { id: 'worried',    emoji: '😰', label: 'Worried',   color: '#BA7517', bg: '#FAEEDA' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated',color: '#D85A30', bg: '#FAECE7' },
  { id: 'okay',       emoji: '😐', label: 'Just okay', color: '#888780', bg: '#F1EFE8' },
  { id: 'tired',      emoji: '😴', label: 'Tired',     color: '#7F77DD', bg: '#EEEDFE' },
];

export { MOODS };

export default function MoodGrid({ selectedId, onSelect }) {
  const scaleAnims = MOODS.reduce((acc, mood) => {
    acc[mood.id] = useRef(new Animated.Value(1)).current;
    return acc;
  }, {});

  const handleSelect = (mood) => {
    onSelect(mood);
    // Spring pop
    Animated.sequence([
      Animated.spring(scaleAnims[mood.id], { toValue: 1.04, useNativeDriver: true }),
      Animated.spring(scaleAnims[mood.id], { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.grid}>
      {MOODS.map((mood) => {
        const selected = selectedId === mood.id;
        return (
          <TouchableOpacity
            key={mood.id}
            activeOpacity={0.85}
            onPress={() => handleSelect(mood)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={mood.label}
            style={styles.cardWrapper}
          >
            <Animated.View style={[
              styles.card,
              selected && { backgroundColor: mood.bg, borderColor: mood.color, borderWidth: 2 },
              { transform: [{ scale: scaleAnims[mood.id] }] }
            ]}>
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={[styles.label, selected && { color: mood.color, fontFamily: 'Nunito_700Bold' }]}>
                {mood.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrapper: { width: '48%', marginBottom: tokens.spacing.md },
  card: {
    backgroundColor: '#FFF', borderColor: tokens.colors.border, borderWidth: 1,
    borderRadius: 12, paddingVertical: tokens.spacing.md,
    alignItems: 'center', justifyContent: 'center', minHeight: 90,
  },
  emoji: { fontSize: 28, marginBottom: 6 },
  label: {
    fontFamily: 'Nunito_600SemiBold', fontSize: 10,
    color: tokens.colors.textSecondary, textAlign: 'center',
  },
});
