'use server'
import ExpertListing from "../../ui/expert-listing";
import { serverQueryCollection } from "@/app/lib/firebaseadmin/adminfirestore";
import { expertAdminConverter } from "@/app/model/expert";
import { revalidatePath, unstable_cache } from "next/cache";

export default async function Page() {
  
    const experts = await unstable_cache(async () =>  serverQueryCollection('expert', [{key: "status", operator: "==", value: "activated"}], expertAdminConverter), ['getExpertsOnHomePage'], {revalidate: 1})()

    return (
      <>
       <ExpertListing expertList={experts} />
    </>
    )
  }