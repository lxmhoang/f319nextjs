"use server"

import { approvePendingTrans, searchCollection, searchUser } from "@/app/lib/firebase/firestore";
import { Transaction, transConverter } from "@/app/lib/definitions";
import ReviewWithDraw from "@/app/ui/admin/reviewWithDraw";
import { Button } from "@/app/ui/button";



export default async function Home() {


  const approveTransaction =  async(tranIDs:string[]) => {
    "use server";
    await approvePendingTrans(tranIDs)
    return {
      message:'good'
    }
  }

  const tranList = await searchCollection<Transaction>("transaction", { "status": "pending" }, transConverter)

  return (
    <>    
    <ReviewWithDraw trans={tranList.map((item) => {
        return {
          id: item.id ?? "", amount: item.amount, status: item.status, key: item.id ?? "", notebankacc: item.notebankacc ?? ""
        };

      })} submit={approveTransaction} />


    </>
  );

}
