
import StatsCard from "../ui/statsCard";
import { unstable_cache } from "next/cache";
import { contentOf, convert } from "../lib/utils";
import RankView from "../ui/rankView";
import { UserNoti } from "../model/noti";
import { Divider, Link } from "@nextui-org/react";
import { getRankData, serverGetStat } from "../lib/server";
import BoardNotificationView from "../ui/boardNotiView";
import QuickIntro from "../ui/quickIntro";
import { getNextMonthMileStone, getNextQuarterMileStone, getNextWeekMileStone, getNextYearMileStone, getPivotDates } from "../lib/statistic";


// const spaces = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
const cacheTime = 1

export default async function Home() {


  // const testRank = await getRankData()
  const stats = await unstable_cache(async () => serverGetStat(), ['getStatsOnHomePage'], { revalidate: cacheTime })()
  const rankData = stats.rankData

  return (
    <>
    {/* {JSON.stringify(testRank)} */}
      <BoardNotificationView />
      <div className="sm:flex sm:p-6 sm:gap-8 sm:justify-start sm:ml-24">

        {rankData &&
          (<div className="mt-4 sm:flex sm:justify-center">
            <RankView rankData={rankData} />
          </div>)}
        <QuickIntro />

      </div>

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

