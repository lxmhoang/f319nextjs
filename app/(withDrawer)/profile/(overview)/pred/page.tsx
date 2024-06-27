import { useAppContext } from "@/app/lib/context";
import { getFollowExpertByIDList, getObservingPredsByExpertIDList } from "@/app/lib/firebaseadmin/adminfirestore";
import { getMyFollowingExpertIDs } from "@/app/lib/server";
import { Expert } from "@/app/model/expert";
import ExpertCard from "@/app/ui/expertcard";
import PredsUserView from "@/app/ui/predsUserView";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default async function Page() {
  const expertIDs = await getMyFollowingExpertIDs()
  console.log('expertIDs ' + JSON.stringify(expertIDs))
  const experts = await getFollowExpertByIDList(expertIDs)
  const preds = expertIDs.length > 0 ? await getObservingPredsByExpertIDList(expertIDs) : []
  console.log('result ' + JSON.stringify(preds))

  // const {user} = useAppContext()
  // const [experts, setExperts] = useState<Expert[]>([])


  // useEffect(() => {
  //   const fetchData = async (list: string[]) => {
  //     const result = await getFollowExpertByIDList(list)
  //     setExperts(result)
  //   }
  //   if (user) {

  //     const list =  Object.keys(user.following) 
  //     console.log('aaaaa ' + JSON.stringify(user.following))
  //     fetchData(list)
  //   }


  // }, [user])



  return (


    <div>
      <div>
        {experts.length > 0 ?
          (<>
            Danh sach chuyen gia dang theo doi

            {experts.map((item) => {
              return <div key={item.id} >
                <ExpertCard expertInfo={JSON.stringify(item)} />
              </div>

            })}
            {
              preds.length > 0 ? (
                <>
                  <Divider />
                  <div>
                    <PredsUserView preds={preds} />
                  </div></>
              ) : (<>Chưa có khuyến nghị nào </>)
            }
          </>) : (<>Chưa theo dõi chuyên gia nào</>)
        }
      </div>
    </div>
  )
}