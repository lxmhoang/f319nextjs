'use client'
import { useAppContext } from "@/app/lib/context";
import { Expert } from "@/app/lib/definitions";
import { clientFetchObject, getExperts } from "@/app/lib/firebase/firestore";
import { getFollowExpertByIDList } from "@/app/lib/firebaseadmin/adminfirestore";
import ExpertCard from "@/app/ui/expertcard";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default  function Page({params} : {params: {id: string}} ) {

  const {user} = useAppContext()
  const [experts, setExperts] = useState<Expert[]>([])
  

  useEffect(() => {
    const fetchData = async (list: string[]) => {
      const result = await getFollowExpertByIDList(list)

      console.log('result ' + JSON.stringify(result))
      setExperts(result)
    }
    if (user) {

      const list =  Object.keys(user.following) 
      fetchData(list)
    }


  }, [user])

  
  
    return (
      
      
      <div>
        <div>
        Danh sach chuyen gia dang theo doi
        </div>
        {experts.map((item) => {
          return <div className="max-w-sm" key={item.id} >
            <ExpertCard expert={item} />
          </div>

        })}

    

    <Divider />
        Danh sach Khuyen nghi
    <Divider />
     .....

      </div>
      
      )
    }