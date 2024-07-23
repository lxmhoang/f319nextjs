'use client'
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
          <Card className="w-full m-1 dark:bg-gray-500">
            <CardBody>
              <div className="flex flex-wrap gap-4" >
                {/* className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center" */}
                <div className="mt-2 ml-2 col-span-6 md:col-span-4 gap-6 md:gap-16 flex">
                  <Image width={100} height={100} priority={true} src={expert.imageURL} className="rounded-full w-[160px] h-[160px] " alt={""}
                  />

                  <div className="flex cols-2 gap-12">
                    <div>
                      <p> Tên </p>
                      <p> Ngày tham gia  </p>
                      <p> Loại chuyên gia </p>
                      <p> Ngày hết hạn </p>
                      {expert.expertType == 'solo' && (<p>{expert.follower.length} người theo dõi</p>)}
                      {expert.expertType == 'solo' && expert.staticFollowerNum &&  <p>{expert.staticFollowerNum} người theo dõi</p>}
                      {expert.expertType == 'rank' && expert.yearPerform && (<p>Hiệu suất năm</p>)}
                      {expert.expertType == 'rank' && expert.quarterPerform && (<p>Hiệu suất quý</p>)}
                      {expert.expertType == 'rank' && expert.monthPerform && (<p>Hiệu suất tháng</p>)}
                      {expert.expertType == 'rank' && expert.weekPerform && (<p>Hiệu suất tuần</p>)}
                    </div>
                    <div>
                      <p> {expert.name} </p>
                      <p> {(new Date(expert.joinDate)).toLocaleDateString('vi')} </p>
                      <p> {expert.expertType} </p>
                      {expert.expertPeriod == 'perm' ? (<p>Vĩnh viễn</p>) :  (<p>{new Date(expert.expertExpire).toLocaleDateString('vi')}</p>)}
                   
                      {expert.expertType == 'solo' && <p> </p>}

                      {expert.expertType == 'rank' && expert.yearPerform && (<p className={perfConver(expert.yearPerform).color}>{perfConver(expert.yearPerform).info}</p>)}
                      {expert.expertType == 'rank' && expert.quarterPerform && (<p className={perfConver(expert.quarterPerform).color}>{perfConver(expert.quarterPerform).info}</p>)}
                      {expert.expertType == 'rank' && expert.monthPerform && (<p className={perfConver(expert.monthPerform).color}>{perfConver(expert.monthPerform).info}</p>)}
                      {expert.expertType == 'rank' && expert.weekPerform && (<p className={perfConver(expert.weekPerform).color}>{perfConver(expert.weekPerform).info}</p>)}

                    </div>
                  </div>
                  {/* <div className="block">
                    <p>Tên: {expert.name} </p>
                    {expert.joinDate && (<p>Ngày tham gia {(new Date(expert.joinDate)).toLocaleDateString('vi')} </p>)}
                    {expert.expertType == 'solo' && (<><p> Loại chuyên gia: Solo</p> <p>{expert.follower.length} follower</p></>)}
                    {expert.expertType == 'rank' && <p>Loại chuyên gia: Rank</p>}
                    {expert.yearPerform && (<>
                      <p>Kết quả theo năm</p>
                      <p className={perfConver(expert.yearPerform).color}> {perfConver(expert.yearPerform).info}</p>
                    </>)}
                    {expert.yearPerform && (<>
                      <p>Kết quả theo năm</p>
                      <p className={perfConver(expert.yearPerform).color}> {perfConver(expert.yearPerform).info}</p>
                    </>)}
                    {expert.yearPerform && (<>
                      <p>Kết quả theo năm</p>
                      <p className={perfConver(expert.yearPerform).color}> {perfConver(expert.yearPerform).info}</p>
                    </>)}

                  </div> */}
                </div>
              </div>

            </CardBody>
          </Card>
        </div></Link>
    </div>
  );
}