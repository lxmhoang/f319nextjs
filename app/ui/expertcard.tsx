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
    <div className="">
      {/* {expert.avatar} */}
      <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}>
        <div className="p-2 rounded-sm">
          <Card className="w-[200px] m-1 bg-gray-500">
            <CardHeader className=" gap-3 flex h-[40px]">

            <Image src={imagedownloadURL} width={40} height={50} className="rounded-full" />
                <Label value={expert.name} />
             
            </CardHeader>
            <CardBody>
              <div className="block">
                <div className="text-small">
                   <p>{expert.follower.length} follower</p>
                   <p className={perfConver(expert.yearPerform).color}>{perfConver(expert.yearPerform).info}</p>
                </div>
              </div>

            </CardBody>
          </Card>
        </div></Link>
    </div>
  );
}