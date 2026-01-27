import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.desencostae.app',
  appName: 'Desencostaê',
  webDir: 'dist',
  server: {
    // For development with hot-reload, uncomment below:
    // url: 'https://201a04a3-125e-4207-8ddd-24b78dbf5673.lovableproject.com?forceHideBadge=true',
    // cleartext: true,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#7C3AED',
      sound: 'notification.wav',
    },
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
