'use client'
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    return (
        <div className="p-10">{children}</div>
    );
  }