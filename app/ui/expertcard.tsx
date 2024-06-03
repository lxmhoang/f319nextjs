'use client'
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import Link from 'next/link'
import { storage } from "../lib/firebase/firebase";
import { getDownloadURL, ref } from 'firebase/storage';
import { Label } from "flowbite-react";
import { Expert } from "../model/expert";
import { perfConver } from "../lib/utils";
import { useEffect, useState } from "react";

export default function ExpertCard({ expert }: { expert: Expert }) {


  useEffect(() => {

    const getImageURL = async (urlStr: string) => {
      const url = await getDownloadURL(ref(storage, urlStr))
      setImageURL(url)
    }
    if (expert.avatar && expert.avatar.length > 0) {
        getImageURL(expert.avatar)
    }
  }, [expert.avatar])

  const [imagedownloadURL, setImageURL] = useState<string>()


  return (
    <div className=" max-w-sm">
      {/* {expert.avatar} */}
      <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}>
        <div className="p-2 rounded-sm">
          <Card className="">
            <CardHeader className=" gap-3 flex">

              <Image src={imagedownloadURL} width={120} className="rounded-full" />
              <div className="block">

                <Label value={expert.name} />
                <Divider />
                <div className="text-small">

                   {expert.follower.length} follower
                </div>
                <div className="flex"><p className={perfConver(expert.yearPerform).color}>{perfConver(expert.yearPerform).info}</p></div>

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
              {/* <div className="flex w-1/2"> Tuần:<p className={perfConver(expert.weekPerform).color}>	&nbsp;&nbsp;{perfConver(expert.weekPerform).info}</p></div>
              <div className="flex w-1/2"> Tháng: <p className={perfConver(expert.monthPerform).color}>	&nbsp;&nbsp;{perfConver(expert.monthPerform).info}</p></div>
              <div className="flex w-1/2"> Quý:<p className={perfConver(expert.quarterPerform).color}>	&nbsp;&nbsp;{perfConver(expert.quarterPerform).info}</p></div> */}
             
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