
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cd39a80231844146ae36cdd17cb235ed',
  appName: 'tasksy-connect',
  webDir: 'dist',
  server: {
    url: 'https://cd39a802-3184-4146-ae36-cdd17cb235ed.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
