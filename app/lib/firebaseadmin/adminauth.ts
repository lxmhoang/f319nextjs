'use server'
'server-only'
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { createFirebaseAdminApp } from "./adminApp";


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

export async function getthuquyUID() {
    // if (process.env.THUQUY_UID) {
    //     return process.env.THUQUY_UID
    // }
    // const thuquyuid = process.env.THU_QUY_UID as string
    // if (thuquyuid) {
    //     console.log('thu quy uid ' + thuquyuid + 'lay tu env var ====== ')
    //     return thuquyuid
    // }

    // console.log('thu quy uid by email ')
    const auth = getAuth(adminApp)
    try {
        const userRecord = await auth.getUserByEmail('lxmhoang@gmail.com')

        console.log('thu quy uid got ' + JSON.stringify(userRecord))
        return userRecord.uid
    } catch (e) {
        console.log('error ' + JSON.stringify(e))
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
    console.log('zzzzz ' )
    const cookie =  getAuth(adminApp).createSessionCookie(idToken, sessionCookieOptions);
    return cookie
}

export async function revokeAllSessions(session: string) {
    const decodedIdToken = await getAuth(adminApp).verifySessionCookie(session);

    return await getAuth(adminApp).revokeRefreshTokens(decodedIdToken.sub);
}


const adminApp = createFirebaseAdminApp()

