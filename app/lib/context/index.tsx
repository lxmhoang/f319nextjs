"use client"

import { apps } from "firebase-admin";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { User as FireBaseUser, onAuthStateChanged } from "firebase/auth";
import { getUserClaims } from "../firebaseadmin/firebaseadmin";
import { useRouter } from "next/navigation";
import { User, userConverter } from "../definitions";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { getAUserByID } from "../firebase/firestore";



const AppContext = createContext<{user: User | undefined}>({user: undefined});



export function AppWrapper({ children }: { children: React.ReactNode }) {
    // let [firebaseUser, setFireBaseUser] = useState<FireBaseUser>()
    const [user, setUser] = useState<User>()
    // const [loadingUser, setLoadingUser] = useState(true)
    // const router = useRouter()

    


    // const [user, setUser] = useState<User>();
    useEffect(() => {
        console.log("useEffect ")
        const getUserInfo = async (firebaseUser: FireBaseUser | null) => {
            if (firebaseUser) {
                const user = await getAUserByID(firebaseUser.uid)
                if (user) {
                    const claim = await getUserClaims(user.uid, user?.email)
                    console.log("custom claim : " + JSON.stringify(claim))
                    user.customClaims = {isAdmin: claim.isAdmin ?? false, isExpert: claim.isExpert ?? false}
                    user.isAdmin = claim["isAdmin"]
                    user.isExpert = claim["isExpert"]
                    setUser(user)
                }
            } else {
                setUser(undefined)
            }

        }

        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log("onAuthStateChanged for app wraper " + authUser)
            getUserInfo(authUser)
        });

        return unsubscribe;
    }, []);



    return (
        <AppContext.Provider value={{ user }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}