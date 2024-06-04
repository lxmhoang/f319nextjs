'use server'
import { FirestoreDataConverter, WhereFilterOp, getFirestore } from "firebase-admin/firestore"
import { getCurrentUser } from "./adminauth"
// import { getas adminDB } from "./firebaseadmin"
import { didFollow } from "../utils"

import admin from "firebase-admin"
import { getApps } from "firebase-admin/app"
import { Expert, ExpertStatus, expertAdminConverter } from "@/app/model/expert"
import { User, userAdminConverter } from "@/app/model/user"
import { Transaction } from "@/app/model/transaction"
import { Subscription, subscriptionAdminConverter } from "@/app/model/subscription"
import { Prediction, predAdminConverter } from "@/app/model/prediction"


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


export async function getFollowExpertByIDList(idList: string[]) {
    var result: Expert[] = []

    for (const eid of idList) {
        const info = await serverGetModal<Expert>('expert/' + eid, expertAdminConverter)
        if (info) {
            result.push(info)
        }
    }
    return result
}
async function getActivesubscriptionOf(uid: string, eid: string) {
    let today = new Date()
    let results = await adminDB.collection("subscription").where("eid", "==", eid).where("uid", "==", uid).where('endDate', '>=', today)
        .withConverter(subscriptionAdminConverter).get();

    // console.log("result = " + results.docs.length)

    return results.docs.map(doc => {
        return doc.data()
    });
}


export async function serverAddNewModal<ModelType>(collectionPath: string, data: ModelType, converter: FirestoreDataConverter<ModelType>) {
    const predCollection = adminDB.collection(collectionPath).withConverter(converter)
    const docRef = await predCollection.add(data)
    return docRef
}

export async function serverGetModal<ModelType>(docPath: string, converter: FirestoreDataConverter<ModelType>) {
    const docRef = adminDB.doc(docPath).withConverter(converter)
    const docSnap = await docRef.get()
    return docSnap.data()
}

export async function serverCount(name: string) {
    const colRef = adminDB.collectionGroup(name)
    const snapshot = await colRef.count().get()
    return snapshot.data().count
}

export async function serverGetStat() {
    const docRef = adminDB.doc('stats/latest')
    const docSnap = await docRef.get()
    return docSnap.data() ?? {}

}

export async function serverQueryCollectionGroup<ModelType>(name: string, filters: { key: string, operator: WhereFilterOp, value: any }[], converter: FirestoreDataConverter<ModelType>) {

    console.log('filer' + JSON.stringify(filters))
    const colGroup = adminDB.collectionGroup(name)
    var q = undefined
    for (const { key, operator, value } of filters) {
        q = q ? q.where(key, operator, value) : colGroup.where(key, operator, value)
    }
    console.log('aa333a' + JSON.stringify(q))
    const snapshot = q ? await q?.withConverter(converter).get() : await colGroup.withConverter(converter).get()
    
    console.log('dddd')
    return snapshot.docs
    
}

export async function serverQueryCollection<ModelType>(path: string, filters: { key: string, operator: WhereFilterOp, value: any }[], converter: FirestoreDataConverter<ModelType>) {
    let ref = adminDB.collection(path)// query(collection(db, name));
    // console.log(filters)
    var q = undefined
    console.log('44444 ==== : ' )
    for (const { key, operator, value } of filters) {
        q = q ? q.where(key, operator, value) : ref.where(key, operator, value)
    }
    // var snapshot = undefined
    // if (!q) return {

    // }
    const snapshot = q ? await q?.withConverter(converter).get() : await ref.withConverter(converter).get()

    return snapshot.docs.map(doc => {
        return doc.data()
    })
}


export async function serverUpdateDoc(path: string, data: {}) {
    return adminDB.doc(path).update(data)
}
export async function serverSetDoc(path: string, data: {}) {
    return adminDB.doc(path).set(data)
}

export async function serverApprovePendingTrans(tranIDs: string[]) {
    const batch = adminDB.batch()
    tranIDs.forEach((id) => {
        const docRef = adminDB.doc('transaction/' + id)
        batch.update(docRef, { status: "adminApproved" })
    })
    await batch.commit()
}

export async function addANewTransaction(tran: Transaction) {
    console.log("tran ======" + JSON.stringify(tran))
    const tranCollection = adminDB.collection('transaction')//.withConverter(transConverter)
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

    await adminDB.collection('expert').doc(docId).update({ status: ExpertStatus.banned })
}


export async function activateExpert(docId: string) {
    // const ref = doc(db, 'expert', docId)
    // await updateDoc(ref, {status: ExpertStatus.activated})
    await adminDB.collection('expert').doc(docId).update({ status: ExpertStatus.activated })
}


export async function viewExpertPreds(user: User | undefined, expert: Expert | undefined) {
    if (!expert) {
        return Promise.resolve(JSON.stringify({
            needFollow: true,
            data: {
                numOfInProgress: 0,
                onTrackPreds: [],
                donePreds: []
            }
        })
        )
    }
    const getDonePredOnly = !user || !didFollow(user, expert)
    // const hideInprogressOnes = !user || (user.following[expert.id] == null && user.uid != expert.id)
    // console.log(hideInprogressOnes ? 'hide them ' : 'show them sub')
    let response = await serverQueryCollection<Prediction>('expert/' + expert.id + '/preds', [], predAdminConverter)
    // console.log('res ' + JSON.stringify(response))
    let allPreds: Prediction[] = response// JSON.parse(response)
    // console.log('allPreds ' + JSON.stringify(allPreds))
    // let data = result.docs



    // console.log('query' )
    // let q = query(collection(db, 'expert', expert.id, 'preds').withConverter(predConverter))
    // // q = getDonePredOnly ? 
    // // 		query(q, where('status',  '!=' , 'Inprogress')) 
    // // 		: 
    // // 		q

    // console.log('22222' )
    // const querySnapshot = await getDocsFromServer(q);
    // // console.log('que3333ry' )
    // const allPreds = querySnapshot.docs.map((doc) => doc.data())
    const inProgressPreds = allPreds.filter((item) => { return item.status == 'Inprogress' })
    const donePreds = allPreds.filter((item) => { return item.status != 'Inprogress' }).sort((a, b) => { return (b.dateIn.getTime() - a.dateIn.getTime()) })
    const result = {
        needFollow: getDonePredOnly,
        data: {
            numOfInProgress: inProgressPreds.length,
            onTrackPreds: getDonePredOnly ? [] : inProgressPreds,
            donePreds: donePreds
        }
    }
    console.log('result ' + JSON.stringify(result))
    return JSON.stringify(result)

}


const ADMIN_APP_NAME = "stock-319-admin";

const adminApp = createFirebaseAdminApp()
const adminDB = getFirestore(adminApp)

// adminDB.settings({ ignoreUndefinedProperties: true })

function formatPrivateKey(key: string) {
    console.log("key : " + key)
    return key ? key.replace(/\\n/g, "\n") : "aa"
}
function createFirebaseAdminApp() {

    const result = getApps().find((it) => it.name === ADMIN_APP_NAME)
    if (result) {
        return result
    }


// use emulator
    if (process.env.USE_EMULATOR == 'true') {
        console.log('admin fire store connecting to emulator')
        process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
        process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
        process.env['KEY_GCLOUD_PROJECT'] = 'stock319-f3905';
    } else {
        console.log('admin fire store NOT connecting to emulator ' + process.env.USE_EMULATOR + process.env.KEY_MEASUREMENT_ID)

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
