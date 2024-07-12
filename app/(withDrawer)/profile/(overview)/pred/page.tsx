'use client'
import { useAppContext } from "@/app/lib/context";
import { getExperts, getFollowExpertByIDList } from "@/app/lib/server";
import { Expert } from "@/app/model/expert";
import ExpertCard from "@/app/ui/expertcard";
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
          const rankExpert =  await getExperts( [{ key: "status", operator: "==", value: "activated" },{ key: "expertType", operator: "==", value: "rank" }])
          result = [...result, ...rankExpert]

        }
        setExperts(result)
      }

      const expertIDs = user.following.map((item) => { return item.eid })

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
          </>) : (<>Chưa theo dõi chuyên gia nào</>)
        }
        { }
      </div>
    </div>
  )
}