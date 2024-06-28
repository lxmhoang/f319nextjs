import { ExpertFormComponent } from "@/app/ui/profile/expert-form";



export default async function Page() {

  return (
  
    <div className="p-5">
      { <ExpertFormComponent expertInfo={undefined} />}
    </div>
  )
}