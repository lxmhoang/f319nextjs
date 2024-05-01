import { Card, CardBody, CardFooter, CardHeader, Divider, Image, Link } from "@nextui-org/react";

export default function StatsCard({num, infos}:{num: number, infos: string[]}) {
    return (
        <div className="p-2 sm:p-5" >
        <Card className="max-w-[200px] sm:max-w-[300px]">

          <CardHeader className=" gap-3 flex">
            <p className="text-3xl sm:text-6xl">{num} </p>
            
            <p className="text-base sm:text-lg">{infos}</p>

          </CardHeader>
            
        </Card>
        </div>
    )
}
