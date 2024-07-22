'use client'
import ExpertCard from "./expertcard";
import { User } from "@nextui-org/user";
import { Expert } from "../model/expert";
import { Button, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { Divider } from "@nextui-org/react";
import { useAppContext } from "../lib/context";
import { AlertModal, ConfirmationModal, initAlertState } from "./confirm";
import { addComma } from "../lib/utils";
import { useRouter } from "next/navigation";
import { joinRankUser } from "../lib/server";
import { login, refreshToken } from "../lib/client";

export default function ExpertListing({ expertList }: { expertList: Expert[] }) {

  const rankExperts = expertList.filter((item) => { return item.expertType == 'rank' })
  const soloExpert = expertList.filter((item) => { return item.expertType == 'solo' })
  const {user, firebaseUser} = useAppContext()

  const router = useRouter()

  const [alertState, setAlertState] = useState<AlertModal>(initAlertState)



  const feeRankSponsorMonth = Number(process.env.NEXT_PUBLIC_RANK_SPONSOR_MONTH)
  const feeRankSponsorPerm = Number(process.env.NEXT_PUBLIC_RANK_SPONSOR_PERM)


  const handleJoinRankSponsor = (perm: boolean) => {
    const feeRankSponsor = perm ? feeRankSponsorPerm : feeRankSponsorMonth
    // console.log('check ' + user.amount + '   ' + feeRankSponsor)
    if (user) {
      if (user.amount < feeRankSponsor) {
        console.log('vvv')
        setAlertState({
          isShown: true,
          title: 'Không đủ tiền',
          message: "Số tiền cần : " + addComma(feeRankSponsor) + " trong khi bạn chỉ có " + addComma(user.amount),
          leftBtnTitle: "Okey để nạp thêm",
          leftBtnClick: () => {
            router.push('/profile/deposit')
          }
        })
      } else {
        // du tien roi
        setAlertState(initAlertState)
        joinRankUser(perm).then(() => {
          refreshToken(firebaseUser).then((result) => { })
        })
        // follow(expert.id, false)
      }
    } else {
      // user hoac expert khong ton tai

    }

  }

  return (

    <div className="p-2">

      <div className="flex max-w-md flex-col items-start gap-4"></div>

      <p className="mx-auto p-4"> Chuyên gia solo, theo dõi từng chuyên gia để xem khuyến nghị</p>
      {/* <ToggleSwitch className="ml-4 mb-4" checked={toggleSolo} label={toggleSolo ? "Ẩn" : "Xem"} onChange={setToggleSolo} /> */}
      {(true && soloExpert.length > 0) && (<div className=" mb-4 flex flex-wrap">
        {soloExpert.map(
          (expert, index) => {
            return <div key={index}>

              <ExpertCard expertInfo={JSON.stringify(expert)} key={index} />
            </div>
          }
          // <Card title={expert.name}/>
        )
        }
      </div>)}
      <Divider />

      <p className="mx-auto p-4"> Chuyên gia đua rank </p>
       <div className="ml-4">

         {user && user.joinRank ? <p>  Bạn đã tài trợ, có thể xem được hết các chuyên gia rank </p> : <Button className='w-[280px]' onClick={() => {
            const state = user ? {
              isShown: true,
              title: 'Đây là chuyên gia rank, bạn cần tài trợ rank để xem',
              message: 'Được theo dõi chuyên gia này và TẤT CẢ chuyên gia rank khác. Tổng tiền tài trợ sẽ dùng để trả thưởng rank',
              leftBtnTitle: "Tham gia 1 tháng " + addComma(feeRankSponsorMonth),
              leftBtnClick: () => { handleJoinRankSponsor(false) },
              rightBtntitle: "Tham gia vĩnh viễn " + addComma(feeRankSponsorPerm),
              rightBtnClick: () => { handleJoinRankSponsor(true) }
            } : 
            {
              isShown: true,
              title: 'Chưa đăng nhập ',
              message: 'Bạn cần đăng nhập trước để mua gói tài trợ rank ',
              leftBtnTitle: 'Đăng nhập ',
              leftBtnClick: () => { login() }
            }

            setAlertState(state)
         }}> Mua gói tài trợ rank để theo dõi tất cả chuyên gia rank </Button>}
       </div>
      {/* <ToggleSwitch className="ml-4 mb-4" checked={toggleRank} label={toggleRank ? "Ẩn" : "Xem"} onChange={setToggleRank} /> */}
      {(true && rankExperts.length > 0) && (<div className="flex flex-wrap mb-4">
        {rankExperts.map(
          (expert, index) => {
            return <div key={index}>

              <ExpertCard expertInfo={JSON.stringify(expert)} key={index} />
            </div>
          }
          // <Card title={expert.name}/>
        )
        }
      </div>)}
      <ConfirmationModal
            isOpen={alertState?.isShown}
            onClose={() => {
              setAlertState(initAlertState)
            }}
            onLeftButtonClick={alertState.leftBtnClick}
            onRightButtonClick={alertState.rightBtnClick}
            // onConfirm={handleMonthlySub}
            title={alertState.title}
            message={alertState.message}
            leftButtonText={alertState.leftBtnTitle}
            rightButtonText={alertState.rightBtntitle}
          />

    </div>
  )
}