
import { cache } from "react";
import { getExperts } from "../lib/firebase/firestore";
import { getPivotDates } from "../lib/statistic";
import LeaderBoard from "../ui/rank";
import StatsCard from "../ui/statsCard";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { convert, perfConver } from "../lib/utils";
import { Carousel } from "flowbite-react";
import { activate } from "firebase/remote-config";
import { serverGetStat } from "../lib/firebaseadmin/adminfirestore";

export const revalidate = false

const fetchData = unstable_cache(async () => getExperts(), ['getExpertsOnHomePage'], { revalidate: 60 * 60 * 2 })

export default async function Home() {

  const experts = await unstable_cache(async () => getExperts({ status: "activated" }), ['getExpertsOnHomePage'], { revalidate: 60 * 60 * 2 })()
  const stats = await unstable_cache(async () => serverGetStat(), ['getStatsOnHomePage'], { revalidate: 60 })()



  const monthly = experts.toSorted((n1, n2) => {
    if (n1.monthPerform > n2.monthPerform) {
      return 1;
    }

    if (n1.monthPerform < n2.monthPerform) {
      return -1;
    }
    return 0;
  }).map((item) => {
    return {
      name: item.name,
      perf: perfConver(item.monthPerform)
    }
  })

  const yearly = experts.toSorted((n1, n2) => {
    if (n1.yearPerform > n2.yearPerform) {
      return 1;
    }
    if (n1.yearPerform < n2.yearPerform) {
      return -1;
    }
    return 0;
  }).map((item) => {
    return {
      name: item.name,
      perf: perfConver(item.yearPerform)
    }
  })

  const quarter = experts.toSorted((n1, n2) => {
    if (n1.quarterPerform > n2.quarterPerform) {
      return 1;
    }
    if (n1.quarterPerform < n2.quarterPerform) {
      return -1;
    }
    return 0;
  }).map((item) => {
    return {
      name: item.name,
      perf: perfConver(item.quarterPerform)
    }
  })

  const weekly = experts.toSorted((n1, n2) => {
    if (n1.weekPerform > n2.weekPerform) {
      return 1;
    }
    if (n1.weekPerform < n2.weekPerform) {
      return -1;
    }
    return 0;
  }).map((item) => {
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

  // var options = { day: 'numeric', month: 'numeric' };

  return (
    <>
      {/* <div className="stats shadow">
  
  <div className="stat">
    <div className="stat-figure text-secondary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    </div>
    <div className="stat-title">Downloads</div>
    <div className="stat-value">31K</div>
    <div className="stat-desc">Jan 1st - Feb 1st</div>
  </div>
  
  <div className="stat">
    <div className="stat-figure text-secondary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
    </div>
    <div className="stat-title">New Users</div>
    <div className="stat-value">4,200</div>
    <div className="stat-desc">↗︎ 400 (22%)</div>
  </div>
  
  <div className="stat">
    <div className="stat-figure text-secondary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
    </div>
    <div className="stat-title">New Registers</div>
    <div className="stat-value">1,200</div>
    <div className="stat-desc">↘︎ 90 (14%)</div>
  </div>
  
</div> */}
      {/* {JSON.stringify(pivots[6])} */}
      {/* {JSON.stringify(pivots)} */}


      <div className="hidden sm:flex sm:justify-center">
        <LeaderBoard title="Rank tuần" since={weekDate} to={weekTo.toLocaleString()} total={""} rewards={[]} data={weekly} />
        <LeaderBoard title="Rank tháng" since={monthDate} to={monthTo.toLocaleString()} total={""} rewards={[]} data={monthly} />
        <LeaderBoard title="Rank quý" since={quarterDate} to={quarterTo} total={""} rewards={[]} data={quarter} />
        <LeaderBoard title="Rank năm" since={yearDate} to={yearTo} total={""} rewards={[]} data={yearly} />
      </div>

      <div className="grid grid-cols-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        <Link className="" href="/expert">
          <StatsCard num={stats.noe} infos={["chuyên gia đang hoạt động"]} />
        </Link>

        <Link href="/expert"><StatsCard num={stats.nosub} infos={["người dùng đang trả phí "]} /></Link>

        <div className="sm:hidden h-[330px] w-full sm:h-64 xl:h-80 2xl:h-96 justify-center col-span-2">

          <Carousel>

            <LeaderBoard title="Rank tuần" since={weekDate} to={weekTo.toLocaleString()} total={""} rewards={[]} data={weekly} />
            <LeaderBoard title="Rank tháng" since={monthDate} to={monthTo.toLocaleString()} total={""} rewards={[]} data={monthly} />
            <LeaderBoard title="Rank quý" since={quarterDate} to={quarterTo} total={""} rewards={[]} data={quarter} />
            <LeaderBoard title="Rank năm" since={yearDate} to={yearTo} total={""} rewards={[]} data={yearly} />
          </Carousel>

        </div>
        <Link href="/referalPolicy"><StatsCard num={convert(stats.sumSubValue)} infos={["doanh thu khuyến nghị"]} /></Link>
        <Link href="/preds"><StatsCard num={stats.openPreds} infos={["khuyến nghị đang tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={stats.allPreds} infos={["Tổng số khuyến nghị"]} /></Link>
      </div>
    </>
  )


}
