import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lobangoAdmin.com",
  appName: "admin",
  webDir: "dist",
  server: {
    url: "https://adminlobango.vercel.app",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0d0b09",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
