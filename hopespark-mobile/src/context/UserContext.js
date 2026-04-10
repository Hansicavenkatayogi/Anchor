import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [anonymousId, setAnonymousId] = useState('');
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('user_name');
        const storedAge = await AsyncStorage.getItem('user_ageGroup');
        const storedAnonId = await AsyncStorage.getItem('user_anonymousId');
        const storedOnboarding = await AsyncStorage.getItem('user_onboardingDone');

        if (storedName) setName(storedName);
        if (storedAge) setAgeGroup(storedAge);
        if (storedAnonId) setAnonymousId(storedAnonId);
        if (storedOnboarding === 'true') setOnboardingDone(true);
      } catch (e) {
        console.error('Failed to load user data.', e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserData();
  }, []);

  const saveName = async (newName) => {
    setName(newName);
    await AsyncStorage.setItem('user_name', newName);
  };

  const saveAgeGroup = async (newAgeGroup) => {
    setAgeGroup(newAgeGroup);
    await AsyncStorage.setItem('user_ageGroup', newAgeGroup);
  };

  const completeOnboarding = async () => {
    setOnboardingDone(true);
    await AsyncStorage.setItem('user_onboardingDone', 'true');
    
    // Generate anonymous ID if not exists
    if (!anonymousId) {
      const initial = name ? name[0].toUpperCase() : 'A';
      const randomChars = Math.random().toString(36).slice(2, 8).toUpperCase();
      const newAnonId = initial + randomChars;
      setAnonymousId(newAnonId);
      await AsyncStorage.setItem('user_anonymousId', newAnonId);
    }
  };

  const clearData = async () => {
    await AsyncStorage.multiRemove(['user_name', 'user_ageGroup', 'user_onboardingDone', 'user_anonymousId']);
    setName('');
    setAgeGroup('');
    setAnonymousId('');
    setOnboardingDone(false);
  };

  return (
    <UserContext.Provider
      value={{
        name,
        ageGroup,
        anonymousId,
        onboardingDone,
        isLoaded,
        saveName,
        saveAgeGroup,
        completeOnboarding,
        clearData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
