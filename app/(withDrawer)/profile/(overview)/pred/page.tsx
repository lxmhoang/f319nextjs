'use client'
import { useAppContext } from "@/app/lib/context";
import { getFollowExpertByIDList } from "@/app/lib/firebaseadmin/adminfirestore";
import { Expert } from "@/app/model/expert";
import ExpertCard from "@/app/ui/expertcard";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default  function Page({params} : {params: {id: string}} ) {

  const {user} = useAppContext()
  const [experts, setExperts] = useState<Expert[]>([])
  

  useEffect(() => {
    const fetchData = async (list: string[]) => {
      const result = await getFollowExpertByIDList(list)
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
          return <div  key={item.id} >
            <ExpertCard expertInfo={JSON.stringify(item)} />
          </div>

        })}

    

    <Divider />
        Danh sach Khuyen nghi
    <Divider />
     .....

      </div>
      
      )
    }