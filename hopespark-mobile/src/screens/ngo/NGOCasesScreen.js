import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NGOContext } from '../../context/NGOContext';
import { tokens } from '../../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import AgeChip from '../../components/AgeChip';
import StatusProgress from '../../components/StatusProgress';

export default function NGOCasesScreen() {
  const { ngoOrg, ngoLogout, cases, fetchCasesLocally } = useContext(NGOContext);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (ngoOrg) {
      fetchCasesLocally(ngoOrg.city);
    }
  }, [ngoOrg]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (ngoOrg) await fetchCasesLocally(ngoOrg.city);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('NGOCaseDetail', { caseItem: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.caseId}>{item.id}</Text>
        <StatusProgress progress={item.status_progress} label={item.status_label || item.status} />
      </View>
      <View style={styles.badgesRow}>
        <AgeChip ageGroup={item.age_group} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category_label || item.category}</Text>
        </View>
        {(item.urgency === 'high' || item.urgency === 'medium') && (
          <View style={[styles.urgencyBadge, item.urgency === 'high' && { backgroundColor: '#FEE2E2' }]}>
            <View style={[styles.urgencyDot, item.urgency === 'high' ? { backgroundColor: '#DC2626' } : { backgroundColor: '#D97706' }]} />
            <Text style={[styles.urgencyText, item.urgency === 'high' ? { color: '#991B1B' } : { color: '#92400E' }]}>{item.urgency}</Text>
          </View>
        )}
      </View>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.location}>{item.city}, {item.state}</Text>
        {item.status === 'submitted' && (
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('NGOCaseDetail', { caseItem: item })}
          >
            <Text style={styles.actionBtnText}>View details</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{ngoOrg?.name || 'NGO Portal'}</Text>
          <Text style={styles.subtitle}>{ngoOrg?.city} Area Cases</Text>
        </View>
        <TouchableOpacity onPress={ngoLogout}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {cases.length === 0 && !refreshing ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No open cases</Text>
          <Text style={styles.emptySubtitle}>There are currently no active cases in {ngoOrg?.city}.</Text>
        </View>
      ) : (
        <FlatList
          data={cases.filter(c => c.status !== 'resolved')}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.primary} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontFamily: 'Nunito_700Bold', color: '#2C2C2A' },
  subtitle: { fontSize: 14, fontFamily: 'Nunito_600SemiBold', color: tokens.colors.primary },
  logoutText: { fontSize: 14, fontFamily: 'Nunito_600SemiBold', color: tokens.colors.textMuted },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, fontFamily: 'Nunito_400Regular', color: '#888780', textAlign: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  caseId: { fontSize: 16, fontFamily: 'Nunito_700Bold', color: '#2C2C2A' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 12, fontFamily: 'Nunito_600SemiBold', color: '#4B5563' },
  urgencyBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4, backgroundColor: '#FEF3C7' },
  urgencyDot: { width: 6, height: 6, borderRadius: 3 },
  urgencyText: { fontSize: 12, fontFamily: 'Nunito_700Bold' },
  description: { fontSize: 15, fontFamily: 'Nunito_400Regular', color: '#5F5E5A', marginBottom: 16, fontStyle: 'italic', lineHeight: 22 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  location: { fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: '#888780' },
  actionBtn: { backgroundColor: tokens.colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  actionBtnText: { color: tokens.colors.primaryDark, fontSize: 13, fontFamily: 'Nunito_700Bold' }
});
