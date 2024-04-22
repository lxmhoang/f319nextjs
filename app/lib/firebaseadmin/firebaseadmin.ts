"use server" // must have this to read env variable

import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth";
import { User, getAuth as clientAuth } from "firebase/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ExpertStatus } from "../definitions";
import { onAuthStateChanged } from "firebase/auth";
import { rejects } from "assert";
import { auth } from "../firebase/firebase";




function formatPrivateKey(key: string) {
    return key.replace(/\\n/g, "\n")
  }
   
  export async function createFirebaseAdminApp(params: FirebaseAdminAppParams) {

const privateKey = formatPrivateKey(params.privateKey)
   
    if (admin.apps.length > 0) {
      const app = admin.app()

    console.log("have existing app");
        return app
    }
    console.log("create new app");
    const cert = admin.credential.cert({
      projectId: params.projectId,
      clientEmail: params.clientEmail,
      privateKey,
    })
   
    return admin.initializeApp({
      credential: cert,
      projectId: params.projectId,
      storageBucket: params.storageBucket,
    })
  }
 
 
export async function initAdmin() {

  const useEmulator = process.env.USE_EMULATOR;

  if (useEmulator){
      process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
      process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
      process.env['KEY_GCLOUD_PROJECT'] = 'stock319-f3905';
  }
    const params = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
      clientEmail: process.env.KEY_FIREBASE_CLIENT_EMAIL as string,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
      privateKey: process.env.KEY_FIREBASE_PRIVATE_KEY as string,
    }
    // console.log("param " + JSON.stringify(params))

     createFirebaseAdminApp(params)
    // console.log("app inited ==== " + JSON.stringify(admin.app()));
    // return JSON.stringify(admin.app())
  }  

  export async function checkUserRole() : Promise<{
    [key: string]: any;
}> {
  console.log('start func')
    await initAdmin()
    console.log('app init')

    return new Promise((resolve) => { 
      onAuthStateChanged(auth, user => {
        console.log('auth state changed : ' + user)
        
        if (user) {
          const uid = user.uid
          console.log("custom Claims : " + JSON.stringify(user))
          getUserClaims(uid).then (customClaims => {
          console.log("custom Claims : " + JSON.stringify(customClaims))
          if (customClaims) {
            resolve(customClaims)
          } else {
            resolve(
              {
                ["role"]: "null custom claim"
              }
            )
          }

          },
          reason => {
            resolve(
              {
                ["role"]: "fail to retrieve user data from uid"
              }
            )
            // reject(reason)
          }
        )
          
        } else {
          // resolve(
          //   {
          //     ["role"]: "not a user"
          //   }
          // )
        }

      })


    })
  }


  export async function getUserClaims(uid: string, email?: string | null) {
    await initAdmin()
    console.log("uid---" + uid)
    console.log("email---" + email)
    const userRecord = await getAuth().getUser(uid)
    var claim = userRecord.customClaims ?? {}

    if (email && email == 'lxmhoang@gmail.com') {
      console.log("return admin---" + uid)
      claim.isAdmin = true
    }
    return claim
  }

  export async function banExpert(docId:string) {
    await initAdmin()
    await getFirestore().collection('expert').doc(docId).update({status: ExpertStatus.banned})    
  }


  export async function activateExpert(docId:string) {
    await initAdmin()
    await getFirestore().collection('expert').doc(docId).update({status: ExpertStatus.activated})    
  }

 
interface FirebaseAdminAppParams {
    projectId: string
    clientEmail: string
    storageBucket: string
    privateKey: string
  }
