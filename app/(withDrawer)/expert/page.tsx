'use server'
import ExpertListing from "../../ui/expert-listing";
import { serverQueryCollection } from "@/app/lib/firebaseadmin/adminfirestore";
import { expertAdminConverter } from "@/app/model/expert";
import { revalidatePath, unstable_cache } from "next/cache";

const cacheTime = 1

export default async function Page() {
  
    const experts = await unstable_cache(async () =>  serverQueryCollection('expert', [{key: "status", operator: "==", value: "activated"}], expertAdminConverter), ['getExpertsListing'], {revalidate: cacheTime})()

    return (
      <>
       <ExpertListing expertList={experts} />
    </>
    )
  }