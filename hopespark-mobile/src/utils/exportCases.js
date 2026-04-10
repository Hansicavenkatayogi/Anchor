import AsyncStorage from '@react-native-async-storage/async-storage';

export const buildExportPayload = (cases) => {
  const exportableCases = cases.filter(c => c.exportReady && !c.forwardedAt);
  
  const sanitizedCases = exportableCases.map(c => ({
    caseId: c.id,
    category: c.category,
    description: c.description,
    urgency: c.urgency,
    city: c.city,
    state: c.state,
    familySituation: c.familySituation,
    hasContact: !!(c.contactInfo && c.contactInfo.trim() !== ''),
    ageGroup: c.ageGroup,
    submittedAt: c.createdAt
  }));

  return {
    exportedAt: new Date().toISOString(),
    source: "HopeSpark v1.0",
    totalCases: sanitizedCases.length,
    cases: sanitizedCases
  };
};

export const logExportAttempt = async () => {
  try {
    const timestamp = new Date().toISOString();
    await AsyncStorage.setItem('last_export_attempt', timestamp);
    return timestamp;
  } catch (error) {
    console.error("Could not log export attempt", error);
  }
};
