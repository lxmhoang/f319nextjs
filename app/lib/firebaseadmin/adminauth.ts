'use server'
'server-only'
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

import admin from "firebase-admin"
import { getApps } from "firebase-admin/app";
// import { adminApp, adminAuth } from "./firebaseadmin";



async function getSession() {
    try {
        return cookies().get("__session")?.value;
    } catch (error) {
        return undefined;
    }
}

async function isUserAuthenticated(session: string | undefined = undefined) {
    const _session = session ?? (await getSession());
    if (!_session) return false;

    const auth = getAuth(adminApp)
    console.log("3333")
    console.log("session : " + _session)

    try {
        const isRevoked = !(await auth.verifySessionCookie(_session, false));
        return !isRevoked;
    } catch (error) {
        console.log("zzz" + error);
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

    console.log("firebase admin cur User " + JSON.stringify(currentUser))

    return currentUser;
}

export async function getUidFromIdToken(idtoken: string) {
    const decodedIdToken = await adminAuth.verifyIdToken(idtoken)
    const uid = decodedIdToken.uid
    return uid
}


export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
    return getAuth(adminApp).createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
    const decodedIdToken = await getAuth(adminApp).verifySessionCookie(session);

    return await getAuth(adminApp).revokeRefreshTokens(decodedIdToken.sub);
}


const ADMIN_APP_NAME = "stock-319";

const adminApp = createFirebaseAdminApp()
const adminAuth = getAuth(adminApp)

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
    console.log('use emulator ' + useEmulator)

    if (true) {
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

    // console.log('fire base admin params : ' + JSON.stringify(params))

    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId: params.projectId,
            clientEmail: params.clientEmail,
            privateKey: formatPrivateKey(params.privateKey),
        }),
    }, ADMIN_APP_NAME);
}