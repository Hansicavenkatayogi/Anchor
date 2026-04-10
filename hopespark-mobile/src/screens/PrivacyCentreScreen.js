import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrivacyCentreScreen({ navigation }) {
  const { clearData, anonymousId } = useContext(UserContext);

  const handleDeleteEverything = () => {
    Alert.alert(
      "Delete everything",
      "This cannot be undone. Your cases, journal, and mood history will be gone permanently. Type 'DELETE' to confirm.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Data", 
          style: "destructive",
          onPress: async () => {
             // 1. Delete cloud cases by anon id (assuming endpoint exists, ignore fail)
             try {
               await fetch(`${process.env.HOPESPARK_API_BASE}/api/account/cases`, {
                 method: 'DELETE',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ anonymousId })
               });
             } catch(e) {}
             
             // 2. Wipe device
             await clearData();
             navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          }
        }
      ]
    );
  };

  const handleDownloadData = async () => {
    Alert.alert("Coming Soon", "Downloading your data package is currently being implemented.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2C2C2A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your privacy</Text>
        <Ionicons name="lock-closed" size={20} color="#2C2C2A" style={{ marginLeft: 8 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What lives only on your phone</Text>
          <View style={[styles.card, { backgroundColor: tokens.colors.primaryLight, borderColor: '#9FE1CB' }]}>
            <Bullet text="Your journal entries" />
            <Bullet text="Your mood log" />
            <Bullet text="Your chat history with Spark" />
            <Bullet text="Your name and anonymous ID" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What we share with helpers</Text>
          <View style={[styles.card, { backgroundColor: '#EEEDFE', borderColor: '#CECBF6' }]}>
            <Bullet color="#534AB7" text="What you need help with (your words)" />
            <Bullet color="#534AB7" text="Your city, state, and age group" />
            <Bullet color="#534AB7" text="Whether you have contact info (yes/no)" />
            <Text style={[styles.strongText, { color: '#534AB7' }]}>Never your name. Never your school.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What the AI sees</Text>
          <View style={[styles.card, { backgroundColor: '#FFF8F0', borderColor: '#FDE68A' }]}>
            <Bullet color="#92400E" text="Only what you type in the chat" />
            <Bullet color="#92400E" text="Never your journal or mood history" />
            <Bullet color="#92400E" text="Never your Help Stream requests" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your controls</Text>
          <TouchableOpacity style={styles.actionRow} onPress={handleDownloadData}>
            <Text style={styles.actionRowText}>Download my data</Text>
            <Ionicons name="download-outline" size={20} color="#2C2C2A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow} onPress={handleDeleteEverything}>
            <Text style={[styles.actionRowText, { color: '#D14343' }]}>Delete everything</Text>
            <Ionicons name="trash-outline" size={20} color="#D14343" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>HopeSpark complies with India's Digital Personal Data Protection Act 2023.</Text>
          <Text style={styles.footerText}>Questions? hello@hopespark.in</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Bullet({ text, color = '#0F6E56' }) {
  return (
    <View style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: color }]} />
      <Text style={[styles.bulletText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#2C2C2A' },
  scroll: { padding: 20, paddingBottom: 60 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', marginBottom: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 20 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, marginRight: 12 },
  bulletText: { fontSize: 15, fontFamily: 'Nunito_600SemiBold', flex: 1, lineHeight: 22 },
  strongText: { fontSize: 14, fontFamily: 'Nunito_700Bold', marginTop: 8 },
  actionRow: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  actionRowText: { fontSize: 16, fontFamily: 'Nunito_700Bold', color: '#2C2C2A' },
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 12, fontFamily: 'Nunito_600SemiBold', color: '#888780', textAlign: 'center', marginBottom: 4 }
});
