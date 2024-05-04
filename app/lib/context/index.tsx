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
import { doc, onSnapshot } from "firebase/firestore";
import { getAUserByID } from "../firebase/firestore";



const AppContext = createContext<{ user: User | undefined, customClaim: {isAdmin: boolean, isExpert:boolean} | undefined }>({ user: undefined, customClaim: undefined });



export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFireBaseUser] = useState<FireBaseUser | null>(null)
    const [user, setUser] = useState<User>()
    const [customClaim , setCustomClaim] = useState<{isAdmin: boolean, isExpert: boolean}>({isAdmin: false, isExpert: false})
    // const [user] = useDocumentData(doc(db, "user", firebaseUser.uid).withConverter(userConverter))
    // const [loadingUser, setLoadingUser] = useState(true)
    // const router = useRouter()



    // const [user, setUser] = useState<User>();
    useEffect(() => {
        console.log("useEffect ")
        // const getUserInfo = async (firebaseUser: FireBaseUser | null) => {
        //     if (firebaseUser) {
        //         const token = await firebaseUser.getIdToken();
        //         Cookies.set("firebaseIdToken", token, { secure: true })

        //         console.log("firebaseIdToken saved : " + token)
        //         const user = await getAUserByID(firebaseUser.uid)
        //         if (user) {
        //             const claim = await getUserClaims(user.uid, user?.email)
        //             console.log("custom claim : " + JSON.stringify(claim))
        //             user.customClaims = { isAdmin: claim.isAdmin ?? false, isExpert: claim.isExpert ?? false }
        //             user.isAdmin = claim["isAdmin"]
        //             user.isExpert = claim["isExpert"]
        //             console.log("user following " + JSON.stringify(user.following));
        //             setUser(user)
        //         }
        //     } else {
        //         console.log('onAuthStateChanged update to null user')
        //         setUser(undefined)
        //         setCurrentUser(null);
        //     }

        // }

        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log("onAuthStateChanged for app wraper " + JSON.stringify(authUser))
            setFireBaseUser(authUser)
            // getUserInfo(authUser)
        });

        return unsubscribe;
    }, []);

    useEffect(() => {

        console.log('firebaseUser   ' + firebaseUser)
        const updateTokenAndCheckClaim = async (fbUsr: FireBaseUser) => {
            const token = await fbUsr.getIdToken();
            Cookies.set("firebaseIdToken", token, { secure: true })

            console.log("firebaseIdToken saved : " + token)

            const claim = await getUserClaims(fbUsr.uid, fbUsr.email)
            console.log("custom claim fetched : " + JSON.stringify(claim))
            setCustomClaim({
                isAdmin: claim.isAdmin ?? false,
                isExpert: claim.isExpert ?? false
            })
        }


        // const unsubscribe = () => {
            console.log('....' + firebaseUser)
            if (firebaseUser) {
                updateTokenAndCheckClaim(firebaseUser)
                const ref = doc(db, "user", firebaseUser.uid).withConverter(userConverter)
                onSnapshot(ref, (doc) => {
                    console.log("Current user data update: ", doc.data());
                    setUser(doc.data())
                });
            } else {
                console.log('onAuthStateChanged update to null user')
                setUser(undefined)
            }
        // }

        // return unsubscribe

    }, [firebaseUser])


    return (
        <AppContext.Provider value={{ user, customClaim }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}