
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
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
            {/* <CardHeader className=" gap-3 flex h-[50px]">
              <Image src={expert.imageURL} width={50} height={50} className="rounded-full" />
              <Label value={expert.name} />
            </CardHeader> */}
            <CardBody>
              <div className ="flex flex-wrap gap-4" >
              {/* className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center" */}
              <div className="mt-2 ml-2 col-span-6 md:col-span-4 gap-6 md:gap-4 flex">
                  <Image src={expert.imageURL} className="rounded-full w-[160px] h-[160px] " />
                  <div className="block">
                      <p>Tên: {expert.name} </p>
                      {expert.joinDate && (<p>Ngày tham gia {(new Date(expert.joinDate)).toLocaleDateString('vi')} </p>)}
                      {expert.expertType == 'solo' &&  (<><p> Loại chuyên gia: Solo</p> <p>{expert.follower.length} follower</p></>)}
                      {expert.expertType == 'rank' &&  <p>Loại chuyên gia: Rank</p>}
                      <p className={perfConver(expert.yearPerform).color}>Kết quả khuyến nghị: {perfConver(expert.yearPerform).info}</p>
                  </div>
              </div>
                {/* <div className="text-small"> */}
                  {/* {expert.expertType == 'solo' &&  <p>{expert.follower.length} follower</p>}
                  {expert.expertType == 'rank' &&  <p>Ranking</p>}
                 
                  <p className={perfConver(expert.yearPerform).color}>{perfConver(expert.yearPerform).info}</p> */}
                {/* </div> */}
              </div>

            </CardBody>
          </Card>
        </div></Link>
    </div>
  );
}