'use client'
import { Expert } from "@/app/lib/definitions";
import ExpertCard from "../expertcard";
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import clsx from 'clsx';

export default function ExpertDetail({ expert }: { expert: Expert }) {


  return (
    <div className="flex flex-row flex-wrap p-15">
      <div className="w-1/4">
        {expert ? (<ExpertCard expert={expert} />) : ""}

      </div>
      <div className="w-3/4 p-5">
        {expert && expert.preds && expert.preds.length > 0 ? (

          <div>
            <div> Các khuyến nghị đang tiếp diễn </div>


            <Accordion >
              {expert.preds?.filter((item) => item.priceRelease == undefined).map((item, index) => {
                // console.log("aaaaa" + item.stockCode)
                // console.log("ooooo" + item.cutLossPrice)
                const content = "Giá vào : " + item.priceIn + " Giá ra  : " + item.priceOut

                // const profit = item.priceRelease ?? 0 * 100 / item.priceIn
                // const profitPercentage = (Math.round(profit * 100) / 100).toFixed(2);
                const title = <p className="text-sky-400"> {item.assetName}  </p>
                return (<AccordionItem key={"c_" + index} title={title}><p className="text-sky-400">{content}</p></AccordionItem>)
              }

              )}
            </Accordion>
            <Divider />
            <div> Các khuyến nghị đã kết thúc</div>


            <Accordion >
              {expert.preds?.filter((item) => item.priceRelease != undefined).map((item, index) => {
                // console.log("aaaaa" + item.stockCode)
                // console.log("ooooo" + item.cutLossPrice)
                const content = "Giá vào : " + item.priceIn + " Giá cuối  : " + item.priceOut

                const profit = item.priceRelease ?? 0 * 100 / item.priceIn
                const profitPercentage = (Math.round(profit * 100) / 100).toFixed(2);
                const title = <p className={clsx(
                  {
                    "text-sky-400": profit >= 100,
                    "text-red-400": profit < 100
                  }
                )}> {item.assetName} {profitPercentage}% </p>
                return (<AccordionItem key={"c_" + index} title={title}><p className="text-sky-400">{content}</p></AccordionItem>)
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