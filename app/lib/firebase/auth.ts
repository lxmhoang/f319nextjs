import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "./firebase";
import { APIResponse } from "../definitions";
import { serverAddNewModal } from "../firebaseadmin/adminfirestore";
import { clientSetDoc } from "./firestore";
import { User, userAdminConverter, userConverter } from "@/app/model/user";
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


export async function signInWithGoogle(refID: string | null) {
  const provider = new GoogleAuthProvider();

  try {
    const userCreds = await signInWithPopup(auth, provider);
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
      await addUser(JSON.stringify(data))// await serverAddNewModal('user/' + userCreds.user.uid, data, userAdminConverter)
      console.log(' did add new user to db ')
      // getFirestore().collection('user').doc(user.uid).set(data)
    }
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
    } else return false;
  } catch (error) {
    console.error("Error signing out with Google", error);
    return false;
  }
}