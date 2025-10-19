import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#1a1625' });
  SplashScreen.hide();
}

createRoot(document.getElementById("root")!).render(<App />);
