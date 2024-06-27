'use client'
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Prediction, PredictionReview } from "../model/prediction";
import { perfConver } from "../lib/utils";
import clsx from 'clsx';
import { useEffect, useState } from "react";
import { useFetchRealTimeStockPrice } from "../lib/hooks/useFetchRealTimeStockPrice";
import { getRealTimeStockData } from "../lib/getStockData";

export default function PredsUserView({ preds }: { preds: Prediction[] }) {
    const onTrackPreds = preds.filter((item) => { return item.dateRelease == undefined })
    const stocks = onTrackPreds.map((item) => item.assetName)
    const donePreds = preds.filter((item) => { return item.dateRelease != undefined })

    const [wipData, setWIPData] = useState<PredictionReview[]>([])

    useEffect(() => {
        const fetchData = async (stocks: string[]) => {
            const data = await getRealTimeStockData(stocks)
            console.log("stock rt price: " + JSON.stringify(data))
            // const wipReviewPreds = wipPreds.map
            const dataList: PredictionReview[] = onTrackPreds.map((pred) => {
                const curPrice = data ? data[pred.assetName] : undefined
                if (!curPrice) {
                  throw new Error('can not get real time stock data of asset ' + pred.assetName)
                }
                // console.log("vvvv : " + pred.deadLine)
                return {
                  id: pred.id,
                  assetName: pred.assetName,
                  priceIn: pred.priceIn.toFixed(2),
                  priceOut: pred.priceOut.toFixed(2),
                  deadLine: pred.deadLine.toLocaleDateString('vi'),
                  dateIn: pred.dateIn.toLocaleDateString('vi'),
                  cutLoss: pred.cutLoss.toFixed(2),
                  status: pred.status,
                  curPrice: curPrice.low.toFixed(2),
                  curStatus: (curPrice.low * 100 / pred.priceIn - 100).toFixed(2) + "%",
                  portion: pred.portion.toString() + '%',
                  disableClose: false
                }
              })

              setWIPData(dataList)
        };



        fetchData(stocks)

    }, [])



    return (
        <>
            <div> Các khuyến nghị đang tiếp diễn </div>
            <Accordion >
                {wipData.map((item, index) => {
                    // const content = "Giá vào : " + item.priceIn + " Giá ra  : " + item.priceOut

                    // const dateReleaseStr = item.dateRelease ? new Date(item.dateRelease).toLocaleDateString('vi') : ""
                    // const deadLineStr = new Date(item.deadLine).toLocaleDateString('vi')
                    // const action = item.status == "WIN" ?
                    //   "Chốt lời" :
                    //   item.status == "LOSE" ? "Cắt lỗ" : "Can thiệp"
                    const content = (
                        <div>
                            <p>
                                Ngày vào : {item.dateIn}
                            </p>
                            <p>
                                Giá vào : {item.priceIn}
                            </p>
                            <p>
                                Dự đoán chốt lời - cắt lỗ:   {item.priceOut} - {item.cutLoss}
                            </p>
                            <p>
                                Hạn cuối nắm giữ: {item.deadLine}
                            </p>
                            <p>
                            curPrice: {item.curPrice}
                            </p>
                            <p>
                            curStatus: {item.curStatus}
                            </p>
                        </div>
                    )
                    const loss = item.curStatus.startsWith("-")
                    const title = <p className={clsx(
                        {
                            "text-sky-400": !loss,
                            "text-red-400": loss
                        }
                    )}> {item.assetName} {item.curStatus} </p>
                    
                    return (<AccordionItem  key={"c_" + index} title={title}>{content}</AccordionItem>)
                }

                )}
            </Accordion>

            <div> Các khuyến nghị đã kết thúc</div>
            <Accordion >
                {donePreds.map((item, index) => {
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
                    const priceRelease = item.priceRelease ?? 0

                    const profit = priceRelease * 100 / item.priceIn
                    const profitPercentage = (Math.round(profit * 100) / 100).toFixed(2);
                    const profitInfo = perfConver(priceRelease / item.priceIn).info
                    const title = <p className={clsx(
                        {
                            "text-sky-400": profit >= 100,
                            "text-red-400": profit < 100
                        }
                    )}> {item.assetName} {profitInfo} </p>
                    return (<AccordionItem key={"c_" + index} textValue={"content"} title={title}>{content}</AccordionItem>)
                }

                )}
            </Accordion>
        </>
    )

}