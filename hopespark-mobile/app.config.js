// Dynamic Expo config — reads .env and exposes ANTHROPIC_API_KEY
// via Constants.expoConfig.extra in the app.
//
// To use: rename this file to app.config.js (or keep app.json for static fields).
// expo-constants reads from expoConfig.extra at runtime.

import 'dotenv/config';

export default {
  expo: {
    name: 'HopeSpark',
    slug: 'hopespark',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1D9E75',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1D9E75',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    // ─── API keys exposed to app via expo-constants ───
    extra: {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? '',
    },
  },
};
