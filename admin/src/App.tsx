import { App as CapacitorApp } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { SplashScreen } from '@capacitor/splash-screen';
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { routeTree } from "./routeTree.gen";


function App() {

  SplashScreen.hide();


  const router = createRouter({ routeTree })

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

  return (
    <>
      <RouterProvider router={router} />
    </>
  )

}

export default App;
