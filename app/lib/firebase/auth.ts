import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
  getAuth
} from "firebase/auth";

import { auth } from "./firebase";

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  console.log("onAuthStateChanged" + auth);
	return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  console.log("signInWithGoogle");

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
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


