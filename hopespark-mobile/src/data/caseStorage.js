import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'hopespark_cases';

export const getAllCases = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const cases = JSON.parse(data);
    // Sort newest first
    return cases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Failed to get cases:', error);
    return [];
  }
};

export const saveCase = async (caseObject) => {
  try {
    const existingCases = await getAllCases();
    existingCases.push(caseObject);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingCases));
    return caseObject;
  } catch (error) {
    console.error('Failed to save case:', error);
    throw error;
  }
};

export const updateCaseStatus = async (caseId, newStatus) => {
  try {
    const cases = await getAllCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) throw new Error('Case not found');
    
    const statusMap = {
      'submitted': { label: "Submitted", progress: 20 },
      'reviewing': { label: "Under review", progress: 45 },
      'matched':   { label: "Helper found!", progress: 80 },
      'resolved':  { label: "Help provided", progress: 100 }
    };
    
    const meta = statusMap[newStatus];
    if (meta) {
      cases[caseIndex] = {
        ...cases[caseIndex],
        status: newStatus,
        statusLabel: meta.label,
        statusProgress: meta.progress,
        updatedAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
      return cases[caseIndex];
    }
  } catch (error) {
    console.error('Failed to update case status:', error);
    throw error;
  }
};

export const deleteCase = async (caseId) => {
  try {
    const cases = await getAllCases();
    const filtered = cases.filter(c => c.id !== caseId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete case:', error);
    throw error;
  }
};

export const exportCasesAsJSON = async () => {
  try {
    const cases = await getAllCases();
    const exportReadyCases = cases.filter(c => c.exportReady && !c.forwardedAt);
    return JSON.stringify(exportReadyCases, null, 2);
  } catch (error) {
    console.error('Failed to export cases:', error);
    return "[]";
  }
};
