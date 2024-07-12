'use server'
import { FieldValue, FirestoreDataConverter, WhereFilterOp, getFirestore } from "firebase-admin/firestore"
import { getCurrentUser, getUserInfoFromSession, getthuquyUID, setClaim } from "./adminauth"
// import { getas adminDB } from "./firebaseadmin"
import { didFollow } from "../utils"

import admin, { auth } from "firebase-admin"
import { getApps } from "firebase-admin/app"
import { Expert, ExpertStatus, expertAdminConverter } from "@/app/model/expert"
import { User, userAdminConverter } from "@/app/model/user"
import { TranType, Transaction } from "@/app/model/transaction"
import { Subscription, subscriptionAdminConverter } from "@/app/model/subscription"
import { Prediction, predAdminConverter } from "@/app/model/prediction"
import { getDatabase } from "firebase-admin/database"
import { createFirebaseAdminApp } from "./adminApp"


export async function firestoreAddNewModal<ModelType>(collectionPath: string, data: ModelType, converter: FirestoreDataConverter<ModelType>) {
    const collection = adminDB.collection(collectionPath).withConverter(converter)
    const docRef = await collection.add(data)
    return docRef
}


export async function firestoreCountModal(collectionName: string) {
    const colRef = adminDB.collectionGroup(collectionName)

    const snapshot = await colRef.count().get()
    return snapshot.data().count
}

export async function firestoreGetRaw<ModelType>(docPath: string) {
    const docRef = adminDB.doc(docPath)
    const docSnap = await docRef.get()
    return docSnap.data()
}

export async function firestoreGetModal<ModelType>(docPath: string, converter: FirestoreDataConverter<ModelType>) {
    const docRef = adminDB.doc(docPath).withConverter(converter)
    const docSnap = await docRef.get()
    return docSnap.data()
}

export async function firestoreBatchUpdate(refs: string[], data: {}) {
    const batch = adminDB.batch()
    refs.forEach((ref) => {
        const docRef = adminDB.doc(ref)
        batch.update(docRef, data)
    })
    await batch.commit()

    
}

export async function firestoreQueryCollectionGroup<ModelType>(name: string, filters: { key: string, operator: WhereFilterOp, value: any }[], converter: FirestoreDataConverter<ModelType>) {

    console.log('filer' + JSON.stringify(filters))
    const colGroup = adminDB.collectionGroup(name)
    var q = undefined
    for (const { key, operator, value } of filters) {
        q = q ? q.where(key, operator, value) : colGroup.where(key, operator, value)
    }
    console.log('aa333a' + JSON.stringify(q))
    const snapshot = q ? await q?.withConverter(converter).get() : await colGroup.withConverter(converter).get()
    
    console.log('dddd' + JSON.stringify(snapshot))
    return snapshot.docs
    
}

export async function firestoreQueryCollection<ModelType>(path: string, filters: { key: string, operator: WhereFilterOp, value: any }[], converter: FirestoreDataConverter<ModelType>, limit = 50, orderBy?: string) {
    let ref = adminDB.collection(path)
    var q = undefined
    for (const { key, operator, value } of filters) {
        q = q ? q.where(key, operator, value) : ref.where(key, operator, value)
    }
    if (orderBy) {
        if (q) {
            q = q.orderBy(orderBy)
        } else {
            q = ref.orderBy(orderBy)
        }

    }
    if (limit) {
        if (q) {
            q = q.limit(limit)
        } else {
            q = ref.limit(limit)
        }
    }
    const snapshot = q ? await q?.withConverter(converter).get() : await ref.withConverter(converter).get()
    // console.log('====firestoreQueryCollection result =====' + JSON.stringify(snapshot.docs))
    return snapshot.docs.map(doc => {
        return doc.data()
    })
}


export async function firestoreUpdateDoc(path: string, data: {}) {
    return adminDB.doc(path).update(data)
}

export async function firestoreSetDoc(path: string, data: {}, merge = false) {
    return adminDB.doc(path).set(data, { merge: merge })
}



const adminDB = getFirestore(createFirebaseAdminApp())

