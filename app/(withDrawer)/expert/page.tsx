'use server'
import ExpertListing from "../../ui/expert-listing";
import { firestoreQueryCollection } from "@/app/lib/firebaseadmin/adminfirestore";
import { clientGetExperts, getExperts } from "@/app/lib/server";
import { Expert, expertAdminConverter } from "@/app/model/expert";
import { revalidatePath, unstable_cache } from "next/cache";

const cacheTime = 1

export default async function Page() {
  
    const res = await unstable_cache(async () =>  clientGetExperts([{key: "status", operator: "==", value: "activated"}], true), ['getExpertsListing'], {revalidate: cacheTime})()
    const experts: Expert[] = JSON.parse(res)
    return (
      <>
       <ExpertListing expertList={experts} />
    </>
    )
  }