import { Card, CardBody, CardFooter, CardHeader, Divider, Image, Link } from "@nextui-org/react";

export default function StatsCard({num, infos}:{num: number, infos: string[]}) {
    return (
        <div className="p-5" >
        <Card className="max-w-[600px]">

          <CardHeader className=" gap-3 flex">
            <p className=" text-6xl mr-4">{num} </p>
            
            <p>{infos}</p>

          </CardHeader>
            
        </Card>
        </div>
    )
    return (
        <>
            <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">NextUI</p>
                        <p className="text-small text-default-500">nextui.org</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <p>Make beautiful websites regardless of your design experience.</p>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Link
                        isExternal
                        showAnchorIcon
                        href="https://github.com/nextui-org/nextui"
                    >
                        Visit source code on GitHub.
                    </Link>
                </CardFooter>
            </Card>
        </>
    )

}
