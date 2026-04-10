import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../theme/tokens';

export default function MotivationCard({ card, compact = false }) {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1, duration: 500, useNativeDriver: true,
    }).start();
  }, [card?.id]);

  const handleShare = async () => {
    if (!card) return;
    try {
      await Share.share({ message: `"${card.quote}" — ${card.author}\n\nShared from HopeSpark 💜` });
    } catch (e) {}
  };

  if (!card) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <Animated.View style={[styles.card, compact && styles.cardCompact, { opacity: opacityAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Today's boost ✨</Text>
        <Text style={styles.dateStr}>{dateStr}</Text>
      </View>
      <Text style={styles.quote}>"{card.quote}"</Text>
      <View style={styles.footer}>
        <Text style={styles.author}>— {card.author}</Text>
        <TouchableOpacity onPress={handleShare} accessibilityLabel="Share this quote">
          <Ionicons name="share-outline" size={18} color={tokens.colors.uplift} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.upliftLight,
    borderColor: '#CECBF6', borderWidth: 1,
    borderRadius: 16, padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  cardCompact: { padding: tokens.spacing.md },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.sm,
  },
  headerLabel: {
    fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm,
    color: tokens.colors.upliftDark,
  },
  dateStr: {
    fontFamily: 'Nunito', fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted,
  },
  quote: {
    fontFamily: 'Nunito', fontSize: 13, fontStyle: 'italic',
    color: tokens.colors.upliftDark, lineHeight: 20.8,
    marginBottom: tokens.spacing.md,
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: {
    fontFamily: 'Nunito_600SemiBold', fontSize: 11,
    color: tokens.colors.uplift,
  },
});
