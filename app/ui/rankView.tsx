'use client'
import { Label, TabItem, Tabs } from "flowbite-react";
import LeaderBoard, { BoardProps } from "./rank";

export default function RankView({ rankData }: { rankData: BoardProps[] }) {
    return (
        <>

            <Tabs aria-label="Rank Tabs" className="mx-auto">
                {
                    rankData.map((item, index) => {
                        return (
                            <TabItem title={<span className="text-xs">{item.title}</span>} key={index} >
                                <div className="mx-auto justify-center mb-0">
                                    <div className="mt-0 mx-auto w-[350px]">
                                        <Label value="* không bao gồm chuyên gia solo" className="text-xs " /></div>
                                    <LeaderBoard title={item.title} since={item.since} to={item.to} perPax={item.perPax} rewards={[]} data={item.data} />
                                </div>
                            </TabItem>
                        )
                    })

                }

            </Tabs>
        </>
    )
}