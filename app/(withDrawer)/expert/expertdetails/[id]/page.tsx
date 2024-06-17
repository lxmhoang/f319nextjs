'use client'

import { doc } from "firebase/firestore";
import { Divider } from "@nextui-org/react";
import { db } from "@/app/lib/firebase/firebase";
import ExpertDetail from "@/app/ui/expert/expert-detail";
import { expertConverter } from "@/app/model/expert";
import { getExpert } from "@/app/lib/server";
import { redirect } from "next/navigation";



export default async function Page({ params }: { params: { id: string } }) {
  const expert = await getExpert(params.id)
  if (!expert) {
    redirect('/expert')
  }
  
  return (


    <div>
      {/* {numOfPreds} */}
      {/* <Breadcrumbs breadcrumbs={[
        { label: 'Danh sach chuyen gia', href: '/' },
        { label: 'Thông tin chuyên gia', href: `/expertdetails/${id}` },
      ]} /> */}

    <div className="max-w-full">
          <ExpertDetail expertData={JSON.stringify(expert)} />
        </div>
       

    </div>

  );

}
