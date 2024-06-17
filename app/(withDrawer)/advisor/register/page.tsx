'use client'

import { useAppContext } from "@/app/lib/context";
import { ExpertFormComponent } from "@/app/ui/profile/expert-form";


export default function Page() {

  const { user } = useAppContext()

  console.log("user : " + JSON.stringify(user))
  return (
  
    <div className="p-1">
        <ExpertFormComponent expertInfo={undefined} />
    </div>
  )
}