import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey || "AIzaSyDu5mRRHdXKPnQHnI8wx-bGrZyFxbyAOIs",
  authDomain: import.meta.env.VITE_authDomain || "swift-tasks-87d89.firebaseapp.com",
  projectId: import.meta.env.VITE_projectId || "swift-tasks-87d89",
  storageBucket: import.meta.env.VITE_storageBucket || "swift-tasks-87d89.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_messagingSenderId || "390291551341",
  appId: import.meta.env.VITE_appId || "1:390291551341:web:3aa286441a7e1d8bdebb64",
};

// Initialize Firebase only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;