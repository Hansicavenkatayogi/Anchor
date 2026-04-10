import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';
import { UpliftContext } from '../../context/UpliftContext';
import PrimaryButton from '../../components/PrimaryButton';

const MOOD_EMOJIS = {
  happy: '😊', sad: '😔', worried: '😰',
  frustrated: '😤', okay: '😐', tired: '😴',
};
const MOOD_COLORS = {
  happy: '#1D9E75', sad: '#378ADD', worried: '#BA7517',
  frustrated: '#D85A30', okay: '#888780', tired: '#7F77DD',
};

export default function JournalHistoryScreen({ navigation }) {
  const { journalEntries, deleteJournalEntry } = useContext(UpliftContext);
  const insets = useSafeAreaInsets();
  const [expandedEntry, setExpandedEntry] = useState(null);

  const sorted = [...journalEntries].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleLongPress = (entry) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteJournalEntry(entry.date) },
    ]);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Past entries</Text>
          <Text style={styles.subtitle}>Your private thoughts — only you can see these</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {sorted.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="journal-outline" size={48} color={tokens.colors.border} />
          <Text style={styles.emptyText}>Your first entry is waiting. Start writing today.</Text>
          <PrimaryButton
            title="Open journal"
            onPress={() => navigation.navigate('JournalScreen')}
            style={{ backgroundColor: tokens.colors.uplift, marginTop: tokens.spacing.lg }}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: tokens.spacing.md, paddingBottom: insets.bottom + 40 }}>
          {sorted.map((entry, idx) => {
            const moodColor = MOOD_COLORS[entry.mood] || tokens.colors.textMuted;
            return (
              <TouchableOpacity
                key={entry.date + idx}
                style={styles.card}
                onPress={() => setExpandedEntry(entry)}
                onLongPress={() => handleLongPress(entry)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
                </View>
                {entry.mood && (
                  <View style={[styles.moodBadge, { backgroundColor: `${moodColor}20`, borderColor: moodColor }]}>
                    <Text style={{ fontSize: 12 }}>{MOOD_EMOJIS[entry.mood]}</Text>
                    <Text style={[styles.moodBadgeText, { color: moodColor }]}>{entry.mood}</Text>
                  </View>
                )}
                {entry.prompt && (
                  <Text style={styles.promptText} numberOfLines={2}>"{entry.prompt}"</Text>
                )}
                <Text style={styles.entryText} numberOfLines={3}>
                  {entry.entry}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Full entry modal */}
      <Modal visible={!!expandedEntry} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setExpandedEntry(null)}>
        <View style={[styles.modal, { paddingTop: insets.top + tokens.spacing.md }]}>
          <TouchableOpacity onPress={() => setExpandedEntry(null)} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={{ padding: tokens.spacing.lg }}>
            <Text style={styles.modalDate}>{expandedEntry ? formatDate(expandedEntry.date) : ''}</Text>
            {expandedEntry?.prompt && (
              <Text style={styles.modalPrompt}>"{expandedEntry.prompt}"</Text>
            )}
            <Text style={styles.modalEntry}>{expandedEntry?.entry}</Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1, borderBottomColor: tokens.colors.border,
  },
  backBtn: { padding: tokens.spacing.xs },
  title: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.lg, color: tokens.colors.textPrimary },
  subtitle: { fontFamily: 'Nunito', fontSize: 11, color: tokens.colors.textMuted },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tokens.spacing.xl },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.md, color: tokens.colors.textSecondary, textAlign: 'center', marginTop: tokens.spacing.md },
  card: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1,
    borderColor: tokens.colors.border, padding: tokens.spacing.md, marginBottom: tokens.spacing.md,
    ...tokens.shadows.card,
  },
  cardHeader: { marginBottom: tokens.spacing.xs },
  dateText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm, color: tokens.colors.textMuted },
  moodBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    borderWidth: 1, borderRadius: tokens.borderRadius.pill,
    paddingHorizontal: 10, paddingVertical: 3, marginBottom: tokens.spacing.sm,
  },
  moodBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 10, textTransform: 'capitalize' },
  promptText: {
    fontFamily: 'Nunito', fontStyle: 'italic', fontSize: 12,
    color: tokens.colors.textSecondary, marginBottom: tokens.spacing.xs, lineHeight: 18,
  },
  entryText: { fontFamily: 'Nunito', fontSize: 13, color: tokens.colors.textPrimary, lineHeight: 20 },
  // Modal
  modal: { flex: 1, backgroundColor: tokens.colors.surface },
  closeBtn: { alignSelf: 'flex-end', paddingRight: tokens.spacing.md, paddingBottom: tokens.spacing.md },
  modalDate: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md, color: tokens.colors.textMuted, marginBottom: tokens.spacing.sm },
  modalPrompt: { fontFamily: 'Nunito', fontStyle: 'italic', fontSize: 13, color: tokens.colors.upliftDark, marginBottom: tokens.spacing.md, lineHeight: 20 },
  modalEntry: { fontFamily: 'Nunito', fontSize: 16, lineHeight: 26, color: tokens.colors.textPrimary },
});
