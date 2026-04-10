import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../theme/tokens';
import BreathingCircle from '../../components/BreathingCircle';
import ChatBubble from '../../components/ChatBubble';

const SEQUENCE = [
  { phase: 'inhale', duration: 4 },
  { phase: 'hold',   duration: 4 },
  { phase: 'exhale', duration: 6 },
  { phase: 'rest',   duration: 2 },
];
const TOTAL_ROUNDS = 3;

const NARRATION = {
  start:   "Let's take 3 slow breaths together. Follow the circle 🌬️",
  round1:  "Great job! You're doing so well.",
  round2:  "Almost there — you're a natural at this.",
  done:    "You did it! How do you feel now? 💜",
};

export default function BreathingScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [started, setStarted]       = useState(false);
  const [phase, setPhase]           = useState('inhale');
  const [phaseIdx, setPhaseIdx]     = useState(0);
  const [round, setRound]           = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(SEQUENCE[0].duration);
  const [done, setDone]             = useState(false);
  const [narrations, setNarrations] = useState([
    { role: 'assistant', content: NARRATION.start }
  ]);

  const intervalRef = useRef(null);
  const phaseIdxRef = useRef(0);
  const roundRef    = useRef(1);
  const secRef      = useRef(SEQUENCE[0].duration);

  const addNarration = (text) => {
    setNarrations(prev => [...prev, { role: 'assistant', content: text }]);
  };

  useEffect(() => {
    if (!started) return;
    intervalRef.current = setInterval(() => {
      secRef.current -= 1;
      setSecondsLeft(secRef.current);

      if (secRef.current <= 0) {
        // Advance phase
        const nextPhaseIdx = (phaseIdxRef.current + 1) % SEQUENCE.length;
        phaseIdxRef.current = nextPhaseIdx;
        setPhaseIdx(nextPhaseIdx);
        setPhase(SEQUENCE[nextPhaseIdx].phase);

        // Check round completion (phaseIdx wrapping to 0 = new round)
        if (nextPhaseIdx === 0) {
          const newRound = roundRef.current + 1;
          roundRef.current = newRound;
          setRound(newRound);

          if (newRound > TOTAL_ROUNDS) {
            // Done
            clearInterval(intervalRef.current);
            setDone(true);
            addNarration(NARRATION.done);
            return;
          } else if (newRound === 2) {
            addNarration(NARRATION.round1);
          } else if (newRound === 3) {
            addNarration(NARRATION.round2);
          }
        }

        secRef.current = SEQUENCE[nextPhaseIdx].duration;
        setSecondsLeft(SEQUENCE[nextPhaseIdx].duration);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [started]);

  const handleGoToChat = () => {
    navigation.navigate('ChatScreen', { mood: 'okay', continueBreathing: true });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + tokens.spacing.lg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={tokens.colors.upliftDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Breathe with Spark</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Spark narration bubbles */}
      <View style={styles.narrations}>
        {narrations.map((n, i) => (
          <ChatBubble key={i} role="assistant" content={n.content} />
        ))}
      </View>

      {!done ? (
        <View style={styles.breathArea}>
          <BreathingCircle phase={phase} />
          <Text style={styles.phaseLabel}>{SEQUENCE[phaseIdx]?.phase?.replace(/^\w/, c => c.toUpperCase())}</Text>
          {started && (
            <>
              <Text style={styles.countdown}>{secondsLeft}s remaining</Text>
              <Text style={styles.roundLabel}>Round {round} of {TOTAL_ROUNDS}</Text>
            </>
          )}
          {!started && (
            <TouchableOpacity style={styles.startBtn} onPress={() => setStarted(true)}>
              <Text style={styles.startBtnText}>Begin</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.doneArea}>
          <TouchableOpacity style={styles.chatBtn} onPress={handleGoToChat}>
            <Text style={styles.chatBtnText}>Tell Spark how I feel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeLink} onPress={() => navigation.goBack()}>
            <Text style={styles.homeLinkText}>← Go back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEEDFE' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.md,
  },
  backBtn: { padding: tokens.spacing.xs },
  title: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md, color: tokens.colors.upliftDark },
  narrations: { paddingVertical: tokens.spacing.md },
  breathArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  phaseLabel: {
    fontFamily: 'Nunito_700Bold', fontSize: 20,
    color: tokens.colors.upliftDark,
  },
  countdown: { fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.sm, color: tokens.colors.uplift },
  roundLabel: { fontFamily: 'Nunito', fontSize: tokens.fontSizes.sm, color: tokens.colors.textMuted },
  startBtn: {
    backgroundColor: tokens.colors.uplift, borderRadius: tokens.borderRadius.pill,
    paddingHorizontal: tokens.spacing.xl, paddingVertical: tokens.spacing.md,
    marginTop: tokens.spacing.md,
  },
  startBtnText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md, color: '#FFF' },
  doneArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  chatBtn: {
    backgroundColor: tokens.colors.uplift, borderRadius: tokens.borderRadius.pill,
    paddingHorizontal: tokens.spacing.xl, paddingVertical: tokens.spacing.md,
  },
  chatBtnText: { fontFamily: 'Nunito_700Bold', fontSize: tokens.fontSizes.md, color: '#FFF' },
  homeLink: { padding: tokens.spacing.md },
  homeLinkText: { fontFamily: 'Nunito_600SemiBold', fontSize: tokens.fontSizes.base, color: tokens.colors.upliftDark },
});
