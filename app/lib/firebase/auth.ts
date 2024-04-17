import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
  getAuth,
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "./firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// export function onAuthStateChanged(cb: NextOrObserver<User>) {
//   console.log("onAuthStateChanged" + auth);
// 	return _onAuthStateChanged(auth, cb);
// }

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  console.log("signInWithGoogle");

  try {
    const userCre = await signInWithPopup(auth, provider);

  } catch (error) {
    console.log("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    console.log("signout");
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}




