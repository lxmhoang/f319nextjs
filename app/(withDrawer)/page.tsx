'use client'
import StatsCard from "../ui/statsCard";
import Link from "next/link";



export default function Home() {

  return (
    <>
      <div className="grid grid-cols-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        <Link className="" href="/expert">
          <StatsCard num={70} infos={["chuyên gia đang hoạt động"]} />
        </Link>

        <Link href="/expert"><StatsCard num={439} infos={["người dùng đang trả phí "]} /></Link>
        
        <Link href="/referalPolicy"><StatsCard num={671} infos={["tr phí giới thiệu"]} /></Link>
        <Link href="/preds"><StatsCard num={19} infos={["khuyến nghị đang theo tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={2819} infos={["khuyến nghị đã kết thúc"]} /></Link>

        <Link href="/referalPolicy"><StatsCard num={671} infos={["tr phí giới thiệu"]} /></Link>
        <Link href="/preds"><StatsCard num={19} infos={["khuyến nghị đang theo tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={2819} infos={["khuyến nghị đã kết thúc"]} /></Link>

        <Link href="/referalPolicy"><StatsCard num={671} infos={["tr phí giới thiệu"]} /></Link>
        <Link href="/preds"><StatsCard num={19} infos={["khuyến nghị đang theo tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={2819} infos={["khuyến nghị đã kết thúc"]} /></Link>

        <Link href="/referalPolicy"><StatsCard num={671} infos={["tr phí giới thiệu"]} /></Link>
        <Link href="/preds"><StatsCard num={19} infos={["khuyến nghị đang theo tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={2819} infos={["khuyến nghị đã kết thúc"]} /></Link>

        <Link href="/referalPolicy"><StatsCard num={671} infos={["tr phí giới thiệu"]} /></Link>
        <Link href="/preds"><StatsCard num={19} infos={["khuyến nghị đang theo tiếp diễn"]} /></Link>
        <Link href="/expert"><StatsCard num={2819} infos={["khuyến nghị đã kết thúc"]} /></Link>


      </div>

    </>
  );
}
