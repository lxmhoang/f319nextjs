'use client'

import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import Image from "next/image";
import ExpertDetail from "@/app/ui/expert/expert-detail";
import { Button } from "@/app/ui/button";
import { useCollection, useCollectionData, useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { collection, doc, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { Prediction, expertConverter, predConverter } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "@/app/ui/confirm";
import { useAppContext } from "@/app/lib/context";
import { Divider } from "@nextui-org/react";
import { addComma, convert } from "@/app/lib/utils";
import exp from "constants";
import { getTotalPredOfExpert, subcribleToAnExpert } from "@/app/lib/firebaseadmin/firebaseadmin";
import { getPredsFromExpert } from "@/app/lib/firebase/firestore";



export default function Page({ params }: { params: { id: string } }) {
  const ref = doc(db, 'expert', params.id).withConverter(expertConverter);
  const [result, loadingExpert, error2] = useDocument(ref)
  const expert = result?.data()
  
  return (


    <div>
      {/* {numOfPreds} */}
      {/* <Breadcrumbs breadcrumbs={[
        { label: 'Danh sach chuyen gia', href: '/' },
        { label: 'Thông tin chuyên gia', href: `/expertdetails/${id}` },
      ]} /> */}

      {expert ?
        (<div className="max-w-full">
          <ExpertDetail expert={expert} />
        </div>
        ) :
        (<>Loading</>)
      }

      <Divider />
      {/* {JSON.stringify(user?.following)} */}
  

    </div>

  );

}
