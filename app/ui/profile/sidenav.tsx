import Link from 'next/link';
// import NavLinks from '';
// import AcmeLogo from '@/app/ui/acme-logo';
// import { HeartIcon, PowerIcon } from '@heroicons/react/24/outline';
import NavLinks from './nav-links';
import { PowerIcon } from '@heroicons/react/16/solid';

export default function SideNav() {
  return (
    <div className="flex h-3/4 flex-col px-3 py-4 md:px-2">
      {/* <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <HeartIcon />
        </div>
      </Link> */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className=" h-auto w-full grow rounded-md md:block"></div>
        {/* <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form> */}
      </div>
    </div>
  );
}
