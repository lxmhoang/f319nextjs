'use client'

import ExpertDetail from "@/app/ui/expert/expert-detail";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { Divider } from "@nextui-org/react";
import { getPivotDates } from "@/app/lib/statistic";
import { expertConverter } from "@/app/model/expert";



export default function Page({ params }: { params: { id: string } }) {
  const ref = doc(db, 'expert', params.id).withConverter(expertConverter);
  const [result, loadingExpert, error2] = useDocument(ref)
  const expert = result?.data()
  // const test = getPivotDates(new Date('2023-01-01'))
  
  return (


    <div>
      {/* {numOfPreds} */}
      {/* <Breadcrumbs breadcrumbs={[
        { label: 'Danh sach chuyen gia', href: '/' },
        { label: 'Thông tin chuyên gia', href: `/expertdetails/${id}` },
      ]} /> */}
      {/* {JSON.stringify(test)} */}
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
