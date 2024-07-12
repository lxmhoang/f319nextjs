'use client'

import { Card, CardBody } from "@nextui-org/react";
import { Expert } from "../model/expert";
import Image from 'next/image'
import { perfConver } from "../lib/utils";

export default function ExpertVertView({ expertInfo }: { expertInfo: string }) {
  const expert: Expert = JSON.parse(expertInfo)

  return (
    <div className="p-4">
      {/* {expert.avatar} */}
      {/* <Link className="justify-center" href={{ pathname: `/expert/details/${expert.id}` }}> */}
      <div className="p-2 rounded-sm">
        <Card className="h-full w-full m-1 dark:bg-gray-500 bg-gray-200">
          <CardBody>
            <div className=" gap-4" >
              {/* className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center" */}
              <div className="mt-2 block ">

                <Image width={100} height={100} priority={true} src={expert.imageURL} className="rounded-full w-[160px] h-[160px] mb-12 mx-auto" alt={""}
                />

                <div className="flex cols-2 gap-12">
                  <div className="gap-4">
                    <p> Tên </p>
                    <p> Ngày tham gia  </p>
                    <p> Loại chuyên gia </p>
                    <p>Ngày hết hạn</p>
                    {/* {expert.expertPeriod == 'perm' ? (<p>Vĩnh viễn</p>) :  (<p>Ngày hết hạn</p>)} */}
                    {expert.expertType == 'solo' && (<p>{expert.follower.length} người theo dõi</p>)}
                    {expert.expertType == 'rank' && expert.yearPerform && (<p>Hiệu quả theo năm</p>)}
                    {expert.expertType == 'rank' && expert.quarterPerform && (<p>Hiệu quả theo quý</p>)}
                    {expert.expertType == 'rank' && expert.monthPerform && (<p>Hiệu quả theo tháng</p>)}
                    {expert.expertType == 'rank' && expert.weekPerform && (<p>Hiệu quả theo tuần</p>)}
                  </div>
                  <div>
                    <p> {expert.name} </p>
                    <p> {(new Date(expert.joinDate)).toLocaleDateString('vi')} </p>
                    <p> {expert.expertType} </p>

                    {expert.expertPeriod == 'perm' ? (<p>Vĩnh viễn</p>) :  (<p>{new Date(expert.expertExpire).toLocaleDateString('vi')}</p>)}
                    {expert.expertType == 'solo' && <p> </p>}

                    {expert.expertType == 'rank' && expert.yearPerform && (<p className={perfConver(expert.yearPerform).color}>{perfConver(expert.yearPerform).info}</p>)}
                    {expert.expertType == 'rank' && expert.quarterPerform && (<p className={perfConver(expert.quarterPerform).color}>{ perfConver(expert.quarterPerform).info}</p>)}
                    {expert.expertType == 'rank' && expert.monthPerform && (<p className={perfConver(expert.monthPerform).color}>{perfConver(expert.monthPerform).info}</p>)}
                    {expert.expertType == 'rank' && expert.weekPerform && (<p className={perfConver(expert.weekPerform).color}>{perfConver(expert.weekPerform).info}</p>)}


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