import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';
import { CaseContext } from '../../context/CaseContext';

export default function CaseDetailScreen({ route, navigation }) {
  const { caseId } = route.params;
  const { cases, deleteCase } = useContext(CaseContext);
  const insets = useSafeAreaInsets();
  
  const caseObj = cases.find(c => c.id === caseId);

  if (!caseObj) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Case not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text>Go Back</Text></TouchableOpacity>
      </View>
    );
  }

  let barColor = tokens.colors.primary;
  if (caseObj.status === 'reviewing') barColor = tokens.colors.warning;
  if (caseObj.status === 'matched') barColor = tokens.colors.uplift;
  if (caseObj.status === 'resolved') barColor = tokens.colors.success;

  const handleDelete = () => {
    Alert.alert('Delete Request', 'Are you sure you want to delete this case?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteCase(caseId);
        navigation.goBack();
      }}
    ]);
  };

  const steps = [
    { state: 'submitted', label: 'Submitted' },
    { state: 'reviewing', label: 'Under Review' },
    { state: 'matched', label: 'Helper Found' },
    { state: 'resolved', label: 'Resolved' }
  ];
  
  const currentStepIndex = steps.findIndex(s => s.state === caseObj.status);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{caseObj.id}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {caseObj.status === 'resolved' && (
          <View style={styles.resolvedBanner}>
            <Ionicons name="checkmark-circle" size={24} color={tokens.colors.success} />
            <Text style={styles.resolvedText}>Help was provided</Text>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${caseObj.statusProgress}%`, backgroundColor: barColor }]} />
          </View>
          
          <View style={styles.timeline}>
            {steps.map((step, idx) => {
              const reached = idx <= currentStepIndex;
              return (
                <View key={idx} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, reached && { backgroundColor: barColor }]} />
                  <Text style={[styles.timelineLabel, reached && { color: tokens.colors.textPrimary, fontFamily: 'Nunito_700Bold' }]}>
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Situation ({caseObj.categoryLabel})</Text>
          <Text style={styles.description}>{caseObj.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{caseObj.city}{caseObj.state ? `, ${caseObj.state}` : ''}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Family context</Text>
            <Text style={styles.detailValue}>{caseObj.familySituation || 'Not provided'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Urgency</Text>
            <Text style={[styles.detailValue, { textTransform: 'capitalize' }]}>{caseObj.urgency}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact</Text>
            <Text style={styles.detailValue}>{caseObj.contactInfo ? caseObj.contactInfo : 'Anonymous'}</Text>
          </View>
        </View>

        {caseObj.assignedNGO && (
          <View style={[styles.card, { backgroundColor: tokens.colors.primaryLight }]}>
            <Text style={styles.sectionTitle}>Matched with:</Text>
            <Text style={styles.description}>{caseObj.assignedNGO}</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleDelete} style={styles.deleteLinkBox}>
          <Text style={styles.deleteLinkText}>Delete request</Text>
        </TouchableOpacity>

      </ScrollView>
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
  content: {
    padding: tokens.spacing.md,
  },
  resolvedBanner: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.primaryLight,
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  resolvedText: {
    fontFamily: 'Nunito_700Bold',
    color: tokens.colors.success,
    fontSize: tokens.fontSizes.md,
    marginLeft: tokens.spacing.sm,
  },
  progressContainer: {
    marginBottom: tokens.spacing.xl,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: tokens.colors.border,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: tokens.spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineItem: {
    alignItems: 'center',
    width: 80,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.colors.border,
    marginBottom: 4,
  },
  timelineLabel: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  description: {
    fontFamily: 'Nunito',
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textSecondary,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  detailLabel: {
    fontFamily: 'Nunito_600SemiBold',
    color: tokens.colors.textMuted,
    fontSize: tokens.fontSizes.sm,
  },
  detailValue: {
    fontFamily: 'Nunito',
    color: tokens.colors.textPrimary,
    fontSize: tokens.fontSizes.sm,
  },
  deleteLinkBox: {
    marginTop: tokens.spacing.lg,
    alignItems: 'center',
    padding: tokens.spacing.md,
  },
  deleteLinkText: {
    fontFamily: 'Nunito_700Bold',
    color: '#D14343',
    fontSize: tokens.fontSizes.base,
  }
});
