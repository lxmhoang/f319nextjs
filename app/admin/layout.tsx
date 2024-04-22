"use client"

import { redirect } from "next/navigation";
import { useUserInfo } from "../lib/firebase/getUser";
import SideNav from "../ui/admin/sidenav";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, role, loading] = useUserInfo(true)
  if ( loading == false && role.isAdmin !=  true) {
    redirect("/")
  }
    return (
      <div>{
        loading ? 
        (
          <p>Loading </p>
        ) : 
        ( 
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
      )
      }</div>
    );
  }