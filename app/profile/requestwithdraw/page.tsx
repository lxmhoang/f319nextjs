"use client"
import { auth } from "@/app/lib/firebase/firebase";
import { searchUser } from "@/app/lib/firebase/firestore";
import { useUserInfo } from "@/app/lib/firebase/getUser";
import TransCreationForm from "@/app/ui/profile/create-trans-form";
import { Divider } from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";

export default async function Page({params} : {params: {id: string}} ) {

  const [user, loadingAuthState, errorAuthState] = useAuthState(auth)

  // const [user, role, loading] = useUserInfo(false)
  console.log("aaaaaa " + JSON.stringify(user))
  const uid = user?.uid

  const userData = uid ? await searchUser({uid: uid}) : undefined
  
    return (<>
       {
        user && userData? 
        
      (<TransCreationForm user = {userData[0]} transactionType="withDraw" />) 
        :
        (<></>)


       }
      </>)
  }