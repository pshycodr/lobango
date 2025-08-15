import { App as CapacitorApp } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { SplashScreen } from '@capacitor/splash-screen';
import { useEffect } from "react";

function App() {

  SplashScreen.hide(); 
  
  document.body.style.backgroundImage = 'none';
  document.body.style.background = 'var(--eerie-black-2)'; 
  
  useEffect(() => {
    let listener: PluginListenerHandle;
  
    (async () => {
      listener = await CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack || window.history.length > 1) {
          window.history.back();
        } else {
          CapacitorApp.exitApp();
        }
      });
    })();
  
    return () => {
      listener?.remove();
    };
  }, []);

  document.addEventListener('copy', e => {
    e.preventDefault();
    e.clipboardData?.setData('text/plain', window.getSelection()?.toString() || '');
  });
  
}

export default App;
