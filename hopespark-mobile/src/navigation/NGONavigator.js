import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NGOContext } from '../../context/NGOContext';
import NGOLoginScreen from '../screens/ngo/NGOLoginScreen';
import NGOCasesScreen from '../screens/ngo/NGOCasesScreen';
import NGOCaseDetailScreen from '../screens/ngo/NGOCaseDetailScreen';
import NGOOfferConfirmScreen from '../screens/ngo/NGOOfferConfirmScreen';

const Stack = createNativeStackNavigator();

export default function NGONavigator() {
  const { ngoUser } = useContext(NGOContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!ngoUser ? (
        <Stack.Screen name="NGOLogin" component={NGOLoginScreen} />
      ) : (
        <>
          <Stack.Screen name="NGOCases" component={NGOCasesScreen} />
          <Stack.Screen name="NGOCaseDetail" component={NGOCaseDetailScreen} />
          <Stack.Screen name="NGOOfferConfirm" component={NGOOfferConfirmScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
