# HopeSpark Production Runbook

This document is the "source of truth" for production operations and maintenance of the HopeSpark ecosystem.

## Environment Variables

### React Native App (Expo)
- `EXPO_PUBLIC_SUPABASE_URL`: URL of your production Supabase project
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous API key
- `HOPESPARK_API_BASE`: URL of the deployed Next.js backend (e.g., `https://api.hopespark.in`)
- `HOPESPARK_SYNC_TOKEN`: Secure shared secret between the app and the backend API

### Next.js Backend & Dashboard
- `NEXT_PUBLIC_SUPABASE_URL`: URL of your production Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous API key
- `SUPABASE_SERVICE_ROLE_KEY`: Admin API key for backend operations (NEVER expose to the client)
- `HOPESPARK_SYNC_TOKEN`: Match the token configured in the mobile app
- `NEXTAUTH_SECRET`: Random string for encrypting JWT auth cookies
- `NEXTAUTH_URL`: Canonical URL of the dashboard (`https://admin.hopespark.in`)

## Deployment Strategy

### 1. Database Migrations
Always deploy Supabase changes using the CLI before updating applications:
`npx supabase db push`

### 2. Next.js Web Application
Hosted on Vercel:
1. Push to the `main` branch.
2. Vercel automatically creates a production build.
3. Verify the deployment at URL.

### 3. Mobile Client 
Built with Expo Application Services (EAS):
- Trigger an EAS Build for Android: `eas build --platform android --profile production`
- Trigger an EAS Build for iOS: `eas build --platform ios --profile production`
- Pushing Over-the-Air (OTA) Updates for minor JS changes: `eas update --branch production --message "Fix typoes"`

## Incident Triggers

### A. Spike in Crisis Flags
**Symptom:** Unusually high volume of `crisis_flags` generated in Supabase.
**Action:** 
1. Check Anthropic API limits and latency (System might be defaulting to fallbacks because of missing API keys, causing users to trigger more rigid fallback regex rules).
2. Validate the Moderation Queue on the dashboard for true vs false positives.

### B. Push Notifications Failing
**Symptom:** Expo push tokens show as registered but NGOs report users aren't receiving updates.
**Action:** 
1. Check `notification_log` table for success/failure status.
2. Ensure Vercel background workers or webhooks aren't timing out (Vercel Hobby has 10s limits, Pro has 15s).

## Scheduled Maintenance
- **Data Pruning:** To comply with DPDP Act 2023, run scripts monthly to prune cases marked as `resolved` for over 90 days, stripping all identifiable info but keeping broad analytics.
- **NGO Audits:** Quarterly verify the active NGO list against updated NGO Darpan registries.
