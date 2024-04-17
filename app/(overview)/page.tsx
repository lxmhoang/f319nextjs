'use client'
import Image from "next/image";
import { getExperts } from "../lib/firebase/firestore";
import { Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@nextui-org/react";
import ExpertCard from "../ui/expertcard";
import ExpertListing from "../ui/expert-listing";
import Breadcrumbs from "../ui/breadcrumbs";
import { getFirestore, collection, FirestoreDataConverter, WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions, query, where } from 'firebase/firestore';
import { useCollection, useCollectionData, useCollectionDataOnce, useCollectionOnce } from 'react-firebase-hooks/firestore';
import { db, firebaseApp } from "../lib/firebase/firebase";
import { Expert, expertConverter } from "../lib/definitions";



export default function Home() {

  const ref = query(collection(db, 'expert'),where("status","==","activated")).withConverter(expertConverter);


  const [data, loading, error] = useCollectionDataOnce(ref);
  return (
    <>    
    <Breadcrumbs breadcrumbs={[
      { label: 'Danh sach chuyen gia', href: '/' }
    ]} />
    {
      data ? 
      (<ExpertListing expertList={data} />   ) : 
      (<div>{error?.message }</div>)
    }
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
    