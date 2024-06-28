"use client"


import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { User as FireBaseUser, getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { User, userConverter } from "@/app/model/user";
import { decrypt , encrypt, persistUserInfo} from "../server";


const AppContext = createContext<{ user: User | undefined, firebaseUser: FireBaseUser | null | undefined }>({ user: undefined, firebaseUser: null });



export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFireBaseUser] = useState<FireBaseUser | null | undefined>(undefined)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        console.log("useEffect ")
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log("onAuthStateChanged check again: " + authUser + '  email ' + getAuth().currentUser?.email)
            setFireBaseUser(authUser)
        });

        return unsubscribe;
    }, []);


    useEffect(() => {

        console.log('firebaseUser new value received :  ' + firebaseUser)
        // const token = firebaseUser?.getIdTokenResult()
        // var unsubscrible
        if (firebaseUser) {
            var unsubscrible =
                onSnapshot(doc(db, "user", firebaseUser.uid).withConverter(userConverter), (doc) => {
                    console.log('onAuthStateChanged onSnapshot fetch user info' + JSON.stringify(doc.data()))
                    // if (token) {

                    // }

                    // updateToken(firebaseUser)
                    const userInfo = doc.data()
                    persistUserInfo(JSON.stringify(userInfo))
                    setUser(doc.data())
                })
            return unsubscrible
        } else {
            if (firebaseUser == null && firebaseUser != undefined) {
                persistUserInfo(undefined)
            }
            //
            setUser(undefined)
        }
    }, [firebaseUser])


    return (
        <AppContext.Provider value={{ user, firebaseUser }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}