'use client'
import Form from "@/app/ui/profile/create-expert-form";
import { useAppContext } from "@/app/lib/context";


export default function Page() {

  const { user } = useAppContext()

  console.log("user : " + JSON.stringify(user))
  return (
  
    <div className="p-5">

        {  user ? (<Form userInfo={user} />) : (<>Loading .... </>)
        }
        
    </div>
  )
}