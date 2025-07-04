import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 🔐 Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyBIm498LNCbEUlatGp4k6JQXOrrUI0SjFE",
    authDomain: "erice-241012.firebaseapp.com",
    projectId: "erice-241012",
    appId: "1:834341780860:android:2a62736e85889c243cb8f9",
    databaseURL: "https://erice-241012.firebaseio.com",
    storageBucket: "erice-241012.firebasestorage.app",
    messagingSenderId: "834341780860",
  };

// ✅ Initialize Firebase once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized');
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
