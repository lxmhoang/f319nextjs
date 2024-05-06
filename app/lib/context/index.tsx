"use client"

import { apps } from "firebase-admin";

import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { User as FireBaseUser, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { User, userConverter } from "../definitions";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { doc, getDoc, getDocFromServer, onSnapshot } from "firebase/firestore";
import { clientFetchObject } from "../firebase/firestore";


const AppContext = createContext<{ user: User | undefined }>({ user: undefined });



export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFireBaseUser] = useState<FireBaseUser | null>(null)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        console.log("useEffect ")
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            // console.log("onAuthStateChanged for firebase auth " + authUser?.email)
            console.log("onAuthStateChanged check again: " + getAuth().currentUser?.email)
            setFireBaseUser(authUser)
        });

        return unsubscribe;
    }, []);

    useEffect(() => {

        console.log('firebaseUser new value received :  ' + firebaseUser)

        const updateToken = async (fbUsr: FireBaseUser) => {
            const token = await fbUsr.getIdToken();
            console.log("firebaseIdToken saved : " + token.slice(0, 10))
            Cookies.set("firebaseIdToken", token, { secure: true })
        }


        const unsubscribe = firebaseUser ?
            onSnapshot(doc(db, "user", firebaseUser.uid).withConverter(userConverter), (doc) => {
                console.log('onAuthStateChanged onSnapshot fetch user info' + JSON.stringify(doc.data()))

                updateToken(firebaseUser)
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
        <AppContext.Provider value={{ user }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}