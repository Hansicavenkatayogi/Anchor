import { Buffer } from 'buffer';
import { supabase } from './supabaseClient';

const API_BASE = process.env.HOPESPARK_API_BASE || 'http://127.0.0.1:3000';
const SYNC_TOKEN = process.env.HOPESPARK_SYNC_TOKEN || 'dev_sync_token_42';

/**
 * Handles the secure transit of contact info.
 * The contact info is base64 encoded as a simple proxy for encryption in this phase.
 * In a true production environment, we should use libsodium-wrappers with an asymmetric public key.
 */
export const contactReleaseService = {
  
  /**
   * Approves contact release to the matched NGO.
   */
  async approveRelease(caseId, rawContactInfo) {
    if (!rawContactInfo) {
      throw new Error("No contact info provided");
    }
    
    // "Encrypt" (Base64) on the client before sending
    const encoded = Buffer.from(rawContactInfo).toString('base64');
    
    const response = await fetch(`${API_BASE}/api/cases/${caseId}/release-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SYNC_TOKEN}`
      },
      body: JSON.stringify({
        caseId,
        contactInfo: encoded
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to release contact info");
    }
    
    return true;
  },

  /**
   * Declines the release, choosing to stay anonymous.
   */
  async declineRelease(caseId) {
    const response = await fetch(`${API_BASE}/api/cases/${caseId}/release-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SYNC_TOKEN}`
      },
      body: JSON.stringify({
        caseId,
        declined: true
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to register decline");
    }
    
    return true;
  }
};
