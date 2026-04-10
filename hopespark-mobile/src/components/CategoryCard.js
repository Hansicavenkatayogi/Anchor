import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../theme/tokens';

export default function CategoryCard({ id, label, iconName, color, selected, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isSafety = id === 'safety';
  
  // Dynamic styles based on selection and special 'safety' type
  let overrideContainerStyle = {};
  let iconBaseColor = color;
  
  if (isSafety) {
    overrideContainerStyle = {
      backgroundColor: selected ? '#FCEBEB' : '#FFF0F0',
      borderColor: selected ? '#E24B4A' : '#F09595',
      borderWidth: selected ? 2 : 1,
    };
  } else {
    if (selected) {
      overrideContainerStyle = {
        backgroundColor: tokens.colors.primaryLight,
        borderColor: tokens.colors.primary,
        borderWidth: 2,
      };
      iconBaseColor = tokens.colors.primaryDark;
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.wrapper, id === 'other' && styles.wrapperFull]}
    >
      <Animated.View style={[styles.card, overrideContainerStyle, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name={iconName} size={32} color={iconBaseColor} style={styles.icon} />
        <Text style={[styles.label, selected && styles.labelSelected, isSafety && selected && {color: '#E24B4A'}]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
    marginBottom: tokens.spacing.md,
  },
  wrapperFull: {
    width: '100%',
  },
  card: {
    backgroundColor: tokens.colors.card,
    borderColor: tokens.colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  icon: {
    marginBottom: tokens.spacing.sm,
  },
  label: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
  },
  labelSelected: {
    fontFamily: 'Nunito_700Bold',
    color: tokens.colors.primaryDark,
  },
});
