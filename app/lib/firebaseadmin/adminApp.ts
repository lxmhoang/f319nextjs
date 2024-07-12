
import admin, { auth } from "firebase-admin"
import { getApps } from "firebase-admin/app"


// use emulator
if (false) {
    console.log('admin FIRESTORE DATABASE connecting to emulator')

    process.env['FIREBASE_DATABASE_EMULATOR_HOST'] = 'localhost:9000';
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
    process.env['KEY_GCLOUD_PROJECT'] = 'prod319-c0378';

} else {
    console.log('admin FIRESTORE DATABASE is NOT connecting to emulator '  + process.env.KEY_MEASUREMENT_ID)

}

function formatPrivateKey(key: string) {
    // console.log("key : " + key)
    return key ? key.replace(/\\n/g, "\n") : "aa"
}

const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    clientEmail: process.env.KEY_FIREBASE_CLIENT_EMAIL as string,
    privateKey: process.env.KEY_FIREBASE_PRIVATE_KEY as string,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL as string
}

const ADMIN_APP_NAME = "stock-319-admin";
export function createFirebaseAdminApp() {

    const result = getApps().find((it) => it.name === ADMIN_APP_NAME)
    if (result) {
        return result
    }
    const app = admin.initializeApp({
        credential: admin.credential.cert({
            projectId: params.projectId,
            clientEmail: params.clientEmail,
            privateKey: formatPrivateKey(params.privateKey),
        }),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    }, ADMIN_APP_NAME);

    app.firestore().settings({ignoreUndefinedProperties:true});

    return app
}
