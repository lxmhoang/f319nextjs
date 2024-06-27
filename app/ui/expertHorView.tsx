
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Image from 'next/image'
import Link from 'next/link'
import { storage } from "../lib/firebase/firebase";
import { getDownloadURL, ref } from 'firebase/storage';
import { Label } from "flowbite-react";
import { Expert } from "../model/expert";
import { perfConver } from "../lib/utils";
import { useEffect, useState } from "react";

export default function ExpertHorView({ expertInfo }: { expertInfo: string }) {
  const expert: Expert = JSON.parse(expertInfo)

  return (
    <div className="">
      {/* {expert.avatar} */}
      <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}>
        <div className="p-2 rounded-sm">
          <Card className="w-full h-[200px] m-1 bg-gray-500">
            <CardBody>
              <div className ="flex flex-wrap gap-4" >
              {/* className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center" */}
              <div className="mt-2 ml-2 col-span-6 md:col-span-4 gap-6 md:gap-4 flex">
                  <Image width={100} height={100} priority={true} src={expert.imageURL} className="rounded-full w-[160px] h-[160px] " alt={""} 
   />
                  <div className="block">
                      <p>Tên: {expert.name} </p>
                      {expert.joinDate && (<p>Ngày tham gia {(new Date(expert.joinDate)).toLocaleDateString('vi')} </p>)}
                      {expert.expertType == 'solo' &&  (<><p> Loại chuyên gia: Solo</p> <p>{expert.follower.length} follower</p></>)}
                      {expert.expertType == 'rank' &&  <p>Loại chuyên gia: Rank</p>}
                      <p className={perfConver(expert.yearPerform).color}>Kết quả khuyến nghị: {perfConver(expert.yearPerform).info}</p>
                  </div>
              </div>
              </div>

            </CardBody>
          </Card>
        </div></Link>
    </div>
  );
}