"use client"


import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { User as FireBaseUser, getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { User, userConverter } from "@/app/model/user";


const AppContext = createContext<{ user: User | undefined, firebaseUser: FireBaseUser | null }>({ user: undefined, firebaseUser: null });



export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFireBaseUser] = useState<FireBaseUser | null>(null)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        console.log("useEffect ")
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log("onAuthStateChanged check again: " + getAuth().currentUser?.email)
            setFireBaseUser(authUser)
        });

        return unsubscribe;
    }, []);

    useEffect(() => {

        console.log('firebaseUser new value received :  ' + firebaseUser)
        const token = firebaseUser?.getIdTokenResult()

        const unsubscribe = firebaseUser ?
            onSnapshot(doc(db, "user", firebaseUser.uid).withConverter(userConverter), (doc) => {
                console.log('onAuthStateChanged onSnapshot fetch user info' + JSON.stringify(doc.data()))

                // updateToken(firebaseUser)
                setUser(doc.data())
            })
            :
            () => {
                console.log('olddddd set new user null, going to set  new user')
                setUser(undefined)

            }
        if (!firebaseUser) {
            console.log('set new user null')
            setUser(undefined)
        }
        return unsubscribe
        // }

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