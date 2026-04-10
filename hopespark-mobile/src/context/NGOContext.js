import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabaseClient';

export const NGOContext = createContext();

export const NGOProvider = ({ children }) => {
  const [ngoUser, setNgoUser] = useState(null);
  const [ngoOrg, setNgoOrg] = useState(null);
  const [session, setSession] = useState(null);
  const [cases, setCases] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [isNGOMode, setIsNGOMode] = useState(false);

  // Restore NGO mode state
  useEffect(() => {
    const loadMode = async () => {
      const mode = await AsyncStorage.getItem('ngo_mode_enabled');
      if (mode === 'true') {
        setIsNGOMode(true);
        // Normally we'd restore Supabase session here too
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          fetchOrgDetails(session.user.id);
        }
      }
    };
    loadMode();
  }, []);

  const fetchOrgDetails = async (userId) => {
    try {
      const { data: user } = await supabase.from('ngo_users').select('*, ngo_organizations(*)').eq('id', userId).single();
      if (user) {
        setNgoUser(user);
        setNgoOrg(user.ngo_organizations);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const toggleNGOMode = async (value) => {
    setIsNGOMode(value);
    await AsyncStorage.setItem('ngo_mode_enabled', value ? 'true' : 'false');
  };

  const ngoLogin = async (email, password) => {
    // Calling our server pseudo-auth or Supabase directly
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
    await fetchOrgDetails(data.user.id);
  };

  const ngoLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setNgoUser(null);
    setNgoOrg(null);
    setCases([]);
  };

  const fetchCasesLocally = async (city) => {
    if (!city) return;
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('city', city)
      .order('submitted_at', { ascending: false });
    if (!error) setCases(data);
  };

  const submitOffer = async (caseId, offerData) => {
    if (!ngoOrg) return;
    try {
      /* Uses the actual Next.js API in production, but we'll talk to Supabase directly here for MVP if we have tokens.
         Since mobile won't easily have the Next.js cookie session, we POST to our backend or just inserts. */
      const { error } = await supabase.from('aid_offers').insert({
        case_id: caseId,
        ngo_id: ngoOrg.id,
        ngo_user_id: ngoUser.id,
        ...offerData,
        status: 'pending'
      });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return (
    <NGOContext.Provider value={{
      ngoUser, ngoOrg, session, cases, myOffers, isNGOMode,
      toggleNGOMode, ngoLogin, ngoLogout, fetchCasesLocally, submitOffer
    }}>
      {children}
    </NGOContext.Provider>
  );
};
