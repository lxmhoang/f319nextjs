
import { getPivotDates } from "../lib/statistic";
import LeaderBoard, { BoardProps } from "../ui/rank";
import StatsCard from "../ui/statsCard";
import { unstable_cache } from "next/cache";
import { addComma, contentOf, convert, perfConver, sortByField } from "../lib/utils";
import { Carousel } from "flowbite-react";
import { serverGetStat, serverQueryCollection } from "../lib/firebaseadmin/adminfirestore";
import { Expert, expertAdminConverter } from "../model/expert";
import RankView from "../ui/rankView";
import { getRankData, getRankingInfo } from "../lib/server";
import { UserNoti } from "../model/noti";
import { Link } from "@nextui-org/react";


// const spaces = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
const cacheTime = 300

export default async function Home() {


  const stats = await unstable_cache(async () => serverGetStat(), ['getStatsOnHomePage'], { revalidate: cacheTime })()
  const rankData = stats.rankData
  

  const boardContent = stats.notifies ? stats.notifies.map((noti: UserNoti) => {

    return (<Link key={noti.dateTime} showAnchorIcon={noti.urlPath != undefined} color="foreground" className="ml-20" href={noti.urlPath ?? ""}>{noti.content}</Link>)
  }) : undefined

  const charSpace = 8
  const dismissX = 400
  const speedPXPerSec = 60
  const rawtext = stats.notifies ? contentOf(stats.notifies.map((noti : UserNoti) => { return noti.content}), ) : ""
  const space = stats.notifies.length * 20
  const lengthOfTextInPx = rawtext.length * charSpace + space + dismissX  
  const time = Math.round(lengthOfTextInPx / speedPXPerSec)
  const css = `
        #wrapper {
          overflow: hidden;
        }

        div#sliding {
          animation: marquee ` + time + `s linear infinite;
         white-space: nowrap;
        }

        @keyframes marquee {
         from {transform: translateX(-100%); }
          to {transform: translateX(`+ dismissX + `px); }
        }
        `
  


  return (
    <>
      <style>
        {css}
      </style>
      {boardContent && (<div className="flex">
        
        <div className="flex mx-auto mt-2 w-3/4 h-[50px] rounded-lg border-solid border-1 border-sky-500" id="wrapper" >
          <div id="sliding" className="my-auto ">{boardContent}</div>
        </div>
      </div>)}
      {rankData && (<div className="mt-4 sm:flex sm:justify-center">
        <RankView rankData={rankData} />
      </div>)}

      <div className="grid grid-cols-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        <Link href="/expert"><StatsCard num={stats.numOfAllExpert} infos={["chuyên gia đang hoạt động"]} /></Link>
        <Link href="/expert"><StatsCard num={stats.numOfAllSub} infos={["người dùng đang trả phí "]} /></Link>
        <Link href="/referalPolicy"><StatsCard num={convert(stats.sumAllSubValue)} infos={["doanh thu khuyến nghị"]} /></Link>
        <Link href="/preds"><StatsCard num={stats.openPreds} infos={["khuyến nghị đang tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={stats.allPreds} infos={["Tổng số khuyến nghị"]} /></Link>
      </div>
    </>
  )
}

