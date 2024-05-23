'use client'
import { Card, CardBody, CardFooter, CardHeader, Divider, Image, User } from "@nextui-org/react";
import Link from 'next/link'
import { useDownloadURL } from "react-firebase-hooks/storage";
import { storage } from "../lib/firebase/firebase";
import { getStorage, ref as storageRef } from 'firebase/storage';
import { Expert } from "../lib/definitions";
import { Table } from "flowbite-react";

export default function ExpertCard({ expert }: { expert: Expert }) {

  const [imagedownloadURL, loading, error] = useDownloadURL(storageRef(storage, expert.avatar ?? "uploads/profileImage/1111"));


  return (
    <div>{error?.message}
      {expert.avatar}
      <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}>
        <div className=" p-2   rounded-sm">
          <Card className="">
            <CardHeader className=" gap-3 flex">
              <User name={expert.name}
                avatarProps={{
                  src: imagedownloadURL
                }}
              />
              {expert.follower.length}
            </CardHeader>
            <Divider />
            <CardBody>
      
              <div className="flex w-1/2"> 	&nbsp;6 th:<p className="text-sky-400">	&nbsp;&nbsp;{(expert.halfYear!*100).toFixed(2) + "%"}</p></div>
              <div className="flex w-1/2"> 12 th:<p className="text-sky-400">	&nbsp;&nbsp;{(expert.oneYear!*100).toFixed(2) + "%"}</p></div>
              <div className="flex w-1/2"> 24 th:<p className="text-sky-400">	&nbsp;&nbsp;{(expert.twoYear!*100).toFixed(2) + "%"}</p></div>
      
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
        </div></Link>
    </div>
      );
}