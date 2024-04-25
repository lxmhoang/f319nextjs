'use client'
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import Image from "next/image";
import {Accordion, AccordionItem} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import clsx from 'clsx';
import Form from "@/app/ui/profile/create-form";
import { auth, db } from "app/lib/firebase/firebase";
import { useEffect, useState } from "react";
import { useAuthState, useSignInWithGoogle, useSignOut } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { DocumentData, doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { Expert, ExpertStatus, expertConverter } from "@/app/lib/definitions";
import {Textarea} from "@nextui-org/react";
import ActiveExpertView from "@/app/ui/expert/active-expert-view";


export default function Page() {

  const [user, loadingAuthState, errorAuthState] = useAuthState(auth);
  const [userExpertInfo, loading, error] = useDocument(
    doc(db, 'expert', user?.uid ?? "dd").withConverter(expertConverter),
    {
      // snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div className="p-5">
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Profile', href: '/profile' },
        {
          label: 'ho so chuyen gia',
          href: '/profile/expert',
          // href: '/profile/registerExpert',
          // active: true,
        },
      ]} />
      {
        user ? 
          body(userExpertInfo?.data(), user) 
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

    switch (userExpertInfoData.status) {
      case null : 
      return (<Form subscriptionPrice={['1mil', '2mil']} userInfo={user} />) 
      case ExpertStatus.paymentPending  : {
        if (!userExpertInfoData.avatar) {
          return (<div>Loading ... </div>)
        } else {
          return  (
          
          <div className="max-w-100 flex">
          <div className="w-1/2">
            <ExpertCard expert={userExpertInfoData} />
          </div>
          
          
          <div className="w-1/2  bg-black ">
          <Textarea 
      isReadOnly
      isDisabled
      label="Thông báo"
      variant="bordered"
      color="warning"
      labelPlacement="outside"
      placeholder="Enter your description"
      defaultValue=" Bạn chưa đóng tiền
      Chuyển 5000000 vào tài khoản xxxx để chúng tôi kích hoạt. 
      Mọi thắc mắc xin liên hệ  0912609848"
      className="max-w-xs text-white-900"
    />
            {/* <Textarea   
      isReadOnly
      defaultValue="  Bạn chưa đóng tiền
            Chuyển 5000000 vào tài khoản xxxx để chúng tôi kích hoạt. 
            Mọi thắc mắc xin liên hệ  0912609848
"
          label="Enter your description"
      className="max-w-xs" /> */}
              


          </div>
          
          </div>)
        }

        }

      case ExpertStatus.suspended: {
        return  (<>Dang cho duoc suspended, co muon kich hoat lai ko ?</>)

      }

      case ExpertStatus.banned: {
        return  (<>Đang bị banned  roi</>)

      }

      case ExpertStatus.activated : {
        
        return  (<>
        <ActiveExpertView expert={userExpertInfoData} />
        </>)
      }

      default : 
        return (<>Unknown status</>)
    }


  }