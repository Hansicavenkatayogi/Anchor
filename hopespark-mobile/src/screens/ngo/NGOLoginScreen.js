import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NGOContext } from '../../context/NGOContext';
import { tokens } from '../../theme/tokens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NGOLoginScreen() {
  const { ngoLogin, toggleNGOMode } = useContext(NGOContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      await ngoLogin(email, password);
    } catch (err) {
      // Hardcode bypass for dummy testing since Supabase isn't running locally yet
      if (email === 'test' && password === 'test') {
        // Simulated mock login logic wouldn't go here in prod, just for UI dev
      }
      setError('Login failed. Please check credentials or network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.closeBtn} 
        onPress={() => toggleNGOMode(false)}
      >
        <Ionicons name="close" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <View style={styles.logoDot} />
          </View>
        </View>

        <Text style={styles.title}>Partner Login</Text>
        <Text style={styles.subtitle}>Sign in to view open cases.</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#888780"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888780"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1D1A3A', justifyContent: 'center', padding: 20 },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: tokens.colors.uplift, alignItems: 'center', justifyContent: 'center' },
  logoDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF', position: 'absolute', top: 14, right: 14 },
  title: { fontSize: 24, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, fontFamily: 'Nunito_400Regular', color: '#5F5E5A', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: tokens.colors.surface, borderRadius: 12, height: 50, paddingHorizontal: 16, marginBottom: 16, fontSize: 16, fontFamily: 'Nunito_400Regular', color: '#2C2C2A' },
  button: { backgroundColor: tokens.colors.primary, borderRadius: 25, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito_700Bold' },
  errorText: { color: tokens.colors.warning, textAlign: 'center', marginBottom: 16, fontFamily: 'Nunito_600SemiBold' }
});
