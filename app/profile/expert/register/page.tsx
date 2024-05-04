'use client'
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import clsx from 'clsx';
import Form from "@/app/ui/profile/create-expert-form";
import { auth, db } from "@/app/lib/firebase/firebase";
import { useEffect, useState } from "react";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { DocumentData, doc } from "firebase/firestore";
import { Expert, ExpertStatus, User, expertConverter } from "@/app/lib/definitions";
import { Textarea } from "@nextui-org/react";
import ExpertRegisterForm from "@/app/ui/profile/create-expert-form";
import { useAppContext } from "@/app/lib/context";
import MyExpertView from "@/app/ui/expert/my-expert-view";
// import withAuth from "@/app/lib/withAuth";
// import withAuth from "../../lib/withAuth";

// withAuth(Page)

// export default withAuth(Page)

export default function Page() {

  const { user } = useAppContext()

  // const [userExpertInfo, loading, error] = useDocumentData(
  //   doc(db, 'expert', user ? user.uid : "aa").withConverter(expertConverter)
  // );
  console.log("user : " + JSON.stringify(user))
  return (
    <div className="p-5">
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'Profile', href: '/profile' },
          {
            label: 'ho so chuyen gia',
            href: '/profile/expert',
            // href: '/profile/registerExpert',
            // active: true,
          },
        ]} /> */}
      
        {/* <div>d9d login</div> */}

        {  user ? (<Form userInfo={user} />) : (<>Loading .... </>)
        }
        
    </div>
  )
}

// function body(userExpertInfoData: Expert | undefined, user: User) {
//   if (!userExpertInfoData) {
//     return user ? (<Form subscriptionPrice={['1mil', '2mil']} userInfo={user} />) : (<>Loading .... </>)
//   }

//   switch (userExpertInfoData.status) {
//     case null:
//       return (<ExpertRegisterForm subscriptionPrice={['1mil', '2mil']} userInfo={user} />)
//     case ExpertStatus.paymentPending: {

//         return (

//           <div className="max-w-100 flex">
//             <div className="w-1/2">
//               <ExpertCard expert={userExpertInfoData} />
//             </div>


//             <div className="w-1/2  bg-black ">
//               <Textarea
//                 isReadOnly
//                 isDisabled
//                 label="Thông báo"
//                 variant="bordered"
//                 color="warning"
//                 labelPlacement="outside"
//                 placeholder="Enter your description"
//                 defaultValue=" Bạn chưa đóng tiền
//       Chuyển 5000000 vào tài khoản xxxx để chúng tôi kích hoạt. 
//       Mọi thắc mắc xin liên hệ  0912609848"
//                 className="max-w-xs text-white-900"
//               />
//             </div>

//           </div>)
      

//     }

//     case ExpertStatus.suspended: {
//       return (<>Dang cho duoc suspended, co muon kich hoat lai ko ?</>)

//     }

//     case ExpertStatus.banned: {
//       return (<>Đang bị banned  roi</>)

//     }

//     case ExpertStatus.activated: {

//       return (<>
//         <MyExpertView expert={userExpertInfoData} />
//       </>)
//     }

//     default:
//       return (<>Unknown status</>)
//   }


// }