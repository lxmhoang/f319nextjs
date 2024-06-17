'use client'

import { signInWithGoogle } from "./firebase/auth"


export function login()  {
    try {
      let cache = localStorage.getItem("referalID")
      signInWithGoogle(cache)
    } catch (error) {
      console.log("error sign in " + JSON.stringify(error))
    }
  };
