import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { notificationStorage } from '../../services/notificationStorage';
import { tokens } from '../../theme/tokens';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationCentreScreen() {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const list = await notificationStorage.getAll();
    setNotifications(list);
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (let u of unread) {
      await notificationStorage.markRead(u.id);
    }
    loadNotifications();
  };

  const handleTap = async (item) => {
    if (!item.read) {
      await notificationStorage.markRead(item.id);
      loadNotifications();
    }
    
    // Route based on type
    if (item.type === 'helper_found' || item.type === 'case_reviewed' || item.type === 'resolved') {
      navigation.navigate('MyCases');
    } else if (item.type === 'mood_reminder') {
      navigation.navigate('Uplift', { screen: 'MoodCheckIn' });
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'helper_found': return '#1D9E75'; // Teal
      case 'case_reviewed': return '#F59E0B'; // Amber
      case 'mood_reminder': return '#7F77DD'; // Purple
      case 'resolved': return '#10B981'; // Green
      default: return '#9CA3AF';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, !item.read && styles.cardUnread]}
      onPress={() => handleTap(item)}
      activeOpacity={0.8}
    >
      {!item.read && <View style={[styles.unreadBorder, { backgroundColor: getIconColor(item.type) }]} />}
      <View style={styles.cardContent}>
        <View style={[styles.iconDot, { backgroundColor: getIconColor(item.type) }]} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, !item.read && styles.titleUnread]}>{item.title}</Text>
          <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
          <Text style={styles.time}>{formatDistanceToNow(new Date(item.receivedAt), { addSuffix: true })}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2C2C2A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>Nothing yet.</Text>
          <Text style={styles.emptySubtext}>We'll let you know when a helper is found or your case is updated.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#2C2C2A' },
  markReadText: { fontSize: 14, fontFamily: 'Nunito_600SemiBold', color: tokens.colors.primary },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontFamily: 'Nunito_700Bold', color: '#6B7280', marginTop: 16 },
  emptySubtext: { fontSize: 14, fontFamily: 'Nunito_400Regular', color: '#9CA3AF', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  listContent: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  cardUnread: { backgroundColor: '#FAFAFA' },
  unreadBorder: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, zIndex: 1 },
  cardContent: { flexDirection: 'row', padding: 16 },
  iconDot: { width: 16, height: 16, borderRadius: 8, marginTop: 2, marginRight: 12 },
  textContainer: { flex: 1 },
  title: { fontSize: 15, fontFamily: 'Nunito_600SemiBold', color: '#4B5563', marginBottom: 4 },
  titleUnread: { fontFamily: 'Nunito_700Bold', color: '#1F2937' },
  body: { fontSize: 13, fontFamily: 'Nunito_400Regular', color: '#6B7280', lineHeight: 18, marginBottom: 8 },
  time: { fontSize: 11, fontFamily: 'Nunito_600SemiBold', color: '#9CA3AF' }
});
