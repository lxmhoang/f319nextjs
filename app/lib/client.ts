'use client'

import { User } from "firebase/auth"
import Cookies from "js-cookie"
import { postIdToken, signInWithGoogle, superSignIn, superSignUp } from "./firebase/auth"
import { rtDB } from "./firebase/firebase"
import { DatabaseReference, ref, update } from "firebase/database"


export function login() {
  try {
    let cache = localStorage.getItem("referalID")
    signInWithGoogle(cache)
  } catch (error) {
    console.log("error sign in " + JSON.stringify(error))
  }
};


export function emailLogin(email: string, pass: string) {
  try {
    console.log('email Login')
    superSignIn(email,pass)
  } catch (error) {
    console.log("error sign in " + JSON.stringify(error))
  }
};

export function emailSignUp(email: string, pass: string, name: string) {
  try {

    let cache = localStorage.getItem("referalID")
    console.log('email Sign up')
    superSignUp(email,pass,cache, name)
  } catch (error) {
    console.log("error sign in " + JSON.stringify(error))
  }
};

// export function getTapNotificationKeys() {

//   let value = Cookies.get('tapNotificationKeys')
//   if (value) {
//     const currentKeys: string[] = JSON.parse(value)
//     return currentKeys
//   } else {
//     return []
//   }

// }

export function didTapNotificationWithKey(uid: string, key: string) {
  const notiRef :DatabaseReference = ref(rtDB, 'user/' + uid + '/notifies/' + key  )
  update(notiRef,  {tapTime: Date.now()})
  // var curKeys = getTapNotificationKeys()
  // if (!curKeys.includes(key)) {
  //   curKeys.push(key)

  //   Cookies.set('tapNotificationKeys', JSON.stringify(curKeys))
   
  // } 
}

export async function refreshToken(firebaseUser: User | null | undefined) {
  if (!firebaseUser) {
    return Promise.resolve({
      success: false,
      error: "not authorized"
    })
  }
  const newIdtoken = await firebaseUser.getIdToken(true)
  console.log(' ========= newIdtoken ' + newIdtoken)
  // const newResult = await firebaseUser.getIdTokenResult()
  // console.log(' ========= newResult ' + JSON.stringify(newResult.claims))
  var result: boolean
  try {
    result = await postIdToken(newIdtoken)

    console.log('done updating token after creating expert')
  } catch (e) {
    console.log('sth wrong with post new ID token')

    return {
      success: false,
      error: "sth wrong with post new ID token"
    }
  }
  
  return {
    success: true,
    error: "done post new ID token"
  }

}