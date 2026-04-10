import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import AgeScreen from '../screens/onboarding/AgeScreen';
import ConsentScreen from '../screens/ConsentScreen';
import ReadyScreen from '../screens/onboarding/ReadyScreen';
import MainTabNavigator from './MainTabNavigator';
import PrivacyCentreScreen from '../screens/PrivacyCentreScreen';

// Phase 2 – Help Stream (fullscreen over tab bar)
import CategoryScreen        from '../screens/help/CategoryScreen';
import StoryScreen           from '../screens/help/StoryScreen';
import LocationContextScreen from '../screens/help/LocationContextScreen';
import ReviewScreen          from '../screens/help/ReviewScreen';
import ConfirmationScreen    from '../screens/help/ConfirmationScreen';
import MyCasesScreen         from '../screens/help/MyCasesScreen';
import CaseDetailScreen      from '../screens/help/CaseDetailScreen';
import ContactReleaseScreen  from '../screens/help/ContactReleaseScreen';
import SafetyNetScreen       from '../screens/help/SafetyNetScreen';
import NotificationCentreScreen from '../screens/NotificationCentreScreen';

// Phase 3 – Uplift Stream (fullscreen over tab bar)
import MoodCheckInScreen      from '../screens/uplift/MoodCheckInScreen';
import MotivationHomeScreen   from '../screens/uplift/MotivationHomeScreen';
import ChatScreen             from '../screens/uplift/ChatScreen';
import ActivitiesScreen       from '../screens/uplift/ActivitiesScreen';
import BreathingScreen        from '../screens/uplift/BreathingScreen';
import JournalScreen          from '../screens/uplift/JournalScreen';
import JournalHistoryScreen   from '../screens/uplift/JournalHistoryScreen';

export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { onboardingDone } = useContext(UserContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />

      {!onboardingDone ? (
        <Stack.Group>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Age"     component={AgeScreen} />
          <Stack.Screen name="Consent" component={ConsentScreen} />
          <Stack.Screen name="Ready"   component={ReadyScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* ── Phase 2: Help Stream ────────────────────────── */}
          <Stack.Screen name="CategoryScreen"        component={CategoryScreen} />
          <Stack.Screen name="StoryScreen"           component={StoryScreen} />
          <Stack.Screen name="LocationContextScreen" component={LocationContextScreen} />
          <Stack.Screen name="ReviewScreen"          component={ReviewScreen} />
          <Stack.Screen
            name="ConfirmationScreen"
            component={ConfirmationScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="MyCasesScreen"   component={MyCasesScreen} />
          <Stack.Screen name="CaseDetailScreen" component={CaseDetailScreen} />
          <Stack.Screen
            name="SafetyNetScreen"
            component={SafetyNetScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="ContactReleaseScreen" component={ContactReleaseScreen} />
          <Stack.Screen name="NotificationCentre" component={NotificationCentreScreen} />
          <Stack.Screen name="PrivacyCentre" component={PrivacyCentreScreen} />

          {/* ── Phase 3: Uplift Stream ──────────────────────── */}
          <Stack.Screen name="MoodCheckInScreen"    component={MoodCheckInScreen} />
          <Stack.Screen name="MotivationHomeScreen" component={MotivationHomeScreen} />
          <Stack.Screen name="ChatScreen"           component={ChatScreen} />
          <Stack.Screen name="ActivitiesScreen"     component={ActivitiesScreen} />
          <Stack.Screen name="BreathingScreen"      component={BreathingScreen} />
          <Stack.Screen name="JournalScreen"        component={JournalScreen} />
          <Stack.Screen name="JournalHistoryScreen" component={JournalHistoryScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
