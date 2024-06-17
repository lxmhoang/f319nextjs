// 'use client'
import MyProfileOverView from '@/app/ui/profile/my-profile-overview';
import { headers } from 'next/headers';

// import { useAppContext } from "@/app/lib/context";s
export default async function Page() {

  const headersList = headers();
  const host =  headersList.get('host') ?? ""; // to get domain
  const url = headersList.get('next-url'); // to get url

  return (
    <>
   <MyProfileOverView host={host} />
    
    </>
  )



    }