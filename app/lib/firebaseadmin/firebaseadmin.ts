'use server' // must have this to read env variable


import admin from "firebase-admin"
import { cookies } from "next/headers";
import { getAuth, SessionCookieOptions } from "firebase-admin/auth";
import { getApps, initializeApp, cert } from "firebase-admin/app"
import { DocumentData, Filter, FirestoreDataConverter, getFirestore, Query, QueryDocumentSnapshot, WithFieldValue } from "firebase-admin/firestore";
import { ExpertStatus, predConverter, User, Expert, subscriptionConverter, Transaction, Subscription, Prediction } from "../definitions";
import { expertAdminConverter, predAdminConverter, subscriptionAdminConverter, userAdminConverter } from "./adminconverter";

const ADMIN_APP_NAME = "stock-319";

const adminApp = createFirebaseAdminApp()
const db = getFirestore(adminApp)
const auth = getAuth(adminApp)

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

    if (false) {
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

    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId: params.projectId,
            clientEmail: params.clientEmail,
            privateKey: formatPrivateKey(params.privateKey),
        }),
    }, ADMIN_APP_NAME);
}

export async function getUidFromIdToken(idtoken: string) {
    const decodedIdToken = await auth.verifyIdToken(idtoken)
    const uid = decodedIdToken.uid
    return uid
}

// export async function getUserClaims(uid: string, email?: string | null) {
//     const userRecord = await auth.getUser(uid)
//     var claim = userRecord.customClaims ?? {}

//     if (email && email == 'lxmhoang@gmail.com') {
//         console.log("return admin---" + uid)
//         claim.isAdmin = true
//         claim.isExpert = true
//     }
//     return claim
// }

export async function serverAddNewModal<ModelType>(collectionPath: string, data: ModelType, converter: FirestoreDataConverter<ModelType>) {
	const predCollection = db.collection(collectionPath).withConverter(converter)
	const docRef = await predCollection.add(data)
	return docRef
}

export async function serverGetModal<ModelType>(docPath: string, converter: FirestoreDataConverter<ModelType>) {
    const docRef = db.doc(docPath).withConverter(converter)
    const docSnap = await docRef.get()
    return docSnap.data()
}

export async function serverQueryCollection<ModelType>(path: string, filters : {}, converter: FirestoreDataConverter<ModelType>) {
	let ref = db.collection(path)// query(collection(db, name));
    var q = undefined
    for (const [key,value] of Object.entries(filters)) {
         q =  q ? q.where(key, '==' , value) : ref.where(key,'==',value)
    }
    if (!q) return []
    const snapshot = await q?.withConverter(converter).get()
    
     return snapshot.docs.map(doc => {
        return doc.data()
    })
}

// export async function getAUserByIDBE(id: string) {
//     const docRef = db.collection('user').doc(id).withConverter(userAdminConverter)
//     const docSnap = await docRef.get()
//     var user = docSnap.data()
//     return user
// }

export async function getTotalPredOfExpert(eid: string) {
    const expertData = await getAnExpertById(eid)
    return expertData && expertData.preds ? expertData.preds.length : 0
}

// export async function updateUser(uid: string, data: {}) {
    
//     const docRef = db.collection('user').doc(uid)
//     return  docRef.update(data)

// }

export async function serverUpdateDoc(path: string, data:{}) {
    return db.doc(path).update(data)
}
export async function serverSetDoc(path: string, data:{}) {
    return db.doc(path).set(data)
}


async function getAnExpertById(id: string) {

    const docRef = db.collection('expert').doc(id).withConverter(expertAdminConverter);

    const docSnap = await docRef.get()
    var expert = docSnap.data()
    if (expert) {
        const predRef = db.collection("expert/" + id + "/preds").withConverter(predAdminConverter)

        let preds = (await predRef.get()).docs.map(doc => doc.data())
        expert.preds = preds
    }

    return expert
}

export async function subcribleToAnExpert(eid: string, perm: boolean) {

    const currentUser = await getCurrentUser()

    if (currentUser == null) {
        return Promise.resolve({
            success: false,
            error: "not authorized"
        })
    }

    const user = await serverGetModal<User>('user/' + currentUser.uid, userAdminConverter)
    if (user == undefined) {
        return Promise.resolve({
            success: false,
            error: "khong ton tai user"
        })
    }

    const expertToSub = await serverGetModal<Expert>('expert/' + eid, expertAdminConverter)

    if (expertToSub == undefined) {
        return Promise.resolve({
            success: false,
            error: "khong tim thay expert"
        })
    }

    if (expertToSub.id == user.uid) {
        return Promise.resolve({
            success: false,
            error: "user va expert la chung 1 nguoi"
        })

    }

    const fee = perm ? expertToSub.permPrice : expertToSub.monthlyPrice

    if (user.amount < fee) {
        return Promise.resolve({
            success: false,
            error: "khong du tien , chi co " + user.amount + " , can : " + fee
        })
    }


    const existingSub = await getActivesubscriptionOf(user.uid, eid)
    if (existingSub.length > 0) {
        return Promise.resolve({
            success: false,
            error: "Subscription da ton tai"
        })

    }

    const tran: Transaction = {
        tranType: "subTran",
        toUid: expertToSub.id,
        fromUid: user.uid,
        amount: Number(fee),
        status: "Done",
        notebankacc: "",
        date: new Date()
    }

    const result = await addANewTransaction(tran)
    if (result.success == false) {
        return Promise.resolve({
            success: false,
            error: result.message
        })
    }

    // const subCollection = db.collection('subscription/').withConverter(subscriptionAdminConverter)
    if (user) {
        const newSub: Subscription = {
            uid: user.uid,
            eid: eid,
            startDate: new Date(),
            perm: perm,
            value: fee
        }
        console.log('adding new sub' + JSON.stringify(newSub))
        await serverAddNewModal<Subscription>('subscription/', newSub, subscriptionAdminConverter)// subCollection.add(newSub)

        return {
            success: true,
            error: ""
        }
    } else {
        return {
            error: "unauthorized",
            success: false
        }
    }
}


async function getActivesubscriptionOf(uid: string, eid: string) {
    let today = new Date()
    let results = await db.collection("subscription").where("eid", "==", eid).where("uid", "==", uid).where('endDate','>=', today)
    .withConverter(subscriptionAdminConverter).get();

    console.log("result = " + results.docs.length )

    return results.docs.map(doc => {
        return doc.data()
    });
}


export async function addANewTransaction(tran: Transaction) {
    console.log("tran ======" + JSON.stringify(tran))
    const tranCollection = db.collection('transaction')//.withConverter(transConverter)
    try {
        const docRef = await tranCollection.add(tran)
        return {
            success: true,
            error: null,
            message: docRef.path
        }

        docRef.path
    } catch (e) {
        return {
            success: false,
            error: e,
            message: 'something wrong adding transaction' + JSON.stringify(e)
        }
    }
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


export async function serverApprovePendingTrans(tranIDs: string[]) {
	const batch = db.batch()
	tranIDs.forEach((id) => {
		const docRef = db.doc('transaction/'+ id)
		batch.update(docRef, { status: "adminApproved" })
	})
	await batch.commit()
}