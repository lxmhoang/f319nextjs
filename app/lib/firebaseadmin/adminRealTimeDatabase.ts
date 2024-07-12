import { getDatabase } from "firebase-admin/database"
import { createFirebaseAdminApp } from "./adminApp"

const adminApp = createFirebaseAdminApp()
const adminRTDB = getDatabase(adminApp)

export async function databaseAddDoc(path: string, data: {}) {
    const ref = adminRTDB.ref(path);
    const newRef = await ref.push(data)
    newRef.set(data)
    return newRef
}
export async function databaseSetDoc(path: string, data: {}) {
    console.log('database set doc with path: ' + path)
    const ref = adminRTDB.ref(path);
    console.log('database DONE doc with path: ' + path)
    await ref.set(data)
}
export async function databaseUpdateDoc(path: string, data: {}) {
    const ref = adminRTDB.ref(path);
     await ref.update(data)
}

export async function databaseGetDoc(path: string) {
    const ref = adminRTDB.ref(path);
    const snap =  await ref.once('value')
    return snap.val()
}