import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

export default function ConsentScreen({ navigation }) {
  const { ageGroup } = useContext(UserContext);
  const [agreed, setAgreed] = useState(false);

  const handleContinue = async () => {
    if (!agreed) return;
    try {
      await AsyncStorage.setItem('dpdp_consentDate', new Date().toISOString());
      await AsyncStorage.setItem('dpdp_consentGiven', 'true');
      
      navigation.navigate('Ready');
    } catch (e) {
      console.error(e);
    }
  };

  const isUnder13 = ageGroup === 'Under 10' || ageGroup === '10 \u2013 13';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={48} color={tokens.colors.primary} />
        </View>
        <Text style={styles.title}>Before we continue</Text>
        
        <Text style={styles.body}>
          HopeSpark collects some information to help connect you with support. Here's exactly what we collect and why:
        </Text>

        <View style={styles.points}>
          <View style={styles.pointRow}>
            <View style={styles.dot} />
            <Text style={styles.pointText}><Text style={styles.bold}>Your city</Text> — to find helpers near you</Text>
          </View>
          <View style={styles.pointRow}>
            <View style={styles.dot} />
            <Text style={styles.pointText}><Text style={styles.bold}>Your situation</Text> — to match you with the right help</Text>
          </View>
          <View style={styles.pointRow}>
            <View style={styles.dot} />
            <Text style={styles.pointText}><Text style={styles.bold}>Your age group</Text> — to show you relevant content</Text>
          </View>
        </View>

        <Text style={styles.guarantee}>
          We never collect your name or share your details without your permission.
        </Text>

        {isUnder13 && (
          <View style={styles.warningBox}>
            <Ionicons name="information-circle" size={20} color="#92400E" />
            <Text style={styles.warningText}>
              Since you're under 13, please make sure a trusted adult knows you're using this app.
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.8}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text style={styles.checkboxText}>I understand and agree</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btn, !agreed && styles.btnDisabled]} 
          onPress={handleContinue}
          disabled={!agreed}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  scroll: { padding: 24, paddingBottom: 40 },
  iconContainer: { alignItems: 'center', marginBottom: 24, marginTop: 40 },
  title: { fontSize: 24, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', textAlign: 'center', marginBottom: 24 },
  body: { fontSize: 16, fontFamily: 'Nunito_400Regular', color: '#5F5E5A', lineHeight: 24, marginBottom: 24 },
  points: { marginBottom: 24, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: tokens.colors.primary, marginTop: 8, marginRight: 12 },
  pointText: { flex: 1, fontSize: 15, fontFamily: 'Nunito_400Regular', color: '#2C2C2A', lineHeight: 22 },
  bold: { fontFamily: 'Nunito_700Bold' },
  guarantee: { fontSize: 15, fontFamily: 'Nunito_700Bold', color: tokens.colors.primaryDark, textAlign: 'center', marginBottom: 30 },
  warningBox: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 16, borderRadius: 12, marginBottom: 24, alignItems: 'center' },
  warningText: { flex: 1, marginLeft: 12, fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: '#92400E', lineHeight: 18 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxChecked: { backgroundColor: tokens.colors.primary, borderColor: tokens.colors.primary },
  checkboxText: { fontSize: 16, fontFamily: 'Nunito_700Bold', color: '#2C2C2A' },
  footer: { padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  btn: { backgroundColor: tokens.colors.primary, paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#E5E7EB' },
  btnText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Nunito_700Bold' }
});
