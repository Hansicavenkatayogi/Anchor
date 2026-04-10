import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { tokens } from '../theme/tokens';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';

export default function CaseStatusCard({ caseObject, onPress, onDelete }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  // Determine colors based on status mapping
  let barColor = tokens.colors.primary;
  if (caseObject.status === 'reviewing') barColor = tokens.colors.warning;
  if (caseObject.status === 'matched') barColor = tokens.colors.uplift;
  if (caseObject.status === 'resolved') barColor = tokens.colors.success;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: caseObject.statusProgress,
      duration: 800,
      useNativeDriver: false, // width animation doesn't support native driver easily
    }).start();
  }, [caseObject.statusProgress]);

  // Relative time helper
  const submitDate = new Date(caseObject.createdAt);
  const now = new Date();
  const diffDays = Math.floor((now - submitDate) / (1000 * 60 * 60 * 24));
  let timeStr = diffDays === 0 ? 'Today' : `${diffDays}d ago`;

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    
    return (
      <TouchableOpacity onPress={() => onDelete(caseObject.id)} style={styles.deleteButton}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={24} color="#FFF" />
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(caseObject)}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{caseObject.categoryLabel}</Text>
            </View>
            <Text style={[styles.statusBadge, { color: barColor }]}>{caseObject.statusLabel}</Text>
          </View>
          
          <Text style={styles.desc} numberOfLines={2}>
            {caseObject.description}
          </Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{caseObject.city}</Text>
            <Text style={styles.metaDot}> · </Text>
            <Text style={styles.metaText}>{caseObject.familySituation || 'Unspecified'}</Text>
            <Text style={styles.metaDot}> · </Text>
            <Text style={styles.metaText}>{timeStr}</Text>
          </View>

          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { backgroundColor: barColor, width: widthAnim.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}) }
              ]} 
              accessibilityLabel={`Case progress: ${caseObject.statusProgress} percent`}
            />
          </View>

          {caseObject.status === 'resolved' && (
            <Text style={styles.resolvedText}>Help was provided ✓</Text>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  categoryPill: {
    backgroundColor: tokens.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    color: tokens.colors.primaryDark,
    textTransform: 'uppercase',
  },
  statusBadge: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.sm,
  },
  desc: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  metaText: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted,
  },
  metaDot: {
    fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted,
    marginHorizontal: 2,
  },
  progressContainer: {
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  resolvedText: {
    marginTop: tokens.spacing.sm,
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.success,
  },
  deleteButton: {
    backgroundColor: '#D14343',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: tokens.spacing.md,
    borderRadius: 12,
    marginLeft: tokens.spacing.sm,
  },
  deleteText: {
    color: '#FFF',
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.xs,
    marginTop: 4,
  }
});
