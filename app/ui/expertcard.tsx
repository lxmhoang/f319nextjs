
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Link from 'next/link'
import { storage } from "../lib/firebase/firebase";
import { getDownloadURL, ref } from 'firebase/storage';
import { Label } from "flowbite-react";
import { Expert } from "../model/expert";
import { perfConver } from "../lib/utils";
import { useEffect, useState } from "react";
import Image from 'next/image'

export default function ExpertCard({ expertInfo }: { expertInfo: string }) {
  const expert: Expert = JSON.parse(expertInfo)

  return (
    <div className="">
      {/* {expert.avatar} */}
      <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}>
        <div className="p-2 rounded-sm">
          <Card className="w-[180px] m-1 dark:bg-gray-500 bg-slate-400">
            <CardHeader className=" gap-3 flex h-[50px]">
              {expert.imageURL && <Image priority={true} src={expert.imageURL} width={30} height={30} className="rounded-full" alt={""} />}
              <Label value={expert.name} />
            </CardHeader>
            <CardBody>
              <div className="block">
                <div className="text-small">
                  {expert.expertType == 'solo' &&  <p>{expert.follower.length} follower</p>}
                  {expert.expertType == 'rank' &&  <p>Ranking</p>}
                  
                  {expert.yearPerform &&  <p className={perfConver(expert.yearPerform).color}>{perfConver(expert.yearPerform).info}</p>}
                </div>
              </div>

            </CardBody>
          </Card>
        </div></Link>
    </div>
  );
}