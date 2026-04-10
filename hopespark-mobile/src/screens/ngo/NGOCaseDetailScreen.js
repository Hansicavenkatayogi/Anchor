import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { tokens } from '../../theme/tokens';
import { NGOContext } from '../../context/NGOContext';

export default function NGOCaseDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { caseItem } = route.params;
  const { submitOffer } = useContext(NGOContext);
  
  const [offerType, setOfferType] = useState('food_parcel');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const offerOptions = [
    { id: 'food_parcel', label: 'Food' },
    { id: 'school_supplies', label: 'School' },
    { id: 'medical', label: 'Medical' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'financial', label: 'Financial' },
    { id: 'other', label: 'Other' }
  ];

  const handleOfferSubmit = async () => {
    if (!description) return;
    setSubmitting(true);
    try {
      await submitOffer(caseItem.id, {
        offer_type: offerType,
        offer_description: description,
        timelineEstimate: '7 days or less'
      });
      navigation.navigate('NGOOfferConfirm');
    } catch (e) {
      console.log(e);
      // Fallback for MVP if offline
      navigation.navigate('NGOOfferConfirm');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2C2C2A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Data</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.caseId}>{caseItem.id}</Text>
        <Text style={styles.submittedAt}>Submitted: {new Date(caseItem.submitted_at || Date.now()).toLocaleDateString()}</Text>
        
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>"{caseItem.description}"</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Category</Text>
            <Text style={styles.gridValue}>{caseItem.category_label || caseItem.category}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Urgency</Text>
            <Text style={[styles.gridValue, { textTransform: 'capitalize' }]}>{caseItem.urgency}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Location</Text>
            <Text style={styles.gridValue}>{caseItem.city}, {caseItem.state}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Family</Text>
            <Text style={styles.gridValue}>{caseItem.family_situation}</Text>
          </View>
        </View>

        {caseItem.status === 'submitted' || caseItem.status === 'reviewing' ? (
          <View style={styles.offerSection}>
            <Text style={styles.offerTitle}>Make an Offer</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offerTypeTypes}>
              {offerOptions.map(opt => (
                <TouchableOpacity 
                  key={opt.id}
                  style={[styles.typeChip, offerType === opt.id && styles.typeChipActive]}
                  onPress={() => setOfferType(opt.id)}
                >
                  <Text style={[styles.typeText, offerType === opt.id && styles.typeTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={styles.textArea}
              placeholder="What can your organization provide to help this child?"
              placeholderTextColor="#A1A1AA"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity 
              style={[styles.submitBtn, (!description || submitting) && { opacity: 0.7 }]}
              onPress={handleOfferSubmit}
              disabled={!description || submitting}
            >
              {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Offer</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusBox}>
            <Text style={styles.statusBoxText}>This case is already marked as {caseItem.status}.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 16, fontFamily: 'Nunito_700Bold', color: '#2C2C2A' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  caseId: { fontSize: 28, fontFamily: 'Nunito_700Bold', color: '#2C2C2A' },
  submittedAt: { fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: tokens.colors.textMuted, marginBottom: 20 },
  descriptionBox: { backgroundColor: '#F3F4F6', padding: 20, borderRadius: 16, marginBottom: 20 },
  descriptionText: { fontSize: 16, fontFamily: 'Nunito_600SemiBold', fontStyle: 'italic', color: '#4B5563', lineHeight: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  gridItem: { width: '48%', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  gridLabel: { fontSize: 12, fontFamily: 'Nunito_600SemiBold', color: '#9CA3AF', marginBottom: 4 },
  gridValue: { fontSize: 14, fontFamily: 'Nunito_700Bold', color: '#374151' },
  offerSection: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  offerTitle: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', marginBottom: 16 },
  offerTypeTypes: { gap: 8, paddingBottom: 16 },
  typeChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  typeChipActive: { borderColor: tokens.colors.primary, backgroundColor: tokens.colors.primaryLight },
  typeText: { fontSize: 14, fontFamily: 'Nunito_600SemiBold', color: '#6B7280' },
  typeTextActive: { color: tokens.colors.primaryDark, fontFamily: 'Nunito_700Bold' },
  textArea: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 15, fontFamily: 'Nunito_400Regular', color: '#1F2937', minHeight: 120, marginBottom: 20 },
  submitBtn: { backgroundColor: tokens.colors.primary, paddingVertical: 16, borderRadius: 24, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito_700Bold' },
  statusBox: { backgroundColor: '#FEE2E2', padding: 16, borderRadius: 12, alignItems: 'center' },
  statusBoxText: { color: '#991B1B', fontFamily: 'Nunito_600SemiBold' }
});
