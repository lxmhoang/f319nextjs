import { getExperts } from "../lib/firebase/firestore";
import ExpertListing from "../ui/expert-listing";

export default async function Page() {
  
    const experts = await getExperts({status: "activated"})
    return (
      <>
       <ExpertListing expertList={experts} />
    </>
    )
  }