
import { getPivotDates } from "../lib/statistic";
import LeaderBoard, { BoardProps } from "../ui/rank";
import StatsCard from "../ui/statsCard";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { addComma, convert, perfConver, sortByField } from "../lib/utils";
import { Carousel } from "flowbite-react";
import { serverGetStat, serverQueryCollection } from "../lib/firebaseadmin/adminfirestore";
import { Expert, expertAdminConverter } from "../model/expert";
import RankView from "../ui/rankView";
import { getRankingInfo } from "../lib/server";

const cacheTime = 600

export default async function Home() {


  const stats = await unstable_cache(async () => serverGetStat(), ['getStatsOnHomePage'], { revalidate: cacheTime })()
  const rankData = await getRankData()


  return (
    <>
      {/* <button className="btn btn-primary">Hello daisyUI!</button> */}
      {/* <div className="mockup-phone">
        <div className="camera"></div>
        <div className="display">
          <div className="artboard artboard-demo phone-2">

          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <Carousel slideInterval={5000}>
        <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
      </Carousel>
    </div>
          </div>
        </div>
      </div> */}
      <div className="mt-4 sm:flex sm:justify-center">
        <RankView rankData={rankData} />
      </div>

      <div className="grid grid-cols-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        <Link href="/expert"><StatsCard num={stats.numOfAllExpert} infos={["chuyên gia đang hoạt động"]} /></Link>
        <Link href="/expert"><StatsCard num={stats.numOfAllSub} infos={["người dùng đang trả phí "]} /></Link>
        <Link href="/referalPolicy"><StatsCard num={convert(stats.sumAllSubValue)} infos={["doanh thu khuyến nghị"]} /></Link>
        <Link href="/preds"><StatsCard num={stats.openPreds} infos={["khuyến nghị đang tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={stats.allPreds} infos={["Tổng số khuyến nghị"]} /></Link>

        {/* <div className="sm:hidden h-[330px] w-full sm:h-64 xl:h-80 2xl:h-96 justify-center col-span-2">

          <Carousel>

            <LeaderBoard title="Rank tuần" since={weekDate} to={weekTo.toLocaleString()} total={""} rewards={[]} data={weekly} />
            <LeaderBoard title="Rank tháng" since={monthDate} to={monthTo.toLocaleString()} total={""} rewards={[]} data={monthly} />
            <LeaderBoard title="Rank quý" since={quarterDate} to={quarterTo} total={""} rewards={[]} data={quarter} />
            <LeaderBoard title="Rank năm" since={yearDate} to={yearTo} total={""} rewards={[]} data={yearly} />
          </Carousel>

        </div> */}
      </div>
    </>
  )
}

async function getRankData() {
  const { weekly, monthly, quarter, yearly } = await unstable_cache(async () => getRankingInfo(), ['getRankInfoHomePage'], { revalidate: cacheTime })()

  const { pivotWeek, pivotMonth, pivotQuarter, pivotYear, weekEnd, monthEnd, quarterEnd, yearEnd } = getPivotDates(new Date())
  const weekDate = pivotWeek.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const monthDate = pivotMonth.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const quarterDate = pivotQuarter.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const yearDate = pivotYear.toLocaleDateString('vi')
  const weekTo = weekEnd.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const monthTo = monthEnd.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const quarterTo = quarterEnd.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
  const yearTo = yearEnd.toLocaleDateString('vi')

  const numOfWinner = Number(process.env.NEXT_PUBLIC_NUM_WINNER)
  const totalWeeklyReward = Number(process.env.NEXT_PUBLIC_WEEK_REWARD) / numOfWinner
  const totalMonthlyReward = Number(process.env.NEXT_PUBLIC_MONTH_REWARD) / numOfWinner
  const totalQuarterlyReward = Number(process.env.NEXT_PUBLIC_QUARTER_REWARD) / numOfWinner
  const totalYearlyReward = Number(process.env.NEXT_PUBLIC_YEAR_REWARD)
  const rankData: BoardProps[] = [
    { title: 'Rank Tuần', since: weekDate, to: weekTo, total: addComma(totalWeeklyReward), rewards: [], data: weekly },
    { title: 'Rank Tháng', since: monthDate, to: monthTo, total: addComma(totalMonthlyReward), rewards: [], data: monthly },
    { title: 'Rank Quý', since: quarterDate, to: quarterTo, total: addComma(totalQuarterlyReward), rewards: [], data: quarter },
    { title: 'Rank năm', since: yearDate, to: yearTo, total: addComma(totalYearlyReward), rewards: [], data: yearly }
  ]
  return rankData

}
