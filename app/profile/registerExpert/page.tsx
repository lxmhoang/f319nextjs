'use client'
import { getAnExpertById, getExperts } from "@/app/lib/firebase/firestore";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import Image from "next/image";
import {Accordion, AccordionItem} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import clsx from 'clsx';
import Form from "@/app/ui/profile/create-form";
import { auth, db, getAuthenticatedAppForUser } from "app/lib/firebase/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@/app/lib/firebase/auth";
import { useAuthState, useSignInWithGoogle, useSignOut } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { DocumentData, doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { Expert, postConverter } from "@/app/lib/definitions";


export default function Page() {

  const [user, loadingAuthState, errorAuthState] = useAuthState(auth);
  const [userExpertInfo, loading, error] = useDocument(
    doc(db, 'expert', user?.uid ?? "dd").withConverter(postConverter),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div className="p-5">
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Profile', href: '/profile' },
        {
          label: 'Đăng ký chuyên gia',
          href: '/profile/registerExpert',
          // active: true,
        },
      ]} />
      {/* {value && JSON.stringify(value.data())} */}
      {/* {value && <span>Document: {JSON.stringify(value.data())}</span>} */}
      {
          // body(user)
        user ? 
        // body (userExpertInfo?.data())
          body(userExpertInfo?.data(), user) 
            // body(userExpertInfo.data()?.status) :
        // userExpertInfo.data()?.status == 'submitted' ? (<>chua dong tien</>) :
        //   (<>da dang ky roi con gi</>) : 
        // (<Form subscriptionPrice={['1mil', '2mil']} userInfo={user} />) 
        : 
        (<div>Please login</div>)
      }
    </div>
    )
  }

  function body(userExpertInfoData: Expert | undefined, user: User) {
    if (!userExpertInfoData) {
      return (<Form subscriptionPrice={['1mil', '2mil']} userInfo={user} />) 
    }
    // if (userExpertInfoData) {
    //   return (<Form subscriptionPrice={['1mil', '2mil']} userInfo={user} />) 
    // }


    switch (userExpertInfoData.status) {
      case null : 
      return (<Form subscriptionPrice={['1mil', '2mil']} userInfo={user} />) 
      case 'submitted'  : {
        if (!userExpertInfoData.avatar) {
          return (<div>Loading ... </div>)
        } else {
          return  (<div>
          <ExpertCard expert={userExpertInfoData} />
          
          
          chua dong tien</div>)
        }

        }

      case 'waitingForApproval': {
        return  (<>Dang cho kiem duyet</>)

      }

      case 'subspended': {
        return  (<>Dang subspended, co muon kich hoat lai ko ?</>)

      }

      case 'active' : {
        
        return  (<>Dang active</>)
      }

      default : 
        return (<>Unknown status</>)
    }


  }