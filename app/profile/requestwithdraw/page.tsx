"use client"
import { User } from "@/app/lib/definitions";
import { auth } from "@/app/lib/firebase/firebase";
import { searchUser } from "@/app/lib/firebase/firestore";
import { useUserInfo } from "@/app/lib/firebase/getUser";
import TransCreationForm from "@/app/ui/profile/create-trans-form";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Page({params} : {params: {id: string}} ) {

  const [user, loadingAuthState, errorAuthState] = useAuthState(auth)
  const [userData, setUserData] = useState<User>()

  // const [user, role, loading] = useUserInfo(false)

  useEffect(() => {
    const fetchUserInfo = async () => {

      if (user && user.uid) {
        const userData = await searchUser({uid: user.uid})
        if (userData.length == 1) {
          setUserData(userData[0])
        }
      }
      
     
    };

    fetchUserInfo();
  }, [user]);


    return (<>
       {
        user && userData? 
        
      (<TransCreationForm user = {userData} transactionType="withDraw" />) 
        :
        (<>Loading</>)
       }
      </>)
  }