import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { CaseContext } from '../../context/CaseContext';
import CaseStatusCard from '../../components/CaseStatusCard';
import PrimaryButton from '../../components/PrimaryButton';

export default function MyCasesScreen({ navigation }) {
  const { cases, deleteCase, resetDraft } = useContext(CaseContext);
  const insets = useSafeAreaInsets();

  const handleCreateNew = () => {
    resetDraft();
    navigation.navigate('CategoryScreen');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My requests</Text>
        <TouchableOpacity onPress={handleCreateNew}>
          <Ionicons name="add" size={28} color={tokens.colors.primary} />
        </TouchableOpacity>
      </View>

      {cases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle}>
            <Ionicons name="help" size={48} color="#FFF" />
          </View>
          <Text style={styles.emptyText}>You haven't shared anything yet.</Text>
          <PrimaryButton title="Share my situation" onPress={handleCreateNew} style={{ marginTop: 20 }} />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: tokens.spacing.xl }}>
          <Text style={styles.subtitle}>{cases.length} request(s) submitted</Text>
          
          {cases.map((c) => (
            <CaseStatusCard 
              key={c.id} 
              caseObject={c} 
              onPress={(caseObj) => navigation.navigate('CaseDetailScreen', { caseId: caseObj.id })}
              onDelete={deleteCase}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: tokens.colors.textPrimary,
  },
  backBtn: {
    padding: tokens.spacing.xs,
  },
  list: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  emptyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: tokens.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  emptyText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
  },
});
