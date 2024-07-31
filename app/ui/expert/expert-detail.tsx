'use client'
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import clsx from 'clsx';
import { useAppContext } from "@/app/lib/context";
import { useEffect, useState } from "react";
import { AlertModal, ConfirmationModal, initAlertState } from "../confirm";
import { Button } from "../button";
import { addComma, perfConver, valueWithBonus } from "@/app/lib/utils";
import { Prediction } from "@/app/model/prediction";
import { Expert } from "@/app/model/expert";
import { login, refreshToken } from "@/app/lib/client";
import ExpertVertView from "../expertVertView";
import { useRouter } from "next/navigation";
import { joinRankUser, subcribleToAnExpert, viewExpertPreds } from "@/app/lib/server";
import { getRealTimeStockData } from "@/app/lib/getStockData";


export default function ExpertDetail({ expertData }: { expertData: string }) {
  const expert: Expert = JSON.parse(expertData)

  const feeRankSponsorMonth = Number(process.env.NEXT_PUBLIC_RANK_SPONSOR_MONTH)
  const feeRankSponsorPerm = Number(process.env.NEXT_PUBLIC_RANK_SPONSOR_PERM)

  const router = useRouter()
  const { user, firebaseUser } = useAppContext()
  const [curPrices, setCurPrices] = useState<{
    [key: string]: {
      high: number;
      low: number;
      tc: number;
    }
  }>()
  const [predsInfo, setPredsInfo] = useState<{
    needFollow: boolean;
    data: {
      numOfInProgress: number;
      onTrackPreds: Prediction[];
      donePreds: Prediction[];
    }
  }>()

  useEffect(() => {
    const exc = async () => {
      const res = await viewExpertPreds(user, expert)
      console.log('viewExpertPreds' + res)
      setPredsInfo(JSON.parse(res))
    }

    if (expert) {
      exc()
    }
  }, [user]
  )

  useEffect(() => {

    const fetchCurPrice = async (codes: string[]) => {
      const res = await getRealTimeStockData(codes)
      setCurPrices(res)

    }


    if (predsInfo && predsInfo.data.onTrackPreds.length > 0) {
      const codes = predsInfo.data.onTrackPreds.map((item) => { return item.assetName })
      fetchCurPrice(codes)

    }

  }, [predsInfo])


  const defaultOpen = (typeof window !== 'undefined') ? window.location.hash.slice(1) : "";
  console.log(' default open ' + defaultOpen)




  const joinRankSponsor = async (perm: boolean) => {
    console.log('begin to follow')

    const result = await joinRankUser(perm)

  }

  const follow = async (eid: string, perm: boolean) => {
    console.log('begin to follow')

    const result = await subcribleToAnExpert(eid, perm)
    // console.log('result ' + JSON.stringify(result))
    setError(result.error)
  }

  const [numOfPreds, setNumOfPreds] = useState<number>()
  const [error, setError] = useState<string>()

  const id = expert.id


  const [alertState, setAlertState] = useState<AlertModal>(initAlertState)


  const handleJoinRankSponsor = (perm: boolean) => {
    const feeRankSponsor = perm ? feeRankSponsorPerm : feeRankSponsorMonth
    // console.log('check ' + user.amount + '   ' + feeRankSponsor)
    if (user && expert) {
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
        joinRankSponsor(perm).then(() => {
          refreshToken(firebaseUser).then((result) => { })
        })
        // follow(expert.id, false)
      }
    } else {
      // user hoac expert khong ton tai

    }

  }


  const handlePermSub = () => {
    if (user && expert && expert.permPrice && expert.id) {
      console.log('handlePermSub')
      if (user.amount < expert.permPrice) {
        console.log('handlePermSub222')
        setAlertState({
          isShown: true,
          title: 'Không đủ tiền',
          message: "Số tiền cần : " + addComma(expert.permPrice) + " trong khi bạn chỉ có " + addComma(user.amount),
          leftBtnTitle: "Okey để nạp thêm",
          leftBtnClick: () => {
            router.push('/profile/deposit')
            // setAlertState(initAlertState)
          }
        })
      } else {
        console.log('handlePermSub333')
        // du tien roi
        setAlertState(initAlertState)
        follow(expert.id, true)
      }

    } else {
      throw new Error('user hoac chuyen gia hoac permPrice không tồn tại ')

    }
  };


  const handleMonthlySub = () => {
    if (user && expert && expert.monthlyPrice && expert.id) {
      if (user.amount < expert.monthlyPrice) {
        setAlertState({
          isShown: true,
          title: 'Không đủ tiền',
          message: "Số tiền cần : " + addComma(expert.monthlyPrice) + " trong khi bạn chỉ có " + addComma(user.amount),
          leftBtnTitle: "Okey để nạp thêm",
          leftBtnClick: () => {
            router.push('/profile/deposit')
            // setAlertState(initAlertState)
          }
        })
      } else {
        // du tien roi
        setAlertState(initAlertState)
        follow(expert.id, false)
      }
    } else {
      // user hoac expert khong ton tai
      throw new Error('user hoac chuyen gia hoac permPrice không tồn tại ')

    }

  };
  console.log('expert data : ' + JSON.stringify(expert))
  const permFollowenabled = expert.permPrice && expert.expertPeriod == 'perm'

  return (
    <div className=" sm:flex sm:justify-start">
      <div className="">
        {expert ? (<ExpertVertView expertInfo={expertData} />) : (<></>)}

      </div>
      <div className=" p-4 grow">
        {predsInfo ? (

          <div className="mt-5">

            {predsInfo.needFollow ?
              (<>
                <p>{predsInfo.data.numOfInProgress} khuyến nghị tiếp diễn đang ẩn </p>

                <p className="text-rose-500">{error}</p>
                <div className="flex justify-left">
                  {user ?
                    <Button className="m-5 h-[44px] w-max-sm"
                      onClick={() => {
                        expert.expertType == 'solo' && expert.monthlyPrice ?
                          setAlertState({
                            isShown: true,
                            title: 'Theo dõi chuyên gia này ?',
                            message: "Chi phí " + addComma(expert.monthlyPrice) + " 1 tháng" + (permFollowenabled ? " hoặc " + addComma(expert.permPrice!) + "  vĩnh viễn ?" : ""),
                            leftBtnTitle: "Chọn gói tháng " + addComma(expert.monthlyPrice),
                            leftBtnClick: handleMonthlySub,
                            rightBtntitle: permFollowenabled ? "Chọn gói vĩnh viễn " + expert.permPrice : undefined,
                            rightBtnClick: permFollowenabled ? handlePermSub : undefined
                          }) :
                          setAlertState({
                            isShown: true,
                            title: 'Đây là chuyên gia rank, bạn cần tài trợ rank để xem',
                            message: 'Được theo dõi chuyên gia này và TẤT CẢ chuyên gia rank khác. Tổng tiền tài trợ sẽ dùng để trả thưởng rank',
                            leftBtnTitle: "Tham gia 1 tháng " + addComma(feeRankSponsorMonth),
                            leftBtnClick: () => { handleJoinRankSponsor(false) },
                            rightBtntitle: "Tham gia vĩnh viễn " + addComma(feeRankSponsorPerm),
                            rightBtnClick: () => { handleJoinRankSponsor(true) }
                          })

                      }}

                    >
                      {expert.expertType == 'solo' ? "Theo dõi chuyên gia này để xem" : "Tài trợ đua rank để xem"}
                    </Button>
                    :
                    <><Button className="m-5 max-w-sm"
                      onClick={login}

                    >
                      Đăng ký để xem
                    </Button>
                    </>
                  }

                </div>
              </>) :
              (<div className="">

                <div> Các khuyến nghị đang tiếp diễn </div>
                <Accordion selectionMode="multiple" defaultExpandedKeys={[defaultOpen]}>
                  {predsInfo.data.onTrackPreds.map((item, index) => {
                    // const content = "Giá vào : " + item.priceIn + " Giá ra  : " + item.priceOut
                    const dateInStr = new Date(item.dateIn).toLocaleDateString('vi')
                    const deadLineStr = new Date(item.deadLine).toLocaleDateString('vi')
                    const curPriceObject = curPrices && curPrices[item.assetName] 
                    const curPrice = curPriceObject && curPriceObject.high !=0 ? curPriceObject.high : curPriceObject?.tc
                    
                    
                
                    const actualPrice = valueWithBonus(Number(curPrice), item.bonus ?? [])
                    // const bonus = item.bonus ? : 1
                    // const curProfile = curPrice ? Number(100 * Number(curPrice)  / item.priceIn).toFixed(2) : ''
                    const title = <p className="ml-1">{item.bonus && item.bonus.length > 0 && (<span className="text-yellow-500 ">* </span>)}{curPrice ? (<><span className={perfConver(Number(actualPrice) / item.priceIn).color}>{item.assetName} {perfConver(Number(actualPrice) / item.priceIn).info}</span></>) : <></>}  <span className="ml-10 dark:text-zinc-200 text-sm"> tỷ trọng vốn {item.portion}%</span> </p>
                    const content = (
                      <div className="flex cols-2 gap-8 mb-5">
                        <div>
                          <p>
                            Ngày vào :
                          </p>
                          <p>
                            Giá vào :
                          </p>
                          {curPrice &&
                            (
                              <p className="text-yellow-500">
                                Giá hiện tại :
                              </p>

                            )
                          }
                          <p>
                            Giá chốt lời :
                          </p>
                          <p>
                            Giá cắt lỗ :
                          </p>
                          <p>
                            Hạn cuối nắm giữ :
                          </p>
                          <p>
                            Tỷ trọng đầu tư :
                          </p>
                          {
                            (item.bonus && item.bonus.length > 0) && (
                              <>
                                <Divider className="mt-5 mb-1" />
                                <p className="text-xs text-yellow-500">Cổ tức</p>
                              </>
                            )
                          }

                        </div>
                        <div>
                          <p>
                            {dateInStr}
                          </p>
                          <p>
                            {item.priceIn}
                          </p>
                          {curPrice &&
                            (
                              <p className="text-yellow-500">
                                {curPrice}
                              </p>

                            )
                          }
                          <p>
                            {item.priceOut}
                          </p>
                          <p>
                            {item.cutLoss}
                          </p>
                          <p>
                            {deadLineStr}
                          </p>
                          <p>
                            {item.portion}%
                          </p>

                          {
                            (item.bonus && item.bonus.length > 0) ? (
                              <>
                                <Divider className="mt-5 mb-1" />
                                {
                                  item.bonus.map((bo) => {
                                    return <p key={bo.id} className="text-xs text-yellow-500">{bo.Note}</p>
                                  })
                                  // JSON.stringify(item.bonus)
                                }
                              </>
                            ) : (<>    {
                              // JSON.stringify(item.bonus)
                            }</>)
                          }

                        </div>
                      </div>
                    )
                    return (<AccordionItem id={item.id} key={item.id} title={title}><p className="text-sky-400">{content}</p></AccordionItem>)
                  }

                  )}
                </Accordion>
              </div>)
            }



            <Divider className="mb-10" />
            <div> Các khuyến nghị đã kết thúc</div>


            <Accordion selectionMode="multiple" defaultExpandedKeys={[defaultOpen]} >
              {predsInfo.data.donePreds.map((item, index) => {
                const dateInStr = new Date(item.dateIn).toLocaleDateString('vi')
                const dateReleaseStr = item.dateRelease ? new Date(item.dateRelease).toLocaleDateString('vi') : ""
                const deadLineStr = new Date(item.deadLine).toLocaleDateString('vi')
                const action = item.status == "WIN" ?
                  "Đạt giá chốt lời" :
                  item.status == "LOSE" ? "Chạm giá cắt lỗ" : "Kết thúc trước hạn"
                const content = (
                  <div className="flex cols-2 gap-8">
                    <div>
                      <p>
                        Ngày vào :
                      </p>
                      <p>
                        Giá vào :
                      </p>
                      <p>
                        Giá chốt lời :
                      </p>
                      <p>
                        Giá cắt lỗ :
                      </p>
                      <p>
                        Hạn cuối nắm giữ :
                      </p>
                      <p>
                        Tỷ trọng đầu tư :
                      </p>

                      <p className="text-yellow-500">
                        Kết quả:
                      </p>
                      <p className="text-yellow-500">
                        Giá kết thúc:
                      </p>
                      <p className="text-yellow-500">
                        Ngày kết thúc:
                      </p>

                      {
                        (item.bonus && item.bonus.length > 0) && (
                          <>
                            <Divider className="mt-5 mb-1" />
                            <p className="text-xs text-yellow-500">Cổ tức</p>
                          </>
                        )
                      }

                    </div>
                    <div>
                      <p>
                        {dateInStr}
                      </p>
                      <p>
                        {item.priceIn}
                      </p>
                      <p>
                        {item.priceOut}
                      </p>
                      <p>
                        {item.cutLoss}
                      </p>
                      <p>
                        {deadLineStr}
                      </p>
                      <p>
                        {item.portion}%
                      </p>

                      <p className="text-yellow-500">
                        {action}
                      </p>
                      <p className="text-yellow-500">
                        {item.priceRelease}
                      </p>
                      <p className="text-yellow-500">
                        {dateReleaseStr}
                      </p>

                      {
                        (item.bonus && item.bonus.length > 0) ? (
                          <>
                            <Divider className="mt-5 mb-1" />
                            {
                              item.bonus.map((bo) => {
                                return <p key={bo.id} className="text-xs text-yellow-500">{bo.Note}</p>
                              })
                              // JSON.stringify(item.bonus)
                            }
                          </>
                        ) : (<>    {
                          // JSON.stringify(item.bonus)
                        }</>)
                      }

                    </div>
                  </div>
                )
                const priceRelease = item.priceRelease ?? 0
                const actualPrice = valueWithBonus(Number(priceRelease), item.bonus ?? [])

                const profit = actualPrice * 100 / item.priceIn
                const profitInfo = perfConver(actualPrice / item.priceIn).info
                const title = <p className={clsx(
                  {
                    "text-sky-400": profit >= 100,
                    "text-red-400": profit < 100
                  }
                )}> {item.assetName} {profitInfo}  <span className="ml-10 text-gray-800 dark:text-zinc-200 text-xs">tỷ trọng vốn: {item.portion}%</span> </p>
                return (<AccordionItem id={item.id} key={item.id} textValue={"content"} title={title}>{content}</AccordionItem>)
              }

              )}
            </Accordion>
          </div>
        )
          :
          (<>Loading</>)

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