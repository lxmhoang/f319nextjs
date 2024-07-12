"use client"
// import WithDrawTransCreationForm from "@/app/ui/profile/create-trans-form";
import { useAppContext } from "@/app/lib/context";
import FeedbackForm from "@/app/ui/profile/feedback-form";

export default function Page() {

  const { user } = useAppContext()

  return (<>
    {
      user ?
      (<FeedbackForm user={user} />) :
      (<>Loading</>)
    }
  </>)
}