'use client'
import ExpertCard from "../expertcard";
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import clsx from 'clsx';
import { Expert, Prediction } from "@/app/lib/definitions";
import { useAppContext } from "@/app/lib/context";
import { useEffect, useState } from "react";
import { getPredsFromExpert } from "@/app/lib/firebase/firestore";
import { subcribleToAnExpert } from "@/app/lib/firebaseadmin/firebaseadmin";
import { ConfirmationModal } from "../confirm";
import { Button } from "../button";
import { addComma } from "@/app/lib/utils";

type AlertModal = {
  isShown: boolean
  title: string
  message: string
  leftBtnTitle: string,
  rightBtntitle?: string,
  leftBtnClick: VoidFunction,
  rightBtnClick?: VoidFunction
}

export default function ExpertDetail({ expert }: { expert: Expert }) {

  const { user } = useAppContext()
  const [donePreds, setDonePreds] = useState<Prediction[]>([])
  const [progressPreds, setInprogressPreds] = useState<Prediction[]>([])

  useEffect(() => {
    const exc = async () => {
      const donePreds = await getPredsFromExpert(user, expert, false)
      console.log('done  exxxx' + JSON.stringify(donePreds))
      setDonePreds(donePreds)

      const wipPreds = await getPredsFromExpert(user, expert, true)
      console.log('done  yyyyy' + JSON.stringify(donePreds))
      setInprogressPreds(wipPreds)

    }


    if (expert) {
      console.log('exxxxx')
      exc()
    }
  }, [expert]
  )



  const shouldHideProgressPreds = () => {
    return !user || (user.uid != expert.id && user.following[expert.id] == null)
  }

  const follow = async (eid: string, perm: boolean) => {

    const result = await subcribleToAnExpert(eid, perm)
    setError(result.error)
  }
  const [numOfPreds, setNumOfPreds] = useState<number>()
  const [error, setError] = useState<string>()

  const id = expert.id

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
    <div className="block sm:flex sm:flex-row sm:flex-wrap">
      <div className="justify-center sm:w-1/4">
        {expert ? (<ExpertCard expert={expert} />) : ""}

      </div>
      <div className="sm:w-3/4 p-1">
        {expert && (donePreds || progressPreds) ? (

          <div>

            {shouldHideProgressPreds() ?
              (<><p>Có {progressPreds.length} khuyến nghị đang tiếp diễn bị ẩn </p>
                <div className="flex justify-center">
                  <Button className="m-5 w-1/2"
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

                  > Follow để xem </Button></div></>) :
              (<>

                <div> Các khuyến nghị đang tiếp diễn </div>
                <Accordion >
                  {progressPreds.map((item, index) => {
                    // console.log("aaaaa" + item.stockCode)
                    // console.log("ooooo" + item.cutLossPrice)
                    const content = "Giá vào : " + item.priceIn + " Giá ra  : " + item.priceOut

                    // const profit = item.priceRelease ?? 0 * 100 / item.priceIn
                    // const profitPercentage = (Math.round(profit * 100) / 100).toFixed(2);
                    // const title = <p className="text-sky-400"> {item.assetName}  </p>
                    return (<AccordionItem key={"c_" + index} title={item.assetName}><p className="text-sky-400">{content}</p></AccordionItem>)
                  }

                  )}
                </Accordion>
              </>)
            }



            <Divider />
            <div> Các khuyến nghị đã kết thúc</div>


            <Accordion >
              {donePreds.map((item, index) => {
                // console.log("aaaaa" + item.stockCode)
                // console.log("ooooo" + item.cutLossPrice)
                const action = item.priceOut == item.priceRelease ?
                  "Chốt lời" :
                  item.priceRelease == item.cutLoss ? "Cắt lỗ" : "Can thiệp"
                const content = (<div><p>Giá vào : {item.priceIn} </p>{action}: {item.priceRelease}</div>)
                const content2 = "aaaa"
                const priceRelease = item.priceRelease ?? 0

                const profit = priceRelease * 100 / item.priceIn
                const profitPercentage = (Math.round(profit * 100) / 100).toFixed(2);
                const title = <p className={clsx(
                  {
                    "text-sky-400": profit >= 100,
                    "text-red-400": profit < 100
                  }
                )}> {item.assetName} {profitPercentage}% </p>
                return (<AccordionItem key={"c_" + index} title={title}>{content}</AccordionItem>)
              }

              )}
            </Accordion>
          </div>
        )
          :
          (<>Không có gì </>)

        }


      </div>
      {shouldHideProgressPreds() && expert ?
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


        </>)
        :
        (<></>)

      }
    </div>
  )


}