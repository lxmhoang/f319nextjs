'use client'
import ExpertCard from "./expertcard";
import { User } from "@nextui-org/user";
import { Expert } from "../model/expert";
import { ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { Divider } from "@nextui-org/react";
import { useAppContext } from "../lib/context";

export default function ExpertListing({ expertList }: { expertList: Expert[] }) {

  const rankExperts = expertList.filter((item) => { return item.expertType == 'rank' })
  const soloExpert = expertList.filter((item) => { return item.expertType == 'solo' })

  // const [toggleSolo, setToggleSolo] = useState(true);
  // const [toggleRank, setToggleRank] = useState(true);

  const {user} = useAppContext()


  return (

    <div className="p-2">

      <div>
      </div>

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

      <p className="mx-auto p-4"> Chuyên gia đua rank, {user?.joinRank ? "bạn có thể xem được hết" : "chọn tham gia theo dõi rank để xem được tất cả"} </p>
      {/* <ToggleSwitch className="ml-4 mb-4" checked={toggleRank} label={toggleRank ? "Ẩn" : "Xem"} onChange={setToggleRank} /> */}
      {(true && soloExpert.length > 0) && (<div className="flex flex-wrap mb-4">
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
    </div>
  )
}