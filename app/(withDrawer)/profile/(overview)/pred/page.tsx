'use client'
import { useAppContext } from "@/app/lib/context";
import { getFollowExpertByIDList } from "@/app/lib/firebaseadmin/adminfirestore";
import { getMyFollowingExpertIDs } from "@/app/lib/server";
import { Expert } from "@/app/model/expert";
import ExpertCard from "@/app/ui/expertcard";
import { useEffect, useState } from "react";

export default function Page() {
  const { user } = useAppContext()
  // const expertIDs = await getMyFollowingExpertIDs()
  // console.log('expertIDs ' + JSON.stringify(expertIDs))
  // const experts = await getFollowExpertByIDList(expertIDs)


  const [experts, setExperts] = useState<Expert[]>()

  useEffect(() => {


    if (user) {
      const fetchExperts = async (ids: string[]) => {
        const result = await getFollowExpertByIDList(ids)
        setExperts(result)
      }

      const expertIDs = user.following.map((item) => { return item.eid })
      if (expertIDs.length > 0) {
        fetchExperts(expertIDs)
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