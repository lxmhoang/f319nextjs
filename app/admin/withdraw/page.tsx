"use client"

import { searchUser } from "@/app/lib/firebase/firestore";
import { Transaction, transConverter } from "@/app/lib/definitions";
import ReviewWithDraw from "@/app/ui/admin/reviewWithDraw";
import { Button } from "@/app/ui/button";
import { serverApprovePendingTrans, serverQueryCollection } from "@/app/lib/firebaseadmin/firebaseadmin";
import { adminTranConverter, userAdminConverter } from "@/app/lib/firebaseadmin/adminconverter";
import { useEffect, useState } from "react";



export default function Home() {

  useEffect(() => {

    const getTranList = async () => {
      const tranList = await serverQueryCollection<Transaction>('transaction',{ "status": "pending" }, adminTranConverter)
      setTransList(tranList)

    }
    
  })

  const [transList, setTransList] = useState<Transaction[]>([])


  const approveTransaction =  async(tranIDs:string[]) => {
    // "use server";
    await serverApprovePendingTrans(tranIDs)
    return {
      message:'good'
    }
  }

  return (
    <>    
    <ReviewWithDraw trans={transList.map((item) => {
        return {
          id: item.id ?? "", amount: item.amount, status: item.status, key: item.id ?? "", notebankacc: item.notebankacc ?? ""
        };

      })} submit={approveTransaction} />


    </>
  );

}
