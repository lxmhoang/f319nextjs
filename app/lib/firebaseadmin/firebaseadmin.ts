'use server' // must have this to read env variable

import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth";
import { getApps, initializeApp } from "firebase-admin/app"
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
  
  console.log("zzzz" + JSON.stringify(process.env))

  const useEmulator = process.env.USE_EMULATOR;

  if (useEmulator) {
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



  // if (admin.apps.length > 0) {
  //   const app = admin.app()

  //   console.log("have existing app");
  //   return app
  // }
  // console.log("create new app");
  // const cert = admin.credential.cert({
  //   projectId: params.projectId,
  //   clientEmail: params.clientEmail,
  //   privateKey: privateKey,
  // })

  // return admin.initializeApp({
  //   credential: cert,
  //   projectId: params.projectId,
  //   storageBucket: params.storageBucket,
  // })

}


// export async function initAdmin() {


//   createFirebaseAdminApp(params)
// }

export async function getUserClaims(uid: string, email?: string | null) {
  // initAdmin()
  // return {
  //   testenv: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  //   isAdmin: true
  // }

  const app = createFirebaseAdminApp()
  const auth = getAuth(app)
  const userRecord = await auth.getUser(uid)
  var claim = userRecord.customClaims ?? {}

  if (email && email == 'lxmhoang@gmail.com') {
    console.log("return admin---" + uid)
    claim.isAdmin = true
  }
  return claim
}


 export async function banExpert(docId: string) {
  await getFirestore(createFirebaseAdminApp()).collection('expert').doc(docId).update({ status: ExpertStatus.banned })
}


export async function activateExpert(docId: string) {
  await getFirestore(createFirebaseAdminApp()).collection('expert').doc(docId).update({ status: ExpertStatus.activated })
}


interface FirebaseAdminAppParams {
  projectId: string
  clientEmail: string
  storageBucket: string
  privateKey: string
}
