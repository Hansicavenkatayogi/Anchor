import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = process.env.HOPESPARK_API_BASE || 'http://127.0.0.1:3000';

const SELF_HARM_KEYWORDS = [
  'hurt myself', 'hurt me', 'want to die', 'kill myself',
  'end my life', "don't want to live", 'nobody would miss me',
  'wish i was dead', 'suicidal', 'cut myself', 'no reason to live',
];

const ABUSE_SIGNALS = [
  'someone hurts me', 'hitting me', 'scared at home',
  'not safe at home', 'being abused', 'touched me wrong',
];

// Layer A: HOPELESSNESS & DANGER PATTERNS
const HOPELESSNESS_PATTERNS = [
  /no\s*point\s*(in|to)\s*(living|trying|anything)/i,
  /everyone\s*(would\s*)?(be\s*)?better\s*without\s*me/i,
  /don\'?t\s*(want|care)\s*(to|about)\s*(be\s*here|anything)/i,
  /wish\s*(I|i)\s*(was|were|wasn\'?t)\s*(born|here|alive)/i,
  /tired\s*of\s*(everything|life|being\s*alive)/i
];

const IMMEDIATE_DANGER_PATTERNS = [
  /someone\s*is\s*(hurting|hitting|touching)\s*me/i,
  /locked\s*(in|out)\s*(my|the)\s*room/i,
  /no\s*(food|water)\s*(at\s*home|for\s*days)/i,
  /running\s*away\s*from\s*home/i
];

// Layer B: SENTIMENT DRIFT
const NEGATIVE_WORDS = [
  'sad', 'hate', 'alone', 'scared', 'nobody', 'miss',
  'crying', 'hurt', 'tired', 'dark', 'bad', 'awful',
  'worst', 'wish', 'gone', 'leave', 'empty', 'can\'t'
];

export const detectCrisis = (messageText) => {
  const lower = messageText.toLowerCase();
  
  for (const keyword of SELF_HARM_KEYWORDS) {
    if (lower.includes(keyword)) return { detected: true, type: 'self_harm', flagType: 'keyword' };
  }
  for (const keyword of ABUSE_SIGNALS) {
    if (lower.includes(keyword)) return { detected: true, type: 'abuse', flagType: 'keyword' };
  }
  
  for (const regex of HOPELESSNESS_PATTERNS) {
    if (regex.test(lower)) return { detected: true, type: 'hopelessness', flagType: 'pattern' };
  }
  for (const regex of IMMEDIATE_DANGER_PATTERNS) {
    if (regex.test(lower)) return { detected: true, type: 'abuse', flagType: 'pattern' };
  }
  
  return { detected: false, type: null, flagType: null };
};

export const checkSentimentDrift = (messages) => {
  if (!messages || messages.length < 3) return false;
  
  // Look at last 3 user messages
  const userMessages = messages.filter(m => m.sender === 'user').slice(-3);
  if (userMessages.length < 3) return false;

  let negativeHits = 0;
  for (let msg of userMessages) {
    let words = msg.text.toLowerCase().split(/\W+/);
    let score = 0;
    for (let word of words) {
      if (NEGATIVE_WORDS.includes(word)) score++;
    }
    if (score >= 2) negativeHits++;
  }

  return negativeHits >= 3; 
};

export const logCrisisFlag = async (anonymousId, type, flagType) => {
  try {
    const existing = await AsyncStorage.getItem('crisis_flags');
    const flags = existing ? JSON.parse(existing) : [];
    flags.push({ date: new Date().toISOString(), type, flagType });
    await AsyncStorage.setItem('crisis_flags', JSON.stringify(flags));
    
    // Attempt sending to cloud
    let sessionId = await AsyncStorage.getItem('spark_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      await AsyncStorage.setItem('spark_session_id', sessionId);
    }

    try {
      await fetch(`${API_BASE}/api/crisis-flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymousId, flagType, crisisCategory: type, sessionId })
      });
    } catch(e) {}
  } catch (e) {
    console.error('Failed to log crisis flag', e);
  }
};

export const CRISIS_SPARK_RESPONSE =
  "I hear you, and I care about you very much. Please talk to someone you trust right now. You can also call Childline at 1098 — it's free and they're there for you. I'm not going anywhere. 💜";

export const SOFT_CRISIS_SPARK_RESPONSE =
  "I've noticed you've been sharing some heavy things. I really care about you. Are you okay right now?";
