
import { getCurrentUser } from "@/app/lib/firebaseadmin/adminauth";
import SideNav from "app/ui/profile/sidenav";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()
    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
    );
  }