

import Link from "next/link"

export default async function Page({ params }: { params: { id: string } }) {


  return (



      <div className="flex flex-col gap-2">

    <Link href="/profile">profile</Link>
    <Link href="/advisor">profile expert</Link>

      
      </div>

      )
  }