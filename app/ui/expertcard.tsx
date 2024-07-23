
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
          <Card className="w-full sm:w-[280px] m-1 dark:bg-gray-500 bg-gray-100">
            <CardHeader className=" gap-3 flex h-[50px]">
              {expert.imageURL && <Image priority={true} src={expert.imageURL} width={30} height={30} className="rounded-full" alt={""} />}
              <Label value={expert.name} />
            </CardHeader>
            <CardBody>
              <div className="block">
                <div className="text-small">
                  {expert.expertType == 'solo' && !expert.staticFollowerNum  &&  <p>{expert.follower ? expert.follower.length : 0} người theo dõi</p>}
                  {expert.expertType == 'solo' && expert.staticFollowerNum &&  <p>{expert.staticFollowerNum} người theo dõi</p>}
                  {expert.expertType == 'rank' &&  (
                  <p>Rank</p>
                  )}
                  <Divider className="mt-4 mb-4" />
                  
                  {(expert.weekPerform) &&  <p className={perfConver(expert.weekPerform).color}>
                    Tuần {perfConver(expert.weekPerform).info}</p>}
                  {( expert.monthPerform) &&  <p className={perfConver(expert.monthPerform).color}>Tháng {perfConver(expert.monthPerform).info}</p>}
                  {(expert.quarterPerform) &&  <p className={perfConver(expert.quarterPerform).color}>Quý {perfConver(expert.quarterPerform).info}</p>}
                  {(expert.yearPerform) &&  <p className={perfConver(expert.yearPerform).color}>Năm {perfConver(expert.yearPerform).info}</p>}
                
                </div>
              </div>

            </CardBody>
          </Card>
        </div></Link>
    </div>
  );
}