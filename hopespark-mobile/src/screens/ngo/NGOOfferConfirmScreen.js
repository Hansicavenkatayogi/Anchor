import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NGOOfferConfirmScreen() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark-circle" size={80} color="#1D9E75" />
        </Animated.View>
        <Text style={styles.title}>Offer Submitted!</Text>
        <Text style={styles.subtitle}>
          Thank you for offering support. The child will be notified that a helper has been found.
        </Text>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('NGOCases')}>
          <Text style={styles.btnText}>View all cases</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconCircle: { marginBottom: 30 },
  title: { fontSize: 28, fontFamily: 'Nunito_700Bold', color: '#2C2C2A', marginBottom: 12 },
  subtitle: { fontSize: 16, fontFamily: 'Nunito_400Regular', color: '#5F5E5A', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  btn: { backgroundColor: tokens.colors.primary, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito_700Bold' }
});
