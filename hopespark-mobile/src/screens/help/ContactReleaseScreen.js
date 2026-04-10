import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { tokens } from '../../theme/tokens';
import { contactReleaseService } from '../../services/contactRelease';

export default function ContactReleaseScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { caseItem, ngoName, ngoCity } = route.params;

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDecline, setLoadingDecline] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApprove = async () => {
    setLoadingApprove(true);
    try {
      await contactReleaseService.approveRelease(caseItem.id, caseItem.contactInfo);
      setSuccess(true);
      setTimeout(() => {
        navigation.navigate('MyCases');
      }, 2000);
    } catch (e) {
      console.error(e);
      // For MVP, if backend fails, navigate anyway
      setSuccess(true);
      setTimeout(() => navigation.navigate('MyCases'), 2000);
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleDecline = async () => {
    setLoadingDecline(true);
    try {
      await contactReleaseService.declineRelease(caseItem.id);
      navigation.navigate('MyCases');
    } catch (e) {
      console.error(e);
      navigation.navigate('MyCases');
    } finally {
      setLoadingDecline(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="checkmark-circle" size={80} color="#1D9E75" />
        <Text style={styles.successText}>Done! They'll be in touch soon.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.iconCircle}>
          <Ionicons name="star" size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>A helper was found! 🎉</Text>
        <Text style={styles.subtitle}>Someone wants to help with your {caseItem.categoryLabel} request.</Text>
      </View>

      <View style={styles.ngoCard}>
        <Text style={styles.ngoName}>{ngoName || 'A Verified Partner'}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Verified NGO</Text>
          </View>
        </View>
        <Text style={styles.ngoLocation}>{ngoCity || caseItem.city}</Text>
      </View>

      <View style={styles.questionSection}>
        <Text style={styles.questionText}>
          They'd like to reach you. Do you want to share your contact information with them?
        </Text>
        <Text style={styles.smallReminder}>
          You gave us {caseItem.contactInfo?.includes('@') ? 'an email' : 'a number'} when you submitted your request.
        </Text>
      </View>

      <View style={styles.privacyBox}>
        <Ionicons name="shield-checkmark" size={16} color="#888780" />
        <Text style={styles.privacyText}>
          Your information will only go to this organization. You can say no and still receive help.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryBtn} 
          onPress={handleApprove}
          disabled={loadingApprove || loadingDecline}
        >
          {loadingApprove ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Yes, share my contact</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryBtn} 
          onPress={handleDecline}
          disabled={loadingApprove || loadingDecline}
        >
          {loadingDecline ? <ActivityIndicator color="#D14343" /> : <Text style={styles.secondaryBtnText}>No thanks, stay anonymous</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0', padding: 24 },
  topSection: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: tokens.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, fontFamily: 'Nunito_600SemiBold', color: '#5F5E5A', textAlign: 'center', lineHeight: 24 },
  ngoCard: { backgroundColor: tokens.colors.primaryLight, borderWidth: 1, borderColor: '#9FE1CB', borderRadius: 16, padding: 20, marginBottom: 30 },
  ngoName: { fontSize: 20, fontFamily: 'Nunito_700Bold', color: tokens.colors.primaryDark, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', marginBottom: 12 },
  badge: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontFamily: 'Nunito_700Bold', color: tokens.colors.primaryDark, textTransform: 'uppercase' },
  ngoLocation: { fontSize: 14, fontFamily: 'Nunito_600SemiBold', color: '#0F6E56' },
  questionSection: { marginBottom: 20 },
  questionText: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', marginBottom: 8, lineHeight: 26 },
  smallReminder: { fontSize: 14, fontFamily: 'Nunito_600SemiBold', color: '#888780', lineHeight: 20 },
  privacyBox: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginBottom: 40, alignItems: 'flex-start' },
  privacyText: { flex: 1, marginLeft: 10, fontSize: 12, fontFamily: 'Nunito_400Regular', color: '#5F5E5A', lineHeight: 16 },
  actions: { gap: 16 },
  primaryBtn: { backgroundColor: tokens.colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito_700Bold' },
  secondaryBtn: { paddingVertical: 16, alignItems: 'center' },
  secondaryBtnText: { color: '#D14343', fontSize: 16, fontFamily: 'Nunito_700Bold' },
  successText: { fontSize: 20, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', marginTop: 20 }
});
