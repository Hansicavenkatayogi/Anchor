import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const API_BASE = process.env.HOPESPARK_API_BASE || 'http://127.0.0.1:3000';

export const pushService = {
  async registerForPushNotifications(anonymousId) {
    let token;
    
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1D9E75',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log("Expo Push Token:", token);
        
        await AsyncStorage.setItem('push_token', token);
        
        // Register token with backend
        if (anonymousId) {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          fetch(`${API_BASE}/api/notifications/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, anonymousId, platform: Platform.OS, timezone: tz })
          }).catch(console.error);
        }
      } catch (e) {
        console.log("Error getting push token", e);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  },

  async sendLocalNotification(title, body, data) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // send immediately
    });
  },

  handleNotificationResponse(response, navigationRef) {
    const data = response.notification.request.content.data;
    
    if (!navigationRef?.current) return;
    
    // Deep linking logic
    switch(data?.type) {
      case 'helper_found':
      case 'case_reviewed':
        navigationRef.current.navigate('Home', { screen: 'MyCases' });
        break;
      case 'mood_reminder':
        navigationRef.current.navigate('Uplift', { screen: 'MoodCheckIn' });
        break;
      default:
        navigationRef.current.navigate('Home');
    }
  }
};
