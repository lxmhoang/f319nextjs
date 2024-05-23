'use client'

import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { Divider } from "@nextui-org/react";
import { db } from "@/app/lib/firebase/firebase";
import { expertConverter } from "@/app/lib/definitions";
import ExpertDetail from "@/app/ui/expert/expert-detail";



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
