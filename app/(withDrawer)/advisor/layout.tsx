
import SideNav from "@/app/ui/expert/sidenav";

function Layout({ children }: { children: React.ReactNode }) {
  
    return (
      <div className="flex h-min-screen flex-col md:flex-row md:overflow-hidden">
          <SideNav />
        <div className="flex-grow overflow-y-auto md:pl-8">{children}</div>
      </div>
    );
  }

  export default Layout