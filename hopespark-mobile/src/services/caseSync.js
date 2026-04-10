import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.HOPESPARK_API_BASE || 'http://127.0.0.1:3000';
const SYNC_TOKEN = process.env.HOPESPARK_SYNC_TOKEN || 'dev_sync_token_42';

/**
 * Sweeps AsyncStorage for local cases, and POSTs them to the Next.js backend.
 */
export const syncCasesToCloud = async () => {
  try {
    const rawData = await AsyncStorage.getItem('cases_storage');
    if (!rawData) return;
    
    const cases = JSON.parse(rawData);
    let updated = false;

    for (let c of cases) {
      if (c.status !== 'exportReady' && c.status !== 'submitted') continue;
      if (c.syncedAt) continue; // Already synced

      // Prepare payload (excludes user contact info by design for Phase 4)
      const payload = {
        id: c.id,
        category: c.category,
        categoryLabel: c.categoryLabel,
        description: c.description,
        urgency: c.urgency,
        city: c.city,
        state: c.state,
        familySituation: c.familySituation,
        ageGroup: c.ageGroup || '13-17',
        anonymousId: c.anonymousId || 'ANON-XXX',
        contactInfo: !!c.contactInfo // boolean only sent
      };

      try {
        const res = await fetch(`${API_BASE}/api/cases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SYNC_TOKEN}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          c.syncedAt = new Date().toISOString();
          c.status = 'submitted';
          updated = true;
        }
      } catch (err) {
        console.log(`Failed to sync case ${c.id}`, err);
      }
    }

    if (updated) {
      await AsyncStorage.setItem('cases_storage', JSON.stringify(cases));
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
};

/**
 * Polls the backend for status updates of local cases.
 */
export const pollCaseStatusUpdates = async () => {
  try {
    const rawData = await AsyncStorage.getItem('cases_storage');
    if (!rawData) return;
    
    const cases = JSON.parse(rawData);
    let updated = false;

    for (let c of cases) {
      if (!c.syncedAt) continue;
      if (c.status === 'resolved') continue;

      try {
        const res = await fetch(`${API_BASE}/api/cases/${c.id}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.status && data.status !== c.status) {
            c.status = data.status;
            c.statusLabel = data.statusLabel;
            c.statusProgress = data.statusProgress;
            c.assignedNGO = data.assignedNGO;
            updated = true;
          }
        }
      } catch (err) {
        // Silent failure on polling offline
      }
    }

    if (updated) {
      await AsyncStorage.setItem('cases_storage', JSON.stringify(cases));
    }
  } catch (error) {
    console.error("Poll error:", error);
  }
};
