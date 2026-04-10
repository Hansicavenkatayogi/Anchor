import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Animated, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';
import { UpliftContext } from '../../context/UpliftContext';

const isSameDay = (d1, d2) => {
  const a = new Date(d1); const b = new Date(d2);
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

export default function JournalScreen({ navigation }) {
  const { todayPrompt, todayMood, journalEntries, saveJournalEntry } = useContext(UpliftContext);
  const insets = useSafeAreaInsets();

  const todayEntry = journalEntries.find(e => isSameDay(e.date, new Date()));
  const [entryText, setEntryText] = useState(todayEntry?.entry || '');
  const [editing, setEditing]     = useState(!todayEntry);
  const [saved, setSaved]         = useState(!!todayEntry);

  // Toast animation
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastY       = useRef(new Animated.Value(40)).current;

  const showToast = () => {
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(toastY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(toastY, { toValue: 40, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 2000);
    });
  };

  const handleSave = async () => {
    if (!entryText.trim()) return;
    await saveJournalEntry({
      prompt: todayPrompt?.prompt,
      entry: entryText.trim(),
      mood: todayMood?.mood,
    });
    setSaved(true);
    setEditing(false);
    showToast();
  };

  const handleSparkRespond = () => {
    if (!entryText.trim()) return;
    Alert.alert('Share with Spark?', 'Want Spark to respond to your journal entry?', [
      { text: 'Not now', style: 'cancel' },
      {
        text: 'Yes!', onPress: () =>
          navigation.navigate('ChatScreen', {
            journalContext: `[User's journal entry: "${entryText.trim()}"] Please respond with warmth and encouragement in under 40 words.`
          })
      }
    ]);
  };

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>My journal</Text>
          <TouchableOpacity onPress={() => navigation.navigate('JournalHistoryScreen')}>
            <Ionicons name="time-outline" size={22} color={tokens.colors.uplift} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]} keyboardShouldPersistTaps="handled">
          {/* Prompt card */}
          {todayPrompt && (
            <View style={styles.promptCard}>
              <Text style={styles.promptLabel}>Today's prompt</Text>
              <Text style={styles.promptText}>{todayPrompt.prompt}</Text>
            </View>
          )}

          {/* Entry input / display */}
          {editing ? (
            <>
              <TextInput
                style={styles.entryInput}
                value={entryText}
                onChangeText={setEntryText}
                multiline
                maxLength={300}
                placeholder={"Write whatever comes to mind...\nThis is just for you."}
                placeholderTextColor={tokens.colors.textMuted}
                textAlignVertical="top"
                autoFocus={!saved}
              />
              <Text style={styles.charCounter}>{entryText.length} / 300</Text>
            </>
          ) : (
            <View style={styles.savedEntry}>
              <Text style={styles.savedText}>{entryText}</Text>
              <TouchableOpacity onPress={() => setEditing(true)} style={styles.editBtn}>
                <Ionicons name="pencil-outline" size={16} color={tokens.colors.uplift} />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.dateLabel}>Writing for {dateStr}</Text>

          {editing && (
            <TouchableOpacity
              style={[styles.saveBtn, !entryText.trim() && { opacity: 0.4 }]}
              onPress={handleSave}
              disabled={!entryText.trim()}
            >
              <Text style={styles.saveBtnText}>Save this entry</Text>
            </TouchableOpacity>
          )}

          {saved && !editing && (
            <TouchableOpacity style={styles.sparkBtn} onPress={handleSparkRespond}>
              <Text style={styles.sparkBtnText}>💜 Want Spark to respond?</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Toast */}
        <Animated.View style={[styles.toast, { opacity: toastOpacity, transform: [{ translateY: toastY }] }]}>
          <Text style={styles.toastText}>Saved! Your thoughts matter. ✨</Text>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
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
  content: { padding: tokens.spacing.lg },
  promptCard: {
    backgroundColor: tokens.colors.upliftLight, borderColor: tokens.colors.upliftDark,
    borderWidth: 0.5, borderRadius: 12, padding: tokens.spacing.md, marginBottom: tokens.spacing.lg,
  },
  promptLabel: { fontFamily: 'Nunito_700Bold', fontSize: 11, color: tokens.colors.uplift, textTransform: 'uppercase', marginBottom: 4 },
  promptText: { fontFamily: 'Nunito', fontStyle: 'italic', fontSize: 13, color: tokens.colors.upliftDark, lineHeight: 20 },
  entryInput: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1,
    borderColor: tokens.colors.border, padding: tokens.spacing.md,
    fontFamily: 'Nunito', fontSize: 14, lineHeight: 22,
    color: tokens.colors.textPrimary, minHeight: 120,
  },
  charCounter: {
    fontFamily: 'Nunito', fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted, textAlign: 'right', marginTop: 4,
  },
  savedEntry: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1,
    borderColor: tokens.colors.border, padding: tokens.spacing.md, marginBottom: tokens.spacing.sm,
  },
  savedText: { fontFamily: 'Nunito', fontSize: 14, lineHeight: 22, color: tokens.colors.textPrimary },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: tokens.spacing.sm },
  editBtnText: { fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.sm, color: tokens.colors.uplift },
  dateLabel: { fontFamily: 'Nunito', fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: tokens.spacing.sm, marginBottom: tokens.spacing.lg },
  saveBtn: {
    backgroundColor: tokens.colors.uplift, borderRadius: tokens.borderRadius.pill,
    paddingVertical: tokens.spacing.md, alignItems: 'center', marginBottom: tokens.spacing.md,
  },
  saveBtnText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md, color: '#FFF' },
  sparkBtn: {
    backgroundColor: tokens.colors.upliftLight, borderRadius: tokens.borderRadius.pill,
    paddingVertical: tokens.spacing.md, alignItems: 'center',
  },
  sparkBtnText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm, color: tokens.colors.upliftDark },
  toast: {
    position: 'absolute', bottom: 30, left: 24, right: 24,
    backgroundColor: tokens.colors.upliftDark, borderRadius: 12,
    padding: tokens.spacing.md, alignItems: 'center',
  },
  toastText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm, color: '#FFF' },
});
