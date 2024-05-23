
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage, } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.KEY_MEASUREMENT_ID
};

export const clientApp = initializeApp(firebaseConfig);
export const auth = getAuth(clientApp);
export const db = getFirestore(clientApp);
export const storage = getStorage(clientApp);
export const cloudFunc = getFunctions(clientApp);

// const useEmulator = process.env.USE_EMULATOR as string;

if (false) {

  console.log('connecting to emulator')
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', {disableWarnings: true})
  connectStorageEmulator(storage,  '127.0.0.1', 9199)
  connectFunctionsEmulator(cloudFunc, '127.0.0.1', 5001)
}