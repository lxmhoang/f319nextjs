import { Card, CardBody, CardFooter, CardHeader, Divider, Image } from "@nextui-org/react";
import Link from 'next/link'
import { useDownloadURL } from "react-firebase-hooks/storage";
import { storage } from "../lib/firebase/firebase";
import { getStorage, ref as storageRef } from 'firebase/storage';

export default function ExpertCard({expert}: {expert: {avatar: string,imageURL: string, id: string, name: string, followerNum: number, selfIntro: string, shortInfo: string}}) {
  
  const [imagedownloadURL, loading, error] = useDownloadURL(storageRef(storage, expert.avatar));
  console.log("aaaaaa" + expert.avatar);


    return (
      <Link href={{pathname:`/expertdetails/${expert.id}`}}>
    <div className="border p-2 rounded-sm">
    <Card className="">
  <CardHeader className=" gap-3">
    {<Image className="max-w-72 max-h-72"
      alt="nextui logo"
      radius="sm"
      // fill = "true"
      src = {imagedownloadURL}
    /> }
  </CardHeader>

  <div className="flex flex-wrap">
      <p className="text-small text-default-500">{expert.name}</p>
    </div>
  <Divider/>
  <CardBody>

    <p>Tỷ lệ lãi 12/94</p>
  </CardBody>
  {/* <Divider/> */}
  {/* <CardFooter> */}
    {/* <Link
      isExternal
      showAnchorIcon
      href="https://github.com/nextui-org/nextui"
    >
     {expert.selfIntro}
    </Link> */}
  {/* </CardFooter> */}
</Card>
</div></Link>);
}