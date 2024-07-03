
import { getAdvisor } from "@/app/lib/server";
import { redirect } from "next/navigation";
import MyExpertView from "@/app/ui/expert/my-expert-view";

export default async function Page() {
  const userExpertInfo = await getAdvisor()
  if (!userExpertInfo.expert) {
    redirect('/register')
  } else if (userExpertInfo.expired) {
    redirect('/advisor/extend')
  }
  return (
    <div className="p-1">
      <MyExpertView expert={userExpertInfo.expert} />
    </div>
  )
}
