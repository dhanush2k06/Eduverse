import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';
dotenv.config();

let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;
let firebaseStorage = null;
let isMockMode = false;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
    });
    firestoreDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    console.log('[Firebase Admin] Successfully initialized with service account.');
  } else if (process.env.FIREBASE_PROJECT_ID) {
    firebaseApp = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    firestoreDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    console.log('[Firebase Admin] Initialized with project ID:', process.env.FIREBASE_PROJECT_ID);
  } else {
    isMockMode = true;
    console.log('[Firebase Admin] No Firebase credentials provided. Operating in development hybrid mode with full mock database.');
  }
} catch (error) {
  console.warn('[Firebase Admin] Notice during Firebase Admin initialization, falling back to hybrid mode:', error.message);
  isMockMode = true;
}

export {
  firebaseApp,
  firestoreDb,
  firebaseAuth,
  firebaseStorage,
  isMockMode
};
