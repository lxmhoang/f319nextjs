'use client'
import { TabItem, Tabs } from "flowbite-react";
import LeaderBoard, { BoardProps } from "./rank";
import { UserIcon } from "@heroicons/react/24/outline";

export default function RankView({ rankData }: { rankData: BoardProps[] }) {
    return (
        <>

            <Tabs aria-label="Rank Tabs" style="underline">
                {
                    rankData.map((item, index) => {
                        return (
                        <TabItem  title={item.title} key={index}>
                            <div className="flex justify-center">
                            <LeaderBoard title={item.title} since={item.since} to={item.to} total={item.total} rewards={[]} data={item.data} />
                            </div>
                        </TabItem>
                        )
                    })

                }

            </Tabs>
        </>
    )
}