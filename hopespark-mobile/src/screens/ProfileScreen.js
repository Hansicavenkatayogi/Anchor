import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../theme/tokens';
import { UserContext } from '../context/UserContext';
import { NGOContext } from '../context/NGOContext';
import SectionLabel from '../components/SectionLabel';

export default function ProfileScreen({ navigation }) {
  const { name, ageGroup, clearData } = useContext(UserContext);
  const { toggleNGOMode } = useContext(NGOContext);
  const insets = useSafeAreaInsets();
  
  let tapCount = 0;
  let lastTap = 0;

  const handleAvatarTap = () => {
    const now = Date.now();
    if (now - lastTap > 1500) {
      tapCount = 1;
    } else {
      tapCount += 1;
    }
    lastTap = now;

    if (tapCount >= 7) {
      tapCount = 0;
      toggleNGOMode(true);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear my data",
      "Are you sure you want to clear your data? You will need to setup your profile again.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Data", 
          style: "destructive", 
          onPress: async () => {
            await clearData();
            // RootNavigator will automatically transition to onboarding
          } 
        }
      ]
    );
  };

  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + tokens.spacing.lg, paddingBottom: tokens.spacing.xl }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleAvatarTap} style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </TouchableOpacity>
        <Text style={styles.nameText}>{name || 'Friend'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{ageGroup || 'Unknown Age'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionLabel text="Settings" />
        
        <View style={styles.list}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Language</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>English</Text>
              <Ionicons name="chevron-forward" size={20} color={tokens.colors.border} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Notifications</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>On</Text>
              <Ionicons name="chevron-forward" size={20} color={tokens.colors.border} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('PrivacyCentre')}>
            <Text style={styles.rowLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={tokens.colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowLabel}>About HopeSpark</Text>
            <Ionicons name="chevron-forward" size={20} color={tokens.colors.border} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleClearData} style={styles.clearButton}>
        <Text style={styles.clearText}>Clear my data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  contentContainer: {
    paddingHorizontal: tokens.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  avatarText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  nameText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  badge: {
    backgroundColor: tokens.colors.upliftLight,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.pill,
  },
  badgeText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.upliftDark,
  },
  section: {
    marginBottom: tokens.spacing.xxl,
  },
  list: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  rowLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textMuted,
    marginRight: tokens.spacing.xs,
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  clearText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.base,
    color: '#D14343', // Soft Red
  },
});
