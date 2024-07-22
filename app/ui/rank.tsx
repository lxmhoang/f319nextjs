'use client'
import { Label, Tooltip } from "flowbite-react";
import { List, ListItem } from "flowbite-react";
// import {Tooltip} from "@nextui-org/tooltip";
import Image from 'next/image'
import Link from "next/link";
import { addComma } from "../lib/utils";
import { ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";

export type BoardProps = {
    title: string,
    since: string,
    to: string,
    perPax: number,
    rewards: number[],
    data: { name: string, perf: { info: string, color: string }, avatar: string, id: string }[]
}

export default function LeaderBoard(props: BoardProps) {
    const range = props.since + ' - ' + props.to
    return (
        <div className="m-2 w-[300px] h-[300px] mx-auto border-gray-400 border-2 rounded-md   ">
            <div className="flex justify-center h-[30px] mb-2 ml-30 mr-30">
            {/* . Mỗi khi có người dùng mua gói tài trợ rank thì tiền sau chiết khấu sẽ chia cho quỹ tuần, tháng, quý, năm (mỗi quỹ 1/4) và chia đều về các mốc trả thưởng nằm trong thời gian tài trợ, tiền từ gói tài trợ rank vĩnh viễn được chia cho các mốc trong 3 năm  */}
            <Tooltip content='Quỹ tăng dần cho đến thời điểm trả thưởng tự động' trigger="hover" className="flex justify-end">
                <div className="flex justify-center">
                    <Label className="m-2 text-md " value={addComma(props.perPax) + " / người"} />
                    <ChevronDoubleUpIcon className="mr-2    mt-2 w-5 h-5 stroke-yellow-500" />
                    <QuestionMarkCircleIcon className="mt-2 w-4 h-4" />
                </div>
                {/* <div className=""> */}
                {/* </div> */}
                </Tooltip>
            </div>
            <div className="flex justify-center  h-[30px]">
                <Label className="m-2" value={range} />
            </div>
            <div className="overflow-auto h-[260px] ">
                {props.data &&
                    <List unstyled className="max-w-md ">
                        {props.data.map((item, index) => {
                            return (
                                <ListItem className="ml-2 mr-4 py-3 sm:py-4" key={index}>
                                    <Link href={"/expert/details/" + item.id}>
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <div>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <Image width={10} height={10} priority={true} src={item.avatar} className="rounded-full w-[30px] h-[30px] " alt={""}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-base font-medium text-gray-900 dark:text-white font-semibold">{item.name}</p>
                                            </div>
                                            <div className={"inline-flex items-center text-base font-semibold "}>{item.perf.info}</div>
                                        </div>
                                    </Link>


                                </ListItem>
                            )
                        })}
                    </List>
                }
            </div>


        </div>
    )

}