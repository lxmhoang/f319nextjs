'use client'
import { Label } from "flowbite-react";
import { List, ListItem } from "flowbite-react";
import Image from 'next/image'
import Link from "next/link";
import { addComma } from "../lib/utils";

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
            <div className="flex justify-center  h-[30px] mb-2">
                <Label className="m-2 text-md " value={addComma(props.perPax) + " / người"} />
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