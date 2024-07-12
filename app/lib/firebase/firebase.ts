
import { getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage, } from "firebase/storage";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.KEY_MEASUREMENT_ID
};

const useEmulator = process.env.USE_EMULATOR == 'true'

export const clientApp = createFirebaseApp();
export const auth = getAuth(clientApp);
export const db = getFirestore(clientApp);
export const rtDB = getDatabase(clientApp)
export const storage = getStorage(clientApp);
export const cloudFunc = getFunctions(clientApp);


function createFirebaseApp() {
  const result = getApps().find((it) => it.name === '[DEFAULT]')
  if (result) {
    return result
  }
  return initializeApp(firebaseConfig)
}


// cu phai set if (true) moi duoc, ko dung useEmulator duoc ,ko hieu tai sao !!!!

if (false) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}

if (useEmulator) {
  console.log(' firebase connecting to emulator')
  connectDatabaseEmulator(rtDB, '127.0.0.1', 9000 )
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectStorageEmulator(storage, '127.0.0.1', 9199)
  connectFunctionsEmulator(cloudFunc, '127.0.0.1', 5001)
} else {
  console.log(' firebase NOT connecting to emulator' + process.env.USE_EMULATOR + '___' + process.env.KEY_MEASUREMENT_ID)
}