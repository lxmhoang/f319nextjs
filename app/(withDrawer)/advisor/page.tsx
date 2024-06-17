
import ExpertCard from "@/app/ui/expertcard";
import { Expert } from "@/app/model/expert";
import { getAdvisor } from "@/app/lib/server";
import { redirect } from "next/navigation";
import MyExpertView from "@/app/ui/expert/my-expert-view";

export default async function Page() {
  const userExpertInfo = await getAdvisor()
  if (!userExpertInfo.expert) {
    redirect('/advisor/register')
  }
  // console.log('userExpertInfo' + JSON.stringify(userExpertInfo))
  return (
    <div className="p-1">
      <MyExpertView expert={userExpertInfo.expert} />
    </div>
  )
}
