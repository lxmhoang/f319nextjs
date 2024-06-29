'use client'
import { useAppContext } from '@/app/lib/context';
import NavLinks from './nav-links';
import { Divider } from '@nextui-org/react';

export default function SideNav() {

  const userInfo = useAppContext()
  const type = userInfo.user?.expertType
  if (!type) {
    return <>
    </>
  }
  return (

    <div className="w-full flex-none md:w-64">
    <div className="flex h-3/4 flex-col px-3 py-4 md:px-2">
      <div className="flex grow  flex-wrap  justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks expertType={type} />
        <div className=" h-auto w-full grow rounded-md md:block"></div>
       
      </div>

      <Divider className='sm:hidden' />
    </div>
    </div>
  );
}
