import { getMyAdvisorProfile } from "@/app/lib/server";
import { ExpertFormComponent } from "@/app/ui/profile/expert-form";
import { redirect } from "next/navigation";


export default async function Page() {

    const { expert , expired} = await getMyAdvisorProfile()
    if (!expert) {
        redirect('/advisor/register')
    } else if (expired) {
        redirect('/advisor/extend')
    }
    return (
        <ExpertFormComponent expertInfo={JSON.stringify(expert)}  />
    )
}
