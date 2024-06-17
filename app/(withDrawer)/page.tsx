
import { getPivotDates } from "../lib/statistic";
import LeaderBoard, { BoardProps } from "../ui/rank";
import StatsCard from "../ui/statsCard";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { convert, perfConver, sortByField } from "../lib/utils";
import { Carousel } from "flowbite-react";
import { serverGetStat, serverQueryCollection } from "../lib/firebaseadmin/adminfirestore";
import { Expert, expertAdminConverter } from "../model/expert";
import RankView from "../ui/rankView";

const cacheTime = 60*60*2

export default async function Home() {

  const rankExpert = await unstable_cache(async () =>  serverQueryCollection('expert', [{key: "expertType", operator: "==", value: "rank"}], expertAdminConverter), ['getExpertsOnHomePage'], {revalidate: cacheTime})()
  let experts = rankExpert.filter((item) => { return item.status == 'activated'})
  
  // await unstable_cache(async () => getExperts({ status: "activated" }), ['getExpertsOnHomePage'], { revalidate: cacheTime })()
  const stats = await unstable_cache(async () => serverGetStat(), ['getStatsOnHomePage'], { revalidate: cacheTime })()
  const monthly = sortByField(experts, "monthPerform").map((item) => {
    return {
      name: item.name,
      perf: perfConver(item.monthPerform)
    }
  })  

  const yearly = sortByField(experts, "yearPerform").map((item) => {
    return {
      name: item.name,
      perf: perfConver(item.yearPerform)
    }
  })

  const quarter = sortByField(experts, "quarterPerform").map((item) => {
    return {
      name: item.name,
      perf: perfConver(item.quarterPerform)
    }
  })

  const weekly = sortByField(experts, "weekPerform").map((item) => {
    return {
      name: item.name,
      perf: perfConver(item.weekPerform)
    }
  })
  // , hour: '2-digit', minute: 'numeric'
  const pivots = getPivotDates(new Date())
  const weekDate = pivots[0].toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const monthDate = pivots[1].toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const quarterDate = pivots[2].toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const yearDate = pivots[3].toLocaleDateString('vi')
  const weekTo = pivots[4].toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const monthTo = pivots[5].toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const quarterTo = pivots[6].toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const yearTo = pivots[7].toLocaleDateString('vi')

  const rankData : BoardProps[] = [
    {title: 'Tuan', since:weekDate, to: weekTo, total:"4.500.000", rewards:[], data: weekly},
    {title: 'Thang', since:monthDate, to: monthTo, total:"", rewards:[], data: monthly},
    {title: 'Quy', since:quarterDate, to: quarterTo, total:"", rewards:[], data: quarter},
    {title: 'Nam', since:yearDate, to: yearTo, total:"", rewards:[], data: yearly}
  ]

  return (
    <>
      <div className=" sm:flex sm:justify-center p-4">
        <RankView rankData={rankData} />
        {/* <LeaderBoard title="Rank tuần" since={weekDate} to={weekTo.toLocaleString()} total={""} rewards={[]} data={weekly} />
        <LeaderBoard title="Rank tháng" since={monthDate} to={monthTo.toLocaleString()} total={""} rewards={[]} data={monthly} />
        <LeaderBoard title="Rank quý" since={quarterDate} to={quarterTo} total={""} rewards={[]} data={quarter} />
        <LeaderBoard title="Rank năm" since={yearDate} to={yearTo} total={""} rewards={[]} data={yearly} /> */}
      </div>

      <div className="grid grid-cols-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        <Link className="" href="/expert">
          <StatsCard num={stats.noe} infos={["chuyên gia đang hoạt động"]} />
        </Link>

        <Link href="/expert"><StatsCard num={stats.nosub} infos={["người dùng đang trả phí "]} /></Link>

        {/* <div className="sm:hidden h-[330px] w-full sm:h-64 xl:h-80 2xl:h-96 justify-center col-span-2">

          <Carousel>

            <LeaderBoard title="Rank tuần" since={weekDate} to={weekTo.toLocaleString()} total={""} rewards={[]} data={weekly} />
            <LeaderBoard title="Rank tháng" since={monthDate} to={monthTo.toLocaleString()} total={""} rewards={[]} data={monthly} />
            <LeaderBoard title="Rank quý" since={quarterDate} to={quarterTo} total={""} rewards={[]} data={quarter} />
            <LeaderBoard title="Rank năm" since={yearDate} to={yearTo} total={""} rewards={[]} data={yearly} />
          </Carousel>

        </div> */}
        <Link href="/referalPolicy"><StatsCard num={convert(stats.sumSubValue)} infos={["doanh thu khuyến nghị"]} /></Link>
        <Link href="/preds"><StatsCard num={stats.openPreds} infos={["khuyến nghị đang tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={stats.allPreds} infos={["Tổng số khuyến nghị"]} /></Link>
      </div>
    </>
  )


}
