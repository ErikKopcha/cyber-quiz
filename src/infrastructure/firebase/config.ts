// Firebase Configuration and Initialization
// This file initializes Firebase app and exports auth and firestore instances

import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_key_here' &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id'
  );
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Only initialize if Firebase is configured
if (isFirebaseConfigured()) {
  try {
    // Check if Firebase has already been initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);

    // Initialize Firestore - disable persistence temporarily to debug
    // FIXME: Re-enable persistence after fixing offline issues
    db = getFirestore(app);

    // Set Firebase Auth persistence to local storage (survives page refresh)
    if (typeof window !== 'undefined' && auth) {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          console.log('✅ Firebase Auth persistence enabled (localStorage)');
        })
        .catch((error) => {
          console.error('❌ Firebase Auth persistence error:', error);
        });
    }

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  console.warn(
    '⚠️ Firebase not configured. Please add credentials to .env.local to enable authentication.'
  );
}

// Export with null checks - consuming code must handle null case
export { app, auth, db };
