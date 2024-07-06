'use server'
'server-only'
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

import admin from "firebase-admin"
import { getApps } from "firebase-admin/app";

export async function getSession() {
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

    try {
        const isRevoked = !(await auth.verifySessionCookie(_session, false));
        return !isRevoked;
    } catch (error) {
        console.log("error verifying session" + error);
        return false;
    }
}

export async function getSoloGod() {

    const auth = getAuth(adminApp)
    try {
        const userRecord = await auth.getUserByEmail('lxmhoang@gmail.com')
        return userRecord.uid
    } catch (e) {
        return undefined
    }
}

export async function getthuquyUID() {
    // if (process.env.THUQUY_UID) {
    //     return process.env.THUQUY_UID
    // }

    const auth = getAuth(adminApp)
    try {
        const userRecord = await auth.getUserByEmail('lxmhoang@gmail.com')
        return userRecord.uid
    } catch (e) {
        return undefined
    }
}

export async function setClaim(uid: string, data: {}) {
    const auth = getAuth(adminApp)

    await auth.setCustomUserClaims(uid, data)
}



export async function getUserInfoFromSession(session: string | undefined = undefined) {
    const _session = session ?? (await getSession());
    if (!_session) return undefined

    try {
        const decodedIdToken = await getAuth(adminApp).verifySessionCookie(_session, true);
        const expertPeriod = decodedIdToken["expertPeriod"]
        const expertExpire = decodedIdToken["expertExpire"]
        const rankExpire = decodedIdToken["rankExpire"]
        console.log(' ==== rank expire ==== ' + rankExpire)
        const isExpert = expertExpire ? 
            new Date(Number(expertExpire)) > new Date()
            : 
            false
        const isRank = rankExpire ? 
         rankExpire > new Date()
            : 
            false
        const data = {
            authenticated: true,
            uid: decodedIdToken.uid,
            isAdmin: decodedIdToken.email == 'lxmhoang@gmail.com',
            isExpert: isExpert,
            isRank: isRank,

            expertType: decodedIdToken["expertType"],
            expertPeriod: expertPeriod,
            expertExpire: new Date(Number(expertExpire)),

            avatarURL: decodedIdToken.picture
        }

        console.log(' result of getUserInfoFromSession : ' + JSON.stringify(data))

        return data;
    } catch (error) {
        console.log("222 error verifying session   " + error);
        return undefined
    }



}

export async function getCurrentUserId() {
    const session = await getSession();
    if (!(await isUserAuthenticated(session))) {
        return null;
    }

    const decodedIdToken = await getAuth(adminApp).verifySessionCookie(session!);
    return decodedIdToken.uid
}

export async function getCurrentUser() {

    const uid = await getCurrentUserId()
    if (uid) {
        const currentUser = await getAuth(adminApp).getUser(uid);
        return currentUser
    } else {
        return null
    }
}

export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
    return getAuth(adminApp).createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
    const decodedIdToken = await getAuth(adminApp).verifySessionCookie(session);

    return await getAuth(adminApp).revokeRefreshTokens(decodedIdToken.sub);
}


const ADMIN_APP_NAME = "stock-319-admin";


// use emulator
if (process.env.USE_EMULATOR == 'true') {
    console.log('admin AUTH connecting to emulator')
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
    process.env['KEY_GCLOUD_PROJECT'] = 'stock319-f3905';
} else {
    console.log('admin AUTH NOT connecting to emulator' + process.env.USE_EMULATOR)

}

const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    clientEmail: process.env.KEY_FIREBASE_CLIENT_EMAIL as string,
    privateKey: process.env.KEY_FIREBASE_PRIVATE_KEY as string
}

function formatPrivateKey(key: string) {
    // console.log("key : " + key)
    return key ? key.replace(/\\n/g, "\n") : "aa"
}

const adminApp = createFirebaseAdminApp()


function createFirebaseAdminApp() {

    const result = getApps().find((it) => it.name === ADMIN_APP_NAME)
    if (result) {
        return result
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


