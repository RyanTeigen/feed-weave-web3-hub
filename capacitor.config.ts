
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0a8d9374ec724b83ba5361c0c5d66c74',
  appName: 'feed-weave-web3-hub',
  webDir: 'dist',
  server: {
    url: 'https://0a8d9374-ec72-4b83-ba53-61c0c5d66c74.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0891b2',
      showSpinner: false
    }
  }
};

export default config;
