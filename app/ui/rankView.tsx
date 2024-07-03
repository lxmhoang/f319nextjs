'use client'
import { TabItem, Tabs } from "flowbite-react";
import LeaderBoard, { BoardProps } from "./rank";

export default function RankView({ rankData }: { rankData: BoardProps[] }) {
    return (
        <>

            <Tabs aria-label="Rank Tabs" style="underline" className="mx-auto"> 
                {
                    rankData.map((item, index) => {
                        return (
                        <TabItem  title={item.title} key={index}>
                            <div className="mx-auto justify-center mb-0">
                            <LeaderBoard  title={item.title} since={item.since} to={item.to} total={item.total} rewards={[]} data={item.data} />
                            </div>
                        </TabItem>
                        )
                    })

                }

            </Tabs>
        </>
    )
}