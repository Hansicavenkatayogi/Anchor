# HopeSpark Launch Guide

This document outlines the final checklist before submitting the HopeSpark suite (Mobile App + Web Dashboard) to production.

## 1. Web Dashboard (Vercel)
- [ ] Connect the Vercel project to your GitHub repository.
- [ ] Add all production environment variables securely in Vercel Settings.
- [ ] Assign a custom domain (e.g., `admin.hopespark.in`).
- [ ] Validate NextAuth with secure `NEXTAUTH_SECRET`.

## 2. Supabase (Database)
- [ ] Push local schema to production: `supabase db push --db-url <production_url>`
- [ ] Ensure RLS (Row Level Security) policies are properly activated. The Admin portal runs via the Server-Side using `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS securely.
- [ ] Verify that real-time subscriptions are enabled for `cases` and `aid_offers` tables.

## 3. Expo Mobile App
- [ ] Ensure `app.json` has correct package id (`in.hopespark.app`) and appropriate versioning.
- [ ] Make sure correct icons (`assets/icon.png`) and splash screens (`assets/splash.png`) are included. 
- [ ] Run an internal EAS Build to test locally on physical devices before store submission.
  - Test the Push Notification flow.
  - Test the DPDP Consent flow.

## 4. App Store Submission (Apple)
- [ ] Create App ID in Developer Portal.
- [ ] Provide screenshots (don't show dummy PII).
- [ ] Answer the Age Rating questionnaire. (Marked 12+ for sensitive topics).
- [ ] Provide Privacy Policy link.
- [ ] Submit for review. Note: Apple might scrutinize the anonymous nature; clearly document it is for child safety in the reviewer notes.

## 5. Play Store Submission (Google)
- [ ] Create App via Play Console.
- [ ] Ensure `google-services.json` is correctly attached for push notifications.
- [ ] Fill out the Data Safety form corresponding exactly to our DPDP compliance.
- [ ] Upload Android App Bundle (AAB).

## Go-Live
Once approved by stores, ensure the `HOPESPARK_SYNC_TOKEN` is rotated away from the development placeholder to a cryptographically secure 256-bit key.
