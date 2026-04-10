/**
 * Pre-screens child content locally before transmission.
 */
export const contentModerator = {
  moderateContent(text) {
    const lowerText = text.toLowerCase();
    
    // 1. CONTACT SHARING
    const emailRegex = /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/;
    const phoneRegex = /(?:\+?91[\s-]?)?[\d\s-]{10,}/;
    const socialRegex = /@(instagram|snapchat|tiktok|twitter)|(insta|snap|sc|ig):?\s*@?[a-z0-9_]+/i;
    
    if (emailRegex.test(text) || phoneRegex.test(text) || socialRegex.test(lowerText)) {
      return { 
        safe: false, 
        reason: "Please don't share personal contact details here — we keep you safe.",
        flag: "contact_sharing"
      };
    }

    // 2. HATE SPEECH
    const hateWords = ['slur1', 'slur2', 'retard', 'faggot', 'nigger', 'spic', 'chink', 'die in a fire', 'kill yourself', 'kys'];
    for (const w of hateWords) {
      if (lowerText.includes(w)) {
        return {
          safe: false, 
          reason: "This language isn't allowed. Tell us what happened without those words.",
          flag: "hate_speech"
        };
      }
    }

    // 3. ADULT CONTENT
    const adultWords = ['porn', 'nsfw', 'sex', 'nudes', 'naked pics', 'hookup'];
    for (const w of adultWords) {
      if (lowerText.includes(w)) {
        return {
          safe: false, 
          reason: "Let's keep this a safe space.",
          flag: "adult_content"
        };
      }
    }

    return { safe: true, reason: null };
  }
};
