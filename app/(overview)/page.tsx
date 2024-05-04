'use client'
import Image from "next/image";
import { getExperts } from "../lib/firebase/firestore";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import ExpertCard from "../ui/expertcard";
import ExpertListing from "../ui/expert-listing";
import Breadcrumbs from "../ui/breadcrumbs";
import { getFirestore, collection, FirestoreDataConverter, WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions, query, where } from 'firebase/firestore';
import { useCollection, useCollectionData, useCollectionDataOnce, useCollectionOnce } from 'react-firebase-hooks/firestore';
import { db } from "../lib/firebase/firebase";
import { BanknotesIcon, ClockIcon, InboxIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { lusitana } from "../ui/font";
import StatsCard from "../ui/statsCard";
import Link from "next/link";



export default function Home() {

  return (
    <>
      <div className="block sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        <Link href="/expert">
          <StatsCard num={70} infos={["chuyên gia đang hoạt động"]} />
        </Link>

        <Link href="/expert"><StatsCard num={439} infos={["người dùng đang trả phí "]} /></Link>
        
        <Link href="/referalPolicy"><StatsCard num={671} infos={["tr phí giới thiệu"]} /></Link>
        <Link href="/preds"><StatsCard num={19} infos={["khuyến nghị đang theo tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={2819} infos={["khuyến nghị đã kết thúc"]} /></Link>


      </div>


      {/* <Breadcrumbs breadcrumbs={[
      { label: 'Danh sach chuyen gia', href: '/' }
    ]} /> */}
      {/* {
      data ? 
      (<ExpertListing expertList={data} />   ) : 
      (<div>{error?.message }</div>)
    } */}
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

// const iconMap = {
//   collected: BanknotesIcon,
//   customers: UserGroupIcon,
//   pending: ClockIcon,
//   invoices: InboxIcon,
// };

// export function Card({
//   title,
//   value,
//   type,
// }: {
//   title: string;
//   value: number | string;
//   type: 'invoices' | 'customers' | 'pending' | 'collected';
// }) {
//   const Icon = iconMap[type];

//   return (
//     <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
//       <div className="flex p-4">
//         {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
//         <h3 className="ml-2 text-sm font-medium">{title}</h3>
//       </div>
//       <p
//         className={`${lusitana.className}
//           truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }
