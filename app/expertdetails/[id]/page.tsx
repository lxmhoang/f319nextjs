'use client'

import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import Image from "next/image";
import ExpertDetail from "@/app/ui/expert/expert-detail";
import { Button } from "@/app/ui/button";
import { useCollection, useCollectionData, useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { collection, doc, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { Prediction, expertConverter, predConverter } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "@/app/ui/confirm";
import { useAppContext } from "@/app/lib/context";
import { Divider } from "@nextui-org/react";
import { addComma, convert } from "@/app/lib/utils";
import exp from "constants";
import { getTotalPredOfExpert, subcribleToAnExpert } from "@/app/lib/firebaseadmin/firebaseadmin";
import { getPredsFromExpert } from "@/app/lib/firebase/firestore";


type AlertModal = {
  isShown: boolean
  title: string
  message: string
  leftBtnTitle: string,
  rightBtntitle?: string,
  leftBtnClick: VoidFunction,
  rightBtnClick?: VoidFunction
}

export default function Page({ params }: { params: { id: string } }) {
  const ref = doc(db, 'expert', params.id).withConverter(expertConverter);
  const [result, loadingExpert, error2] = useDocument(ref)
  const expert = result?.data()
  const { user } = useAppContext()
  const [preds, setPreds] = useState<Prediction[]>([])

  useEffect(() => {
    const exc = async () => {
      const preds = await getPredsFromExpert(user, expert)
      console.log('done  exxxx' + JSON.stringify(preds))
      setPreds(preds)

    }


    if (user && expert) {
      console.log('exxxx')
      exc()
    }
  }, [loadingExpert, user]
  )


  useEffect(() => {

    const countPred = async () => {
      const num = await getTotalPredOfExpert(params.id)
      setNumOfPreds(num)
    }
    countPred()
  }

  )

  const notSubYet = () => {
    return user && expert && user.uid != params.id && user.following[params.id] == null
  }

  const follow = async (eid: string, perm: boolean) => {

    const result = await subcribleToAnExpert(eid, perm)
    setError(result.error)
  }
  const [numOfPreds, setNumOfPreds] = useState<number>()
  const [error, setError] = useState<string>()

  const id = params.id

  const initAlertState: AlertModal = {
    isShown: false,
    title: '',
    message: '',
    leftBtnTitle: '',
    leftBtnClick: () => { }
  }

  const [alertState, setAlertState] = useState<AlertModal>(initAlertState)

  const handlePermSub = () => {
    if (user && expert) {
      if (user.amount < expert.permPrice) {
        setAlertState({
          isShown: true,
          title: 'Không đủ tiền',
          message: "Số tiền cần : " + expert.permPrice + " trong khi bạn chỉ có " + user.amount,
          leftBtnTitle: "Okey để nạp thêm",
          leftBtnClick: () => {
            setAlertState(initAlertState)
          }
        })
      } else {
        // du tien roi
        setAlertState(initAlertState)
        follow(expert.id, true)
      }

    } else {
      // user hoac expert khong ton tai

    }
    setAlertState(initAlertState)
  };


  const handleMonthlySub = () => {
    if (user && expert) {
      if (user.amount < expert.monthlyPrice) {
        setAlertState({
          isShown: true,
          title: 'Không đủ tiền',
          message: "Số tiền cần : " + expert.monthlyPrice + " trong khi bạn chỉ có " + user.amount,
          leftBtnTitle: "Okey để nạp thêm",
          leftBtnClick: () => {
            setAlertState(initAlertState)
          }
        })
      } else {
        // du tien roi
        setAlertState(initAlertState)
        follow(expert.id, false)
      }
    } else {
      // user hoac expert khong ton tai

    }

  };
  return (


    <div>
      {numOfPreds}
      {/* {numOfPreds} */}
      {/* <Breadcrumbs breadcrumbs={[
        { label: 'Danh sach chuyen gia', href: '/' },
        { label: 'Thông tin chuyên gia', href: `/expertdetails/${id}` },
      ]} /> */}

      {expert ?
        (<div className="max-w-full">
          <ExpertDetail expert={expert} preds={preds ?? []} totalPreds={numOfPreds ?? 0} />

          <div className="text-red-600">{error}</div>
        </div>
        ) :
        (<>Loading</>)
      }

      <Divider />
      {/* {JSON.stringify(user?.following)} */}
      {notSubYet() && expert ?
        (<>
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
          <div className="flex justify-center">
            <Button className="mt-5"
              onClick={() => {
                const message = expert.monthlyPrice + " 1 tháng hoặc " + expert.permPrice + "  vĩnh viễn ?"
                // setShowConfirmation(true)
                setAlertState({
                  isShown: true,
                  title: 'Theo dõi chuyên gia này ?',
                  message: addComma(expert.monthlyPrice) + " 1 tháng hoặc " + addComma(expert.permPrice) + "  vĩnh viễn ?",
                  leftBtnTitle: "Chọn gói tháng " + addComma(expert.monthlyPrice),
                  leftBtnClick: handleMonthlySub,
                  rightBtntitle: "Chọn gói vĩnh viễn " + expert.permPrice,
                  rightBtnClick: handlePermSub
                })
              }}

            > Follow chuyên gia này</Button></div>

        </>)
        :
        (<></>)

      }

    </div>

  );

}
