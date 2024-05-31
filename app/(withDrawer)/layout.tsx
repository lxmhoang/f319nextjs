
import BottomNav from "../ui/botnav";
import TopNav from "../ui/topnav";

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <>
      <TopNav />

      <div className=" mb-[54px]">

        {children}
      </div>
      <div className="fixed bottom-0 sm:hidden w-full z-10">
        <BottomNav />
      </div>
    </>
  );
}
