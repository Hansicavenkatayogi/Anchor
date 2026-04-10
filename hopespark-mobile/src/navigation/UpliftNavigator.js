import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UpliftLandingScreen    from '../screens/uplift/UpliftLandingScreen';
import MoodCheckInScreen      from '../screens/uplift/MoodCheckInScreen';
import MotivationHomeScreen   from '../screens/uplift/MotivationHomeScreen';

const Stack = createNativeStackNavigator();

export default function UpliftNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="UpliftLandingScreen"  component={UpliftLandingScreen} />
      <Stack.Screen name="MoodCheckInScreen"    component={MoodCheckInScreen} />
      <Stack.Screen name="MotivationHomeScreen" component={MotivationHomeScreen} />
    </Stack.Navigator>
  );
}
