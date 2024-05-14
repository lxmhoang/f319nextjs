'use client'
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { usePathname } from "next/navigation";
import TopBar from "../ui/topbar";
import SideBar from "../ui/sidebar";
import BottomNav from "../ui/botnav";
import { useState } from "react";
import TopNav from "../ui/topnav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  return (
    <>
<TopNav />
{/* <TopBar hamClick={() => setIsOpen(true) } /> */}

<div className="mt-[66px] mb-[54px]">

  {/* <SideBar handleClose={handleClose } isOpen={isOpen} /> */}
  {children}
</div>
<div className="fixed bottom-0 sm:hidden w-full z-10">
  <BottomNav />
</div>
    </>
  );
}
