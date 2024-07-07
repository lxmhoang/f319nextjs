import {
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "./firebase";
import { APIResponse } from "../definitions";
import { User } from "@/app/model/user";
import { addUser, verifyAccessID } from "../server";


export async function postIdToken(idToken:string) {
  const response = await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
  const resBody = (await response.json()) as unknown as APIResponse<string>;
  if (response.ok && resBody.success) {
    console.log('update idToken success')
    return true;
  } else return false;

}

async function doSomeThingIfNewUser(userCreds:UserCredential, refID: string | null, name?:string) {
  const addUInfo = getAdditionalUserInfo(userCreds)
  if (addUInfo && addUInfo.isNewUser) {
    const data: User = JSON.parse(JSON.stringify(userCreds.user))
    
    console.log('user data : ' + JSON.stringify(userCreds.user))
    data.amount = 0
    let stop = false
    
    while (stop == false) {
      var accessId = Math.random().toString(36).substring(2,8)
      stop = await verifyAccessID(accessId)    
      if (stop) {
        data.accessId = accessId
      }    
    }
    if (refID) {
      data.refID = refID
    }
    if (name) {
      data.displayName = name
    }
    await addUser(JSON.stringify(data))// await serverAddNewModal('user/' + userCreds.user.uid, data, userAdminConverter)
    console.log(' did add new user to db ')
    // getFirestore().collection('user').doc(user.uid).set(data)
  }
  console.log('user cred ' + JSON.stringify(userCreds))
  
}
// http://localhost:3000?ref=6nh973
export async function superSignIn(email: string, pass: string) {
  console.log('sign in   ' + email + pass)
  const userCreds = await signInWithEmailAndPassword(auth, email, pass)
  console.log('user cred ' + JSON.stringify(userCreds))
  const idToken = await userCreds.user.getIdToken(true);
  return await postIdToken(idToken)
}

export async function superSignUp(email: string, pass: string, refID: string | null, name:string) {
  console.log('sign up  ' + email + pass + name)
  const userCreds = await createUserWithEmailAndPassword(auth, email, pass)
  await doSomeThingIfNewUser(userCreds, refID, name)
  const idToken = await userCreds.user.getIdToken(true);
  return await postIdToken(idToken)
}


export async function signInWithGoogle(refID: string | null) {
  const provider = new GoogleAuthProvider();

  try {
    const userCreds = await signInWithPopup(auth, provider);
    await doSomeThingIfNewUser(userCreds, refID)
    const idToken = await userCreds.user.getIdToken(true);
    return await postIdToken(idToken)
    
  } catch (error) {
    console.error("Error signing in with Google", error);
    return false;
  }
}

export async function signOut() {
  try {
    await auth.signOut();

    const response = await fetch("/api/auth/sign-out", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      
      return true;
    } else 
    return false;
  } catch (error) {
    console.error("Error signing out with Google", error);
    return false;
  }
}