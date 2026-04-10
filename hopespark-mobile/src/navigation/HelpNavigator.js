import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HelpLandingScreen from '../screens/help/HelpLandingScreen';
import MyCasesScreen from '../screens/help/MyCasesScreen';
import CaseDetailScreen from '../screens/help/CaseDetailScreen';

const Stack = createNativeStackNavigator();

export default function HelpNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="HelpLandingScreen" component={HelpLandingScreen} />
      <Stack.Screen name="MyCasesScreen" component={MyCasesScreen} />
      <Stack.Screen name="CaseDetailScreen" component={CaseDetailScreen} />
    </Stack.Navigator>
  );
}
