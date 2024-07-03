'use client'

import { User } from "firebase/auth"
import Cookies from "js-cookie"
import { postIdToken, signInWithGoogle } from "./firebase/auth"


export function login() {
  try {
    let cache = localStorage.getItem("referalID")
    signInWithGoogle(cache)
  } catch (error) {
    console.log("error sign in " + JSON.stringify(error))
  }
};

export function getTapNotificationKeys() {

  let value = Cookies.get('tapNotificationKeys')
  if (value) {
    const currentKeys: string[] = JSON.parse(value)
    return currentKeys
  } else {
    return []
  }

}

export function didTapNotificationWithKey(key: string) {
  var curKeys = getTapNotificationKeys()
  if (!curKeys.includes(key)) {
    curKeys.push(key)

    Cookies.set('tapNotificationKeys', JSON.stringify(curKeys))
   
  } 
 
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