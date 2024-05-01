'use client'
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (

    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="flex-grow p-2 overflow-auto md:p-12">{children}</div>
    </div>
  );
}
