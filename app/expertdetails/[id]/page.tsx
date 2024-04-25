'use client'
import {  subcribleToAnExpert } from "@/app/lib/firebase/firestore";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import Image from "next/image";
import ExpertDetail from "@/app/ui/expert/expert-detail";
import { Button } from "@/app/ui/button";
import { useCollection, useCollectionData, useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { collection, doc, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { expertConverter, predConverter } from "@/app/lib/definitions";
import { useState } from "react";




export default function Page({ params }: { params: { id: string } }) {
  const follow = async (eid: string, length: number) => {

    const result = await subcribleToAnExpert(eid, length)
    setError(result.error)
  }
  

  const ref = doc(db, 'expert', params.id).withConverter(expertConverter);
  const [error, setError] = useState<string>()

  const [result, loading, error2] = useDocument(ref)
  const [preds] = useCollectionData(collection(db, 'expert', params.id, "preds").withConverter(predConverter))

  const expert = result?.data()
  if (expert) {
    console.log("preds : " + JSON.stringify(preds))
    expert.preds = preds
  }
  
  const id = params.id

  return (


    <div>

      <Breadcrumbs breadcrumbs={[
        { label: 'Danh sach chuyen gia', href: '/' },
        { label: 'Thông tin chuyên gia', href: `/expertdetails/${id}` },
      ]} />

      {expert ?
        (<div className="max-w-full">
          <ExpertDetail expert={expert} />
          <Button
           onClick={() => {
            follow(expert.id, 30)
          }}
          > Unlock </Button>
          <div>{error}</div>
        </div>
        ) :
        (<></>)}


    </div>

  );

}
