import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Linking, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { UserContext } from '../../context/UserContext';
import { UpliftContext } from '../../context/UpliftContext';
import { sendMessage, buildMessage } from '../../services/sparkAPI';
import { detectCrisis, logCrisisFlag, CRISIS_SPARK_RESPONSE } from '../../services/crisisDetector';
import ChatBubble from '../../components/ChatBubble';
import TypingIndicator from '../../components/TypingIndicator';
import QuickReplyChips from '../../components/QuickReplyChips';

const OPENING_MESSAGES = {
  happy:      (name) => `Hey ${name}! You're feeling happy today — that's wonderful to hear! Tell me, what's been the best part of your day so far? 🌟`,
  sad:        (name) => `Hi ${name}... I can see today feels a bit heavy. I'm really glad you're here. Want to tell me what's been going on? I'm listening. 💙`,
  worried:    (name) => `Hey ${name}, feeling worried can be so exhausting. You're not alone in this. What's been on your mind today? 🤍`,
  frustrated: (name) => `Hi ${name}! Sounds like something's been frustrating you today. That feeling is totally valid. Want to talk about what happened? 🧡`,
  okay:       (name) => `Hey ${name}! A 'just okay' kind of day — I know those well. Sometimes they turn into something better. What's been happening? ☁️`,
  tired:      (name) => `Hi ${name}, feeling tired takes a lot out of you. Let's take it slow today. How have you been? 🌙`,
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function ChatScreen({ route, navigation }) {
  const { name, ageGroup } = useContext(UserContext);
  const { todayMood, conversationHistory, addMessage } = useContext(UpliftContext);
  const insets = useSafeAreaInsets();

  const moodId = route?.params?.mood || todayMood?.mood || 'okay';

  // Local UI state
  const [messages, setMessages] = useState([]);       // { id, role, content, timestamp }
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [showCrisisCard, setShowCrisisCard] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  // Generate unique bubble ID
  const nextId = useRef(0);
  const uid = () => `msg-${++nextId.current}`;

  // On mount: inject opening message
  useEffect(() => {
    const openingFn = OPENING_MESSAGES[moodId] || OPENING_MESSAGES.okay;
    const openingText = openingFn(name || 'friend');
    const opening = { id: uid(), role: 'assistant', content: openingText, timestamp: new Date().toISOString() };
    setMessages([opening]);
    // Add to context history so Spark knows what it said first
    addMessage('assistant', openingText);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (text = inputText) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setInputText('');
    setShowChips(false);
    setError(null);

    // Add user bubble
    const userMsg = { id: uid(), role: 'user', content: trimmed, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    await addMessage('user', trimmed);

    // Crisis detection — run BEFORE API call
    const crisis = detectCrisis(trimmed);
    if (crisis.detected) {
      await logCrisisFlag(crisis.type);
      setShowCrisisCard(true);
      // Still show warm Spark safety response
      const safetyMsg = { id: uid(), role: 'assistant', content: CRISIS_SPARK_RESPONSE, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, safetyMsg]);
      await addMessage('assistant', CRISIS_SPARK_RESPONSE);
      return;
    }

    // Normal flow — call Anthropic
    setIsLoading(true);
    try {
      const apiHistory = [...conversationHistory];
      const responseText = await sendMessage(apiHistory, {
        name: name || 'friend',
        ageGroup: ageGroup || '10-13',
        todayMood: moodId,
      });

      const aiMsg = { id: uid(), role: 'assistant', content: responseText, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
      await addMessage('assistant', responseText);
      setShowChips(true);
    } catch (e) {
      setError('Oops, I lost connection for a second! Try sending again?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={22} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.sparkAvatar} />
            <Text style={styles.sparkName}>Spark</Text>
            <View style={styles.onlineDot} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ActivitiesScreen')} style={styles.headerBtn}>
            <Ionicons name="apps-outline" size={22} color={tokens.colors.uplift} />
          </TouchableOpacity>
        </View>

        {/* Crisis Card */}
        {showCrisisCard && (
          <View style={styles.crisisCard}>
            <Text style={styles.crisisTitle}>You're not alone. Childline is here for you.</Text>
            <View style={styles.crisisBtns}>
              <TouchableOpacity style={styles.crisisBtn} onPress={() => Linking.openURL('tel:1098')}>
                <Text style={styles.crisisBtnText}>📞 Call 1098 now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.crisisBtn, { backgroundColor: tokens.colors.upliftLight }]} onPress={() => Linking.openURL('tel:9152987821')}>
                <Text style={[styles.crisisBtnText, { color: tokens.colors.upliftDark }]}>Chat with a counsellor</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Messages */}
        <ScrollView ref={scrollRef} style={styles.messageArea} contentContainerStyle={{ paddingVertical: tokens.spacing.md }} showsVerticalScrollIndicator={false}>
          {messages.map(msg => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} timestamp={formatTime(msg.timestamp)} />
          ))}
          {isLoading && <TypingIndicator />}
          {error && (
            <View style={styles.errorBubble}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => handleSend(messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '')}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Quick Reply Chips */}
        <QuickReplyChips visible={showChips && !isLoading} onSend={handleSend} />

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          {isLoading && <ActivityIndicator color={tokens.colors.uplift} style={{ marginRight: 8 }} />}
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Talk to Spark..."
            placeholderTextColor={tokens.colors.textMuted}
            multiline
            maxHeight={80}
            fontFamily="Nunito"
            fontSize={14}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || isLoading) && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            accessibilityLabel="Send message"
          >
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1, borderBottomColor: tokens.colors.border, backgroundColor: '#FFF',
  },
  headerBtn: { padding: tokens.spacing.xs, minWidth: 40, alignItems: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sparkAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: tokens.colors.uplift,
  },
  sparkName: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.base, color: tokens.colors.textPrimary },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22CC88' },
  messageArea: { flex: 1 },
  crisisCard: {
    backgroundColor: '#FFF0F8', borderColor: tokens.colors.uplift,
    borderWidth: 1, borderRadius: 12, margin: tokens.spacing.md,
    padding: tokens.spacing.md,
  },
  crisisTitle: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.base, color: tokens.colors.upliftDark, marginBottom: tokens.spacing.sm },
  crisisBtns: { flexDirection: 'row', gap: 8 },
  crisisBtn: {
    flex: 1, backgroundColor: tokens.colors.uplift,
    borderRadius: tokens.borderRadius.sm, paddingVertical: 8, alignItems: 'center',
  },
  crisisBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#FFF' },
  errorBubble: {
    margin: tokens.spacing.md, backgroundColor: '#FAECE7',
    borderRadius: 12, padding: tokens.spacing.md,
  },
  errorText: { fontFamily: 'Nunito', fontSize: tokens.fontSizes.sm, color: '#D85A30' },
  retryText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.sm, color: tokens.colors.uplift, marginTop: 4 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: '#FFF', borderTopWidth: 0.5, borderTopColor: tokens.colors.border,
    paddingTop: 8, paddingHorizontal: tokens.spacing.md, paddingBottom: 8,
  },
  input: {
    flex: 1, backgroundColor: '#FFF',
    borderWidth: 0.5, borderColor: tokens.colors.border,
    borderRadius: 24, paddingHorizontal: 14, paddingVertical: 8,
    fontFamily: 'Nunito', fontSize: 14, color: tokens.colors.textPrimary,
    maxHeight: 80, marginRight: 8,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: tokens.colors.uplift,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: tokens.colors.border },
});
