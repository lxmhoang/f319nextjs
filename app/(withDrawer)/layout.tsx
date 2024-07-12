
import BottomNav from "../ui/botnav";
import TopNav from "../ui/topnav";

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <>
      <TopNav />

      <div className="">

        {children}
      </div>
      <div className="h-[60px]">

      </div>
      <div className="fixed bottom-0 block sm:hidden w-full z-10">
        <BottomNav />
      </div>
    </>
  );
}
