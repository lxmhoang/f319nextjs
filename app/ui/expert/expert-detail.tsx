'use client'
import ExpertCard from "../expertcard";
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import clsx from 'clsx';
import { Expert, Prediction } from "@/app/lib/definitions";

export default function ExpertDetail({ expert, preds, totalPreds }: { expert: Expert, preds: Prediction[], totalPreds: number }) {

  const onGoingPreds = preds.filter((item) => item.status != 'Closed')
  const closePreds = preds.filter((item) => item.status == 'Closed')

  const isPredHidden = onGoingPreds.length == 0 && totalPreds > closePreds.length

  const numberOfhHidePred = totalPreds - closePreds.length


  return (
    <div className="block sm:flex sm:flex-row sm:flex-wrap">
      <div className="justify-center sm:w-1/4">
        {expert ? (<ExpertCard expert={expert} />) : ""}

      </div>
      <div className="sm:w-3/4 p-1">
        {expert && preds && preds.length > 0 ? (

          <div>
            <div> Các khuyến nghị đang tiếp diễn </div>

            {isPredHidden ? 
            (<><p>Có {numberOfhHidePred} khuyến nghị đang tiếp diễn, follow chuyên gia này để theo dõi </p></>) : 
            (<>
            <Accordion >
              {onGoingPreds.map((item, index) => {
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
              {closePreds.map((item, index) => {
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
    </div>
  )


}