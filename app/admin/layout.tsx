"use client"

import { redirect } from "next/navigation";
import SideNav from "../ui/admin/sidenav";
import { useState } from "react";
import { useAppContext } from "@/app/lib/context";

export default function Layout({ children }: { children: React.ReactNode }) {

  const { user } = useAppContext()
  if ( user && user.isAdmin !=  true) {
    console.log("let redirect" + JSON.stringify(user))
    redirect("/")
  }
  return (
    <div>{
      user ?
        (
          <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none sm:w-64">
              <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
          </div>
        ) :
        (
          <p>Please login </p>
      )
      }</div>
  );
}