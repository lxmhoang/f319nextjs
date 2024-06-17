'use client'

import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../../ui/breadcrumbs";
import { Divider } from "@nextui-org/react";


export default function Landing() {

  const searchParams = useSearchParams()
  const refID = searchParams ? searchParams.get('ref')?.toString() : undefined
  
  var cache = null
  try {
    if (refID && (typeof window !== "undefined")) {
      localStorage.setItem("referalID", refID)
    }
    cache = localStorage.getItem("referalID")

  } catch (e) {

  }
  return (
    <>
      <Breadcrumbs breadcrumbs={[
        { label: 'Danh sach chuyen gia', href: '/' }
      ]} />
      {cache ?? "no cachesss"}
      <Divider />
      {refID}
    </>
  );
}
