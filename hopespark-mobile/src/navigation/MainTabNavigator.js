import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { tokens } from '../theme/tokens';
import HomeScreen from '../screens/HomeScreen';
import HelpNavigator from './HelpNavigator';
import UpliftNavigator from './UpliftNavigator';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Help') {
            iconName = focused ? 'hand-left' : 'hand-left-outline';
          } else if (route.name === 'Uplift') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: tokens.colors.border,
          height: Platform.OS === 'ios' ? 60 : 56,
          paddingBottom: Platform.OS === 'ios' ? 10 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito',
          fontSize: tokens.fontSizes.xs,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Help"
        component={HelpNavigator}
        options={{ tabBarActiveTintColor: tokens.colors.primary }}
      />
      <Tab.Screen
        name="Uplift"
        component={UpliftNavigator}
        options={{ tabBarActiveTintColor: tokens.colors.uplift }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarActiveTintColor: tokens.colors.textPrimary }}
      />
    </Tab.Navigator>
  );
}
