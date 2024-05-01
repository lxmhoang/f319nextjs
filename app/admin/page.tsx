'use client'

import Link from "next/link";
import ReviewExpert from "../ui/admin/reviewExpert";

export default function Home() {
  

    return    (
<>  

      {/* <div>{JSON.stringify(role)}</div>
      <div>{JSON.stringify(user)}</div> */}
      <div className="p-8"><ReviewExpert /></div>
      </>
    );

}
