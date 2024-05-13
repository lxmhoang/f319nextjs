"use client"
import TransCreationForm from "@/app/ui/profile/create-trans-form";
import { useAppContext } from "@/app/lib/context";

export default function Page() {

  const { user } = useAppContext()

  return (<>
    {
      user ?
      (<TransCreationForm user={user} transactionType="withDraw" />) :
      (<>Loading</>)
    }
  </>)
}