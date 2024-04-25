'use client'
import { Card, CardBody, CardFooter, CardHeader, Divider, Image, User } from "@nextui-org/react";
import Link from 'next/link'
import { useDownloadURL } from "react-firebase-hooks/storage";
import { storage } from "../lib/firebase/firebase";
import { getStorage, ref as storageRef } from 'firebase/storage';
import { Expert } from "../lib/definitions";

export default function ExpertCard({ expert }: { expert:Expert }) {

  const [imagedownloadURL, loading, error] = useDownloadURL(storageRef(storage, expert.avatar));
  console.log("aaaaaa" + expert.avatar);


  return (
    <Link href={{ pathname: `/expertdetails/${expert.id}` }}>
      <div className=" p-2 max-w-80 rounded-sm">
        <Card className="">
          <CardHeader className=" gap-3 flex">
          
          <User name={expert.name}
                avatarProps={{
                  src:  imagedownloadURL 
                }}
              />
          </CardHeader>


          <Divider />
          <CardBody>
          {/* {
            <Image className="max-w-40 max-h-40"
              alt="nextui logo"
              radius="sm"
              // fill = "true"
              src={imagedownloadURL}
            />} */}
            <ul>
              <p>Số người đăng ký: 44</p>
              <p>Tỷ lệ lãi 12/94</p>

            </ul>

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