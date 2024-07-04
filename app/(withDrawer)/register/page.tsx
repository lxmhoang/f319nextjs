import { ExpertFormComponent } from "@/app/ui/profile/expert-form";



export default async function Page() {

  return (
  
    <div className="pt-10">
      { <ExpertFormComponent expertInfo={undefined} />}
    </div>
  )
}