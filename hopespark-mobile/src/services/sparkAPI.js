import Constants from 'expo-constants';
import { getSystemPrompt } from './systemPrompt';
import { SPARK_FALLBACKS } from './sparkFallbacks';

const ANTHROPIC_API_KEY =
  Constants.expoConfig?.extra?.ANTHROPIC_API_KEY ||
  process.env.ANTHROPIC_API_KEY ||
  '';

export const buildMessage = (role, content) => ({ role, content });

export const sendMessage = async (conversationHistory, userContext = {}) => {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('No API key configured. Please add ANTHROPIC_API_KEY to your .env file.');
  }

  const systemPrompt = getSystemPrompt(userContext);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 300,
        system: systemPrompt,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`Anthropic API error ${response.status}: ${errorBody}`);
      return SPARK_FALLBACKS[Math.floor(Math.random() * SPARK_FALLBACKS.length)];
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.warn('Unexpected response format from Anthropic API');
      return SPARK_FALLBACKS[Math.floor(Math.random() * SPARK_FALLBACKS.length)];
    }

    return data.content[0].text;
  } catch (error) {
    console.warn("Network or API failure in sparkAPI", error);
    return SPARK_FALLBACKS[Math.floor(Math.random() * SPARK_FALLBACKS.length)];
  }
};
