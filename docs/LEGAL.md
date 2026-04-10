# Legal & Compliance Brief

## Digital Personal Data Protection (DPDP) Act 2023 Compliance
HopeSpark has been built specifically around the requirements of the DPDP Act 2023.

### 1. Notice & Consent (Section 5, 6)
- The app explicitly captures consent during the `ConsentScreen` in onboarding.
- Users are presented with a clear itemized list of what data is collected (Age Group, General Location) and what is inferred.
- Consent is explicitly toggled by user action, recorded locally, and honored globally.

### 2. Children's Data (Section 9)
- Users under 18 receive an age-appropriate consent prompt.
- We do not use their data for targeted advertising or any behavioral tracking.
- The app disables all third-party marketing SDKs.

### 3. Right to Erasure (Section 12)
- Within the `PrivacyCentreScreen`, users have a one-tap option to "Delete Everything". 
- This calls the `/api/account/cases` route which comprehensively deletes `cases`, `journal`, `activity logs`, and `push tokens` linked to their Anonymous ID.

### 4. Data Minimization
- We do not ask for exact Date of Birth; we ask for Age Groups.
- We do not ask for precise GPS; we ask for City/State.
- Contact info is deliberately held back from NGOs until explicitly approved by the child per-request via the `ContactReleaseScreen`.

## POCSO Act Notice
While HopeSpark connects children to NGOs, we strictly mandate that NGOs on the platform adhere to mandatory reporting under the Protection of Children from Sexual Offences (POCSO) Act. If a child discloses sexual abuse, the NGO must immediately inform the Special Juvenile Police Unit (SJPU) or the local police.

## AI Disclaimer
HopeSpark utilizes Anthropic Claude 3 for the "Uplift Stream" chatbot. The app's Terms of Service clearly state that the AI is not a licensed therapist or a replacement for professional psychological help, and we provide hardcoded fallbacks and crisis hotlines (1098 Childline) when triggers are detected.
