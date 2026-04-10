import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../theme/tokens';
import { UserContext } from '../context/UserContext';
import StreamCard from '../components/StreamCard';
import { notificationStorage } from '../services/notificationStorage';
import { TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const { name } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const [greeting, setGreeting] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Refresh unread count on focus
    const unsubscribe = navigation.addListener('focus', () => {
      notificationStorage.getUnreadCount().then(setUnreadCount);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + tokens.spacing.lg, paddingBottom: tokens.spacing.xl }
      ]}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.greeting}>{greeting}, {name} 👋</Text>
          <Text style={styles.subtext}>Where would you like to go today?</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('NotificationCentre')}>
          <Ionicons name="notifications-outline" size={24} color={tokens.colors.textPrimary} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <StreamCard
          bg={tokens.colors.primaryLight}
          border="#9FE1CB"
          accent={tokens.colors.primary}
          iconName="hand-left-outline"
          iconColor={tokens.colors.primaryDark}
          title="Help Stream"
          titleColor={tokens.colors.primaryDark}
          desc="Share what you need. We connect you with people who genuinely want to help."
          descColor="#0F6E56"
          onPress={() => navigation.navigate('Help', { screen: 'HelpLandingScreen' })}
        />

        <StreamCard
          bg={tokens.colors.upliftLight}
          border="#CECBF6"
          accent={tokens.colors.uplift}
          iconName="chatbubble-ellipses-outline"
          iconColor={tokens.colors.upliftDark}
          title="Uplift Stream"
          titleColor={tokens.colors.upliftDark}
          desc="Talk to your AI friend, get motivated, and feel better — any time of day."
          descColor="#534AB7"
          onPress={() => navigation.navigate('Uplift')}
        />
      </View>

      <View style={styles.footer}>
        <Ionicons name="lock-closed" size={12} color={tokens.colors.textMuted} style={{ marginRight: 4 }} />
        <Text style={styles.footerText}>Everything here is private and safe.</Text>
      </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.xl,
  },
  bellBtn: {
    padding: 8,
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 6,
    backgroundColor: '#E24B4A',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Nunito_700Bold'
  },
  greeting: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  subtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: tokens.colors.textMuted,
  },
  cardsContainer: {
    marginBottom: tokens.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.xxl,
  },
  footerText: {
    fontFamily: 'Nunito',
    fontSize: 11,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
});
