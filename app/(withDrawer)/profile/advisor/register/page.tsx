'use client'
import { useAppContext } from "@/app/lib/context";
import ExpertRegisterForm from "@/app/ui/profile/create-expert-form";


export default function Page() {

  const { user } = useAppContext()

  console.log("user : " + JSON.stringify(user))
  return (
  
    <div className="p-5">

        {  user ? (<ExpertRegisterForm userInfo={user} />) : (<>Loading .... </>)
        }
        
    </div>
  )
}