'use client'
import { Card, CardBody, CardFooter, CardHeader, Divider, Image, User } from "@nextui-org/react";
import Link from 'next/link'
import { useDownloadURL } from "react-firebase-hooks/storage";
import { storage } from "../lib/firebase/firebase";
import { getStorage, ref as storageRef } from 'firebase/storage';
import { Label, Table } from "flowbite-react";
import { Expert } from "../model/expert";
import { perfConver } from "../lib/utils";

export default function ExpertCard({ expert }: { expert: Expert }) {

  const [imagedownloadURL, loading, error] = useDownloadURL(storageRef(storage, expert.avatar ?? "uploads/profileImage/1111"));


  return (
    <div className=" max-w-sm">{error?.message}
    <div>{expert.selfIntro}</div>
      {/* {expert.avatar} */}
      <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}>
        <div className="p-2 rounded-sm">
          <Card className="">
            <CardHeader className=" gap-3 flex">

            <Image  src={imagedownloadURL} width={120}/>
              <div className="block">
              
                <Label value={expert.name} />
              <div className="text-small">

              Follower {expert.follower.length}
              </div>
            </div>
              {/* <User name={expert.name}
                // avatarProps={{
                //   src: imagedownloadURL
                // }}
                description={expert.shortIntro}
              /> */}
            </CardHeader>
            <Divider />
            <CardBody>
      
              {/* <div className="flex w-1/2"> 	&nbsp;6 th:<p className="text-sky-400">	&nbsp;&nbsp;{(expert.halfYear!*100).toFixed(2) + "%"}</p></div>
              <div className="flex w-1/2"> 12 th:<p className="text-sky-400">	&nbsp;&nbsp;{(expert.oneYear!*100).toFixed(2) + "%"}</p></div> */}
              <div className="flex w-1/2"> Tuần:<p className={perfConver(expert.weekPerform).color}>	&nbsp;&nbsp;{perfConver(expert.weekPerform).info}</p></div>
              <div className="flex w-1/2"> Tháng: <p className={perfConver(expert.monthPerform).color}>	&nbsp;&nbsp;{perfConver(expert.monthPerform).info}</p></div>
              <div className="flex w-1/2"> Quý:<p className={perfConver(expert.quarterPerform).color}>	&nbsp;&nbsp;{perfConver(expert.quarterPerform).info}</p></div>
              <div className="flex w-1/2"> Năm:<p className={perfConver(expert.yearPerform).color}>	&nbsp;&nbsp;{perfConver(expert.yearPerform).info}</p></div>
      
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