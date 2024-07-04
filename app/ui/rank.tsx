'use client'
import { Label } from "flowbite-react";
import { List, ListItem } from "flowbite-react";

export type BoardProps = {
    title: string,
    since: string,
    to: string,
    total: string,
    rewards: number[],
    data: {name: string, perf: {info: string, color: string}}[]
}

export default function LeaderBoard(props: BoardProps) {
    const range = props.since + ' - ' + props.to
    return (
        <div className="m-2 w-[300px] h-[300px] mx-auto border-gray-400 border-2 rounded-md   ">
            <div className="flex justify-center  h-[30px] mb-2">
                <Label className="m-2 text-md " value={props.total + " / người"} /> 
            </div>
            <div className="flex justify-center  h-[30px]">
                <Label className="m-2" value={range} />
            </div>
            <div className="overflow-auto h-[260px] ">

                <List unstyled className="max-w-md ">
                    {props.data.map((item, index) => {
                        return (
                            <ListItem className="ml-2 mr-4 py-3 sm:py-4" key={index}>
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    {/* <Avatar img="/images/people/profile-picture-3.jpg" alt="Neil image" rounded size="sm" /> */}
                                    <div>
                                    {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        {/* <p className="truncate text-sm text-gray-500 dark:text-gray-400">email@flowbite.com</p> */}
                                    </div>
                                    <div className={"inline-flex items-center text-base font-semibold " + item.perf.color}>{item.perf.info}</div>



                                </div>


                            </ListItem>
                        )
                    })}
                </List>
            </div>


        </div>
    )

}