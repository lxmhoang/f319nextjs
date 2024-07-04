import MyProfileOverView from '@/app/ui/profile/my-profile-overview';
import { headers } from 'next/headers';
export default async function Page() {

  const headersList = headers();
  const host = headersList.get('host') ?? ""; // to get domain
  const schema = headersList.get('x-forwarded-proto') ?? ""
  const domain = schema + '://' + host // to get url

  return (
    <>
      <MyProfileOverView domain={domain} />
    </>
  )
}