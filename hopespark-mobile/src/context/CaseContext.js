import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { getAllCases, saveCase, deleteCase as storageDeleteCase } from '../data/caseStorage';
import { contentModerator } from '../services/contentModerator';

export const CaseContext = createContext();

const initialDraftState = {
  category: '',
  categoryLabel: '',
  description: '',
  urgency: 'medium',
  city: '',
  state: '',
  familySituation: '',
  contactInfo: ''
};

export const CaseProvider = ({ children }) => {
  const { ageGroup, anonymousId } = useContext(UserContext);
  const [cases, setCases] = useState([]);
  const [activeDraft, setActiveDraft] = useState(initialDraftState);

  useEffect(() => {
    refreshCases();
  }, []);

  const refreshCases = async () => {
    const loadedCases = await getAllCases();
    setCases(loadedCases);
  };

  const setDraftField = (key, value) => {
    setActiveDraft(prev => ({ ...prev, [key]: value }));
  };

  const submitCase = async (generatedId) => {
    const newCase = {
      id: generatedId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      category: activeDraft.category,
      categoryLabel: activeDraft.categoryLabel,
      description: activeDraft.description,
      urgency: activeDraft.urgency,
      
      city: activeDraft.city,
      state: activeDraft.state,
      familySituation: activeDraft.familySituation,
      contactInfo: activeDraft.contactInfo,
      
      status: 'submitted',
      statusLabel: 'Submitted',
      statusProgress: 20,
      anonymousId: anonymousId,
      ageGroup: ageGroup,
      
      exportReady: true,
      forwardedAt: null,
      assignedNGO: null
    };

    const modResult = contentModerator.moderateContent(activeDraft.description);
    if (!modResult.safe) {
      newCase.needsReview = true;
      newCase.clientFlag = modResult.flag;
      // In UI, we'd normally show the warning, but here we still save it with the flag.
    }

    await saveCase(newCase);
    await refreshCases();
    setActiveDraft(initialDraftState);
  };

  const resetDraft = () => {
    setActiveDraft(initialDraftState);
  };

  const deleteCase = async (id) => {
    await storageDeleteCase(id);
    await refreshCases();
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        activeDraft,
        setDraftField,
        submitCase,
        refreshCases,
        deleteCase,
        resetDraft
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};
