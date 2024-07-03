// 'use client'
import MyActivityView from '@/app/ui/profile/MyActivityView';
import MyProfileOverView from '@/app/ui/profile/my-profile-overview';
import { headers } from 'next/headers';
export default async function Page() {

  const headersList = headers();
  const host = headersList.get('host') ?? ""; // to get domain
  const url = headersList.get('next-url'); // to get url

  return (
    <>
    <div>
      <MyActivityView />
      </div>
    </>
  )
}