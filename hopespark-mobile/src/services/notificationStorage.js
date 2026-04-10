import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'notification_history';
const MAX_NOTIFS = 50;

export const notificationStorage = {
  async getAll() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async saveNotification(notif) {
    try {
      const existing = await this.getAll();
      const newNotif = {
        id: notif.id || uuidv4(),
        title: notif.title,
        body: notif.body,
        type: notif.data?.type || 'general',
        data: notif.data,
        read: false,
        receivedAt: new Date().toISOString()
      };
      
      const updated = [newNotif, ...existing].slice(0, MAX_NOTIFS);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving notification', e);
    }
  },

  async markRead(id) {
    try {
      const existing = await this.getAll();
      const updated = existing.map(n => n.id === id ? { ...n, read: true } : n);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Fire and forget to server
      // fetch(`${API_BASE}/api/notification-log/${id}/read`, { method: 'PATCH' });
      return updated;
    } catch (e) {
      console.error(e);
    }
  },

  async getUnreadCount() {
    const list = await this.getAll();
    return list.filter(n => !n.read).length;
  }
};
