import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from './UserContext';
import { MOTIVATION_CARDS } from '../services/motivationCards';
import { JOURNAL_PROMPTS } from '../services/journalPrompts';

export const UpliftContext = createContext();

// Get day-of-year for deterministic daily picks
const getDayOfYear = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const isSameDay = (d1, d2) => {
  const a = new Date(d1);
  const b = new Date(d2);
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
};

const MAX_HISTORY = 20;
const RECENT_CHAT_SIZE = 6;

export const UpliftProvider = ({ children }) => {
  const { name, ageGroup } = useContext(UserContext);

  const [todayMood, setTodayMood]             = useState(null);
  const [moodLog, setMoodLog]                 = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [streak, setStreak]                   = useState({ current: 0, total: 0, goodDays: 0 });
  const [journalEntries, setJournalEntries]   = useState([]);
  const [journalDoneToday, setJournalDoneToday] = useState(false);
  const [isLoaded, setIsLoaded]               = useState(false);

  // Deterministic daily picks
  const dayIdx = getDayOfYear();
  const todayCard = MOTIVATION_CARDS[dayIdx % MOTIVATION_CARDS.length];
  const todayPrompt = JOURNAL_PROMPTS[dayIdx % JOURNAL_PROMPTS.length];

  // --- Load on mount ---
  useEffect(() => {
    const load = async () => {
      try {
        const [storedMoodLog, storedJournal, storedRecentChat] = await Promise.all([
          AsyncStorage.getItem('mood_log'),
          AsyncStorage.getItem('journal_entries'),
          AsyncStorage.getItem('spark_recent_chat'),
        ]);

        const parsedMoodLog = storedMoodLog ? JSON.parse(storedMoodLog) : [];
        const parsedJournal = storedJournal ? JSON.parse(storedJournal) : [];
        const parsedRecentChat = storedRecentChat ? JSON.parse(storedRecentChat) : [];

        setMoodLog(parsedMoodLog);
        setJournalEntries(parsedJournal);

        // Restore recent chat session
        if (parsedRecentChat.length > 0) {
          setConversationHistory(parsedRecentChat);
        }

        // Check today's mood
        const today = new Date();
        const todayEntry = parsedMoodLog.find(m => isSameDay(m.date, today));
        if (todayEntry) setTodayMood(todayEntry);

        // Check journal today
        const todayJournal = parsedJournal.find(e => isSameDay(e.date, today));
        if (todayJournal) setJournalDoneToday(true);

        // Compute streak
        const computed = computeStreak(parsedMoodLog);
        setStreak(computed);

      } catch (e) {
        console.error('UpliftContext load error:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  const computeStreak = (log) => {
    if (!log || log.length === 0) return { current: 0, total: 0, goodDays: 0 };

    const sorted = [...log].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date();

    let current = 0;
    let checkDay = new Date(today);

    for (let i = 0; i < sorted.length; i++) {
      if (isSameDay(sorted[i].date, checkDay)) {
        current++;
        checkDay.setDate(checkDay.getDate() - 1);
      } else {
        break;
      }
    }

    const goodDays = log.filter(m => m.mood === 'happy' || m.mood === 'okay').length;
    // total = distinct days chatted (approximated by mood log for now)
    const total = log.length;

    return { current, total, goodDays };
  };

  // --- Actions ---
  const logMood = async (moodObject) => {
    const today = new Date();
    const entry = { ...moodObject, date: today.toISOString() };

    // Replace today's entry if exists, otherwise append
    const filtered = moodLog.filter(m => !isSameDay(m.date, today));
    const newLog = [...filtered, entry];

    setMoodLog(newLog);
    setTodayMood(entry);
    setStreak(computeStreak(newLog));

    await AsyncStorage.setItem('mood_log', JSON.stringify(newLog));
  };

  const addMessage = async (role, content) => {
    const newMsg = { role, content };
    setConversationHistory(prev => {
      const updated = [...prev, newMsg];
      const capped = updated.slice(-MAX_HISTORY);
      // Persist last 6
      const recent = capped.slice(-RECENT_CHAT_SIZE);
      AsyncStorage.setItem('spark_recent_chat', JSON.stringify(recent)).catch(() => {});
      return capped;
    });
  };

  const clearConversation = async () => {
    setConversationHistory([]);
    await AsyncStorage.removeItem('spark_recent_chat');
  };

  const saveJournalEntry = async (entryObject) => {
    const today = new Date();
    const filtered = journalEntries.filter(e => !isSameDay(e.date, today));
    const newEntries = [{ ...entryObject, date: today.toISOString() }, ...filtered];
    setJournalEntries(newEntries);
    setJournalDoneToday(true);
    await AsyncStorage.setItem('journal_entries', JSON.stringify(newEntries));
  };

  const deleteJournalEntry = async (dateStr) => {
    const filtered = journalEntries.filter(e => e.date !== dateStr);
    setJournalEntries(filtered);
    await AsyncStorage.setItem('journal_entries', JSON.stringify(filtered));
  };

  return (
    <UpliftContext.Provider
      value={{
        todayMood,
        moodLog,
        conversationHistory,
        streak,
        todayCard,
        todayPrompt,
        journalEntries,
        journalDoneToday,
        isLoaded,
        logMood,
        addMessage,
        clearConversation,
        saveJournalEntry,
        deleteJournalEntry,
      }}
    >
      {children}
    </UpliftContext.Provider>
  );
};
