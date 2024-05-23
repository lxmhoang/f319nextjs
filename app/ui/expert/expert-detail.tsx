'use client'
import ExpertCard from "../expertcard";
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import clsx from 'clsx';
import { Expert, Prediction } from "@/app/lib/definitions";
import { useAppContext } from "@/app/lib/context";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "../confirm";
import { Button } from "../button";
import { addComma } from "@/app/lib/utils";
import { subcribleToAnExpert, viewExpertPreds } from "@/app/lib/firebaseadmin/adminfirestore";

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
  const [predsInfo, setPredsInfo] = useState<{
    needFollow: boolean;
    data: {
      numOfInProgress: number;
      onTrackPreds: Prediction[];
      donePreds: Prediction[];
    }
  }>()
  // const [donePreds, setDonePreds] = useState<Prediction[]>([])
  // const [progressPreds, setInprogressPreds] = useState<Prediction[]>([])

  useEffect(() => {
    const exc = async () => {
      const res = await viewExpertPreds(user, expert)
      console.log('done  exxxx' + res)
      setPredsInfo(JSON.parse(res))
    }

    if (expert) {
      exc()
    }
  }, [expert]
  )


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
      console.log('handlePermSub')
      if (user.amount < expert.permPrice) {
        console.log('handlePermSub222')
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
        console.log('handlePermSub333')
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
        {predsInfo ? (

          <div>

            {predsInfo.needFollow ?
              (<><p>Có {predsInfo.data.numOfInProgress} khuyến nghị đang tiếp diễn bị ẩn </p>
                <div className="flex justify-center">
                  <Button className="m-5 w-1/2"
                    onClick={() => {
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
                  {predsInfo.data.onTrackPreds.map((item, index) => {
                    const content = "Giá vào : " + item.priceIn + " Giá ra  : " + item.priceOut
                    return (<AccordionItem key={"c_" + index} title={item.assetName}><p className="text-sky-400">{content}</p></AccordionItem>)
                  }

                  )}
                </Accordion>
              </>)
            }



            <Divider />
            <div> Các khuyến nghị đã kết thúc</div>


            <Accordion >
              {predsInfo.data.donePreds.map((item, index) => {
                const dateInStr = new Date(item.dateIn).toLocaleDateString('vi')
                const dateReleaseStr = item.dateRelease ? new Date(item.dateRelease).toLocaleDateString('vi') : ""
                const deadLineStr = new Date(item.deadLine).toLocaleDateString('vi')
                const action = item.status == "WIN" ?
                  "Chốt lời" :
                  item.status == "LOSE" ? "Cắt lỗ" : "Can thiệp"
                const content = (
                  <div>
                    <p>
                      Ngày vào : {dateInStr}
                    </p>
                    <p>
                      Giá vào : {item.priceIn}
                    </p>
                    <p>
                      Dự đoán chốt lời - cắt lỗ:   {item.priceOut} - {item.cutLoss}
                    </p>
                    <p>
                      Hạn cuối nắm giữ: {deadLineStr}
                    </p>
                    <p className="text-yellow-500">
                      Giá kết thúc : {item.priceRelease} ({action})
                    </p>
                    <p className="text-yellow-500">
                      Ngày kết thúc : {dateReleaseStr}
                    </p>
                  </div>
                )
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
                return (<AccordionItem key={"c_" + index} textValue={"content"} title={title}>{content}</AccordionItem>)
              }

              )}
            </Accordion>
          </div>
        )
          :
          (<>Không có gì </>)

        }


      </div>
      {expert ?
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