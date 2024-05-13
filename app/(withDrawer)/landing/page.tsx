'use client'

import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../../ui/breadcrumbs";
import { Divider } from "@nextui-org/react";


export default function Landing() {

  const searchParams = useSearchParams()
  const refID = searchParams.get('ref')?.toString()
  
  var cache = null
  try {
    if (refID && (typeof window !== "undefined")) {
      localStorage.setItem("referalID", refID)
    }
    cache = localStorage.getItem("referalID")

  } catch (e) {

  }
  return (
    <>
      <Breadcrumbs breadcrumbs={[
        { label: 'Danh sach chuyen gia', href: '/' }
      ]} />
      {cache ?? "no cachesss"}
      <Divider />
      {refID}
    </>
  );


  // const [experts, loading, error] = useCollectionDataOnce <Expert>
  // (collection(getFirestore(firebaseApp), "hooks"), {
  //  getOptions: {source: "default"}
  // });


  // const data = experts?.docs.map(doc => {
  // 	return {
  // 		id: doc.id,
  // 		imageURL: doc.data().imageURL ,
  // 		followerNum: doc.data().followerNum,
  // 		name: doc.data().name,
  // 		selfIntro: doc.data().selfIntro,
  // 		shortInfo: doc.data().shortInfo,

  // 		// ...doc.data()//,
  // 		// Only plain objects can be passed to Client Components from Server Components
  // 		// timestamp: doc.data().timestamp.toDate(),
  // 	};
  // })

}
