import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { tokens } from '../../theme/tokens';
import { UserContext } from '../../context/UserContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function WelcomeScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const { saveName } = useContext(UserContext);
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    if (inputText.trim()) {
      await saveName(inputText.trim());
      navigation.navigate('Age');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.inner, { paddingTop: insets.top, paddingBottom: insets.bottom + tokens.spacing.lg }]}>
          
          {/* Top Progress Indicators */}
          <View style={styles.progressContainer}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.content}>
            <View style={styles.emojiPlaceholder}>
              <Ionicons name="star" size={40} color="#FFFFFF" />
            </View>
            
            <Text style={styles.heading}>Hi! What's your name?</Text>
            <Text style={styles.subtext}>This stays just with you. No one else will see it.</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Your name..."
              placeholderTextColor={tokens.colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              autoFocus={true}
              autoCorrect={false}
              maxLength={20}
            />
          </View>

          <PrimaryButton 
            title="Continue →" 
            onPress={handleContinue}
            disabled={inputText.trim().length === 0}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  inner: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: tokens.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: tokens.colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: tokens.spacing.xxl,
  },
  emojiPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  heading: {
    fontFamily: 'Nunito_700Bold',
    fontSize: tokens.fontSizes.lg,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  subtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.pill,
    paddingHorizontal: tokens.spacing.lg,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary,
    backgroundColor: '#FFFFFF',
  },
});
