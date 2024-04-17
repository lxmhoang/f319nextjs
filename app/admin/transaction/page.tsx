'use client'

import ReviewExpert from "app/ui/admin/reviewExpert";
import { useUserInfo } from "app/lib/firebase/getUser";
import { Button } from "@/app/ui/button";
import Link from "next/link";

export default function Home() {
  const [user, role] = useUserInfo(true)

    return    (
<>  
Transaction Page
      {/* <div>{JSON.stringify(role)}</div>
      <div>{JSON.stringify(user)}</div> */}
      <div className="p-8"><ReviewExpert /></div>
      <Link href="/admin/transaction/new">
      <Button >Add new transaction </Button>
      </Link>
      </>
    );

}
