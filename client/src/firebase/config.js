import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase credentials configured for eduverse-e0eb4
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAUQ24yVn6M6NhCJHL19fw8YYkmkPYV3mo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eduverse-e0eb4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eduverse-e0eb4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eduverse-e0eb4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "942069506724",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:942069506724:web:577b70a0fbb11096513c31",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-N5HNSHQYX2"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics conditionally
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { 
  app, 
  auth, 
  db, 
  storage, 
  analytics,
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  sendPasswordResetEmail,
  signInWithPopup
};
