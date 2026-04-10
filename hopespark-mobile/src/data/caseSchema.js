// src/data/caseSchema.js

/**
 * Reference schema for a HopeSpark Help Request case.
 * Used to structure and document the local AsyncStorage payloads
 * before they are forwarded to the NGO API.
 */

export const CaseSchema = {
  id: '',             // "HS-" + random 4-digit number, e.g. "HS-2847"
  createdAt: '',      // ISO string
  updatedAt: '',      // ISO string

  // Step 1
  category: '',       // 'food' | 'shelter' | 'school' | 'health' | 'clothing' | 'safety' | 'other'
  categoryLabel: '',  // human-readable label

  // Step 2
  description: '',    // free text, max 600 chars
  urgency: '',        // 'low' | 'medium' | 'high'

  // Step 3
  city: '',           // e.g. "Hyderabad"
  state: '',          // e.g. "Telangana"
  familySituation: '',// 'single_parent' | 'no_parents' | 'guardian' | 'other'
  contactInfo: '',    // optional phone/email, default ""

  // Meta
  status: '',         // 'submitted' | 'reviewing' | 'matched' | 'resolved'
  statusLabel: '',    // human-readable
  statusProgress: 20, // 0–100 for progress bar
  anonymousId: '',    // generated anonymous ID from UserContext
  ageGroup: '',       // from UserContext

  // For future NGO forwarding
  exportReady: true,  // true once submitted
  forwardedAt: null,  // null until forwarded via API
  assignedNGO: null   // null until matched via API
};
