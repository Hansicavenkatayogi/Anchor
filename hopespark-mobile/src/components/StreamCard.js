import React, { useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../theme/tokens';

export default function StreamCard({ bg, border, accent, iconName, iconColor, title, titleColor, desc, descColor, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Navigate to ${title}`}
    >
      <Animated.View style={[styles.card, { backgroundColor: bg, borderColor: border, transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.accentBar, { backgroundColor: accent }]} />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={24} color={iconColor} />
            <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          </View>
          <Text style={[styles.desc, { color: descColor }]}>{desc}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={titleColor} style={styles.arrowIcon} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    overflow: 'hidden',
    minHeight: 100,
    ...tokens.shadows.card,
  },
  accentBar: {
    width: 4,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: tokens.spacing.lg,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.md,
    marginLeft: tokens.spacing.sm,
  },
  desc: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.sm,
    lineHeight: 18,
  },
  arrowIcon: {
    paddingRight: tokens.spacing.md,
  },
});
