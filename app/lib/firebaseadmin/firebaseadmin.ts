"use server" // must have this to read env variable

import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth";
import { User, getAuth as clientAuth } from "firebase/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ExpertStatus } from "../definitions";
import { onAuthStateChanged } from "firebase/auth";
import { rejects } from "assert";
import { auth } from "../firebase/firebase";
import { applicationDefault } from "firebase-admin/app";




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
    privateKey: privateKey,
  })

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  })

}


export async function initAdmin() {

  const useEmulator = process.env.USE_EMULATOR;

  if (useEmulator) {
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
    process.env['KEY_GCLOUD_PROJECT'] = 'stock319-f3905';
  }
  const params = {
    projectId: "stock319-f3905",
    clientEmail: "firebase-adminsdk-7fqse@stock319-f3905.iam.gserviceaccount.com",
    storageBucket: "stock319-f3905.appspot.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCm2LkARW/CTZyH\nk5F6S2uLQATebb4USL4orMAPi9N3LuaDCgJnUZDnxTBZ0pQwdyvSradyVFoVWKQV\nEREfgjsxw0OFFzGNpJOKZTE8/ENreUwC3BybJ0vy43d88BPorGU5wd1UgmgbfNw+\nSUtj/QEd4AtjLbblriSq4IrSDZKL7qNgTeynbXaqavH5sL7XSSDk75xCPYaR947G\nP4Gpl942YfRkEMywoIYiLmrsUoGIzdKsnMvp7ae6BJltVenDf/C438ytpye51dbi\ncirfSFchXpQVggb3R+gq5DWo0IQXz30lUL0J1pp3lt1zfq/Gl+QPbtsicPAUPNfY\nkyyPY31FAgMBAAECggEACRz+AI7KYPGTotrORRYeL1f1gXS7FNPjAckVyy5BrwPd\nIWaIOmkmd2e6PAhtgbbbVOxD9icMre0j4TwHvxHXoTXfgpiBY2bhjDCkyjD5OcNB\nV0f7OVpMeAgxUZ4HaFu/l7JddYKTTypjGUqFl1Y4G7qjb0Ji+BP/+rloZmV0Dg00\njoFLXdTnVdFZpI7tqWAe9D+bqOMI4AxZPbHje6AUxK+C3vMo+cWtPh8Wxmd6y6OT\nIVWE0PpnXgeLa6svYiNKuGvO+jeyGULn4EvVKNTiw1RydvvWVNg3nzQp5vXAnW2d\nIb159fv4QRiHjpi0Ia/AwVMyzuxpzmbm10g5zJzZzQKBgQDb0+1Ay9HGIRyxb2oF\nZyF4pppOYxRESE1E13JeWPUbvakAmWGy/ABHKnSma6loCdlDi/yWA4FT8HEtlV+W\nUHUlMFov/QuGddw2HnEni7DGqnn5vPYrvGMg37V9DT7Y8D/t/QHeKZWlllnxf0E2\n0dcEbXXmnFFu9ja134Oz0VxAWwKBgQDCTQCKWx+9+i3MjJ6Hc4IBOr25A3cJYTOT\ntZqWg0aYpua0uuy0OwcPSBW4MMirzqTugt1qqp7va7sIQW1rK1X3rbg3WehLl/UQ\npf0MDTG1TZcGFpZ9VGi88QqM/56SWYiO8QHey51cW38ZEi+whOmCnCKpqayNJR/0\nwyIhmdGq3wKBgQC/oBD8X/AAP5MMlWudRBZoXwq59CKRl1lL/mcjGXao9P6imBIT\nfRsc7kR7YfRtzdAH0rqfZnTRYBK4wrJtjLthbLHhjTsDvi/1OTo4V8wEkkz7x53r\n6C+dU4WYefhkEaIY6mk7aZKaouLK4rxNdkRyBp01JuTRzm1Iw4vCL2m0awKBgQCV\nC/6LI6Ww1NYHICOHojqq+MWKxDavEko/V8LTDLa96OH256EmDFW5CkHm/j0hVi48\n7FQvO90ZqhlaFt55pE+Y5ED47NX+Dv4lnD8F3KUx/+gG+pLMZ1DFB15hlMCuYVIY\n3JXjs2vt6h4QPFwq23pI/76zSX4c88qUto9bGSS2HwKBgQC1bpaPcT3oS6QyFTdd\nM+d4nDXR8tZEHhIjDaYXvKD8xwb96tP20UmcVyDt/yrYdSUDPhxXs/FH/jFd0wvY\n/q/y6VOkWPr3e4rY5T/QxQiVBrbmaxhu6cZDg8nM3KhgN79VGKIvIVgO2auyRwV6\nBGkGpuaCwoNo2D+I90EvYqzsMA==\n-----END PRIVATE KEY-----\n",
  }
  // console.log("param " + JSON.stringify(params))

  createFirebaseAdminApp(params)
  // console.log("app inited ==== " + JSON.stringify(admin.app()));
  // return JSON.stringify(admin.app())
}

export async function getUserClaims(uid: string, email?: string | null) {
  await initAdmin()

  const userRecord = await getAuth().getUser(uid)
  var claim = userRecord.customClaims ?? {}

  if (email && email == 'lxmhoang@gmail.com') {
    console.log("return admin---" + uid)
    claim.isAdmin = true
  }
  return claim
}

export async function banExpert(docId: string) {
  await initAdmin()
  await getFirestore().collection('expert').doc(docId).update({ status: ExpertStatus.banned })
}


export async function activateExpert(docId: string) {
  await initAdmin()
  await getFirestore().collection('expert').doc(docId).update({ status: ExpertStatus.activated })
}


interface FirebaseAdminAppParams {
  projectId: string
  clientEmail: string
  storageBucket: string
  privateKey: string
}
