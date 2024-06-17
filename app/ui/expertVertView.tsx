
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import Link from 'next/link'
import { storage } from "../lib/firebase/firebase";
import { getDownloadURL, ref } from 'firebase/storage';
import { Label } from "flowbite-react";
import { Expert } from "../model/expert";
import { perfConver } from "../lib/utils";
import { useEffect, useState } from "react";

export default function ExpertVertView({ expertInfo }: { expertInfo: string }) {
  const expert: Expert = JSON.parse(expertInfo)

  return (
    <div className="p-4">
      {/* {expert.avatar} */}
      {/* <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}> */}
        <div className="p-2 rounded-sm">
          <Card className="h-full w-full m-1 bg-gray-500">
            {/* <CardHeader className=" gap-3 flex h-[50px]">
              <Image src={expert.imageURL} width={50} height={50} className="rounded-full" />
              <Label value={expert.name} />
            </CardHeader> */}
            <CardBody>
              <div className ="flex flex-wrap gap-4" >
              {/* className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center" */}
              <div className="mt-2 ml-2  gap-6 md:gap-12 block ">
                  <Image src={expert.imageURL} className="rounded-full w-[160px] h-[160px] mb-5 " />
                  <div className="block md:gap-12">
                      <p className="mb-5">Tên: {expert.name} </p>
                      {expert.joinDate && (<p className="mb-5">Ngày tham gia {(new Date(expert.joinDate)).toLocaleDateString('vi')} </p>)}
                      {expert.expertType == 'solo' &&  (<><p className="mb-5"> Loại chuyên gia: Solo</p> <p className="mb-5">{expert.follower.length} follower</p></>)}
                      {expert.expertType == 'rank' &&  <p className="mb-5">Loại chuyên gia: Rank</p>}
                      <div className="mb-5">
                        <p className={perfConver(expert.yearPerform).color}>Kết quả khuyến nghị: {perfConver(expert.yearPerform).info}</p>
                      </div>
                  </div>
              </div>
              </div>

            </CardBody>
          </Card>
        </div>
        {/* </Link> */}
    </div>
  );
}