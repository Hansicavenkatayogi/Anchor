import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

export default function ChatBubble({ role, content, timestamp }) {
  const isAI = role === 'assistant';

  return (
    <View style={[styles.wrapper, isAI ? styles.wrapperAI : styles.wrapperUser]}>
      <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
        <Text style={[styles.text, isAI ? styles.textAI : styles.textUser]}>{content}</Text>
      </View>
      {timestamp && (
        <Text style={[styles.timestamp, isAI ? styles.tsLeft : styles.tsRight]}>
          {timestamp}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 4, maxWidth: '85%' },
  wrapperAI: { alignSelf: 'flex-start', marginLeft: tokens.spacing.md },
  wrapperUser: { alignSelf: 'flex-end', marginRight: tokens.spacing.md },
  bubble: { paddingVertical: 10, paddingHorizontal: 14 },
  bubbleAI: {
    backgroundColor: tokens.colors.upliftLight,
    borderRadius: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
  },
  bubbleUser: {
    backgroundColor: tokens.colors.uplift,
    borderRadius: 16,
    borderTopRightRadius: 2,
  },
  text: { fontFamily: 'Nunito', fontSize: tokens.fontSizes.base, lineHeight: 22 },
  textAI: { color: tokens.colors.upliftDark },
  textUser: { color: '#FFFFFF' },
  timestamp: {
    fontFamily: 'Nunito', fontSize: 9,
    color: tokens.colors.textMuted, marginTop: 2,
  },
  tsLeft: { marginLeft: 4 },
  tsRight: { textAlign: 'right', marginRight: 4 },
});
