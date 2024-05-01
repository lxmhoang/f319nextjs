'use client'

import ReviewExpert from "@/app/ui/admin/reviewExpert";
import { Button } from "@/app/ui/button";
import Link from "next/link";

export default function Home() {

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
