"use client"


import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, rtDB } from "../firebase/firebase";
import { User as FireBaseUser, getAuth } from "firebase/auth";
import { User, userRTDBConverter } from "@/app/model/user";
import { persistUserInfo} from "../server";
import { onValue, ref } from "firebase/database";


const AppContext = createContext<{ user: User | undefined, firebaseUser: FireBaseUser | null | undefined }>({ user: undefined, firebaseUser: null });



export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFireBaseUser] = useState<FireBaseUser | null | undefined>(undefined)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        // console.log("useEffect ")
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
           
            var unsubscrible = onValue(ref(rtDB ,'user/' + firebaseUser.uid), (snapshot) => {
                console.log('onValue Realtime Database onSnapshot fetch user info with id ' + firebaseUser.uid + ' data : ' + JSON.stringify(snapshot.val()))
                if (snapshot.val()) {
                    const userInfo : User = userRTDBConverter.fromRTDB(snapshot) 
                    // if (userInfo.notifies) {
                    //     userInfo.notifies.sort((a,b) => { 
                    //         return b.dateTime - a.dateTime})
                    // }
                    persistUserInfo(JSON.stringify(userInfo))
                    setUser(userInfo)
                }



            })
             
            return unsubscrible
        } else {
            if (firebaseUser == null && firebaseUser != undefined) {
                // xac dinh la user dang bi logged out
                // persistUserInfo(undefined)
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