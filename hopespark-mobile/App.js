import 'react-native-gesture-handler';
import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UserProvider, UserContext } from './src/context/UserContext';
import { CaseProvider } from './src/context/CaseContext';
import { UpliftProvider } from './src/context/UpliftContext';
import { NGOProvider, NGOContext } from './src/context/NGOContext';
import RootNavigator from './src/navigation/RootNavigator';
import NGONavigator from './src/navigation/NGONavigator';
import { pushService } from './src/services/pushService';
import * as Notifications from 'expo-notifications';
import { navigationRef } from './src/navigation/RootNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function Main() {
  const { isLoaded } = useContext(UserContext);
  const { isNGOMode } = useContext(NGOContext);

  let [fontsLoaded] = useFonts({
    Nunito: Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    // Register Push on startup if context is loaded and we have anonymousId
    // For simplicity without anonymousId immediately available, we register first
    pushService.registerForPushNotifications();

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => pushService.handleNotificationResponse(response, navigationRef)
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoaded]);

  if (!fontsLoaded || !isLoaded) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {isNGOMode ? <NGONavigator /> : <RootNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <CaseProvider>
          <UpliftProvider>
            <NGOProvider>
              <Main />
            </NGOProvider>
          </UpliftProvider>
        </CaseProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
