'use server'
'server-only'
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { createFirebaseAdminApp } from "./adminApp";
import { redirect } from "next/navigation";
import { refreshToken } from "../client";


export async function getSession() {
    try {
        return cookies().get("__session")?.value;
    } catch (error) {
        return undefined;
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

export async function setClaim(uid: string, data: any) {

    const _session = await getSession();
    if (_session) {

        const decodedIdToken = await getAuth(adminApp).verifySessionCookie(_session);
        data.expertType = data.expertType ?? decodedIdToken["expertType"]
        data.expertPeriod = data.expertPeriod ?? decodedIdToken["expertPeriod"]
        data.expertExpire = data.expertExpire ?? decodedIdToken["expertExpire"]
        data.rankExpire = data.rankExpire ?? decodedIdToken["rankExpire"]
        await getAuth(adminApp).setCustomUserClaims(uid, data)
    } else {
        throw new Error('_session not found while setClaims')
    }


}



export async function getUserInfoFromSession(session: string | undefined = undefined) {
    // throw new Error('auth/session-cookie-expired')
    const _session = session ?? (await getSession());
    if (!_session) return undefined
    try {
        const decodedIdToken = await getAuth(adminApp).verifySessionCookie(_session, true);
        const expertPeriod = decodedIdToken["expertPeriod"]
        const expertExpire = decodedIdToken["expertExpire"]
        const rankExpire = decodedIdToken["rankExpire"]
        const isExpert = expertExpire ?
            Number(expertExpire) > Date.now()
            :
            false
        const isRank = rankExpire ?
            rankExpire > Date.now()
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
    } catch (e : any) {
        throw Error(e.code ?? "no error code")
    }
}

export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
    console.log('createSessionCookie ')
    const cookie = getAuth(adminApp).createSessionCookie(idToken, sessionCookieOptions);
    return cookie
}

export async function revokeAllSessions(session: string) {
    const decodedIdToken = await getAuth(adminApp).verifySessionCookie(session);

    return await getAuth(adminApp).revokeRefreshTokens(decodedIdToken.sub);
}


const adminApp = createFirebaseAdminApp()

