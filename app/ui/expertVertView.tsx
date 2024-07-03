
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Link from 'next/link'
import { storage } from "../lib/firebase/firebase";
import { getDownloadURL, ref } from 'firebase/storage';
import { Label } from "flowbite-react";
import { Expert } from "../model/expert";
import { perfConver } from "../lib/utils";
import { useEffect, useState } from "react";
import Image from 'next/image'

export default function ExpertVertView({ expertInfo }: { expertInfo: string }) {
  const expert: Expert = JSON.parse(expertInfo)

  return (
    <div className="p-4">
      {/* {expert.avatar} */}
      {/* <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}> */}
      <div className="p-2 rounded-sm">
        <Card className="h-full w-full m-1 bg-gray-500">
          <CardBody>
            <div className="flex flex-wrap gap-4" >
              {/* className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center" */}
              <div className="mt-2 ml-2  gap-6 md:gap-12 block ">

                <Image width={100} height={100} priority={true} src={expert.imageURL} className="rounded-full w-[160px] h-[160px] mb-4" alt={""}
                />
                <div className="block md:gap-12">
                  <p className="mb-5">Tên: {expert.name} </p>
                  {expert.joinDate && (<p className="mb-5">Ngày tham gia {(new Date(expert.joinDate)).toLocaleDateString('vi')} </p>)}
                  {expert.expertType == 'solo' && (<><p className="mb-5"> Loại chuyên gia: Solo</p> <p className="mb-5">{expert.follower.length} follower</p></>)}
                  {expert.expertType == 'rank' && <p className="mb-5">Loại chuyên gia: Rank</p>}
                  <div className="mb-5">
                  {expert.yearPerform && (<>
                      <p>Hiệu quả năm nay</p>
                      <p className={perfConver(expert.yearPerform).color}> {perfConver(expert.yearPerform).info}</p>
                    </>)}
                    {expert.quarterPerform && (<>
                      <p>Hiệu quả quý</p>
                      <p className={perfConver(expert.quarterPerform).color}> {perfConver(expert.quarterPerform).info}</p>
                    </>)}
                    {expert.monthPerform && (<>
                      <p>Hiệu quả tháng</p>
                      <p className={perfConver(expert.monthPerform).color}> {perfConver(expert.monthPerform).info}</p>
                    </>)}
                    {expert.weekPerform && (<>
                      <p>Hiệu quả tuần</p>
                      <p className={perfConver(expert.weekPerform).color}> {perfConver(expert.weekPerform).info}</p>
                    </>)}
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