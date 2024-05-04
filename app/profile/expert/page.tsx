'use client'
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import { db } from "@/app/lib/firebase/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { Expert, ExpertStatus, User, expertConverter } from "@/app/lib/definitions";
import { Textarea } from "@nextui-org/react";
import ExpertRegisterForm from "@/app/ui/profile/create-expert-form";
import { redirect } from "next/navigation";
import { useAppContext } from "@/app/lib/context";
import { doc } from "firebase/firestore";
import MyExpertView from "@/app/ui/expert/my-expert-view";
import Link from "next/link";
import { Button } from "@/app/ui/button";
// import withAuth from "@/app/lib/withAuth";
// export default withAuth(Page)

// const monthlyPlans =
//   [
//     {
//       key: '100kmonthly',
//       value: 100000,
//       label: '100K 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 100K từ mỗi người theo dõi chọn gói này'
//     },
//     {
//       key: '200kmonthly',
//       value: 200000,
//       label: '200K 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 200K từ mỗi người theo dõi chọn gói này'
//     },
//     {
//       key: '500Kmonthly',
//       value: 500000,
//       label: '500K 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 500K từ mỗi người theo dõi chọn gói này'
//     },
//     {
//       key: '1Mmonthly',
//       value: 1000000,
//       label: '1 triệu 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 1 triệu từ mỗi người theo dõi chọn gói này'
//     },
//     {
//       key: '2Mmonthly',
//       value: 2000000,
//       label: '2 triệu 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 2 triệu từ mỗi người theo dõi chọn gói này'
//     }
//   ]

//   const permPlans = 
//   [
//     {
//       key: '500Kperm',
//       value: 500000,
//       label: '500K vĩnh viễn',
//       des: 'Bạn sẽ nhận được 500K từ mỗi người theo dõi vĩnh viễn'
//     },
//     {
//       key: '1Mperm',
//       value: 200000,
//       label: '200K 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 200K từ mỗi người theo dõi chọn gói này'
//     },
//     {
//       key: '500Kmonthly',
//       value: 500000,
//       label: '500K 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 500K từ mỗi người theo dõi chọn gói này'
//     },
//     {
//       key: '1Mmonthly',
//       value: 1000000,
//       label: '1 triệu 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 1 triệu từ mỗi người theo dõi chọn gói này'
//     },
//     {
//       key: '2Mmonthly',
//       value: 2000000,
//       label: '2 triệu 1 tháng',
//       des: 'Mỗi tháng bạn sẽ nhận được 2 triệu từ mỗi người theo dõi chọn gói này'
//     }

//   ]

export default function Page() {
  const { user } = useAppContext()
  console.log("user uid" + user?.uid)
  const [userExpertInfo, loading, error] = useDocument(
    doc(db, 'expert', user?.uid ?? "dd").withConverter(expertConverter));
  return (
    <div className="p-0">
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
      {
        user ? body(userExpertInfo?.data(), user) : (<> Loading user</>)
      }
    </div>
  )
}

function body(userExpertInfoData: Expert | undefined, user: User) {
  if (!userExpertInfoData) {
    return (
      <>
      <p>Chưa đang ký user </p>
      <Link href={"/profile/expert/register"}> <Button> Bam vao day de dang ky</Button> </Link>
      </>
    )
    redirect('/profile/expert/register')
    // return (<Form subscriptionPrice={['1mil', '2mil']} userInfo={user} />)
  }

  switch (userExpertInfoData.status) {
    case null:
      return (<ExpertRegisterForm 
        // subscriptionPrice={[{ key: '1mil1thang', value: 1000000, label: '1 triệu 1 tháng' },]}
         userInfo={user} />)
    case ExpertStatus.paymentPending: {
      if (!userExpertInfoData.avatar) {
        return (<div>Loading ... </div>)
      } else {
        return (

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
            </div>

          </div>)
      }

    }

    case ExpertStatus.suspended: {
      return (<>Dang cho duoc suspended, co muon kich hoat lai ko ?</>)

    }

    case ExpertStatus.banned: {
      return (<>Đang bị banned  roi</>)

    }

    case ExpertStatus.activated: {

      return (<>
        <MyExpertView expert={userExpertInfoData} />
      </>)
    }

    default:
      return (<>Unknown status</>)
  }


}