'use client'

import ReviewExpert from "../ui/admin/reviewExpert";
import { useUserInfo } from "../lib/firebase/getUser";

export default function Home() {
  const [user, role] = useUserInfo(true)

    return    (
<>  
      <div>{JSON.stringify(role)}</div>
      <div>{JSON.stringify(user)}</div>
      <div className="p-8"><ReviewExpert /></div>
      </>
    );

}
