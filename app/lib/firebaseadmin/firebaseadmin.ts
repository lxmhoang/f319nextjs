'use server' // must have this to read env variable


import admin from "firebase-admin"
import { cookies } from "next/headers";
import { getAuth, SessionCookieOptions } from "firebase-admin/auth";
import { getApps, initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore";
import { ExpertStatus } from "../definitions";

const ADMIN_APP_NAME = "stock-319";

const adminApp =  createFirebaseAdminApp()

function formatPrivateKey(key: string) {
  console.log("key : " + key)
  return key ? key.replace(/\\n/g, "\n") : "aa"
}
 function createFirebaseAdminApp() {

  const result = getApps().find((it) => it.name === ADMIN_APP_NAME)
  if (result) {
    return result
  }
  

  const useEmulator = process.env.USE_EMULATOR as string;


  if (useEmulator == "enabled") {
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
    process.env['KEY_GCLOUD_PROJECT'] = 'stock319-f3905';
  }

  const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    clientEmail: process.env.KEY_FIREBASE_CLIENT_EMAIL as string,
    privateKey: process.env.KEY_FIREBASE_PRIVATE_KEY as string
  }




  return initializeApp({
      credential: admin.credential.cert({
        projectId: params.projectId,
        clientEmail: params.clientEmail,
        privateKey: formatPrivateKey(params.privateKey),
      }),
  }, ADMIN_APP_NAME);
}



export async function getUserClaims(uid: string, email?: string | null) {
  const auth = getAuth(adminApp)
  const userRecord = await auth.getUser(uid)
  var claim = userRecord.customClaims ?? {}

  if (email && email == 'lxmhoang@gmail.com') {
    console.log("return admin---" + uid)
    claim.isAdmin = true
    claim.isExpert = true
  }
  return claim
}


 export async function banExpert(docId: string) {
  
  await getFirestore(adminApp).collection('expert').doc(docId).update({ status: ExpertStatus.banned })
}


export async function activateExpert(docId: string) {
  // const ref = doc(db, 'expert', docId)
  // await updateDoc(ref, {status: ExpertStatus.activated})
  await getFirestore(adminApp).collection('expert').doc(docId).update({ status: ExpertStatus.activated })
}


interface FirebaseAdminAppParams {
  projectId: string
  clientEmail: string
  storageBucket: string
  privateKey: string
}

export async function isUserAuthenticated(session: string | undefined = undefined) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await getAuth(adminApp).verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }

  const decodedIdToken = await getAuth(adminApp).verifySessionCookie(session!);
  const currentUser = await getAuth(adminApp).getUser(decodedIdToken.uid);

  return currentUser;
}

async function getSession() {
  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    return undefined;
  }
}

export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
  return getAuth(adminApp).createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await getAuth(adminApp).verifySessionCookie(session);

  return await getAuth(adminApp).revokeRefreshTokens(decodedIdToken.sub);
}
