"use client"
// import WithDrawTransCreationForm from "@/app/ui/profile/create-trans-form";
import { useAppContext } from "@/app/lib/context";
import { TranType } from "@/app/model/transaction";
import WithDrawTransCreationForm from "@/app/ui/profile/withdraw-tran-form";

export default function Page() {

  const { user } = useAppContext()

  return (<>
    {
      user ?
      (<WithDrawTransCreationForm user={user} />) :
      (<>Loading</>)
    }
  </>)
}