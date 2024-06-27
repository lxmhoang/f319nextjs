
import { ExpertFormComponent } from "@/app/ui/profile/expert-form";


export default async function Page() {

  return (
  
    <div className="p-1">
      { <ExpertFormComponent expertInfo={undefined} />}
    </div>
  )
}