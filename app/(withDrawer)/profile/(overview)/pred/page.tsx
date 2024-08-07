'use client'
import { useAppContext } from "@/app/lib/context";
import { clientGetExperts, getExperts, getFollowExpertByIDList } from "@/app/lib/server";
import { Expert } from "@/app/model/expert";
import ExpertCard from "@/app/ui/expertcard";
import { Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Page() {
  const { user } = useAppContext()

  const [experts, setExperts] = useState<Expert[]>()

  useEffect(() => {


    if (user) {

      const fetchExperts = async (ids: string[], joinRank: boolean) => {
        const experts = await getFollowExpertByIDList(ids)
        var result = experts
        if (joinRank) {
          const res =  await clientGetExperts( [{ key: "status", operator: "==", value: "activated" },{ key: "expertType", operator: "==", value: "rank" }])
          const rankExpert: Expert[] = JSON.parse(res)
          result = [...result, ...rankExpert]

        }
        setExperts(result)
      }

      const expertIDs = user.following.filter((item) => { return item.endDate > Date.now()}).map((item) => { return item.eid })

      if (expertIDs.length > 0 || user.joinRank) {
        fetchExperts(expertIDs, user.joinRank)
      } else {
        setExperts([])
      }
    }

  }
    , [user]

  )

  return (
    <div>
      <div>
        {(experts && experts.length > 0) ?
          (<>
            Danh sach chuyen gia dang theo doi
            <div className="mb-4 flex flex-wrap">
              {experts.map((item) => {
                return <div key={item.id} >
                  <ExpertCard expertInfo={JSON.stringify(item)} />
                </div>
              })}
            </div>
          </>) : (<>Chưa theo dõi chuyên gia nào <Link href="/expert">Vào đây </Link> để chọn 1 chuyên gia theo dõi</>)
        }
        { }
      </div>
    </div>
  )
}