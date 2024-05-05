"use client"

import { apps } from "firebase-admin";

import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { User as FireBaseUser, onAuthStateChanged } from "firebase/auth";
import { getUserClaims } from "../firebaseadmin/firebaseadmin";
import { useRouter } from "next/navigation";
import { User, userConverter } from "../definitions";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { doc, getDoc, getDocFromServer, onSnapshot } from "firebase/firestore";
import { getAUserByID } from "../firebase/firestore";



const AppContext = createContext<{ user: User | undefined }>({ user: undefined});



export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFireBaseUser] = useState<FireBaseUser | null>(null)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        console.log("useEffect ")
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log("onAuthStateChanged for app wraper " + JSON.stringify(authUser))
            setFireBaseUser(authUser)
        });

        return unsubscribe;
    }, []);

    useEffect(() => {

        console.log('firebaseUser   ' + firebaseUser)


        const updateTokenAndGetUserData = async (fbUsr: FireBaseUser) => {

            const ref = doc(db, "user", fbUsr.uid).withConverter(userConverter)
            const userSnapshot = await getDocFromServer(ref)
            const claim = await getUserClaims(fbUsr.uid, fbUsr.email)
            const userData = userSnapshot.data()

            if (userData && claim) {

            console.log("custom claim fetched  " + JSON.stringify(claim) + "  user  :  "+ JSON.stringify(userData))
                userData.isAdmin = claim.isAdmin ?? false
                userData.isExpert = claim.isExpert ?? false

                console.log("final user " + JSON.stringify(userData))
                setUser(userData)
            }


            const token = await fbUsr.getIdToken();
            console.log("firebaseIdToken saved : " + token)
            Cookies.set("firebaseIdToken", token, { secure: true })
        }


        // const unsubscribe = () => {
            console.log('....' + firebaseUser)
            if (firebaseUser) {
                updateTokenAndGetUserData(firebaseUser)
            } else {
                console.log('onAuthStateChanged update to null user')
                setUser(undefined)
            }

    }, [firebaseUser])


    return (
        <AppContext.Provider value={{ user }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}